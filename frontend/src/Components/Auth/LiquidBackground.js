import React, { useEffect, useRef } from "react";
import * as THREE from "three";

const LiquidBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true,
    });

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const material = new THREE.ShaderMaterial({
      uniforms: {
        t: { value: 0 },
        res: { value: new THREE.Vector2() },
      },
      vertexShader: `
        void main(){
          gl_Position = vec4(position,1.);
        }
      `,
      fragmentShader: `
        uniform float t;
        uniform vec2 res;

        void main(){
          vec2 uv = gl_FragCoord.xy / res.xy;

          float w =
            sin(uv.x * 7. + t * .8) +
            sin(uv.y * 7. - t * .6) +
            sin((uv.x + uv.y) * 6. + t * .5);

          // 🎨 YOUR COLORS (navy + gold)
           vec3 navy = vec3(0.02, 0.13, 0.18);   // #062036
           vec3 gold = vec3(0.94, 0.83, 0.61);   // #f1d49b
           vec3 cream = vec3(1.0, 0.97, 0.93);   // #fff7ee

          // blend navy → gold
            vec3 col = mix(navy, gold, sin(w) * .5 + .5);

          // softly mix cream for highlights
            col = mix(col, cream, 0.2);

          // subtle depth
            col *= 0.9;

    

          // glow center
          float g = exp(-4. * length(uv - .5));
          col += g * .2;

          gl_FragColor = vec4(col, 1.);
        }
      `,
    });

    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    scene.add(mesh);

    const resize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      renderer.setSize(width, height);
      material.uniforms.res.value.set(width, height);
    };

    window.addEventListener("resize", resize);
    resize();

    let animationFrameId;

    const loop = () => {
      animationFrameId = requestAnimationFrame(loop);
      material.uniforms.t.value += 0.02;
      renderer.render(scene, camera);
    };

    loop();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resize);
      renderer.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
      }}
    />
  );
};

export default LiquidBackground;
