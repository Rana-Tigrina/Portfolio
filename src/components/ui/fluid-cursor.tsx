"use client";

import { useEffect, useRef } from "react";

interface FluidCursorProps {
  simResolution?: number;
  dyeResolution?: number;
  densityDissipation?: number;
  velocityDissipation?: number;
  pressure?: number;
  curl?: number;
  splatRadius?: number;
  splatForce?: number;
  opacity?: number;
}

export function FluidCursor({
  simResolution = 128,
  dyeResolution = 1024,
  densityDissipation = 2.8,
  velocityDissipation = 1.8,
  pressure = 0.8,
  curl = 28,
  splatRadius = 0.22,
  splatForce = 5500,
  opacity = 0.6,
}: FluidCursorProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let isDisposed = false;
    let animationFrameId: number;

    const glParams = {
      alpha: true,
      depth: false,
      stencil: false,
      antialias: false,
      preserveDrawingBuffer: false,
    };

    let gl: WebGL2RenderingContext | WebGLRenderingContext | null =
      canvas.getContext("webgl2", glParams) as WebGL2RenderingContext | null;
    const isWebGL2 = Boolean(gl);

    if (!gl) {
      gl = (canvas.getContext("webgl", glParams) ||
        canvas.getContext("experimental-webgl", glParams)) as WebGLRenderingContext | null;
    }

    if (!gl) {
      return; // WebGL not supported, silently degrade
    }

    let halfFloat: any;
    let supportLinearFiltering: any;

    if (isWebGL2) {
      gl.getExtension("EXT_color_buffer_float");
      supportLinearFiltering = gl.getExtension("OES_texture_float_linear");
    } else {
      halfFloat = gl.getExtension("OES_texture_half_float");
      supportLinearFiltering = gl.getExtension("OES_texture_half_float_linear");
    }

    gl.clearColor(0.0, 0.0, 0.0, 0.0);

    const halfFloatTexType = isWebGL2
      ? (gl as WebGL2RenderingContext).HALF_FLOAT
      : halfFloat?.HALF_FLOAT_OES || (gl as WebGLRenderingContext).UNSIGNED_BYTE;

    function createFBO(w: number, h: number, internalFormat: number, format: number, type: number, param: number) {
      if (!gl) return null;
      gl.activeTexture(gl.TEXTURE0);
      const texture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, param);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, param);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, w, h, 0, format, type, null);

      const fbo = gl.createFramebuffer();
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
      gl.viewport(0, 0, w, h);
      gl.clear(gl.COLOR_BUFFER_BIT);

      return {
        texture,
        fbo,
        width: w,
        height: h,
        attach(id: number) {
          gl?.activeTexture(gl.TEXTURE0 + id);
          gl?.bindTexture(gl.TEXTURE_2D, texture);
          return id;
        },
      };
    }

    function createDoubleFBO(w: number, h: number, internalFormat: number, format: number, type: number, param: number) {
      let fbo1 = createFBO(w, h, internalFormat, format, type, param);
      let fbo2 = createFBO(w, h, internalFormat, format, type, param);
      return {
        width: w,
        height: h,
        texelSizeX: 1.0 / w,
        texelSizeY: 1.0 / h,
        get read() {
          return fbo1;
        },
        set read(val) {
          fbo1 = val;
        },
        get write() {
          return fbo2;
        },
        set write(val) {
          fbo2 = val;
        },
        swap() {
          const temp = fbo1;
          fbo1 = fbo2;
          fbo2 = temp;
        },
      };
    }

    const filterMode = supportLinearFiltering ? gl.LINEAR : gl.NEAREST;
    const rgbaFormat = gl.RGBA;
    const internalRgba = isWebGL2 ? (gl as WebGL2RenderingContext).RGBA16F : gl.RGBA;

    let density = createDoubleFBO(dyeResolution, dyeResolution, internalRgba, rgbaFormat, halfFloatTexType, filterMode);
    let velocity = createDoubleFBO(simResolution, simResolution, internalRgba, rgbaFormat, halfFloatTexType, filterMode);
    let divergence = createFBO(simResolution, simResolution, internalRgba, rgbaFormat, halfFloatTexType, gl.NEAREST);
    let curlFbo = createFBO(simResolution, simResolution, internalRgba, rgbaFormat, halfFloatTexType, gl.NEAREST);
    let pressureFbo = createDoubleFBO(simResolution, simResolution, internalRgba, rgbaFormat, halfFloatTexType, gl.NEAREST);

    function compileShader(type: number, source: string) {
      if (!gl) return null;
      const s = gl.createShader(type);
      if (!s) return null;
      gl.shaderSource(s, source);
      gl.compileShader(s);
      return s;
    }

    function createProgram(vertexSource: string, fragmentSource: string) {
      if (!gl) return null;
      const p = gl.createProgram();
      if (!p) return null;
      const vs = compileShader(gl.VERTEX_SHADER, vertexSource);
      const fs = compileShader(gl.FRAGMENT_SHADER, fragmentSource);
      if (!vs || !fs) return null;
      gl.attachShader(p, vs);
      gl.attachShader(p, fs);
      gl.linkProgram(p);

      const uniforms: Record<string, WebGLUniformLocation | null> = {};
      const count = gl.getProgramParameter(p, gl.ACTIVE_UNIFORMS);
      for (let i = 0; i < count; i++) {
        const info = gl.getActiveUniform(p, i);
        if (info) {
          uniforms[info.name] = gl.getUniformLocation(p, info.name);
        }
      }
      return { program: p, uniforms };
    }

    const baseVertexShader = `
      precision highp float;
      attribute vec2 aPosition;
      varying vec2 vUv;
      varying vec2 vL;
      varying vec2 vR;
      varying vec2 vT;
      varying vec2 vB;
      uniform vec2 texelSize;

      void main () {
        vUv = aPosition * 0.5 + 0.5;
        vL = vUv - vec2(texelSize.x, 0.0);
        vR = vUv + vec2(texelSize.x, 0.0);
        vT = vUv + vec2(0.0, texelSize.y);
        vB = vUv - vec2(0.0, texelSize.y);
        gl_Position = vec4(aPosition, 0.0, 1.0);
      }
    `;

    const splatShader = `
      precision highp float;
      precision highp sampler2D;
      varying vec2 vUv;
      uniform sampler2D uTarget;
      uniform float aspectRatio;
      uniform vec3 color;
      uniform vec2 point;
      uniform float radius;

      void main () {
        vec2 p = vUv - point.xy;
        p.x *= aspectRatio;
        vec3 splat = exp(-dot(p, p) / radius) * color;
        vec3 base = texture2D(uTarget, vUv).xyz;
        gl_FragColor = vec4(base + splat, 1.0);
      }
    `;

    const advectionShader = `
      precision highp float;
      precision highp sampler2D;
      varying vec2 vUv;
      uniform sampler2D uVelocity;
      uniform sampler2D uSource;
      uniform vec2 texelSize;
      uniform float dt;
      uniform float dissipation;

      void main () {
        vec2 coord = vUv - dt * texture2D(uVelocity, vUv).xy * texelSize;
        gl_FragColor = dissipation * texture2D(uSource, coord);
        gl_FragColor.a = 1.0;
      }
    `;

    const divergenceShader = `
      precision highp float;
      precision highp sampler2D;
      varying highp vec2 vUv;
      varying highp vec2 vL;
      varying highp vec2 vR;
      varying highp vec2 vT;
      varying highp vec2 vB;
      uniform sampler2D uVelocity;

      void main () {
        float L = texture2D(uVelocity, vL).x;
        float R = texture2D(uVelocity, vR).x;
        float T = texture2D(uVelocity, vT).y;
        float B = texture2D(uVelocity, vB).y;

        vec2 C = texture2D(uVelocity, vUv).xy;
        if (vL.x < 0.0) { L = -C.x; }
        if (vR.x > 1.0) { R = -C.x; }
        if (vT.y > 1.0) { T = -C.y; }
        if (vB.y < 0.0) { B = -C.y; }

        float div = 0.5 * (R - L + T - B);
        gl_FragColor = vec4(div, 0.0, 0.0, 1.0);
      }
    `;

    const curlShader = `
      precision highp float;
      precision highp sampler2D;
      varying highp vec2 vUv;
      varying highp vec2 vL;
      varying highp vec2 vR;
      varying highp vec2 vT;
      varying highp vec2 vB;
      uniform sampler2D uVelocity;

      void main () {
        float L = texture2D(uVelocity, vL).y;
        float R = texture2D(uVelocity, vR).y;
        float T = texture2D(uVelocity, vT).x;
        float B = texture2D(uVelocity, vB).x;
        float vorticity = R - L - T + B;
        gl_FragColor = vec4(0.5 * vorticity, 0.0, 0.0, 1.0);
      }
    `;

    const vorticityShader = `
      precision highp float;
      precision highp sampler2D;
      varying highp vec2 vUv;
      varying highp vec2 vL;
      varying highp vec2 vR;
      varying highp vec2 vT;
      varying highp vec2 vB;
      uniform sampler2D uVelocity;
      uniform sampler2D uCurl;
      uniform float curl;
      uniform float dt;

      void main () {
        float L = texture2D(uCurl, vL).x;
        float R = texture2D(uCurl, vR).x;
        float T = texture2D(uCurl, vT).x;
        float B = texture2D(uCurl, vB).x;
        float C = texture2D(uCurl, vUv).x;

        vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
        force /= length(force) + 0.0001;
        force *= curl * C;
        force.y *= -1.0;

        vec2 vel = texture2D(uVelocity, vUv).xy;
        gl_FragColor = vec4(vel + force * dt, 0.0, 1.0);
      }
    `;

    const pressureShader = `
      precision highp float;
      precision highp sampler2D;
      varying highp vec2 vUv;
      varying highp vec2 vL;
      varying highp vec2 vR;
      varying highp vec2 vT;
      varying highp vec2 vB;
      uniform sampler2D uPressure;
      uniform sampler2D uDivergence;

      void main () {
        float L = texture2D(uPressure, vL).x;
        float R = texture2D(uPressure, vR).x;
        float T = texture2D(uPressure, vT).x;
        float B = texture2D(uPressure, vB).x;
        float C = texture2D(uPressure, vUv).x;
        float div = texture2D(uDivergence, vUv).x;
        float pressure = (L + R + B + T - div) * 0.25;
        gl_FragColor = vec4(pressure, 0.0, 0.0, 1.0);
      }
    `;

    const gradientSubtractShader = `
      precision highp float;
      precision highp sampler2D;
      varying highp vec2 vUv;
      varying highp vec2 vL;
      varying highp vec2 vR;
      varying highp vec2 vT;
      varying highp vec2 vB;
      uniform sampler2D uPressure;
      uniform sampler2D uVelocity;

      void main () {
        float L = texture2D(uPressure, vL).x;
        float R = texture2D(uPressure, vR).x;
        float T = texture2D(uPressure, vT).x;
        float B = texture2D(uPressure, vB).x;
        vec2 vel = texture2D(uVelocity, vUv).xy;
        vel.xy -= vec2(R - L, T - B);
        gl_FragColor = vec4(vel, 0.0, 1.0);
      }
    `;

    const displayShader = `
      precision highp float;
      precision highp sampler2D;
      varying vec2 vUv;
      uniform sampler2D uTexture;

      void main () {
        vec3 c = texture2D(uTexture, vUv).rgb;
        float a = max(c.r, max(c.g, c.b));
        gl_FragColor = vec4(c, a * 0.85);
      }
    `;

    const splatProgram = createProgram(baseVertexShader, splatShader);
    const advectionProgram = createProgram(baseVertexShader, advectionShader);
    const divergenceProgram = createProgram(baseVertexShader, divergenceShader);
    const curlProgram = createProgram(baseVertexShader, curlShader);
    const vorticityProgram = createProgram(baseVertexShader, vorticityShader);
    const pressureProgram = createProgram(baseVertexShader, pressureShader);
    const gradSubtractProgram = createProgram(baseVertexShader, gradientSubtractShader);
    const displayProgram = createProgram(baseVertexShader, displayShader);

    // Quad geometry
    const quadBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]),
      gl.STATIC_DRAW
    );
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    function blit(targetFbo: WebGLFramebuffer | null, w: number, h: number) {
      if (!gl) return;
      gl.bindFramebuffer(gl.FRAMEBUFFER, targetFbo);
      gl.viewport(0, 0, w, h);
      gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer);
      gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
      gl.enableVertexAttribArray(0);
      gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
    }

    // Pointer state
    interface Pointer {
      x: number;
      y: number;
      dx: number;
      dy: number;
      moved: boolean;
      color: [number, number, number];
    }

    const cyberColors: [number, number, number][] = [
      [0.0, 0.9, 0.64], // Emerald mint (#00e5a3)
      [0.0, 0.76, 1.0], // Electric cyan (#00c2ff)
      [0.55, 0.36, 0.96], // Cyber violet (#8b5cf6)
      [0.96, 0.62, 0.04], // Amber flare (#f59e0b)
    ];
    let colorIdx = 0;

    const pointers: Pointer[] = [
      {
        x: 0,
        y: 0,
        dx: 0,
        dy: 0,
        moved: false,
        color: cyberColors[0],
      },
    ];

    const currentCanvas = canvas;

    function splat(x: number, y: number, dx: number, dy: number, color: [number, number, number]) {
      if (!gl || !splatProgram || !velocity || !density || !currentCanvas) return;

      // Splat velocity
      gl.useProgram(splatProgram.program);
      gl.uniform1i(splatProgram.uniforms.uTarget, velocity.read?.attach(0) ?? 0);
      gl.uniform1f(splatProgram.uniforms.aspectRatio, currentCanvas.width / currentCanvas.height);
      gl.uniform2f(splatProgram.uniforms.point, x, y);
      gl.uniform3f(splatProgram.uniforms.color, dx, dy, 0.0);
      gl.uniform1f(splatProgram.uniforms.radius, splatRadius / 100.0);
      blit(velocity.write?.fbo ?? null, velocity.width, velocity.height);
      velocity.swap();

      // Splat dye
      gl.uniform1i(splatProgram.uniforms.uTarget, density.read?.attach(0) ?? 0);
      gl.uniform3f(splatProgram.uniforms.color, color[0] * 0.4, color[1] * 0.4, color[2] * 0.4);
      blit(density.write?.fbo ?? null, density.width, density.height);
      density.swap();
    }

    function resize() {
      if (!canvas) return;
      const width = window.innerWidth;
      const height = window.innerHeight;
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }
    }
    resize();
    window.addEventListener("resize", resize);

    const onPointerMove = (e: MouseEvent | TouchEvent) => {
      let clientX = 0;
      let clientY = 0;
      if ("touches" in e) {
        if (e.touches.length === 0) return;
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else {
        clientX = e.clientX;
        clientY = e.clientY;
      }

      const rect = canvas.getBoundingClientRect();
      const x = clientX / rect.width;
      const y = 1.0 - clientY / rect.height;

      const p = pointers[0];
      p.dx = (x - p.x) * splatForce;
      p.dy = (y - p.y) * splatForce;
      p.x = x;
      p.y = y;
      p.moved = Math.abs(p.dx) > 0.1 || Math.abs(p.dy) > 0.1;

      // Cycle colors smoothly
      if (Math.random() < 0.08) {
        colorIdx = (colorIdx + 1) % cyberColors.length;
        p.color = cyberColors[colorIdx];
      }
    };

    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      onPointerMove(e);
      const p = pointers[0];
      colorIdx = (colorIdx + 1) % cyberColors.length;
      p.color = cyberColors[colorIdx];
      splat(p.x, p.y, (Math.random() - 0.5) * 800, (Math.random() - 0.5) * 800, p.color);
    };

    window.addEventListener("mousemove", onPointerMove, { passive: true });
    window.addEventListener("touchstart", onPointerDown, { passive: true });
    window.addEventListener("touchmove", onPointerMove, { passive: true });

    let lastTime = performance.now();

    function update() {
      if (isDisposed || !gl) return;
      const now = performance.now();
      const dt = Math.min((now - lastTime) / 1000, 0.02);
      lastTime = now;

      // Handle pointer splats
      for (const p of pointers) {
        if (p.moved) {
          splat(p.x, p.y, p.dx, p.dy, p.color);
          p.moved = false;
        }
      }

      if (
        !curlProgram ||
        !vorticityProgram ||
        !divergenceProgram ||
        !pressureProgram ||
        !gradSubtractProgram ||
        !advectionProgram ||
        !displayProgram ||
        !velocity ||
        !density ||
        !curlFbo ||
        !divergence ||
        !pressureFbo
      ) {
        animationFrameId = requestAnimationFrame(update);
        return;
      }

      // 1. Curl
      gl.useProgram(curlProgram.program);
      gl.uniform2f(curlProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
      gl.uniform1i(curlProgram.uniforms.uVelocity, velocity.read?.attach(0) ?? 0);
      blit(curlFbo.fbo, velocity.width, velocity.height);

      // 2. Vorticity
      gl.useProgram(vorticityProgram.program);
      gl.uniform2f(vorticityProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
      gl.uniform1i(vorticityProgram.uniforms.uVelocity, velocity.read?.attach(0) ?? 0);
      gl.uniform1i(vorticityProgram.uniforms.uCurl, curlFbo.attach(1));
      gl.uniform1f(vorticityProgram.uniforms.curl, curl);
      gl.uniform1f(vorticityProgram.uniforms.dt, dt);
      blit(velocity.write?.fbo ?? null, velocity.width, velocity.height);
      velocity.swap();

      // 3. Divergence
      gl.useProgram(divergenceProgram.program);
      gl.uniform2f(divergenceProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
      gl.uniform1i(divergenceProgram.uniforms.uVelocity, velocity.read?.attach(0) ?? 0);
      blit(divergence.fbo, velocity.width, velocity.height);

      // 4. Pressure solve (Jacobi iterations)
      gl.useProgram(pressureProgram.program);
      gl.uniform2f(pressureProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
      gl.uniform1i(pressureProgram.uniforms.uDivergence, divergence.attach(1));

      for (let i = 0; i < 18; i++) {
        gl.uniform1i(pressureProgram.uniforms.uPressure, pressureFbo.read?.attach(0) ?? 0);
        blit(pressureFbo.write?.fbo ?? null, pressureFbo.width, pressureFbo.height);
        pressureFbo.swap();
      }

      // 5. Gradient subtract
      gl.useProgram(gradSubtractProgram.program);
      gl.uniform2f(gradSubtractProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
      gl.uniform1i(gradSubtractProgram.uniforms.uPressure, pressureFbo.read?.attach(0) ?? 0);
      gl.uniform1i(gradSubtractProgram.uniforms.uVelocity, velocity.read?.attach(1) ?? 1);
      blit(velocity.write?.fbo ?? null, velocity.width, velocity.height);
      velocity.swap();

      // 6. Advect velocity
      gl.useProgram(advectionProgram.program);
      gl.uniform2f(advectionProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
      gl.uniform1i(advectionProgram.uniforms.uVelocity, velocity.read?.attach(0) ?? 0);
      gl.uniform1i(advectionProgram.uniforms.uSource, velocity.read?.attach(0) ?? 0);
      gl.uniform1f(advectionProgram.uniforms.dt, dt);
      gl.uniform1f(advectionProgram.uniforms.dissipation, 1.0 / (1.0 + velocityDissipation * dt));
      blit(velocity.write?.fbo ?? null, velocity.width, velocity.height);
      velocity.swap();

      // 7. Advect dye
      gl.uniform2f(advectionProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
      gl.uniform1i(advectionProgram.uniforms.uVelocity, velocity.read?.attach(0) ?? 0);
      gl.uniform1i(advectionProgram.uniforms.uSource, density.read?.attach(1) ?? 1);
      gl.uniform1f(advectionProgram.uniforms.dissipation, 1.0 / (1.0 + densityDissipation * dt));
      blit(density.write?.fbo ?? null, density.width, density.height);
      density.swap();

      // 8. Render to screen
      gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
      gl.enable(gl.BLEND);
      gl.useProgram(displayProgram.program);
      gl.uniform1i(displayProgram.uniforms.uTexture, density.read?.attach(0) ?? 0);
      blit(null, currentCanvas.width, currentCanvas.height);
      gl.disable(gl.BLEND);

      animationFrameId = requestAnimationFrame(update);
    }

    animationFrameId = requestAnimationFrame(update);

    return () => {
      isDisposed = true;
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onPointerMove);
      window.removeEventListener("touchstart", onPointerDown);
      window.removeEventListener("touchmove", onPointerMove);
    };
  }, [
    simResolution,
    dyeResolution,
    densityDissipation,
    velocityDissipation,
    pressure,
    curl,
    splatRadius,
    splatForce,
  ]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{ opacity }}
      className="fixed inset-0 pointer-events-none z-[1] h-full w-full select-none"
    />
  );
}
