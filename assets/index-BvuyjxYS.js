(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=class{gl;_program;vs;fs;initialized=!1;ext;type=0;vsSource=``;fsSource=``;uniformLocations={};uniformTypes={};attributeLocations={};_compiled=!1;constructor(e,t){this.gl=e;let n=e.context;this.ext=n.getExtension(`KHR_parallel_shader_compile`),this._program=n.createProgram(),this.vs=n.createShader(n.VERTEX_SHADER),this.fs=n.createShader(n.FRAGMENT_SHADER),this.type=this.detectType(t),this.vsSource=this.getVertexShader(this.type),n.shaderSource(this.vs,this.vsSource),n.compileShader(this.vs),this.fsSource=`${this.getFragmentShader(this.type)}${t}`,n.shaderSource(this.fs,this.fsSource),n.compileShader(this.fs),n.attachShader(this._program,this.vs),n.attachShader(this._program,this.fs),n.linkProgram(this._program)}get program(){if(this.initialized)return this._program;this.initialized=!0;let e=this.gl.context,t=e.getShaderParameter(this.vs,e.COMPILE_STATUS);if(!t)throw console.table(this.vsSource.split(`
`)),Error(`ImageEffectRenderer: Vertex shader compilation failed: ${e.getShaderInfoLog(this.vs)}`);if(t=e.getShaderParameter(this.fs,e.COMPILE_STATUS),!t)throw console.table(this.fsSource.split(`
`)),Error(`ImageEffectRenderer: Shader compilation failed: ${e.getShaderInfoLog(this.fs)}`);if(t=e.getProgramParameter(this._program,e.LINK_STATUS),!t)throw Error(`ImageEffectRenderer: Program linking failed: ${e.getProgramInfoLog(this._program)}`);return this._program}get shaderCompiled(){return this._compiled=this._compiled||!this.ext||this.gl.context.getProgramParameter(this._program,this.ext.COMPLETION_STATUS_KHR),this._compiled}use(){this.gl.context.useProgram(this.program)}getUniformLocation(e){return this.uniformLocations[e]===void 0?this.uniformLocations[e]=this.gl.context.getUniformLocation(this._program,e):this.uniformLocations[e]}getAttributeLocation(e){return this.attributeLocations[e]===void 0?(this.gl.context.useProgram(this.program),this.attributeLocations[e]=this.gl.context.getAttribLocation(this._program,e)):this.attributeLocations[e]}getUniformType(e){if(this.uniformTypes[e]!==void 0)return this.uniformTypes[e];let t=this.gl.context,n=t.getProgramParameter(this._program,t.ACTIVE_UNIFORMS);for(let r=0;r<n;r++){let n=t.getActiveUniform(this._program,r);if(n&&n.name===e)return this.uniformTypes[e]=n.type}return this.uniformTypes[e]=null}detectType(e){return/mainImage/gim.exec(e)?0:/^#version[\s]+300[\s]+es[\s]+/gim.exec(e)?3:2}getFragmentShader(e){switch(e){case 0:return`#version 300 es
                        precision highp float;

                        ${this.getUniformShader()}

                        in vec2 vUV0;
                        out vec4 outFragColor;

                        void mainImage(out vec4, vec2);

                        vec4 texture2D(sampler2D tex, vec2 uv) {
                            return texture(tex, uv);
                        }

                        vec4 texture2DLod(sampler2D tex, vec2 uv, float lod) {
                            return textureLod(tex, uv, lod);
                        }

                        vec4 texture2DLodEXT(sampler2D tex, vec2 uv, float lod) {
                            return textureLod(tex, uv, lod);
                        }

                        
                        vec4 texture2DGrad(sampler2D tex, vec2 uv, vec2 dPdx, vec2 dPdy) {
                            return textureGrad(tex, uv, dPdx, dPdy);
                        }

                        vec4 texture2DGradEXT(sampler2D tex, vec2 uv, vec2 dPdx, vec2 dPdy) {
                            return textureGrad(tex, uv, dPdx, dPdy);
                        }

                        void main(void) {
                            outFragColor = vec4(0.0, 0.0, 0.0, 1.0);
                            mainImage(outFragColor, vUV0 * iResolution.xy);
                        }
                        `;default:return``}}getVertexShader(e){switch(e){case 0:return`#version 300 es
                    in vec2 aPos;
                    in vec2 aUV;

                    out vec2 vUV0;

                    void main(void) {
                        vUV0 = aUV;
                        gl_Position = vec4(aPos, 0.0, 1.0);
                    }
                `;case 2:return`attribute vec3 aPos;
                attribute vec2 aUV;

                uniform float iAspect;

                varying vec2 vScreen;
                varying vec2 vUV0;

                void main(void) {
                    vUV0 = aUV;
                    vScreen = aPos.xy;
                    vScreen.x *= iAspect;
                    gl_Position = vec4(aPos, 1.0);
                }`;default:return`#version 300 es
                in  vec3 aPos;
                in vec2 aUV;

                uniform float iAspect;

                out vec2 vScreen;
                out vec2 vUV0;

                void main(void) {
                    vUV0 = aUV;
                    vScreen = aPos.xy;
                    vScreen.x *= iAspect;
                    gl_Position = vec4(aPos, 1.0);
                }`}}getUniformShader(){return`
            #define HW_PERFORMANCE 1

            uniform vec3 iResolution;
            uniform float iTime;
            uniform float iTimeDelta;
            uniform int iFrame;
            uniform float iChannelTime[4];
            uniform vec4 iMouse;
            uniform vec4 iMouseNormalized;
            uniform vec4 iDate;
            uniform float iSampleRate;
            uniform vec3 iChannelResolution[4];

            uniform float iGlobalTime;
            uniform float iAspect;

            uniform highp sampler2D iChannel0;
            uniform highp sampler2D iChannel1;
            uniform highp sampler2D iChannel2;
            uniform highp sampler2D iChannel3;
            uniform highp sampler2D iChannel4;
            uniform highp sampler2D iChannel5;
            uniform highp sampler2D iChannel6;
            uniform highp sampler2D iChannel7;

            uniform highp samplerCube iChannelCube0;
            uniform highp samplerCube iChannelCube1;
            uniform highp samplerCube iChannelCube2;
            uniform highp samplerCube iChannelCube3;
            uniform highp samplerCube iChannelCube4;
            uniform highp samplerCube iChannelCube5;
            uniform highp samplerCube iChannelCube6;
            uniform highp samplerCube iChannelCube7;
            `}},t=class{type;name;x=0;y=0;z=0;w=0;matrix;constructor(e,t){this.type=e,this.name=t}},n=class{context;canvas;sharedPrograms={};sharedTextures={};quadVBO;lastQuadVBO=void 0;constructor(e=void 0){this.canvas=e||document.createElement(`canvas`);let t={premultipliedAlpha:!0,alpha:!0,preserveDrawingBuffer:!1,antialias:!1,depth:!1,stencil:!1};if(this.context=this.canvas.getContext(`webgl2`,t),!this.context)throw Error(`Unable to create WebGL2 context.`);this.context.getExtension(`WEBGL_color_buffer_float`),this.context.getExtension(`EXT_color_buffer_float`),this.context.getExtension(`OES_texture_float`),this.context.getExtension(`OES_texture_float_linear`),this.context.getExtension(`KHR_parallel_shader_compile`),this.context.clearColor(0,0,0,0),this.context.clear(this.context.COLOR_BUFFER_BIT),this.context.enable(this.context.BLEND),this.context.blendFunc(this.context.ONE,this.context.ONE_MINUS_SRC_ALPHA),this.quadVBO=this.generateQuad()}drawQuad(e,t){let n=this.context;this.lastQuadVBO!==this.quadVBO&&(this.lastQuadVBO=this.quadVBO,n.bindBuffer(n.ARRAY_BUFFER,this.quadVBO),n.enableVertexAttribArray(e),n.vertexAttribPointer(e,2,n.FLOAT,!1,16,0),n.enableVertexAttribArray(t),n.vertexAttribPointer(t,2,n.FLOAT,!1,16,8)),n.drawArrays(n.TRIANGLE_STRIP,0,4)}getCachedTexture(e,t){let n=`${e}_${t.clampX}_${t.clampY}_${t.useMipmap}`;return this.sharedTextures[e]?this.sharedTextures[n]:this.sharedTextures[n]=this.context.createTexture()}compileShader(t){return this.sharedPrograms[t]?this.sharedPrograms[t]:this.sharedPrograms[t]=new e(this,t)}setTextureParameter(e,t){let n=this.context;n.bindTexture(n.TEXTURE_2D,e),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_S,t.clampX?n.CLAMP_TO_EDGE:n.REPEAT),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_T,t.clampY?n.CLAMP_TO_EDGE:n.REPEAT),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_MAG_FILTER,t.magFilterLinear?n.LINEAR:n.NEAREST),t.useMipmap?(n.texParameteri(n.TEXTURE_2D,n.TEXTURE_MIN_FILTER,n.LINEAR_MIPMAP_LINEAR),n.generateMipmap(n.TEXTURE_2D)):n.texParameteri(n.TEXTURE_2D,n.TEXTURE_MIN_FILTER,t.minFilterLinear?n.LINEAR:n.NEAREST)}setCubeMapParameter(e,t){let n=this.context;n.bindTexture(n.TEXTURE_CUBE_MAP,e),n.texParameteri(n.TEXTURE_CUBE_MAP,n.TEXTURE_WRAP_S,n.CLAMP_TO_EDGE),n.texParameteri(n.TEXTURE_CUBE_MAP,n.TEXTURE_WRAP_T,n.CLAMP_TO_EDGE),n.texParameteri(n.TEXTURE_CUBE_MAP,n.TEXTURE_MAG_FILTER,t.magFilterLinear?n.LINEAR:n.NEAREST),t.useMipmap?(n.texParameteri(n.TEXTURE_CUBE_MAP,n.TEXTURE_MIN_FILTER,n.LINEAR_MIPMAP_LINEAR),n.generateMipmap(n.TEXTURE_CUBE_MAP)):n.texParameteri(n.TEXTURE_CUBE_MAP,n.TEXTURE_MIN_FILTER,t.minFilterLinear?n.LINEAR:n.NEAREST)}bindTextures(e){let t=this.context;for(let n=0;n<8;n++){t.activeTexture(t.TEXTURE0+n);let r=e[n];r&&r.buffer?t.bindTexture(t.TEXTURE_2D,r.buffer.src.texture):r&&r.texture?r.isCubemap?t.bindTexture(t.TEXTURE_CUBE_MAP,r.texture):t.bindTexture(t.TEXTURE_2D,r.texture):t.bindTexture(t.TEXTURE_2D,null)}}setUniforms(e,t){let n=this.context;Object.values(e).forEach(e=>{let r=t.getUniformLocation(e.name);if(r!==null)switch(e.type){case 0:n.uniform1i(r,e.x);break;case 1:n.uniform1f(r,e.x);break;case 2:n.uniform2f(r,e.x,e.y);break;case 3:n.uniform3f(r,e.x,e.y,e.z);break;case 4:n.uniform4f(r,e.x,e.y,e.z,e.w);break;case 5:n.uniformMatrix4fv(r,!1,e.matrix);break}})}generateQuad(){let e=this.context,t=new Float32Array([-1,1,0,1,-1,-1,0,0,1,1,1,1,1,-1,1,0]),n=e.createBuffer();return e.bindBuffer(e.ARRAY_BUFFER,n),e.bufferData(e.ARRAY_BUFFER,t,e.STATIC_DRAW),n}},r={clampX:!0,clampY:!0,flipY:!1,useMipmap:!0,useCache:!0,minFilterLinear:!0,magFilterLinear:!0},i=class e{width=0;height=0;program;main;gl;frame=0;lastTime=0;mouse=[0,0,0,0];mouseNormalized=[0,0,0,0];uniforms={};textures=[];constructor(e){this.gl=e}get shaderCompiled(){return this.program.shaderCompiled}get iMouseUsed(){return this.program.getUniformLocation(`iMouse`)!==null||this.program.getUniformLocation(`iMouseNormalized`)!==null}setImage(t,n,i={}){if(t>=8)throw Error(`ImageEffectRenderer: A maximum of 8 slots is available, slotIndex is out of bounds.`);if(n instanceof HTMLImageElement){if(!n.complete||n.naturalWidth===0){n.addEventListener(`load`,()=>{this.setImage(t,n,i)},{once:!0});return}}else if(n instanceof HTMLVideoElement&&n.readyState<HTMLMediaElement.HAVE_CURRENT_DATA){n.addEventListener(`loadeddata`,()=>{this.setImage(t,n,i)},{once:!0});return}this.setUniformInt(`iChannel${t}`,t);let a,o;typeof VideoFrame<`u`&&n instanceof VideoFrame?(a=n.displayWidth,o=n.displayHeight):(a=n.width,o=n.height),this.setUniformVec3(`iChannelResolution[${t}]`,a,o,1);let s=this.gl.context,c=this.textures[t];if(n instanceof e){c&&c.texture&&!c.cached&&s.deleteTexture(c.texture);let e={...n.options,...i};this.textures[t]={texture:void 0,buffer:n,cached:!1,isCubemap:!1},this.gl.setTextureParameter(n.src.texture,e),this.gl.setTextureParameter(n.dest.texture,e)}else{let e={...r,...i};e.useCache=e.useCache&&n instanceof HTMLImageElement,e.useCache&&c&&c.texture&&!c.cached&&(s.deleteTexture(c.texture),c.texture=void 0);let a=c&&c.texture;e.useCache&&n instanceof HTMLImageElement&&(a=this.gl.getCachedTexture(n.src,e)),a||=s.createTexture(),this.textures[t]={texture:a,buffer:void 0,cached:e.useCache,isCubemap:!1},s.bindTexture(s.TEXTURE_2D,a),s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,+!!i.flipY),s.texImage2D(s.TEXTURE_2D,0,s.RGBA,s.RGBA,s.UNSIGNED_BYTE,n),this.gl.setTextureParameter(a,e)}}setCubeMap(e,t,n={}){if(e>=8)throw Error(`ImageEffectRenderer: A maximum of 8 slots is available, slotIndex is out of bounds.`);if(t.length!==6)throw Error(`ImageEffectRenderer: Cubemap requires exactly 6 face images.`);for(let r=0;r<6;r++){let i=t[r];if(i instanceof HTMLImageElement&&(!i.complete||i.naturalWidth===0)){i.addEventListener(`load`,()=>{this.setCubeMap(e,t,n)},{once:!0});return}}this.setUniformInt(`iChannelCube${e}`,e);let i=t[0],a,o;typeof VideoFrame<`u`&&i instanceof VideoFrame?(a=i.displayWidth,o=i.displayHeight):(a=i.width,o=i.height),this.setUniformVec3(`iChannelResolution[${e}]`,a,o,1);let s=this.gl.context,c=this.textures[e];c&&c.texture&&!c.cached&&s.deleteTexture(c.texture);let l={...r,...n},u=s.createTexture();this.textures[e]={texture:u,buffer:void 0,cached:!1,isCubemap:!0},s.bindTexture(s.TEXTURE_CUBE_MAP,u),s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,0);let d=[s.TEXTURE_CUBE_MAP_POSITIVE_X,s.TEXTURE_CUBE_MAP_NEGATIVE_X,s.TEXTURE_CUBE_MAP_POSITIVE_Y,s.TEXTURE_CUBE_MAP_NEGATIVE_Y,s.TEXTURE_CUBE_MAP_POSITIVE_Z,s.TEXTURE_CUBE_MAP_NEGATIVE_Z];for(let e=0;e<6;e++)s.texImage2D(d[e],0,s.RGBA,s.RGBA,s.UNSIGNED_BYTE,t[e]);this.gl.setCubeMapParameter(u,l)}setUniformFloat(e,t){this.setUniform(e,1,t,0,0,0,void 0)}setUniformInt(e,t){this.setUniform(e,0,t,0,0,0,void 0)}setUniformVec2(e,t,n){this.setUniform(e,2,t,n,0,0,void 0)}setUniformVec3(e,t,n,r){this.setUniform(e,3,t,n,r,0,void 0)}setUniformVec4(e,t,n,r,i){this.setUniform(e,4,t,n,r,i,void 0)}setUniformMatrix(e,t){this.setUniform(e,5,0,0,0,0,t)}destruct(){this.textures.forEach(e=>e.texture&&!e.cached&&this.gl.context.deleteTexture(e.texture)),this.textures=[],this.uniforms={}}draw(e=0,t,n){this.width=t|0,this.height=n|0,this.program.use();let r=e-this.lastTime;this.lastTime=e,this.setUniformFloat(`iTime`,e),this.setUniformFloat(`iTimeDelta`,r),this.setUniformInt(`iFrame`,this.frame),this.program.getUniformType(`iResolution`)===this.gl.context.FLOAT_VEC2?this.setUniformVec2(`iResolution`,t,n):this.setUniformVec3(`iResolution`,t,n,1);let i=this.main.mouse;this.setUniformVec4(`iMouse`,i[0],i[1],i[2],i[3]);let a=this.main.mouseNormalized;this.setUniformVec4(`iMouseNormalized`,a[0],a[1],a[2],a[3]);let o=new Date;this.setUniformVec4(`iDate`,o.getFullYear(),o.getMonth(),o.getDate(),o.getHours()*3600+o.getMinutes()*60+o.getSeconds()+o.getMilliseconds()/1e3),this.setUniformFloat(`iSampleRate`,44100),this.setUniformFloat(`iGlobalTime`,e),this.setUniformFloat(`iAspect`,t/n),this.gl.setUniforms(this.uniforms,this.program),this.gl.bindTextures(this.textures),this.gl.drawQuad(this.program.getAttributeLocation(`aPos`),this.program.getAttributeLocation(`aUV`)),this.frame++}setUniform(e,n,r,i,a,o,s){let c=this.uniforms[e];c||=this.uniforms[e]=new t(n,e),c.x=r,c.y=i,c.z=a,c.w=o,c.matrix=s}},a={type:5121,pixelRatio:1,msaa:!1},o=class{width=0;height=0;texture;frameBuffer;options;gl;format=WebGLRenderingContext.RGBA;internalFormat=WebGLRenderingContext.RGBA;constructor(e,t={}){switch(this.gl=e,this.options={...a,...t},this.options.type){case WebGLRenderingContext.UNSIGNED_BYTE:this.internalFormat=WebGL2RenderingContext.RGBA8;break;case WebGLRenderingContext.FLOAT:this.internalFormat=WebGL2RenderingContext.RGBA32F;break}let n=e.context;this.texture=n.createTexture(),this.resize(16,16),this.frameBuffer=n.createFramebuffer(),n.bindFramebuffer(n.FRAMEBUFFER,this.frameBuffer),n.framebufferTexture2D(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,this.texture,0),n.bindFramebuffer(n.FRAMEBUFFER,null)}resize(e,t){if(this.width===(e|0)&&this.height===(t|0))return;this.width=e|0,this.height=t|0;let n=this.gl.context;n.bindTexture(n.TEXTURE_2D,this.texture),n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,0),n.texImage2D(n.TEXTURE_2D,0,this.internalFormat,this.width,this.height,0,this.format,this.options.type,null)}destruct(){let e=this.gl.context;this.frameBuffer&&e.deleteFramebuffer(this.frameBuffer),this.texture&&e.deleteTexture(this.texture)}},s={...r,...a,useMipmap:!1,useCache:!1},c=class extends i{options;frameBuffer0;frameBuffer1;constructor(e,t={}){super(e),this.options={...s,...t},this.frameBuffer0=new o(e,this.options),this.frameBuffer1=new o(e,this.options)}get src(){return this.frame%2==0?this.frameBuffer0:this.frameBuffer1}get dest(){return this.frame%2==1?this.frameBuffer0:this.frameBuffer1}draw(e=0,t,n){if(t<=0||n<=0)return;let r=this.gl.context,i=this.dest;i.resize(t,n),r.bindFramebuffer(r.FRAMEBUFFER,i.frameBuffer),r.clear(r.COLOR_BUFFER_BIT),super.draw(e,t,n),r.bindFramebuffer(r.FRAMEBUFFER,null)}destruct(){super.destruct(),this.frameBuffer0.destruct(),this.frameBuffer1.destruct()}},l=0,u=0,d=0,f=0,p=!1,m=!1,h=0,g=0,_=0,v=0,y=!1;function b(e){y||(y=!0,e.addEventListener(`mousemove`,e=>{d=l,f=u,l=e.clientX,u=e.clientY,p&&(_=l,v=u)},{passive:!0}),e.addEventListener(`mousedown`,e=>{e.button===0&&(p=!0,m=!0,h=e.clientX,g=e.clientY,_=e.clientX,v=e.clientY)},{passive:!0}),e.addEventListener(`mouseup`,e=>{e.button===0&&(p=!1)},{passive:!0}))}function x(){m=!1}function S(e){return[(l-e.left)/e.width,1-(u-e.top)/e.height,(d-e.left)/e.width,1-(f-e.top)/e.height]}function C(e,t,n){let r=e.height,i=e.width,a=_-e.left,o=r-(v-e.top),s=h-e.left,c=r-(g-e.top),l=p||h>0?a:0,u=p||g>0?o:0,d=(p?1:-1)*(s>0?s:0),f=(m?1:-1)*(c>0?c:0);return[l/i*t,u/r*n,d/i*t,f/r*n]}var w=class extends i{canvas;buffers=[];options;time=0;tickFuncs=[];readyFuncs=[];startTime=-1;drawOneFrame=!1;container;animationRequestId=0;resizeObserver;_ready=!1;constructor(t,n,r,i){if(super(t),this.options={...i},this.container=n,this.main=this,this.options.useSharedContext){this.canvas=document.createElement(`canvas`);let e=this.canvas.getContext(`2d`);e.fillStyle=`#00000000`,e.clearRect(0,0,this.canvas.width,this.canvas.height)}else this.canvas=this.gl.canvas;Object.assign(this.canvas.style,{inset:`0`,width:`100%`,height:`100%`,margin:`0`,display:`block`}),this.container.appendChild(this.canvas),this.program=new e(this.gl,r),this.resizeObserver=new ResizeObserver(()=>{this.options.autoResize&&this.updateSize()}),this.resizeObserver.observe(n),this.options.useSharedContext||this.drawingLoop(0)}get drawThisFrame(){return(this.options.loop||this.drawOneFrame)&&this.width>0&&this.height>0&&(!this.options.asyncCompile||this.allShadersCompiled)}get iMouseUsed(){return super.iMouseUsed||this.buffers.some(e=>e&&e.iMouseUsed)}get allShadersCompiled(){return this.shaderCompiled&&this.buffers.every(e=>e&&e.shaderCompiled)}play(){this.options.loop=!0}stop(){this.options.loop=!1}createBuffer(e,t,n={}){let r=this.buffers[e];r&&r.destruct();let i=new c(this.gl,n);return i.program=this.gl.compileShader(t),i.main=this,this.buffers[e]=i}tick(e){this.tickFuncs.push(e)}ready(e){this.readyFuncs.push(e)}drawFrame(e=0){this.time=e/1e3,this.drawOneFrame=!0}setData(e){e.buffers&&this.setBuffersData(e.buffers),e.images&&this.setImagesData(e.images),e.cubemaps&&this.setCubeMapsData(e.cubemaps)}setImagesData(e,t=this){e.forEach(e=>{e.image.bufferIndex===void 0?t?.setImage(e.slotIndex,e.image,e.options):t?.setImage(e.slotIndex,this.buffers[e.image.bufferIndex],e.options)})}setBuffersData(e){e.forEach(e=>{this.createBuffer(e.index,e.shader,e.options)}),e.forEach(e=>{e.images&&this.setImagesData(e.images,this.buffers[e.index]),e.cubemaps&&this.setCubeMapsData(e.cubemaps,this.buffers[e.index])})}setCubeMapsData(e,t=this){e.forEach(e=>{t?.setCubeMap(e.slotIndex,e.faces,e.options)})}drawInstance(e){let t=this.gl.context;if(this.drawOneFrame||(this.time+=e),this.tickFuncs.forEach(t=>t(e)),this.iMouseUsed){let e=this.container.getBoundingClientRect();this.mouse=C(e,this.width,this.height),this.mouseNormalized=S(e),x()}this.buffers.forEach(e=>{e&&(t.viewport(0,0,this.width,this.height),e.draw(this.time,this.canvas.width,this.canvas.height))}),t.viewport(0,0,this.width,this.height),t.clear(t.COLOR_BUFFER_BIT),this.draw(this.time,this.canvas.width,this.canvas.height),this.drawOneFrame=!1}update(e){this.allShadersCompiled&&(this._ready||(this._ready=!0,this.readyFuncs.forEach(e=>e()),this.readyFuncs=[],this.iMouseUsed&&b(document.body)))}destruct(){cancelAnimationFrame(this.animationRequestId),super.destruct(),this.resizeObserver.disconnect(),this.container.removeChild(this.canvas),this.canvas.replaceWith(this.canvas.cloneNode(!0)),this.buffers.forEach(e=>{e.destruct()}),this.buffers=[],this.tickFuncs=[]}copyCanvas(){let e=this.gl.canvas,t=this.canvas.getContext(`2d`);t.clearRect(0,0,this.width,this.height),t.drawImage(e,0,e.height-this.height,this.width,this.height,0,0,this.width,this.height)}updateSize(){this.width=this.container.offsetWidth*this.options.pixelRatio|0,this.height=this.container.offsetHeight*this.options.pixelRatio|0,(this.width!==this.canvas.width||this.height!==this.canvas.height)&&(this.canvas.width=this.width,this.canvas.height=this.height,this.drawOneFrame=!0)}drawingLoop(e=0){this.animationRequestId=window.requestAnimationFrame(e=>this.drawingLoop(e)),e/=1e3;let t=this.startTime<0?1/60:e-this.startTime;this.startTime=e>0?e:-1,this.update(t),this.drawThisFrame&&this.drawInstance(t)}},T={loop:!1,autoResize:!0,pixelRatio:typeof window<`u`?window.devicePixelRatio:1,useSharedContext:!1,asyncCompile:!0},E=[],D=[],O,k=-1,A=class{constructor(){throw Error(`Use ImageEffectRenderer.createTemporary to create an ImageEffectRenderer`)}static createTemporary(e,t,r={}){let i={...T,...r};if(i.useSharedContext){O||(O=new n,this.drawInstances(0));let r=new w(O,e,t,i);return E.push(r),r}else return new w(D.pop()||new n,e,t,i)}static releaseTemporary(e){e.options.useSharedContext||D.push(e.gl),e.stop(),e.destruct();let t=E.indexOf(e);t>-1&&E.splice(t,1)}static drawInstances(e=0){window.requestAnimationFrame(e=>this.drawInstances(e)),e/=1e3;let t=k<0?1/60:e-k;k=e;let n=O.canvas,r=O.context,i=E,a=0,o=0;i.forEach(e=>{e.update(t)}),i.forEach(e=>{e.drawThisFrame&&(a=Math.max(a,e.width),o=Math.max(o,e.height))}),(a>n.width||o>n.height)&&(n.width=a,n.height=o),r.clear(r.COLOR_BUFFER_BIT),i.forEach(e=>{e.drawThisFrame&&(e.drawInstance(t),e.copyCanvas())})}},j=class{canvas;ctx;imageData;keyStates;keyPressed;keyToggle;bound=!1;constructor(){this.canvas=document.createElement(`canvas`),this.canvas.width=256,this.canvas.height=3,this.ctx=this.canvas.getContext(`2d`),this.imageData=this.ctx.createImageData(256,3),this.keyStates=new Uint8Array(256),this.keyPressed=new Uint8Array(256),this.keyToggle=new Uint8Array(256),this.handleKeyDown=this.handleKeyDown.bind(this),this.handleKeyUp=this.handleKeyUp.bind(this)}bind(){this.bound||(this.bound=!0,document.addEventListener(`keydown`,this.handleKeyDown),document.addEventListener(`keyup`,this.handleKeyUp))}unbind(){this.bound&&(this.bound=!1,document.removeEventListener(`keydown`,this.handleKeyDown),document.removeEventListener(`keyup`,this.handleKeyUp))}handleKeyDown(e){let t=e.keyCode;t<256&&(this.keyStates[t]===0&&(this.keyPressed[t]=255,this.keyToggle[t]=this.keyToggle[t]===0?255:0),this.keyStates[t]=255)}handleKeyUp(e){let t=e.keyCode;t<256&&(this.keyStates[t]=0)}update(){let e=this.imageData.data;for(let t=0;t<256;t++){let n=t*4;e[n]=this.keyStates[t],e[n+1]=this.keyStates[t],e[n+2]=this.keyStates[t],e[n+3]=255;let r=(256+t)*4;e[r]=this.keyPressed[t],e[r+1]=this.keyPressed[t],e[r+2]=this.keyPressed[t],e[r+3]=255;let i=(512+t)*4;e[i]=this.keyToggle[t],e[i+1]=this.keyToggle[t],e[i+2]=this.keyToggle[t],e[i+3]=255,this.keyPressed[t]=0}return this.ctx.putImageData(this.imageData,0,0),this.canvas}getTexture(){return this.canvas}destruct(){this.unbind()}},M=`https://www.shadertoy.com`,N=class{renderer;shader;options;loadedImages=new Map;keyboardHandler=null;keyboardChannels=new Map;bufferIdToIndex=new Map;cubemapChannels=new Map;constructor(e,t,n={}){this.shader=t,this.options=n;let r=this.getImagePass();if(!r)throw Error(`Shader does not have an image renderpass`);this.detectCubemapChannels();let i=this.getCommonCode(),a=this.processShaderCode(r,i);this.renderer=A.createTemporary(e,a,{loop:!0,...n}),this.setupBuffers(i),this.loadInputs()}getImagePass(){return this.shader.renderpass.find(e=>e.type===`image`)}getBufferPasses(){return this.shader.renderpass.filter(e=>e.type===`buffer`)}detectCubemapChannels(){for(let e of this.shader.renderpass){if(!e.inputs)continue;let t=new Set;for(let n of e.inputs)n.type===`cubemap`&&t.add(n.channel);t.size>0&&this.cubemapChannels.set(e,t)}}processShaderCode(e,t){let n=this.prependCommonCode(e.code,t),r=this.cubemapChannels.get(e);if(r)for(let e of r){let t=RegExp(`\\biChannel${e}\\b`,`g`);n=n.replace(t,`iChannelCube${e}`)}return n}setupBuffers(e){let t=this.getBufferPasses();this.bufferIdToIndex=new Map,t.forEach((t,n)=>{let r=this.processShaderCode(t,e),i=n;if(t.outputs)for(let e of t.outputs)this.bufferIdToIndex.set(e.id,i);this.renderer.createBuffer(i,r,{type:WebGL2RenderingContext.FLOAT})})}getCommonCode(){return this.shader.renderpass.find(e=>e.type===`common`)?.code||``}prependCommonCode(e,t){return t?`${t}\n\n${e}`:e}async loadInputs(){let e=this.getImagePass();if(!e)return;await this.loadPassInputs(e,this.renderer);let t=this.getBufferPasses();for(let e=0;e<t.length;e++){let n=this.renderer.buffers[e];n&&await this.loadPassInputs(t[e],n)}}async loadPassInputs(e,t){if(e.inputs)for(let n of e.inputs)await this.loadInput(n,t)}async loadInput(e,t){let n=e.channel;if(e.type===`buffer`){let r=this.getBufferIndexFromId(e.id);if(r>=0&&this.renderer.buffers[r]){let i=this.getImageOptions(e);t.setImage(n,this.renderer.buffers[r],i)}}else if(e.type===`texture`){let r=await this.loadImage(e.filepath);if(r){let i=this.getImageOptions(e);t.setImage(n,r,i)}}else if(e.type===`cubemap`){let r=await this.loadCubemap(e.filepath);if(r){let i=this.getImageOptions(e);t.setCubeMap(n,r,i)}}else e.type===`keyboard`&&(this.keyboardHandler||(this.keyboardHandler=new j,this.keyboardHandler.bind(),this.renderer.tick(()=>{if(this.keyboardHandler){let e=this.keyboardHandler.update();for(let[t,n]of this.keyboardChannels)n.setImage(t,e,{minFilterLinear:!1,magFilterLinear:!1})}})),this.keyboardChannels.set(n,t),t.setImage(n,this.keyboardHandler.update(),{minFilterLinear:!1,magFilterLinear:!1}))}getBufferIndexFromId(e){return this.bufferIdToIndex.get(e)??-1}getImageOptions(e){let t=e.sampler;return{clampX:t?.wrap===`clamp`,clampY:t?.wrap===`clamp`,flipY:t?.vflip===`true`,useMipmap:t?.filter===`mipmap`,minFilterLinear:t?.filter!==`nearest`,magFilterLinear:t?.filter!==`nearest`}}getMediaUrl(e){if(this.options.mediaMapping){let t=this.options.mediaMapping(e);if(t!=null)return t}return`${M}${e}`}async loadImage(e){if(this.loadedImages.has(e))return this.loadedImages.get(e);let t=this.getMediaUrl(e);return Array.isArray(t)?null:this.loadSingleImage(t)}async loadSingleImage(e){return this.loadedImages.has(e)?this.loadedImages.get(e):new Promise(t=>{let n=new Image;n.crossOrigin=`anonymous`,n.onload=()=>{this.loadedImages.set(e,n),t(n)},n.onerror=()=>t(null),n.src=e})}async loadCubemap(e){let t=this.getMediaUrl(e),n;if(Array.isArray(t)){if(t.length!==6)return null;n=t}else{let e=t,r=e.match(/\.[^.]+$/)?.[0]||`.jpg`,i=e.slice(0,-r.length);n=[e,`${i}_1${r}`,`${i}_2${r}`,`${i}_3${r}`,`${i}_4${r}`,`${i}_5${r}`]}let r=await Promise.all(n.map(e=>this.loadSingleImage(e)));return r.some(e=>e===null)?null:r}play(){this.renderer.play()}stop(){this.renderer.stop()}destruct(){this.keyboardHandler&&=(this.keyboardHandler.destruct(),null),this.keyboardChannels.clear(),A.releaseTemporary(this.renderer),this.loadedImages.clear()}},P={userName:`reinder`,date:`2026-02-10T08:32:37.079Z`,numShaders:64,shaders:[{ver:`0.1`,info:{id:`4sl3z4`,date:`1364249310`,viewed:11859,name:`Moonlight`,description:`If your using a Mac or Linux please uncomment line 1 to view the full shader with mountains and a floating bottle (screenshot: http://imgur.com/KKPZsj4). 

Part of the code is copy-pasted from shaders by inigo quilez and dave hoskins.`,likes:123,published:`Public API`,usePreview:0,tags:[`procedural`,`noise`,`reflection`,`raymarch`,`water`,`raytrace`]},renderpass:[{inputs:[{id:`Xsf3zn`,filepath:`/media/a/f735bee5b64ef98879dc618b016ecf7939a5756040c2cde21ccb15e69a6e1cfb.png`,type:`texture`,channel:0,sampler:{filter:`mipmap`,wrap:`repeat`,vflip:`false`,srgb:`false`,internal:`byte`},published:1}],outputs:[{id:`4dfGRr`,channel:0}],code:`// Moonlight. Created by Reinder Nijhoff 2013
// Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License.
// @reindernijhoff
//
// https://www.shadertoy.com/view/4sl3z4
//

#define SHOWALL
//#define SHOWBOTTLE

#ifdef SHOWALL
	#define SHOWBOTTLE
	//#define BOTTLESHADOW 0
	#define SHOWMOUNTAINS
	#define CLOUDDETAiL
#endif

#define CLOUDSHARPNESS 0.001
#define WINDSPEED vec2(-43.0, 32.0)
#define BUMPFACTOR 0.05
#define BUMPDISTANCE 70.
#define MAXMOUNTAINDISTANCE 40.
#define SKYCOLOR vec3(0.1,0.1,0.15)
#define MOONLIGHTCOLOR vec3(.4,0.4,0.2)
#define SKYBYMOONLIGHTCOLOR vec3(.4,.2,0.87)
#define BOTTLECOLOR vec3( 0.7, 1., 0.6 )*0.3
#define WATERCOLOR vec3( 0.2, 0.2, 0.4 )

#define EXPOSURE 0.9
#define EPSILON 0.01
#define MARCHSTEPS 100

#define time (iTime + 23.0)
#define CLOUDCOVER (0.1*cos( time*0.072+0.2 ) + 0.26)
#define moont (time * 0.1)
#define moonf (-time * 0.1)
#define moondir normalize( vec3( cos(moont), 0.8*(0.6+0.5*sin(moonf)), sin(moont) ) )

// math functions

const mat3 m = mat3( 0.00,  0.90,  0.60,
                    -0.90,  0.36, -0.48,
                    -0.60, -0.48,  0.34 );

const mat2 mr = mat2 (0.84147,  0.54030,
                      0.54030, -0.84147 );

float hash( float n ) {
    return fract(sin(n)*43758.5453);
}

float noise( in vec3 x )
{
    vec3 p = floor(x);
    vec3 f = fract(x);
	f = f*f*(3.0-2.0*f);
	
	vec2 uv = (p.xy+vec2(37.0,17.0)*p.z) + f.xy;
	vec2 rg = textureLod( iChannel0, (uv+ 0.5)/256.0, 0.0 ).yx;
	return mix( rg.x, rg.y, f.z );
}

float noise( in vec2 x )
{
    vec2 p = floor(x);
    vec2 f = fract(x);
	vec2 uv = p.xy + f.xy*f.xy*(3.0-2.0*f.xy);
	return textureLod( iChannel0, (uv+118.4)/256.0, 0.0 ).x;
}


float fbm( vec3 p ) {
    float f;
    f  =      0.5000*noise( p ); p = m*p*2.02;
    f +=      0.2500*noise( p ); p = m*p*2.33;
    f +=      0.1250*noise( p ); p = m*p*2.01;
    f +=      0.0625*noise( p ); 
    return f/(0.9175);
}

float fbm( vec2 p ) {
    float f;
    f  =      0.5000*noise( p ); p = mr*p*2.02;
    f +=      0.2500*noise( p ); p = mr*p*2.33;
    f +=      0.1250*noise( p ); p = mr*p*2.01;
    f +=      0.0625*noise( p ); 
    return f/(0.9175);
}

// heightmaps

float heightMap( vec3 pos ) {
	float n = noise( vec2(0.0,4.2)+pos.xz*0.14 );
	return 9.*(n-0.7);
}

float waterHeightMap( vec2 pos ) {
	vec2 posm = pos * mr;
	posm.x += 0.25*time;
	float f = fbm( vec3( posm*1.9, time*0.27 ));
	float height = 0.5+0.1*f;
	height += 0.13*sin( posm.x*6.0 + 10.0*f );

#ifdef SHOWBOTTLE	
	float d = length(pos-vec2(-3., 0.));
	height += 0.1 * cos( d*50.-time*4. ) * (1. - smoothstep( 0., 1.0, d) );
#endif
	
	return  height;
}

// intersection functions

bool intersectPlane(vec3 ro, vec3 rd, float height, out float dist) {	
	if (rd.y==0.0) {
		return false;
	}
		
	float d = -(ro.y - height)/rd.y;
	d = min(100000.0, d);
	if( d > 0. ) {
		dist = d;
		return true;
	}
	return false;
}

bool intersectHeightMap(vec3 ro, vec3 rd, float maxdist, const bool reflection, out float dist ) {
	float dt = 0.3;
	vec3 pos;
	dist = 0.0;
	bool hit = false;

	for( int i=0; i<MARCHSTEPS; i++) {
		if( hit || dist > maxdist ) break;
		
		dist += dt;
		dt = min( dt*1.1, 0.5 );
		pos = ro + rd*dist;
		if( heightMap( pos ) >= pos.y ) {
			hit = true;
		}
	}
	return hit;
}

bool intersectSphere ( in vec3 ro, in vec3 rd, in vec4 sph, out float dist, out vec3 normal ) {
    vec3  ds = ro - sph.xyz;
    float bs = dot( rd, ds );
    float cs = dot(  ds, ds ) - sph.w*sph.w;
    float ts = bs*bs - cs;
	
    if( ts > 0.0 ) {
        ts = -bs - sqrt( ts );
		if( ts>0. ) {
			normal = normalize( ((ro+ts*rd)-sph.xyz)/sph.w );
			dist = ts;
			return true;
		}
    }

    return false;
}

bool intersectCylinder( in vec3 ro, in vec3 rd, in vec3 A, in vec3 B, in float radius, out float dist, out vec3 normal) {
	vec3 AB = B - A;
	vec3 AO = ro - A;
 
	float AB_dot_d = dot( AB, rd );
	float AB_dot_AO = dot( AB, AO );
	float AB_dot_AB = dot( AB, AB );
 
	float m = AB_dot_d / AB_dot_AB;
	float n = AB_dot_AO / AB_dot_AB;
 
	vec3 Q = rd - (AB * m);
	vec3 R = AO - (AB * n);
 
	float a = dot( Q, Q );
	float b = 2.0 * dot( Q, R );
	float c = dot( R, R ) - (radius*radius);
 
	if(a == 0.0) {
		float adist = 100000., bdist = 100000.;
		if(	!intersectSphere( ro, rd, vec4( A, radius ), adist, normal ) ||
			!intersectSphere( ro, rd, vec4( B, radius ), bdist, normal ) ) {
			return false;
		}
 		dist = min (adist, bdist);
		normal = normalize((ro+rd*dist) - (adist<bdist?A:B) );
		return true;
	}
 
	float discriminant = b * b - 4.0 * a * c;
	if(discriminant < 0.0) {
		return false;
	}
 
	float sqrtdis = sqrt(discriminant);
	float tmin = (-b - sqrtdis) / (2.0 * a);
	float tmax = (-b + sqrtdis) / (2.0 * a);
	if( tmin < 0. )
		tmin = tmax;
	else 
		tmin = min(tmin, tmax); 
	
	if( tmin < 0. ) return false;
	
	float t_k1 = tmin * m + n;
	float dc = 10000000.;
	
	vec3 nc;
	
	if(t_k1 < 0.0)	{		
		if(intersectSphere( ro, rd, vec4( A, radius ), dist, normal)) {
			return true;
		} else {
			return false;
		}
	}
	else if(t_k1 > 1.0) {
		if(intersectSphere( ro, rd, vec4( B, radius ), dist, normal)) {
			return true;
		} else {
			return false;
		}
	} else {
		// On the cylinder...
		vec3 p1 = ro + (rd * tmin);
 		vec3 k1 = A + AB * t_k1;
		dist = tmin;
		normal = normalize( p1 - k1 );
		return true;
	}
	return false;
}
	
bool intersectBottle ( in vec3 ro,  in vec3 rd, out float dist, out vec3 normal ) {		
	float d = 1000000.;
	bool  hitc;
	float distc;
	vec3  normalc;	
	
	float rx = sin( iTime ) * 0.2;	
	vec3 up = vec3( 0., 0.4 * cos(rx), 0.4 * sin(rx) );
	vec3 pos = vec3(  -3.0, 0.05*cos(iTime*0.6)+0.05, 0.);
	
	hitc = intersectCylinder( ro, rd, pos+up*1.5, pos-up*1.5, 0.07, distc, normalc);
	if( hitc && distc < d ) {
		d = distc;
		normal = normalc;
	}
	hitc = intersectCylinder( ro, rd, pos+up*0.15, pos-up*0.15, 0.22, distc, normalc);
	if( hitc && distc < d ) {
		d = distc;
		normal = normalc;
	}
	if( d < 1000000. ) {
		dist = d;
		return true;
	}
	return false;
}

// more copy-paste functions...

float cloudDensity( vec3 rd ) {
	float d;
	intersectPlane( vec3(0., 0., 0.), rd, 500., d );
	vec3 intersection = rd*d;	
	
	float cloud = 0.5 + 0.5*fbm( vec3( 
		(intersection.xz + WINDSPEED*time)*0.001, time*0.25) ) - (1.-CLOUDCOVER);

#ifdef CLOUDDETAiL	
	cloud += 0.02*noise((intersection.xz - WINDSPEED*time*0.01));
#endif
	
    if (cloud < 0.) cloud = 0.;
	
	cloud = 1. - pow(CLOUDSHARPNESS, cloud);
	
	cloud = mix( CLOUDCOVER, cloud, smoothstep( 0.0, 0.1, dot( rd, vec3(0.,1.,0.) ) ) );
	
	return cloud;
}

vec3 skyColor( vec3 rd ) {	
	float moonglow = clamp( 1.0782*dot(moondir,rd), 0.0, 2.0 );
	vec3 col = SKYCOLOR * moondir.y;
	col += .4*SKYBYMOONLIGHTCOLOR*moonglow;
	col += 0.43*MOONLIGHTCOLOR*pow( moonglow, 21.0 );

	// moon!
	float dist; vec3 normal; bool moonhit = false;
	if( intersectSphere( vec3(0., 0., 0.), rd, vec4( moondir, 0.07), dist, normal ) ) {
		float l = dot( normalize(vec3( -moondir.x, 0.0, -moondir.z)+vec3( 2.2, -1.6, 0.)), normal );
		col += 3.0*MOONLIGHTCOLOR*clamp(l, 0.0, 1.);
		moonhit = true;
	}
		
	// Do the stars...
	if( !moonhit ) {
		vec3 rds = rd;
		
		float v = 1.0/( 2. * ( 1. + rds.z ) );
		vec2 xy = vec2(rds.y * v, rds.x * v);
		float s = noise(rds.xz*134.);
		s += noise(rds.xz*370.);
		s += noise(rds.xz*870.);
		s = pow(s,19.0) * 0.00000001 * max(rd.y, 0.0 );
		if (s > 0.1) {
			vec3 backStars = vec3((1.0-sin(xy.x*20.0+time*13.0*rds.x+xy.y*30.0))*.5*s,s, s); 
			col += backStars;
		}
	}
	
	col *= (1.0-cloudDensity( rd ) );

	return col;
}

// trace function

vec3 trace(vec3 ro, vec3 rd, float currentDistance, const bool reflection, out vec3 intersection, out vec3 normal, out float dist, out int material) 
{
	material = 0; // sky
	float d = 1000000.;
	bool  hitc;
	float distc;
	vec3  normalc;

#ifdef SHOWMOUNTAINS
	hitc = intersectHeightMap( ro, rd, MAXMOUNTAINDISTANCE-currentDistance, reflection, distc );
	if( hitc ) {
		material = 1; // mountain
		normal = -rd; // ahum
		d = distc;
	}
#endif

	hitc = intersectPlane( ro, rd, 0., distc);
	if( hitc && (distc < d) ) {
		material = 2; // water
		normal = vec3( 0., 1., 0. );
		d = distc;
	}
	
#ifdef SHOWBOTTLE
	hitc = intersectBottle( ro, rd, distc, normalc ); 
	if( hitc && (distc < d) ) {
		material = 3; // bottle
		normal = normalc;
		d = distc;
	}
#endif
	
	if( d < 100000. ) {
		dist = d;
		intersection = ro + rd*dist;
	}

	if( !reflection && material == 2 ) {
		vec2 coord = intersection.xz;
		vec2 dx = vec2( EPSILON, 0. );
		vec2 dz = vec2( 0., EPSILON );
		
		float bumpfactor = BUMPFACTOR * (1. - smoothstep( 0., BUMPDISTANCE, dist) );
		
		normal.x = bumpfactor * (waterHeightMap(coord + dx) - waterHeightMap(coord-dx) ) / (2. * EPSILON);
		normal.z = bumpfactor * (waterHeightMap(coord + dz) - waterHeightMap(coord-dz) ) / (2. * EPSILON);
		normal = normalize( normal );
	}
		
	vec3 col;
	float diff = clamp(dot(normal,moondir), 0., 1.);
	
	// shadow ?
#ifdef BOTTLESHADOW
	if( intersectBottle( intersection+normal*EPSILON, moondir, distc, normalc ) ) {
		diff = 0.;
	}
#endif
	
	if (material == 2) { // water
		col = WATERCOLOR * MOONLIGHTCOLOR * diff;
	} else if( material == 1 ) { // mountains
		col = mix( 0.5 * MOONLIGHTCOLOR * diff, vec3(0.), (currentDistance+dist)/MAXMOUNTAINDISTANCE);
	} else if( material == 3 ) { // bottle
		col = BOTTLECOLOR * diff * smoothstep( 0., 0.2, intersection.y );
	} else { // sky
		col = skyColor(rd);
	}
	
	if( material > 0 ) {
		col = mix( col, SKYCOLOR*CLOUDCOVER, clamp( dist/100., 0., 1.) );	
	}
		
	return col;
}
		
// main

void mainImage( out vec4 fragColor, in vec2 fragCoord ) {

	vec2 q = fragCoord.xy/iResolution.xy;
    vec2 p = -1.0+2.0*q;
	p.x *= iResolution.x/iResolution.y;
    vec2 mo = iMouse.xy/iResolution.xy;
		 
	float a = moont + 0.3*sin( time*0.12 )+(mo.x>0.?(mo.x-0.5):0.)*3.1415*2.;
	// camera	
	vec3 ce = vec3( 0.0, 0.2, 0.0 );
	vec3 ro = ce + vec3( 1.3*cos(0.11*time + 6.0*mo.x), 0.65*(mo.y>0.?mo.y:0.5), 1.3*sin(0.11*time + 6.0*mo.x) );
	vec3 ta = ro + vec3( 0.95*cos(a), 0.75*ro.y-0.3+moondir.y*0.2, 0.95*sin(a) );
	
	float roll = -0.15*sin(0.1*time);
	
	// camera tx
	vec3 cw = normalize( ta-ro );
	vec3 cp = vec3( sin(roll), cos(roll),0.0 );
	vec3 cu = normalize( cross(cw,cp) );
	vec3 cv = normalize( cross(cu,cw) );
	vec3 rd = normalize( p.x*cu + p.y*cv + 1.5*cw );

	// raytrace
	int material;
	vec3 normal, intersection;
	float dist = 0., dist2 = 0.;
		
	vec3 col = trace(ro, rd, 0.0, false, intersection, normal, dist, material);

	if( material >= 2 ) {
		// reflection
		vec3 rfld = reflect( rd, normal );
		
		float reflectstrength = 1.-abs(dot( rd, normal ));
		
		col += 0.9 * reflectstrength * trace(intersection+rfld*EPSILON, rfld, dist, true, intersection, normal, dist2, material);
	}

	col = pow( col, vec3(EXPOSURE, EXPOSURE, EXPOSURE) );	
	col = clamp(col, 0.0, 1.0);
	
    // vigneting
    col *= 0.25+0.75*pow( 16.0*q.x*q.y*(1.0-q.x)*(1.0-q.y), 0.15 );
	
	fragColor = vec4( col,1.0);
}`,name:`Image`,description:``,type:`image`}]},{ver:`0.1`,info:{id:`MdlGz4`,date:`1364485357`,viewed:11202,name:`Minecraft Blocks`,description:`Shameless port of javascriptcode by Markus Persson (http://jsfiddle.net/uzMPU/).`,likes:65,published:`Public API`,usePreview:0,tags:[`raycasting`,`voxel`,`minecraft`,`proceduraltextures`]},renderpass:[{inputs:[],outputs:[],code:`// Minecraft Blocks. Created by Reinder Nijhoff 2013
// Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License.
// @reindernijhoff
//
// https://www.shadertoy.com/view/MdlGz4
//
// port of javascript minecraft: http://jsfiddle.net/uzMPU/
// original code by Markus Persson: https://twitter.com/notch/status/275331530040160256

float hash( float n ) {
    return fract(sin(n)*43758.5453);
}

// port of minecraft

bool getMaterialColor( int i, vec2 coord, out vec3 color ) {
	// 16x16 tex
	vec2 uv = floor( coord );

    float n = uv.x + uv.y*347.0 + 4321.0 * float(i);
	float h = hash(n);
		
    float br = 1. - h * (96./255.
						);
	color = vec3( 150./255., 108./255.,  74./255.); // 0x966C4A;
	
	if (i == 4) {
		color = vec3( 127./255., 127./255., 127./255.); // 0x7F7F7F;
	}
	
	float xm1 = mod((uv.x * uv.x * 3. + uv.x * 81.) / 4., 4.);
	
	if (i == 1) {
		if( uv.y < (xm1 + 18.)) {
			color = vec3( 106./255., 170./255.,  64./255.); // 0x6AAA40;
		} else if (uv.y < (xm1 + 19.)) {
			br = br * (2. / 3.);
		}
	}
	
	if (i == 7) {
		color = vec3( 103./255., 82./255.,  49./255.); // 0x675231;
		if (uv.x > 0. && uv.x < 15.
			&& ((uv.y > 0. && uv.y < 15.) || (uv.y > 32. && uv.y < 47.))) {
			color = vec3( 188./255., 152./255.,  98./255.); // 0xBC9862;
			float xd = (uv.x - 7.);
			float yd = (mod(uv.y, 16.) - 7.);
			if (xd < 0.)
				xd = 1. - xd;
			if (yd < 0.)
				yd = 1. - yd;
			if (yd > xd)
				xd = yd;
			
			br = 1. - (h * (32./255.) + mod(xd, 4.) * (32./255.));
		} else if ( h < 0.5 ) {
			br = br * (1.5 - mod(uv.x, 2.));
		}
	}
	
	if (i == 5) {
		color = vec3( 181./255.,  58./255.,  21./255.); // 0xB53A15;
		if ( mod(uv.x + (floor(uv.y / 4.) * 5.), 8.) == 0. || mod( uv.y, 4.) == 0.) {
			color = vec3( 188./255., 175./255., 165./255.); // 0xBCAFA5;
		}
	}
	if (i == 9) {
		color = vec3(  64./255.,  64./255., 255./255.); // 0x4040ff;
	}
	
	float brr = br;
	if (uv.y >= 32.)
		brr /= 2.;
	
	if (i == 8) {
		color = vec3(  80./255., 217./255.,  55./255.); // 0x50D937;
		if ( h < 0.5) {
			return false;
		}
	}
	
	color *= brr;
	
	return true;
}

int getMap( vec3 pos ) {	
	vec3 posf = floor( (pos - vec3(32.))  );
    
	float n = posf.x + posf.y*517.0 + 1313.0*posf.z;
    float h = hash(n);
	
	if( h > sqrt( sqrt( dot( posf.yz, posf.yz )*0.16 ) ) - 0.8  ) {
        return 0;
	}	
	
	return int( hash( n * 465.233 ) * 16. );
}

vec3 renderMinecraft( vec2 uv ) {
    float xRot = sin( iTime*0.5 ) * 0.4 + (3.1415 / 2.);
    float yRot = cos( iTime*0.5 ) * 0.4;
    float yCos = cos(yRot);
    float ySin = sin(yRot);
    float xCos = cos(xRot);
    float xSin = sin(xRot);

	vec3 opos = vec3( 32.5 + iTime * 6.4, 32.5, 32.5 );
	
	float gggxd = (uv.x - 0.5) * (iResolution.x / iResolution.y );
	float ggyd = (1.-uv.y - 0.5);
	float ggzd = 1.;
	
	float gggzd = ggzd * yCos + ggyd * ySin;
	
	vec3 _posd = vec3( gggxd * xCos + gggzd * xSin,
					   ggyd * yCos - ggzd * ySin,
					   gggzd * xCos - gggxd * xSin );
	
	vec3 col = vec3( 0. );
	float br = 1.;
	vec3 bdist = vec3( 255. - 100., 255. -   0., 255. -  50.  );
	float ddist = 0.;
	
	float closest = 32.;
	
	for ( int d = 0; d < 3; d++) {
		float dimLength = _posd[d];
		
		float ll = abs( 1. / dimLength );
		vec3 posd = _posd * ll;;
		
		float initial = fract( opos[d] );
		if (dimLength > 0.) initial = 1. - initial;
		
		float dist = ll * initial;
		
		vec3 pos = opos + posd * initial;
		
		if (dimLength < 0.) {
			pos[d] -= 1.;
		}
		
		for (int i=0; i<30; i++) {
			if( dist > closest )continue;
			
			//int tex = getMap( mod( pos, 64. ) );
			int tex = getMap( pos );
			
			if (tex > 0) {
				vec2 texcoord;
				texcoord.x = mod(((pos.x + pos.z) * 16.), 16.);
				texcoord.y = mod((pos.y * 16.), 16.) + 16.;
				if (d == 1) {
					texcoord.x = mod(pos.x * 16., 16.);
					texcoord.y = mod(pos.z * 16., 16.);
					if (posd.y < 0.)
						texcoord.y += 32.;
				}
				
				if ( getMaterialColor( tex, texcoord, col ) ) {
					ddist = 1. - (dist / 32.);
					br = bdist[d];
					closest = dist;
				}
			}
			pos += posd;
			dist += ll;
		}
	}
	
	return col * ddist * (br/255.);
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
	vec2 uv = fragCoord.xy / iResolution.xy;
	
	fragColor = vec4( renderMinecraft( uv ) ,1.0);
}`,name:`Image`,description:``,type:`image`}]},{ver:`0.1`,info:{id:`XsfGzM`,date:`1365016363`,viewed:3542,name:`Nyan`,description:`Nyan exploring. The shader shows the procedural textures of my shader 'Abandond base on Mars': https://www.shadertoy.com/view/4sfGR7.`,likes:46,published:`Public API`,usePreview:0,tags:[`procedural`,`textures`]},renderpass:[{inputs:[{id:`XsXGRn`,filepath:`/media/a/cd4c518bc6ef165c39d4405b347b51ba40f8d7a065ab0e8d2e4f422cbc1e8a43.jpg`,type:`texture`,channel:0,sampler:{filter:`mipmap`,wrap:`repeat`,vflip:`false`,srgb:`false`,internal:`byte`},published:1},{id:`Xsf3Rn`,filepath:`/media/a/cbcbb5a6cfb55c36f8f021fbb0e3f69ac96339a39fa85cd96f2017a2192821b5.png`,type:`texture`,channel:1,sampler:{filter:`nearest`,wrap:`clamp`,vflip:`false`,srgb:`false`,internal:`byte`},published:1}],outputs:[{id:`4dfGRr`,channel:0}],code:`// Nyan. Created by Reinder Nijhoff 2013
// Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License.
// @reindernijhoff
//
// https://www.shadertoy.com/view/XsfGzM
//

// seconds needed to walk through room
#define WALKINGSPEED 3.

#define DIRT
#define NYANSPEED 16.

#define NUMBERLIGHTS 4

#define EXPOSURE 1.9
#define AMBIANT 3.
#define DYNAMICLIGHTSTRENGTH 2.
#define PI 3.1415926

#define INTERVALBACKGROUND 16.
#define INTERVALFLOOR 16.
#define INTERVALFOREGROUND 16.
#define INTERVALSPECULARCOLOR 1.
#define INTERVALDIRT 10.


float dirtFactor;


//
// math functions
//

const mat2 mr = mat2 (0.84147,  0.54030,
					  0.54030, -0.84147 );
float hash( float n ) {
	return fract(sin(n)*43758.5453);
}
vec2 hash2( float n ) {
    return fract(sin(vec2(n,n+1.0))*vec2(2.1459123,3.3490423));
}

vec3 hash3( float n ) {
    return fract(sin(vec3(n,n+1.0,n+2.0))*vec3(3.5453123,4.1459123,1.3490423));
}
float noise(in float x) {
	float p = floor(x);
	float f = fract(x);
		
	f = f*f*(3.0-2.0*f);	
	return mix( hash(p+  0.0), hash(p+  1.0),f);
}
float noise(in vec2 x) {
	vec2 p = floor(x);
	vec2 f = fract(x);
		
	f = f*f*(3.0-2.0*f);	
	float n = p.x + p.y*57.0;
	
	float res = mix(mix( hash(n+  0.0), hash(n+  1.0),f.x),
					mix( hash(n+ 57.0), hash(n+ 58.0),f.x),f.y);
	return res;
}
float fbm( vec2 p ) {
	float f;
	f  =      0.5000*noise( p ); p = mr*p*2.02;
	f +=      0.2500*noise( p ); p = mr*p*2.33;
	f +=      0.1250*noise( p ); p = mr*p*2.01;
	f +=      0.0625*noise( p ); p = mr*p*2.01;
	return f/(0.9175);
}

//
// material functions
//

float matfhf, matflf;
float matnoisehf;
vec3 math3;

void materialInit(in float seed, const vec2 coord) {
	matfhf = fbm( coord * 171. );
	matflf = fbm( coord );
	matnoisehf = noise( coord * 193. );
	math3  = hash3( seed * 11. );
}

vec3 materialBaseColor( float t ) {
	t = mod( t, 3490423. );
	return texture( iChannel0, vec2( t )*vec2(0.14591255443,0.34934560423) ).xyz;
}

void materialDirt( const vec2 coord, out vec3 color, out vec2 normal ) {
	color = vec3( 0.7, 0.5, 0.4 ) * (0.25+0.75*matfhf);
	normal = vec2( matnoisehf*2. -1. );
}

vec2 materialGrooves( float seed, bool iswall ) {
	vec2 math2 = hash2( seed );
	if( iswall ) return clamp( floor(math2*6.) / 8. - 0.25, vec2(0.), vec2(1.));
	return clamp( floor( math2*4.) / 8., vec2(0.), vec2(1.));
}

float grooveHeight( float l, const float w, float p ) {
	if( l == 0. ) return 1.;
	return (smoothstep( 0.,  w*0.5, mod(p, l) )) * (1.-smoothstep( l-w*0.5, l, mod(p, l) ));
}

float materialHeightMap( const vec2 grooves, const vec2 coord ) {
	return min( grooveHeight( grooves.x, 0.01, coord.x ), grooveHeight( grooves.y, 0.01, coord.y ));
}

float materialDirtAmount( const vec2 grooves, const vec2 coord ) {
	vec2 f = mix( vec2(0.01), grooves*2., dirtFactor );
	return 1. - 0.5*min( grooveHeight( grooves.x, f.x, coord.x ), grooveHeight( grooves.y, f.y, coord.y ));
}

// calculate color

void getMaterial( float seed, const vec2 coord, const vec2 grooves,  bool isfloor, bool iswall, 
			  	  out vec3 color, out vec2 normal, out float spec ) {

	float height = materialHeightMap( grooves, coord );	
	normal.x = (height-materialHeightMap( grooves, coord-vec2(0.002,0.) )) * 500.;
	normal.y = (height-materialHeightMap( grooves, coord-vec2(0.,0.002) )) * 500.;
	normal += 0.1*fract( math3.y * 1.64325 ) * (2. * vec2( matfhf, matnoisehf ) - vec2(1.));
	
	spec = (height + 4.*matfhf )*0.1*fract( math3.x * 1.13 )*matflf;
	
	vec3 color1 = materialBaseColor( seed ); 	
	vec3 color2 = materialBaseColor( seed*2.6345 ); 	

	// checkboard ?
	bool checkx = grooves.x > 0. && mod( coord.x, grooves.x*2. ) < grooves.x;
	bool checky = grooves.y > 0. && mod( coord.y, grooves.y*2. ) < grooves.y;
	
	if( fract( math3.z * 4.435 ) < 0.5 && ((checkx && checky) || (!checkx && !checky)) ) {
		color = mix( color2, color1, matflf*fract(math3.y*45.234) );
	} else {		
		color = mix( color1, color2, matflf*fract(math3.y*45.234) );
	}
	
	color *= (0.8+0.2*height+0.2*fract( math3.x*3.76 )*matfhf);
		
#ifdef DIRT	
	if( dirtFactor > 0.1 ) { // dirt
		vec2 dirtNormal; vec3 dirtColor;		
		materialDirt( coord, dirtColor, dirtNormal );
		
		float dirtAmount = materialDirtAmount( grooves, coord );	

		if( iswall ) {
			dirtAmount += clamp( dirtFactor - coord.y, -dirtAmount, 1.);
		} else	if( !isfloor ) {
			dirtAmount *= 0.5; // less dirt on ceiling
		}
	
		dirtFactor = clamp( 10. * (0.5* (dirtAmount * matflf + matfhf ) - (1.-dirtFactor)), 0., 1.);
	
		if( dirtFactor > 0.1 ) {
			color = mix( color, dirtColor, dirtFactor );
			spec *= 1. - dirtFactor;
			normal = mix( normal, dirtNormal, dirtFactor );
		}
	}
#endif
}

void getWallMaterial( float seed, vec2 coord,  
					  out vec3 color, out vec2 normal, out float spec ) {
	coord *= 0.1;
	materialInit( seed, coord );
	
	float s = mod( floor( math3.y*13.4361 ), 8. ) * 0.125;
	
	float wseed = seed;
	if( coord.y > s ) wseed += 1.;	

	vec2 grooves = materialGrooves( wseed, true );

	getMaterial( seed, coord, vec2(grooves.x, max( grooves.y, s )), false, true, color, normal, spec );
}

void getFloorMaterial( float seed, vec2 coord, bool isfloor,  
					   out vec3 color, out vec2 normal, out float spec ) {	
	coord *= 0.1;
	materialInit( seed, coord );
	vec2 grooves = materialGrooves( seed, false );

	getMaterial( seed, coord, grooves, isfloor, false, color, normal, spec );
}


vec3 getColor(vec2 coord, float time) {
	float z, spec, offset;
	vec3 color, position, normal, retcolor;
	vec2 ntangent;
	
    
	offset = time * NYANSPEED;
	
	coord.y += 0.4;
	
	if( coord.y >  0. ) { // wall at z = -8.
		z = 8.; vec2 dxy = vec2( z );
		position = vec3( coord*dxy, z );
		float material = floor( (position.x+offset) / INTERVALBACKGROUND );	
		getWallMaterial( material, position.xy+offset*vec2(1., 0.), color, ntangent, spec );
		normal = normalize( vec3( -ntangent.x, -ntangent.y, -1. ) );
	} else if( coord.y < -0.125 ) { // wall at z = -4;
		z = 4.; vec2 dxy = vec2( z );
		position = vec3( (coord+vec2(0.,0.125))*dxy, z );
		float material = floor( (position.x+offset) / INTERVALFOREGROUND );
		getFloorMaterial( material, position.xy+offset*vec2(1., 0.), false, color, ntangent, spec );
		normal = normalize( vec3( -ntangent.x, -ntangent.y, -1. ) );
	} else { // floor
		z = -1./(coord.y-0.125); vec2 dxy = vec2( z );
		position = vec3( coord*dxy, z );
		float material = floor( (position.x+offset) / INTERVALFLOOR );
		getFloorMaterial( material, position.xz+offset*vec2(1., 0.), true, color, ntangent, spec );
		normal = normalize( vec3( -ntangent.x, 1., -ntangent.y ) );
	}
	
	// nyan cat! at z=-7;
	z = 7.; vec2 dxy = vec2( z );
	vec2 nyanpos = coord*dxy+vec2( 6.5, 1.2 );
	bool nyanhit = false;
	
	if( nyanpos.x >= 0. && nyanpos.x < 5. && nyanpos.y >= 0. && nyanpos.y < 5. ) {
		vec2 nyancoord = nyanpos/5.;
		
		float ofx = floor( mod( time*NYANSPEED, 6.0 ) );
		float ww = 40.0/256.0;
				
		nyancoord.y = 1.0-nyancoord.y;
		nyancoord.x = clamp( nyancoord.x*ww + ofx*ww, 0.0, 1.0 );
		vec4 nyan = texture( iChannel1, nyancoord );
		if( nyan.w > 0. ) {
			color = nyan.xyz;
			normal = vec3( 0., 0., -1. );
			position =  vec3( nyanpos, z );
			spec = 0.5;
			nyanhit = true;
		}
	}
		
	vec3 diffcolor = vec3(0.6);
	retcolor = diffcolor*color*AMBIANT * dot( normalize( -vec3( 0.8, -0.8, 1.0 ) ), normal );
	
	// dynamic lights

	float specfactor = time/INTERVALSPECULARCOLOR;
	vec3 speccolor = normalize( mix( hash3( floor( specfactor ) ), hash3( floor( specfactor+1. ) ), fract( specfactor ) ) );
	
	float totalwidth = 40.;
	vec3 rd = normalize( vec3( coord, 0.1 ) );
	
	for( int i=0; i<NUMBERLIGHTS; i++) {
		float lx = mod( float(i)*totalwidth/float(NUMBERLIGHTS)-offset, totalwidth)-totalwidth/2.;
		vec3 loffset = vec3( 1.5*sin(time*2.+float(i)), 4.4*cos(time*1.3+float(i)), 3.*sin(time*0.9+float(i)) );

		vec3 lpos = vec3( lx, 5., 4.5 ) + loffset;
		vec3 lvec = lpos - position;
		
		float llig = dot( lvec, lvec);
		float im = inversesqrt( llig );
		lvec = im * lvec;
		
		// diffuse
		float diff = DYNAMICLIGHTSTRENGTH * clamp( dot( lvec, normal ), 0., 1.);	
		// specular		
		float specu = clamp( dot( reflect(rd,normal), lvec ), 0.0, 1.0 );
		specu = 40. * DYNAMICLIGHTSTRENGTH * spec * (pow(specu,16.0) + 0.5*pow(specu,4.0));
		
		retcolor += speccolor * color * (diff+specu) / llig;
	}

	if( !nyanhit ) {
		float ao = length(position- vec3( -3.5, 1.3, 6.));
		retcolor *= clamp( ao*0.4, 0., 1.);
	}
	
	return retcolor;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
    float time = iTime + 259.;
	vec2 q = fragCoord.xy/iResolution.xy;
	vec2 p = -1.0+2.0*q;
	p.x *= iResolution.x/iResolution.y;
	
	dirtFactor = 0.4+0.2*sin(time/INTERVALDIRT+1.6);
	
	vec3 color = getColor( p, time );
	color = pow( 0.7*color, vec3(EXPOSURE) );	
    // vigneting
    color *= 0.25+0.75*pow( 16.0*q.x*q.y*(1.0-q.x)*(1.0-q.y), 0.15 );
	
	fragColor = vec4( color, 1.0);
}`,name:`Image`,description:``,type:`image`}]},{ver:`0.1`,info:{id:`4sfGR7`,date:`1365161571`,viewed:5438,name:`Abandoned base on Mars`,description:`Complete rewrite of old shader.
You're exploring an abandoned base on Mars. The base is covered with dirt.
Shader shows procedural levels and materials, a doom-like pseudo 3d-engine, dynamics lights & shadows, bumpmapping, specular maps and reflections.`,likes:43,published:`Public API`,usePreview:0,tags:[`raycasting`,`procedurallevel`,`proceduralmaterial`]},renderpass:[{inputs:[{id:`XsXGRn`,filepath:`/media/a/cd4c518bc6ef165c39d4405b347b51ba40f8d7a065ab0e8d2e4f422cbc1e8a43.jpg`,type:`texture`,channel:0,sampler:{filter:`mipmap`,wrap:`repeat`,vflip:`false`,srgb:`false`,internal:`byte`},published:1},{id:`4dXGzn`,filepath:`/media/a/0c7bf5fe9462d5bffbd11126e82908e39be3ce56220d900f633d58fb432e56f5.png`,type:`texture`,channel:1,sampler:{filter:`mipmap`,wrap:`repeat`,vflip:`false`,srgb:`false`,internal:`byte`},published:1}],outputs:[],code:`// Abandoned base on Mars. Created by Reinder Nijhoff 2013
// Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License.
// @reindernijhoff
//
// https://www.shadertoy.com/view/4sfGR7
//

#define DIRT
#define DYNAMICLIGHTNING
//#define SHADOWS
//#define REFLECTION

#define ROOMSIZE 10.
#define PORTALSIZE 1.5
#define PORTALHEIGHT 3.0

// seconds needed to walk through room
#define WALKINGSPEED 3.

#define MAXDISTANCE 1000.
#define MAXMATERIALS 1000.

#define EXPOSURE 2.3
#define AMBIANT 2.2
#define DYNAMICLIGHTSTRENGTH 7.
#define PI 3.1415926

#define NUMBEROFLIGHTS 2

float dirtFactor;

//
// math functions
//

const mat2 mr = mat2 (0.84147,  0.54030,
					  0.54030, -0.84147 );
float hash( float n ) {
	return fract(sin(n)*43758.5453);
}
vec2 hash2( float n ) {
    return fract(sin(vec2(n,n+1.0))*vec2(2.1459123,3.3490423));
}

vec3 hash3( float n ) {
    return fract(sin(vec3(n,n+1.0,n+2.0))*vec3(3.5453123,4.1459123,1.3490423));
}
float noise(in float x) {
	float p = floor(x);
	float f = fract(x);
		
	f = f*f*(3.0-2.0*f);	
	return mix( hash(p+  0.0), hash(p+  1.0),f);
}
float noise( in vec2 x )
{
    vec2 p = floor(x);
    vec2 f = fract(x);
	vec2 uv = p.xy + f.xy*f.xy*(3.0-2.0*f.xy);
	return textureLod( iChannel1, (uv+118.4)/256.0, 0.0 ).x;
}
float fbm( vec2 p ) {
	float f;
	f  =      0.5000*noise( p ); p = mr*p*2.02;
	f +=      0.2500*noise( p ); p = mr*p*2.33;
	f +=      0.1250*noise( p ); p = mr*p*2.01;
	f +=      0.0625*noise( p ); p = mr*p*2.01;
	return f/(0.9175);
}
vec3 rotate(vec3 r, float v){ return vec3(r.x*cos(v)+r.z*sin(v),r.y,r.z*cos(v)-r.x*sin(v));}
float crossp( vec2 a, vec2 b ) { return a.x*b.y - a.y*b.x; }

//
// intersection functions
//

void intersectPlane(const vec3 ro, const vec3 rd, const float height, out float dist) {	
	dist = MAXDISTANCE;
	if (rd.y==0.0) {
		return;
	}
	
	float d = -(ro.y - height)/rd.y;
	d = min(MAXDISTANCE, d);
	if( d > 0. ) {
		dist = d;
	}
}

void intersectSegment(const vec3 ro, const vec3 rd, const vec2 a, const vec2 b, out float dist, out float u) {
	dist = MAXDISTANCE;
	vec2 p = ro.xz;
	vec2 r = rd.xz;
	vec2 q = a-p;
	vec2 s = b-a;
	float rCrossS = crossp(r, s);
	
	if( rCrossS == 0.){
		return;
	}
	float t = crossp(q, s) / rCrossS;
	u = crossp(q, r) / rCrossS;
	
	if(0. <= t && 0. <= u && u <= 1.){
		dist = t;
	}
}

//
// material functions
//

float matfhf, matflf;
float matnoisehf;
vec3 math3;

void materialInit(in float seed, const vec2 coord) {
	matfhf = fbm( coord * 171. );
	matflf = fbm( coord );
	matnoisehf = noise( coord * 193. );
	math3  = hash3( seed * 11. );
}

vec3 materialBaseColor( float t ) {
	return textureLod( iChannel0, vec2(1.1459123*t,2.3490423*t), 0. ).xyz;
}

void materialDirt(  vec2 coord, out vec3 color, out vec2 normal ) {
	color = vec3( 0.7, 0.5, 0.4 ) * (0.75*matfhf+0.25);
	normal = vec2( matnoisehf*2. -1. );
}

vec2 materialGrooves( float seed, bool iswall ) {
	vec2 math2 = hash2( seed );
	if( iswall ) return clamp( floor(math2*6.) * 0.125 - 0.25, vec2(0.), vec2(1.));
	return clamp( floor( math2*4.) * 0.125, vec2(0.), vec2(1.));
}

float grooveHeight( float l, float w, float p ) {
	if( l == 0. ) return 1.;
	return smoothstep( l, (l-w), abs(2.*mod(p, l)-l) );
}

float materialHeightMap( vec2 grooves, vec2 coord ) {
	return min( grooveHeight( grooves.x, 0.01, coord.x ), grooveHeight( grooves.y, 0.01, coord.y ));
}

float materialDirtAmount( vec2 grooves, vec2 coord ) {
	vec2 f = mix( vec2(0.01), grooves*2., dirtFactor );
	return 1. - 0.5*min( grooveHeight( grooves.x, f.x, coord.x ), grooveHeight( grooves.y, f.y, coord.y ));
}

// calculate color

void getMaterial( float seed, vec2 coord, vec2 grooves,  bool isfloor, bool iswall, 
			  	  out vec3 color, out vec2 normal, out float spec ) {

	float height = materialHeightMap( grooves, coord );	
	normal.x = (height-materialHeightMap( grooves, coord-vec2(0.002,0.) )) * 500.;
	normal.y = (height-materialHeightMap( grooves, coord-vec2(0.,0.002) )) * 500.;
	normal += (0.2 * fract( math3.y * 1.64325 )) * (vec2( matfhf, matnoisehf ) - vec2(0.5));
	
	spec = (height + 4.*matfhf )*0.1*fract( math3.x * 1.13 )*matflf;
	
	vec3 color1 = materialBaseColor( seed ); 	
	vec3 color2 = materialBaseColor( seed*2.6345 ); 	

	// checkboard ?
	bool checkx = grooves.x > 0. && mod( coord.x, grooves.x*2. ) < grooves.x;
	bool checky = grooves.y > 0. && mod( coord.y, grooves.y*2. ) < grooves.y;
	
	if( fract( math3.z * 4.435 ) < 0.5 && ((checkx && checky) || (!checkx && !checky)) ) {
		color = mix( color2, color1, matflf*fract(math3.y*45.234) );
	} else {		
		color = mix( color1, color2, matflf*fract(math3.y*45.234) );
	}
	
	color *= (0.4+0.6*height+0.2*fract( math3.x*3.76 )*matfhf);
		
#ifdef DIRT	
	if( dirtFactor > 0.1 ) { // dirt
		vec2 dirtNormal; vec3 dirtColor;		
		materialDirt( coord, dirtColor, dirtNormal );
		
		float dirtAmount = materialDirtAmount( grooves, coord );	

		if( iswall ) {
			dirtAmount += clamp( dirtFactor - coord.y, -dirtAmount, 1.);
		} else	if( !isfloor ) {
			dirtAmount *= 0.5; // less dirt on ceiling
		}
	
		float dirtMix = clamp( 10. * (0.5* (dirtAmount * matflf + matfhf ) - (1.-dirtFactor)), 0., 1.);
	
		if( dirtFactor > 0.1 ) {
			color = mix( color, dirtColor, dirtMix );
			spec *= 1. - dirtMix;
			normal = mix( normal, dirtNormal, dirtMix );
		}
	}
#endif
}

void getWallMaterial( float seed, vec2 coord,  
					  out vec3 color, out vec2 normal, out float spec ) {
	coord *= 0.25;	
	materialInit( seed, coord );
	
	float s = mod( floor( math3.y*13.4361 ), 8. ) * 0.125;
	
	float wseed = seed;
	if( coord.y > s ) wseed += 1.;	

	vec2 grooves = materialGrooves( wseed, true );

	getMaterial( seed, coord, vec2(grooves.x, max( grooves.y, s )), false, true, color, normal, spec );
}

void getFloorMaterial( float seed, vec2 coord, bool isfloor,  
					   out vec3 color, out vec2 normal, out float spec ) {
	
	coord *= 0.25;	
	materialInit( seed, coord );
	vec2 grooves = materialGrooves( seed, false );

	getMaterial( seed, coord, grooves, isfloor, false, color, normal, spec );
}

//
// level creation
//

vec3 portalPlacements; // t=-1, t=0, t=1
bool inRoom;
float currentSeed, currentSeedFract, roomSeed;
vec3 ambiantLight;
vec2 pillarPosition;
float pillarAngle, roomHeight;
vec2 roommorph;
vec3 roomoffset;


//
// Initialization
//

void init( float t ) {
	float seed =  t / WALKINGSPEED;
	currentSeedFract = fract( seed );	
	currentSeed = floor( seed );	
	inRoom = mod( currentSeed, 2. ) < 1.;

	// dirt in base
	dirtFactor = 0.4+0.2*cos(iTime*0.05+0.5);
	
	// possible values: 0., 1., 2., 3. (n,e,s,w)
	portalPlacements = floor( mod( vec3( 
		noise(currentSeed*0.25-0.25), noise(currentSeed*0.25-0.0), noise(currentSeed*0.25+0.25) )*4., vec3(4.) ) );	
	
	ambiantLight = mix( materialBaseColor( currentSeed ), materialBaseColor( currentSeed+1. ), currentSeedFract );
	ambiantLight = normalize( ambiantLight+vec3(0.5) );

	roomSeed = (currentSeed+(inRoom?0.:1.));
	roommorph = 0.5*hash2( roomSeed ) + vec2( 0.5 );
	pillarPosition = (vec2(-0.7)+1.4*hash2( roomSeed*11. ))*(ROOMSIZE*roommorph);
	pillarAngle = hash( roomSeed )*6.;
	roomHeight = PORTALHEIGHT+PORTALHEIGHT*2.*hash(roomSeed);
}

//
// Render level
//

vec2 avoidPillar( in vec2 position ) {
	vec2  v = position - pillarPosition;
	float d = length(v);
	if( d < 1.5 ) {
		position += (1.5-d)*normalize(v);
	}
	return position;
}

void traceRoom( bool inside, float seed, bool isroom, vec3 roo, vec3 rd,
				out float dist, out vec3 color, out vec3 normal, out vec3 bumpnormal, out float spec) {
	
	float p1, p2;
	dist = MAXDISTANCE;
	vec3 offset;
		
	color = normal = bumpnormal = vec3(0.); spec = 0.;
	
	if( inside ) {
		p1 = mod( portalPlacements[0]+2., 4.); // enter room this side
		p2 = portalPlacements[1]; // leaving room this side
		offset = vec3(0.);
	} else {
		// if you're not inside this room, calculate offset of room
		seed += 1.;
		p1 = portalPlacements[1]; // enter room this side
		offset = 2.*vec3( p1==1.?ROOMSIZE:p1==3.?-ROOMSIZE:0., 0., p1==0.?ROOMSIZE:p1==2.?-ROOMSIZE:0. );
		p1 = mod( p1+2., 4.); // enter room this side
		p2 = portalPlacements[2]; // leaving room this side
	}

	bool hitfloor;

	vec3 ro = roo - offset;	
	vec3 t1, t2, hitnormal;
	vec2 hittex;
	float d, hitmaterial;
	
	// intersect with floor and ceiling
	t1 = vec3( -1., 0., 0. );
	t2 = vec3( 0., 0., -1. );

	// floor		
	intersectPlane( ro, rd, 0.0, d );
	if( d < dist && all( lessThan( abs( (ro+d*rd).xz), vec2(ROOMSIZE)))) {
		dist = d;
		hitmaterial	= mod(seed*124.565431, MAXMATERIALS); // procedural foor material
		hitnormal = vec3( 0., 1., 0.);
		hitfloor = true;
		hittex = (rd*dist+ro).xz;
	}
	// ceiling
	intersectPlane( ro, rd, isroom?roomHeight:PORTALHEIGHT, d );
	if( d < dist && all( lessThan( abs( (ro+d*rd).xz), vec2(ROOMSIZE)))) {
		dist = d;
		hitmaterial	= mod(seed*131.565431, MAXMATERIALS); // procedural foor material
		hitnormal = vec3( 0., -1., 0.);
		hitfloor = false;
		hittex = (rd*dist+ro).xz;
	}

	vec2 hits, hite, s, e;
	float u, hitu = -1.;
	
	if(	isroom ) {
		roomoffset = offset;
		
		// the walls, check for each side of room...
		for( int i=0; i<4; i++ ) {
			if( i == 0 ) {
				s = vec2( -ROOMSIZE, ROOMSIZE )*roommorph;
				e = abs(s); //vec2( ROOMSIZE, ROOMSIZE )*roommorph;
			} else if( i == 1 ) {
				e = vec2( ROOMSIZE, -ROOMSIZE )*roommorph;
				s = abs(e); //vec2( ROOMSIZE, ROOMSIZE )*roommorph;
			} else if( i == 2 ) {
				e = vec2( -ROOMSIZE, -ROOMSIZE )*roommorph;
				s = e; e.x = -e.x; //vec2( ROOMSIZE, -ROOMSIZE )*roommorph;
			} else {
				s = vec2( -ROOMSIZE, -ROOMSIZE )*roommorph;
				e = s; e.y=-e.y;//vec2( -ROOMSIZE, ROOMSIZE )*roommorph;
			}
			
			if( float(i) != p1 && float(i) != p2  ) { // normal wall
				
				intersectSegment( ro, rd, s, e, d, u );
				if( d < dist ) { dist = d; hitu = u; hits = s; hite = e; }

			} else { // three walls with portal
				vec2 sp, ep;
				if( i == 0 ) {
					sp = vec2( -PORTALSIZE, ROOMSIZE );
					ep = vec2( PORTALSIZE, ROOMSIZE );
				} else if( i == 1) {
					sp = vec2( ROOMSIZE, PORTALSIZE );
					ep = vec2( ROOMSIZE, -PORTALSIZE );
				} else if( i == 2) {
					sp = vec2( -PORTALSIZE, -ROOMSIZE );
					ep = vec2( PORTALSIZE, -ROOMSIZE );
				} else {
					sp = vec2( -ROOMSIZE, -PORTALSIZE );
					ep = vec2( -ROOMSIZE, PORTALSIZE );
				}
								
				intersectSegment( ro, rd, s, sp, d, u );
				if( d < dist ) { dist = d; hitu = u; hits = s; hite = sp; }
				
				intersectSegment( ro, rd, ep, e, d, u );
				if( d < dist ) { dist = d; hitu = u; hits = ep; hite = e; }
				
				// portal!
				intersectSegment( ro, rd, sp, ep, d, u );
				if( d < dist && (rd.y*d+ro.y > PORTALHEIGHT) ) { 
					dist = d; hitu = u; hits = sp; hite = ep;
				}
			}
		}
	} else { 
		// we are in a portal; check walls:		
		float totalu = 2.0 * ROOMSIZE;
		if( mod( p1, 2.) == mod( p2, 2.) ) {
			// straight	
		
			vec2 ps, pw;
			if( p1==0. || p1==2.) {
				ps = vec2( 0., ROOMSIZE );
				pw = vec2( PORTALSIZE, 0. );
			} else {
				ps = vec2( ROOMSIZE, 0. );
				pw = vec2( 0., PORTALSIZE );
			}
			
			vec2 o2, o1 = vec2(0.); 
			for( int j=0; j<6; j++ ) {
				if( j!=5 ) o2 = hash2(float(j)); else o2 = vec2(0.);
				
				s = o1+pw+ps*(1.-float(j)/3.);
				e = o2+pw+ps*(1.-float(j+1)/3.);
				
				intersectSegment( ro, rd, s, e, d, u );
				if( d < dist ) { dist = d; hitu = totalu+u; hits = s; hite = e; }
				
				e = o1-pw+ps*(1.-float(j)/3.);
				s = o2-pw+ps*(1.-float(j+1)/3.);
				
				intersectSegment( ro, rd, s, e, d, u );
				if( d < dist ) { dist = d; hitu = totalu-u; hits = s; hite = e; }
				
				o1=o2;
				totalu += distance( e, s );
			}		
		} else {
			// curved
			float a; vec2 o;
			if( min(p1, p2) == 0. ) {
				if( max(p1, p2) == 1. ) {
					a = PI * 0.5; o = vec2( ROOMSIZE, ROOMSIZE );
				} else {
					a = PI * 0.0; o = vec2( -ROOMSIZE, ROOMSIZE );
				}
			} else if( min(p1, p2) == 1. ) {
				a = PI * 1.0; o = vec2( ROOMSIZE, -ROOMSIZE );
			} else {
				a = PI * 1.5; o = vec2( -ROOMSIZE, -ROOMSIZE );
			}
			float da = 0.5 * PI / 6.;
			for( int j=0; j<6; j++ ) {
				float si = sin(a); float co = cos(a);
				float ds = sin(a+da); float dc = cos(a+da);
				a+=da;
				
				s = o+vec2( (ROOMSIZE+PORTALSIZE)*co , -(ROOMSIZE+PORTALSIZE)*si );
				e = o+vec2( (ROOMSIZE+PORTALSIZE)*dc, -(ROOMSIZE+PORTALSIZE)*ds);
				
				intersectSegment( ro, rd, s, e, d, u );
				if( d < dist ) { dist = d; hitu = totalu+u; hits = s; hite = e; }
				
				e = o+vec2( (ROOMSIZE-PORTALSIZE)*co , -(ROOMSIZE-PORTALSIZE)*si );
				s = o+vec2( (ROOMSIZE-PORTALSIZE)*dc, -(ROOMSIZE-PORTALSIZE)*ds);
				
				intersectSegment( ro, rd, s, e, d, u );
				if( d < dist ) { dist = d; hitu = totalu-u; hits = s; hite = e; }
				
				totalu += distance( e, s );
			}
		}
	}
	
	
	if(	isroom ) {			
		// pillar	
		for( int i=0; i<4; i++ ) {
			float angle = float(i)*PI*0.5+pillarAngle;
			s = vec2( cos( angle ), sin( angle ) ) + pillarPosition; 
			e = vec2( cos( angle+PI*0.5 ), sin( angle+PI*0.5 ) ) + pillarPosition;
				
			intersectSegment( ro, rd, s, e, d, u );
			if( d < dist ) { dist = d; hitu = u; hits = s; hite = e; }
		}
	}
	
	if( dist >= MAXDISTANCE ) {
		return;
	}
	
	// calculate color for material
	
	vec2 ntangent;
	
	if( hitu >= 0. ) {
		vec2 sme = hits-hite;
		float lt = length(sme);
		hittex.x = lt*hitu;
		hittex.y = (ro+rd*dist).y; 
		hitnormal = normalize( vec3( -sme.y, 0., sme.x ));
		t2 = vec3( 0., -1., 0. );
		t1 = cross( hitnormal, t2 );

		getWallMaterial( mod(seed*14.1565431, MAXMATERIALS),
						hittex, color, ntangent, spec );	
	} else {
		getFloorMaterial( hitmaterial, hittex, hitfloor,
				 		  color, ntangent, spec );
	}
	
	normal = hitnormal;
	bumpnormal = normalize( (normal + ntangent.x*t1) + ntangent.y*t2 );
}


bool traceShadow( vec3 roo, vec3 rd, float maxdist ) { 	

	float u, d = MAXDISTANCE;
	vec3 ro = roo - roomoffset;
	vec2 e, s;
	
	for( int i=0; i<4; i++ ) {
			float angle = float(i)*PI*0.5+pillarAngle;
			s = vec2( cos( angle ), sin( angle ) ) + pillarPosition; 
			e = vec2( cos( angle+PI*0.5 ), sin( angle+PI*0.5 ) ) + pillarPosition;
				
			intersectSegment( ro, rd, s, e, d, u );
			if( d < maxdist ) return true;
		}
	return false;
}

float trace( vec3 roo, vec3 rd, out vec3 color, out vec3 normal, out float spec ) {	
	normal = color = vec3( 0. );
	vec3 matcolor, bumpnormal, hitcolor, hitnormal, hitbumpnormal;
	float dist = MAXDISTANCE, d, hitspec;	
	
	// trace room
	traceRoom( inRoom, currentSeed, true, roo, rd, dist,
				 matcolor, normal, bumpnormal, spec);
	// trace portal
	traceRoom( !inRoom, currentSeed, false, roo, rd, d,
				  hitcolor, hitnormal, hitbumpnormal, hitspec);
	if( d < dist ) {
		dist = d;
		matcolor = hitcolor; normal = hitnormal; bumpnormal = hitbumpnormal; spec = hitspec;
	}

	vec3 intersection  = roo + rd*dist;
	
	// lightning
	color = (matcolor*ambiantLight)*(AMBIANT*(0.7 + 0.4*clamp( dot(bumpnormal, normalize( vec3( 0.2, 0.3, 0.5) ) ), 0., 1.)));
	color *= clamp( 7.5/dist, 0., 1.);
	
	vec3 offset = roomoffset + vec3( 0., 0.5*roomHeight, 0. );
	
#ifdef DYNAMICLIGHTNING	
	for( int i=0; i<NUMBEROFLIGHTS; i++ ) {	
		float fi = float(i); 
		vec3 lightcolor = hash3( roomSeed+float(i*643) );
		
		vec3 lightpos = (lightcolor*vec3(0.8*ROOMSIZE*roommorph.x,0.5*roomHeight,0.8*ROOMSIZE*roommorph.y)*
								 cos((2.*(fi+iTime))*lightcolor ))+offset;
		vec3 lightvec = lightpos-intersection;
		
		if( dot( lightvec, normal ) < 0. ) continue;
		
		float l = length( lightvec );
		vec3 nlightvec = lightvec * (1./l);
		
		// diffuse
		float diff = DYNAMICLIGHTSTRENGTH * clamp( dot( nlightvec, bumpnormal ), 0., 1.);	
		
#ifndef REFLECTION		
		// specular		
		float specu = clamp( dot( reflect(rd,bumpnormal), nlightvec ), 0.0, 1.0 );
		specu = 20. * DYNAMICLIGHTSTRENGTH * spec * (pow(specu,16.0) + 0.5*pow(specu,4.0));
#endif
		
#ifdef SHADOWS		
		if( !traceShadow( nlightvec*0.001+intersection, nlightvec, l ) )
#endif
#ifdef REFLECTION			
			color += matcolor*lightcolor*(diff / (l*l));		
#else
			color += matcolor*lightcolor*((diff+specu) / (l*l));
#endif
	}
#endif
	
	normal = bumpnormal;
	return dist;
}

//
// Camera path
//

vec3 initCamera( float f ) {	
	float p1 = mod( portalPlacements[0]+2., 4.);
	float p2 = portalPlacements[1];
	float mf = 1.-f;
	
	if( mod( p1, 2.) == mod( p2, 2.) ) {
		// straight	
		vec3 cam;
		if( p1==0.) {
			cam.xy = vec2( 0., ROOMSIZE-f*ROOMSIZE*2. );
		} else if( p1==1.) {
			cam.xy = vec2(  ROOMSIZE-f*ROOMSIZE*2., 0. );
		} else if( p1==2.) {
			cam.xy = vec2( 0., -ROOMSIZE+f*ROOMSIZE*2. );
		} else {
			cam.xy = vec2( -ROOMSIZE+f*ROOMSIZE*2., 0. );
		}
		cam.z = (p2==1.)?0.5*PI:(p2==2.)?PI:(p2==3.)?PI*1.5:0.;
		
		return cam;
	} else {
		// curved
		float a, an; vec2 o; 
		if( min(p1, p2) == 0. ) {
			if( max(p1, p2) == 1. ) {
				a = PI * 0.5; o = vec2( ROOMSIZE, ROOMSIZE );
			} else {
				a = PI * 0.0; o = vec2( -ROOMSIZE, ROOMSIZE );
			}
		} else if( min(p1, p2) == 1. ) {
			a = PI * 1.0; o = vec2( ROOMSIZE, -ROOMSIZE );
		} else {
			a = PI * 1.5; o = vec2( -ROOMSIZE, -ROOMSIZE );
		}
		if( mod(p1+1.,4.) == p2) f=mf;
		
		if( mod(p1+1.,4.) == p2) { // counter clockwise
			an = f*0.5*PI+(p1)*PI*0.5;
		} else {
			an = f*0.5*PI+(p1+1.)*PI*0.5;
		}
		
		a += f*PI*0.5;
		float s = sin(a); float c = cos(a);
		return vec3(o, an+0.5*PI)+vec3( c*ROOMSIZE, -s*ROOMSIZE, 0.);
	}
	return vec3(0.);
}

//
// Main
//

void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
	vec2 q = fragCoord.xy/iResolution.xy;
	vec2 p = -1.0+2.0*q;
	p.x *= iResolution.x/iResolution.y;
	
	init( iTime+1.5 );
		
	vec3 camPosition = initCamera( currentSeedFract );
	if(inRoom) camPosition.xy = avoidPillar( camPosition.xy );
	
	vec3 ro = vec3( camPosition.x, 1.6+0.03*sin(iTime*6.), camPosition.y );
	vec3 ta = rotate( vec3(0.0, 0.0, 1.0), camPosition.z + 0.3*sin(iTime) );
		
	float roll = 0.13*sin(camPosition.z + 0.13*iTime);
	
	// camera tx
	vec3 cw = normalize( ta );
	vec3 cp = vec3( sin(roll), cos(roll),0.0 );
	vec3 cu = normalize( cross(cw,cp) );
	vec3 cv = normalize( cross(cu,cw) );
	vec3 rd = normalize( p.x*cu + p.y*cv + 1.5*cw );

	
	
	vec3 color, normal;
	float spec, dist;
	dist = trace( ro, rd, color, normal, spec );

#ifdef REFLECTION
	if( spec > 0.0) {
		vec3 speccolor = vec3(0.);
		float refspec;
		vec3 refl = normalize(reflect( rd, normal ));
		dist = trace( ro+rd*dist+refl*0.001, refl, speccolor, normal, refspec );	
		//dist = trace( ro, rd, speccolor, normal, refspec );				
		color += spec*speccolor;
	}
#endif
	
	color = pow( color, vec3(EXPOSURE) );
	
    // vigneting
    color *= 0.25+0.75*pow( 16.0*q.x*q.y*(1.0-q.x)*(1.0-q.y), 0.15 );
	
	fragColor = vec4( clamp(color, 0., 1.),1.0);
}`,name:`Image`,description:``,type:`image`}]},{ver:`0.1`,info:{id:`Mdf3zM`,date:`1365959156`,viewed:15949,name:`Escher's prentententoonstelling`,description:`I found this article: http://www.ams.org/notices/200304/fea-escher.pdf describing the transformation used by Escher in the droste-picture: de prentententoonstelling (the picture gallery). The source is a mess atm - I will clean up later.`,likes:156,published:`Public API`,usePreview:0,tags:[`distancefields`,`domain`,`droste`,`escher`,`transformation`,`reproduction`]},renderpass:[{inputs:[],outputs:[{id:`4dfGRr`,channel:0}],code:`// Escher's prentententoonstelling. Reinder Nijhoff 2013
// Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License.
// @reindernijhoff
//
// https://www.shadertoy.com/view/Mdf3zM
//
// Study of the transformation of Escher in 'the prentententoonstelling' 
// \`\`\`
// h(w) = w^((2πi + log scale)/(2πi))
// \`\`\`
// Distance field functions by Inigo Quilez.
//
// [1] http://www.ams.org/notices/200304/fea-escher.pdf
//

// #define SHADOW
#define WOBBLE

float t;

float st = 0., zt = 0.;

float deformationScale, zoom;

vec2 escherDeformation( in vec2 uv ) {
	
// http://www.ams.org/notices/200304/fea-escher.pdf
// h(w) = w^((2πi + log scale)/(2πi))
	
	float lnr = log(length(uv));
	float th = atan( uv.y, uv.x )+(0.4/256.)*deformationScale;
	float sn = -log(deformationScale)*(1./(2.*3.1415926));
	float l = exp( lnr - th*sn ); 
	
	vec2 ret = vec2( l );
	
	ret.x *= cos( sn*lnr+th );
	ret.y *= sin( sn*lnr+th );
		
	return ret;
}

#define drostescale 256.

vec2 drosteTransformation( in vec2 uv ) {
	for( int i=0; i<2; i++ ) {
		if(any(greaterThan(abs(uv),vec2(1.)))) {
			uv *= (1./drostescale);
		}		
		if(all(lessThan(abs(uv),vec2(1./drostescale)))) {
			uv *= drostescale;
		}
	}
	return uv;
}

float hash( float n )
{
    return fract(sin(n)*43758.5453);
}

float sdPlane( vec3 p ) {
	return p.y+14.+0.05*cos(p.x+iTime*2.);
}

float sdBox( vec3 p, vec3 b ) {
  vec3 d = abs(p) - b;
  return min(max(d.x,max(d.y,d.z)),0.0) +
         length(max(d,0.0));
}

float udBox( vec3 p, vec3 b) {
  return length(max(abs(p)-b,0.0));
}
float sdTriPrism( vec3 p, vec2 h ) {
    vec3 q = abs(p);
    return max(q.x-h.y,max(q.z*0.4+p.y*0.5,-p.y)-h.x*0.5);
}

float sdCylinderXY( vec3 p, vec2 h ) {
  return max( length(p.xy)-h.x, abs(p.z)-h.y );
}
float sdCylinderYZ( vec3 p, vec2 h ) {
  return max( length(p.yz)-h.x, abs(p.x)-h.y );
}
float sdCylinderXZ( vec3 p, vec2 h ) {
  return max( length(p.xz)-h.x, abs(p.y)-h.y );
}


//----------------------------------------------------------------------

float opS( float d1, float d2 ) {
    return max(-d2,d1);
}
float opU( float d1, float d2 ) {
    return min(d2,d1);
}

vec2 opU( vec2 d1, vec2 d2 ) {
	return (d1.x<d2.x) ? d1 : d2;
}

float opI( float d1, float d2 ) {
    return max(d1,d2);
}

//----------------------------------------------------------------------


float objPrentenTentoonstelling( in vec3 pos ) {
	vec3 tpos;// = pos;
	tpos.x = min( abs(pos.x), abs(pos.z) );
	tpos.y = pos.y;
	tpos.z = max( abs(pos.x), abs(pos.z) );
	
	float res = opU(opU(opU(opU(opU(
			opS(opS(opS( // main building
				opS(
					udBox( tpos, vec3( 5.5, 24.0, 5.5 ) ),
					sdBox( vec3(tpos.x, tpos.y-24.0, tpos.z), vec3( 5.25, 0.5, 5.25) ) 
				),
				sdBox( vec3( mod(tpos.x+1.75, 3.5)-1.75, tpos.y-21.5, tpos.z-5.), vec3( 1.,1.,4.) )
			),
				sdBox( vec3( mod(tpos.x+1.75, 3.5)-1.75, tpos.y-15.5, tpos.z-5.), vec3( 1.,2.,4.) )
			),
				sdCylinderXY( vec3( mod(tpos.x+1.75, 3.5)-1.75, tpos.y-17.5, tpos.z-5.), vec2( 1.,4.) )
			),
			opI( // main building windows
				udBox( tpos, vec3( 5.5, 23., 5.5 ) ),
				opU(
					udBox(  vec3( mod(tpos.x+1.75, 3.5)-1.75, tpos.y, tpos.z-5.2), vec3( 0.05, 24., 0.05 ) ),
					udBox(  vec3( tpos.x, mod(tpos.y+0.425, 1.75)-0.875, tpos.z-5.2), vec3( 10.0, 0.05, 0.05 ) )
				)
			)
		),
		opS( // gallery
			opU(opU(opU(		
				opS(opS( 
						udBox( tpos, vec3( 8.375, 8.75, 8.375 ) ),
						sdCylinderXY( vec3( mod(tpos.x, 2.75)-1.375, tpos.y-6.5, tpos.z-8.75), vec2( 1.25,2.75) )
					),
					sdBox( vec3(  mod(tpos.x, 2.75)-1.375, tpos.y-4.5, tpos.z-8.75), vec3( 1.25,2.0,2.75) )			
				),
				udBox(  vec3( mod(tpos.x-8.375/18., 8.375/9.)-8.375/18., tpos.y, tpos.z-8.3), vec3( 0.025, 8.5, 0.025 ) )
			),
				udBox(  vec3( tpos.x, tpos.y-4.3, tpos.z-8.3), vec3( 8.5, 0.025, 0.025 ) ) 
			),
				udBox(  vec3( tpos.x, tpos.y-6.3, tpos.z-8.3), vec3( 8.5, 0.025, 0.025 ) ) 
			),
			opU(opU(opU(
				sdCylinderYZ( vec3( pos.x-8.75, pos.y-6.5, mod(pos.z, 13.75)-6.875), vec2( 1.25,20.) ),
				sdBox( vec3(  pos.x-8.75, pos.y-2.5, mod(pos.z,  13.75)-6.875), vec3( 20.,4.0,1.25) )			
			),
				sdCylinderXY( vec3( mod(pos.x,13.75)-6.875, pos.y-6.5, pos.z-8.75), vec2( 1.25,20.) )
			),
				sdBox( vec3(  mod(pos.x, 13.75)-6.875, pos.y-2.5, pos.z-8.75), vec3( 1.25,4.0,20.) )	
			)
		) ),
			sdTriPrism( vec3(tpos.x, tpos.y-9.3, tpos.z-5.2), vec2(2.0, 10. ) ) // roof
		),
			sdTriPrism( vec3(tpos.x, tpos.y-2.8, tpos.z-5.2), vec2(0.75, 8. ) )
		),
		udBox( tpos, vec3( 6.5, 2.5, 6.5 ) )
	);
	
	return res;
}

float objB1( in vec3 pos ) {
	float res =
		opU(opS(			
			opS(
				udBox( pos, vec3( 20., 30.0, 10. ) ),				
				sdBox( pos+vec3(0., -30., 0.), vec3( 19.75, 1., 9.75 ) )
			),
			sdBox( vec3( mod(pos.x+1.75, 3.5)-1.75, mod(pos.y+3.5, 7.)-2., pos.z-10.), vec3( 1.,1.,4.) )
		),
			opI( // main building windows
				udBox( pos, vec3( 18., 30.0, 10. ) ),
				opU(
					udBox(  vec3( mod(pos.x+1.75, 3.5)-1.75, pos.y, pos.z-9.8), vec3( 0.05, 30., 0.05 ) ),
					udBox(  vec3( pos.x, mod(pos.y+0.425, 1.75)-0.875, pos.z-9.8), vec3( 50.0, 0.05, 0.05 ) )
				)
			)
		);
	return res;	
}

float objB2( in vec3 pos ) {
	vec3 tpos;// = pos;
	tpos.x = min( abs(pos.x), abs(pos.z) );
	tpos.y = pos.y;
	tpos.z = max( abs(pos.x), abs(pos.z) );
	
	float res = opU(
			opS(opS( // main building
				opS(
					udBox( tpos, vec3( 8.75, 31.0, 8.75 ) ),
					sdBox( vec3(tpos.x, tpos.y-31.0, tpos.z), vec3( 8.5, 1.0, 8.5) ) 
				
			),
				sdBox( vec3( mod(tpos.x+1.75, 3.5)-1.75, mod(tpos.y+4.5, 9.)-2.5, tpos.z-5.), vec3( 1.,2.,4.) )
			),
				sdCylinderXY( vec3( mod(tpos.x+1.75, 3.5)-1.75, mod(tpos.y+4.5, 9.)-4.5, tpos.z-5.), vec2( 1.,4.) )
			),
			opI( // main building windows
				udBox( tpos, vec3( 8.75, 31.0, 8.75 ) ),
				opU(
					udBox(  vec3( mod(tpos.x+1.75, 3.5)-1.75, tpos.y, tpos.z-8.45), vec3( 0.05, 31., 0.05 ) ),
					udBox(  vec3( tpos.x, mod(tpos.y+0.425, 1.75)-0.875, tpos.z-8.45), vec3( 10.0, 0.05, 0.05 ) )
				)
			)
		);
	return res;	
}

vec2 map( in vec3 pos ) {
    vec2 res = opU( vec2( sdPlane( pos), 3.0 ),
	                vec2( udBox( pos+vec3(0.0, 9.0, 85.0), vec3( 200., 10.0, 100. ) ), 1. ) );

	res = opU( res, vec2( udBox( pos+vec3(0.0, 20.0, 75.0), vec3( 200., 10.0, 100. ) ), 1. ) );
 	res = opU( res, vec2( udBox( pos+vec3(0.0, 6.5, -15.0), vec3( 200., 10.0, 0.25 ) ), 1. ) );

	res = opU( res, vec2( udBox( pos+vec3( 220.0, 14.0, 0.0), vec3( 100., 10.0, 200. ) ), 1. ) );
		
	res = opU( res, vec2( udBox( (pos+vec3(3.20, -4.95, -5.55)), vec3( 0.55, 0.9, 0.01 ) ), 2. ) );
	res = opU( res, vec2( sdCylinderXZ( vec3(mod(pos.x+8., 16.)-8., pos.y+10., pos.z-24.), vec2( 0.4, 1.5)), 1.) );

	if( pos.z > 20. ) {
		return res;
	}
	
	res = opU( res, vec2( objPrentenTentoonstelling( vec3(mod(pos.x+40.,80.)-40., pos.y, mod(pos.z+40.,80.)-40.) ), 1. ) );
	
	pos += vec3(3.25, -4.60, -5.55);
	res = opU( res, vec2( opI(
		udBox( vec3(mod(pos.x+0.8, 1.6)-0.8, pos.y, pos.z), vec3( 0.7, 0.9, 0.1 ) ),
		udBox( pos-vec3(3.25, -4.60, -5.55), vec3( 5.5, 5.5, 8.5 ) )
		), 4. ) );
	pos -= vec3(3.25, -4.60, -5.55);
	
	pos += vec3( 15.5, 8., 10.);
	res = opU( res, vec2( objB1( vec3(mod(pos.x+27.,54.)-27., pos.y, mod(pos.z+50.,100.)-50.) ), 1. ) );
	pos += vec3( 20.5, -8., 5.);
	res = opU( res, vec2( objB2( vec3(mod(pos.x+23.,46.)-23., pos.y, mod(pos.z+35.,70.)-35.) ), 1. ) );
	pos += vec3( 20., -10., 10.);
	res = opU( res, vec2( objB1( vec3(mod(pos.x+77.,144.)-77., pos.y, mod(pos.z+66.,132.)-66.) ), 1. ) );
		
	return res;
}


// fast castfunctions to detect if droste picture is hit by ray

float fastObjPrentenTentoonstelling( in vec3 pos ) {
	return opU(	udBox(  vec3( pos.x, pos.y-6.3, pos.z-8.3), vec3( 8.5, 0.025, 0.025 ) ),
				udBox(  vec3( mod(pos.x-8.375/18., 8.375/9.)-8.375/18., pos.y, pos.z-8.3), vec3( 0.025, 8.5, 0.025 ) )
	);
}
vec2 fastMap( in vec3 pos ) {
    return opU( vec2( fastObjPrentenTentoonstelling( pos), 1.0 ),
	            vec2( udBox( (pos+vec3(3.30, -4.55, -5.55)), vec3( 0.55, 0.7, 0.01 ) ), 2. ) );
}

vec2 fastCastRay( in vec3 ro, in vec3 rd, in float maxd )
{
	float precis = 0.001;
    float h=precis*2.0;
    float t = 0.0;
    float m = -1.0;
    for( int i=0; i<60; i++ )
    {
		if( abs(h)<precis || t>maxd ) break;  {
			t += h;
			vec2 res = fastMap( ro+rd*t );
			h = res.x;
			m = res.y;
		}
    }

    if( t>maxd ) m=-1.0;
    return vec2( t, m );
}

vec2 castRay( in vec3 ro, in vec3 rd, in float maxd )
{
	float precis = 0.001;
    float h=precis*2.0;
    float t = 0.0;
    float m = -1.0;
    for( int i=0; i<60; i++ )
    {
		if( abs(h)<precis || t>maxd ) break;  {
			t += h;
			vec2 res = map( ro+rd*t );
			h = res.x;
			m = res.y;
		}
    }

    if( t>maxd ) m=-1.0;
    return vec2( t, m );
}


float softshadow( in vec3 ro, in vec3 rd, in float mint, in float maxt, in float k )
{
	float res = 1.0;
    float t = 0.1;
    float ph = 0.0;
    for( int i=0; i<32; i++ )
    {
		if( t<maxt )
		{
            float h = map( ro + rd*t ).x;			
                        
            float y = h*h/(2.0*ph);
            float d = sqrt(h*h-y*y);
            res = min( res, 10.0*d/max(0.0,t-y) );
            ph = h;
            
            t += 0.005+h;
		} 
    }
    return clamp( res, 0.0, 1.0 );

}

vec3 calcNormal( in vec3 pos )
{
	vec3 eps = vec3( 0.001, 0.0, 0.0 );
	vec3 nor = vec3(
	    map(pos+eps.xyy).x - map(pos-eps.xyy).x,
	    map(pos+eps.yxy).x - map(pos-eps.yxy).x,
	    map(pos+eps.yyx).x - map(pos-eps.yyx).x );
	return normalize(nor);
}

void getRoAndRd( in vec2 uv, out vec3 ro, out vec3 rd ) {
#ifdef WOBBLE
	ro = vec3( 20.2+(1.0+cos((t+42.)/48.*2.*3.1415926))*cos(iTime), 36.0, 47.0  );
#else
	ro = vec3( 20.2, 36.0, 47.0  );
#endif	
	vec3 ta = vec3( -3.1, 4.8,  5.5 );
	
	// camera tx
	vec3 cw = normalize( ta-ro );
	vec3 cp = vec3( 0.0, 1.0, 0.0 );
	vec3 cu = normalize( cross(cw,cp) );
	vec3 cv = normalize( cross(cu,cw) );
	rd = normalize( uv.x*cu + uv.y*cv + cw*zoom);
}

bool hitDrostePicture( vec2 uv ) {
	vec3 ro, rd;
	getRoAndRd( uv, ro, rd );	
	
	vec2 res = fastCastRay(ro,rd,200.0);
	return (res.y == 2. );
}

vec4 trace( vec2 uv ) {
	vec3 ro, rd;
	getRoAndRd( uv, ro, rd );
	
    vec3 col = vec3(0.);
		
    vec2 res = castRay(ro,rd,400.0);
    float t = res.x;
	float m = res.y;
    if( m>-0.5 )
    {
        vec3 pos = ro + t*rd;
        vec3 nor = calcNormal( pos );

		col = vec3(0.7);
		if( m == 3. ) col = vec3(0.6,0.71,1.0);
		if( m == 4. ) col = vec3( 1. );
		
		if( m == 1. && all(lessThan(abs(pos), vec3( 5.65, 10., 5.65 ) ) ) ) {
			col = vec3( 0.6 ); // inside gallery
		}
		
		vec3 lig = normalize( vec3(-0.4, 0.4, 0.8) );
		float amb = clamp( 0.5+0.5*nor.y, 0.0, 1.0 );
        float dif = clamp( dot( nor, lig ), 0.0, 1.0 );

		float sh = 1.0;
#ifdef SHADOW		
		if( dif>0.05 ) { sh = softshadow( pos, lig, 0.1, 30.0, 5.0 ); dif *= (0.8+0.2*sh); }
#endif		
		vec3 brdf = vec3(0.0);
		brdf += 0.80*amb*vec3(0.6,0.71,0.85);
        brdf += 1.30*dif*vec3(1.00,0.90,0.70);

		col = col*brdf;
		
	} else {
		col = 1.2*vec3(0.6,0.71,0.85) - rd.y*0.2*vec3(1.0,0.5,1.0);
	}

	return vec4( clamp(col,0.0,1.0), m );
}

void init() {
	t = mod( t+11., 48. );

	if( t < 8. ) st = t;
	else if( t < 24. ) st = 8.;
	else if( t < 32. ) st = 32.-t;
		
	t = mod( t+12., 48. );
		
	if( t < 8. ) zt = t;
	else if( t < 24. ) zt = 8.;
	else if( t < 32. ) zt = 32.-t;
		
	deformationScale = clamp(pow(2.0,st), 1., 256.);
	zoom =  2.71828 * clamp(pow(2.0,zt), 1.0, 256. );
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    t = mod(iTime, 48.);
	vec2 uv = fragCoord.xy / iResolution.xy;
	
	uv = 2.*uv - vec2(1.);
    uv.x *= iResolution.x/ iResolution.y;
		
	init();
	
	vec3 col = vec3(0.);

	bool band = abs(uv.x)>1.?true:false;
	
	// the  gallerymodel is a factor 1./0.7 too high to match Eschers painting, so I cheat :(
	uv.x *= 0.7;
	uv = escherDeformation(uv);	
	uv = drosteTransformation(uv);
	
	if( hitDrostePicture(uv) ) uv*=256.;
	if( hitDrostePicture(uv) ) uv*=256.;
	
	
	vec4 tr = trace( uv );
	col = tr.xyz;
	
	if( band ) {
		col = mix( col, vec3(0.), st/8. );	
	}		
	
	fragColor = vec4( col,1.0);
}`,name:`Image`,description:``,type:`image`}]},{ver:`0.1`,info:{id:`Mdf3Dr`,date:`1367336643`,viewed:6655,name:`Outrun`,description:`Just a quick one. Please don't look at the source of this shader :) The math is a mess and full of magical numbers and physical incorrect`,likes:60,published:`Public API`,usePreview:0,tags:[`raycasting`,`outrun`]},renderpass:[{inputs:[],outputs:[{id:`4dfGRr`,channel:0}],code:`// Outrun. Created by Reinder Nijhoff 2013
// Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License.
// @reindernijhoff
//
// https://www.shadertoy.com/view/Mdf3Dr
//

// DON'T LOOK AT THE MATH!!!

#define MAXDISTANCE 10000.
#define TRACKSVISIBLE 10
#define SEGMENTSPERTRACK 10
#define SECONDSPERTRACK 0.97
#define TRACKLENGTH 200.

#define time iTime

//
// math functions
//

float hash( float n ) {
	return fract(sin(n)*43758.5453);
}
float noise(in float x) {
	float p = floor(x);
	float f = fract(x);
		
	f = f*f*(3.0-2.0*f);	
	return mix( hash(p+  0.0), hash(p+  1.0),f);
}
float crossp( vec2 a, vec2 b ) { return a.x*b.y - a.y*b.x; }

//
// intersection functions
//

void intersectSegment(const vec3 ro, const vec3 rd, const vec2 a, const vec2 b, out float dist, out float u) {
	dist = MAXDISTANCE;
	vec2 p = ro.yz;
	vec2 r = rd.yz;
	vec2 q = a-p;
	vec2 s = b-a;
	float rCrossS = crossp(r, s);
	
	if( rCrossS == 0.){
		return;
	}
	float t = crossp(q, s) / rCrossS;
	u = crossp(q, r) / rCrossS;
	
	if(0. <= t && 0. <= u && u <= 1.){
		dist = t;
	}
}

float trackAngle( float s ) {
	return (2.*noise( s*0.1 )-1.)*2.;
}
float trackHeight( float s ) {
	return 500.*noise( s*0.2 );
}

float traceTrack( vec3 ro, vec3 rd, out vec2 texcoord ) {
	float dist = MAXDISTANCE, dtest, xdist, zdist = MAXDISTANCE;
	float utest;
	
	float tf = time / SECONDSPERTRACK;
	float starttrack = floor(tf);
	float fracttrack = fract(tf);
	
	float z = -fracttrack*TRACKLENGTH;
	
	float sa = trackAngle( tf );
		
	for( int it=0; it<TRACKSVISIBLE; it++) {
		float t = float(it)+starttrack;
			
		for( int is=0; is<SEGMENTSPERTRACK; is++ ) {			
			float dt = float(is)/float(SEGMENTSPERTRACK);
			intersectSegment( ro, rd, vec2( trackHeight( t+dt ), z ), 
							 vec2( trackHeight( t+dt+(1./float(SEGMENTSPERTRACK)) ), z+(TRACKLENGTH/float(SEGMENTSPERTRACK))), dtest, utest );
			if( dtest < dist ) {
				dist = dtest;
				texcoord.y = utest;
				xdist = ro.x+rd.x*dist;
				zdist = ro.z+rd.z*dist;
				texcoord.x = xdist + 2.*zdist*sin( trackAngle(t+dt+(utest/float(SEGMENTSPERTRACK)))-sa );
			}
			z+=(TRACKLENGTH/float(SEGMENTSPERTRACK));
		}
	}
	return zdist;
}

vec3 trackColor( vec2 texcoord ) {
	if( abs(texcoord.x)<50. ) { // road
		if(texcoord.y>0.5) {
			return abs(texcoord.x)>46.?vec3(1.):vec3( 146./255. );
		} else {
			return mod(texcoord.x, 22.)<1.5?vec3(1.):vec3( 154./255. );
		}
	} else { // desert
		return (texcoord.y>0.5)?vec3( 235./255., 219./255., 203./255. )
			:vec3( 227./255., 211./255., 195./255. );
	}
}
vec3 skyColor( vec2 texcoord ) {
	vec3 col = vec3( 0./255., 146./255., 255./255.);
	float n = noise( texcoord.x )*texcoord.y*10.+texcoord.y*4.;
	n += noise( texcoord.x * 10. );
	if( n < 1. ) col = mix(
		vec3( 170./255., 154./255., 138./255.),
		vec3( 235./255., 219./255., 203./255. ), clamp(texcoord.y*16., 0., 1.) );
	return col;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
	vec2 q = fragCoord.xy/iResolution.xy;
	vec2 p = -1.0+2.0*q;
	p.x *= iResolution.x/iResolution.y;

	vec3 ro = vec3( -20.*sin(trackAngle(time/SECONDSPERTRACK)), 10.+trackHeight(time/SECONDSPERTRACK), -14. );
	vec3 rd = normalize( vec3( p, 1. ) );	
	vec3 color = vec3( 0. );
	
	vec2 texcoord;
	float d =  traceTrack( ro, rd, texcoord );
	if( d < MAXDISTANCE ) {
		color = mix( trackColor( texcoord ), vec3( 170./255., 154./255., 138./255.), d/(float(TRACKSVISIBLE)*TRACKLENGTH));
	} else {
		if( rd.y > 0. ) {
			color = skyColor( vec2( p.x-2.*trackAngle(time/SECONDSPERTRACK), p.y) );
		} else {
			color = vec3( 170./255., 154./255., 138./255.);
		}
	}
	
	fragColor = vec4( clamp(color, 0., 1.),1.0);
}`,name:`Image`,description:``,type:`image`}]},{ver:`0.1`,info:{id:`lsX3WH`,date:`1368546969`,viewed:27474,name:`A lot of spheres`,description:`Simple raytracer showing a lot of spheres and light sources. A grid is used as an acceleration structure.`,likes:181,published:`Public API`,usePreview:0,tags:[`raytracer`,`spheres`]},renderpass:[{inputs:[],outputs:[{id:`4dfGRr`,channel:0}],code:`// A lot of spheres. Created by Reinder Nijhoff 2013
// Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License.
// @reindernijhoff
// 
// https://www.shadertoy.com/view/lsX3WH
//

#define SHADOW
#define REFLECTION

#define RAYCASTSTEPS 40

#define EPSILON 0.0001
#define MAXDISTANCE 400.
#define GRIDSIZE 8.
#define GRIDSIZESMALL 5.
#define MAXHEIGHT 30.
#define SPEED 0.5

#define time iTime

//
// math functions
//

const mat2 mr = mat2 (0.84147,  0.54030,
					  0.54030, -0.84147 );
float hash( float n ) {
	return fract(sin(n)*43758.5453);
}
vec2 hash2( float n ) {
	return fract(sin(vec2(n,n+1.0))*vec2(2.1459123,3.3490423));
}
vec2 hash2( vec2 n ) {
	return fract(sin(vec2( n.x*n.y, n.x+n.y))*vec2(2.1459123,3.3490423));
}
vec3 hash3( float n ) {
	return fract(sin(vec3(n,n+1.0,n+2.0))*vec3(3.5453123,4.1459123,1.3490423));
}
vec3 hash3( vec2 n ) {
	return fract(sin(vec3(n.x, n.y, n+2.0))*vec3(3.5453123,4.1459123,1.3490423));
}
//
// intersection functions
//

bool intersectPlane(vec3 ro, vec3 rd, float height, out float dist) {	
	if (rd.y==0.0) {
		return false;
	}
	
	float d = -(ro.y - height)/rd.y;
	d = min(100000.0, d);
	if( d > 0. ) {
		dist = d;
		return true;
	}
	return false;
}

bool intersectUnitSphere ( in vec3 ro, in vec3 rd, in vec3 sph, out float dist, out vec3 normal ) {
	vec3  ds = ro - sph;
	float bs = dot( rd, ds );
	float cs = dot(  ds, ds ) - 1.0;
	float ts = bs*bs - cs;
	
	if( ts > 0.0 ) {
		ts = -bs - sqrt( ts );
		if( ts>0. ) {
			normal = normalize( (ro+ts*rd)-sph );
			dist = ts;
			return true;
		}
	}
	
	return false;
}

//
// Scene
//

void getSphereOffset( vec2 grid, inout vec2 center ) {
	center = (hash2( grid+vec2(43.12,1.23) ) - vec2(0.5) )*(GRIDSIZESMALL);
}
void getMovingSpherePosition( vec2 grid, vec2 sphereOffset, inout vec3 center ) {
	// falling?
	float s = 0.1+hash( grid.x*1.23114+5.342+74.324231*grid.y );
	float t = fract(14.*s + time/s*.3);
	
	float y =  s * MAXHEIGHT * abs( 4.*t*(1.-t) );
	vec2 offset = grid + sphereOffset;
	
	center = vec3( offset.x, y, offset.y ) + 0.5*vec3( GRIDSIZE, 2., GRIDSIZE );
}
void getSpherePosition( vec2 grid, vec2 sphereOffset, inout vec3 center ) {
	vec2 offset = grid + sphereOffset;
	center = vec3( offset.x, 0., offset.y ) + 0.5*vec3( GRIDSIZE, 2., GRIDSIZE );
}
vec3 getSphereColor( vec2 grid ) {
	return normalize( hash3( grid+vec2(43.12*grid.y,12.23*grid.x) ) );
}

vec3 trace(vec3 ro, vec3 rd, out vec3 intersection, out vec3 normal, out float dist, out int material) {
	material = 0; // sky
	dist = MAXDISTANCE;
	float distcheck;
	
	vec3 sphereCenter, col, normalcheck;
	
	if( intersectPlane( ro,  rd, 0., distcheck) && distcheck < MAXDISTANCE ) {
		dist = distcheck;
		material = 1;
		normal = vec3( 0., 1., 0. );
		col = vec3( 0.25 );
	} else {
		col = vec3( 0. );
	}
	
		
	// trace grid
	vec3 pos = floor(ro/GRIDSIZE)*GRIDSIZE;
	vec3 ri = 1.0/rd;
	vec3 rs = sign(rd) * GRIDSIZE;
	vec3 dis = (pos-ro + 0.5  * GRIDSIZE + rs*0.5) * ri;
	vec3 mm = vec3(0.0);
	vec2 offset;
		
	for( int i=0; i<RAYCASTSTEPS; i++ )	{
		if( material > 1 || distance( ro.xz, pos.xz ) > dist+GRIDSIZE ) break;
		vec2 offset;
		getSphereOffset( pos.xz, offset );
		
		getMovingSpherePosition( pos.xz, -offset, sphereCenter );
		
		if( intersectUnitSphere( ro, rd, sphereCenter, distcheck, normalcheck ) && distcheck < dist ) {
			dist = distcheck;
			normal = normalcheck;
			material = 2;
		}
		
		getSpherePosition( pos.xz, offset, sphereCenter );
		if( intersectUnitSphere( ro, rd, sphereCenter, distcheck, normalcheck ) && distcheck < dist ) {
			dist = distcheck;
			normal = normalcheck;
			col = getSphereColor( offset );
			material = 3;
		}
		mm = step(dis.xyz, dis.zyx);
		dis += mm * rs * ri;
		pos += mm * rs;		
	}
	
	vec3 color = vec3( 0. );
	if( material > 0 ) {
		intersection = ro + rd*dist;
		vec2 map = floor(intersection.xz/GRIDSIZE)*GRIDSIZE;
		
		if( material == 1 || material == 3 ) {
			// lightning
			vec3 c = vec3( -GRIDSIZE,0., GRIDSIZE );
			for( int x=0; x<3; x++ ) {
				for( int y=0; y<3; y++ ) {
					vec2 mapoffset = map+vec2( c[x], c[y] );		
					vec2 offset;
					getSphereOffset( mapoffset, offset );
					vec3 lcolor = getSphereColor( mapoffset );
					vec3 lpos;
					getMovingSpherePosition( mapoffset, -offset, lpos );
					
					float shadow = 1.;
#ifdef SHADOW
					if( material == 1 ) {
						for( int sx=0; sx<3; sx++ ) {
							for( int sy=0; sy<3; sy++ ) {
								if( shadow < 1. ) continue;
								
								vec2 smapoffset = map+vec2( c[sx], c[sy] );		
								vec2 soffset;
								getSphereOffset( smapoffset, soffset );
								vec3 slpos, sn;
								getSpherePosition( smapoffset, soffset, slpos );
								float sd;
								if( intersectUnitSphere( intersection, normalize( lpos - intersection ), slpos, sd, sn )  ) {
									shadow = 0.;
								}							
							}
						}
					}
#endif
					color += col * lcolor * ( shadow * max( dot( normalize(lpos-intersection), normal ), 0.) *
											 clamp(10. / dot( lpos - intersection, lpos - intersection) - 0.075, 0., 1.)  );
				}
			}
		} else {
			// emitter
			color = (3.+2.*dot(normal, vec3( 0.5, 0.5, -0.5))) * getSphereColor( map );
		}
	}
	return color;
}


void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
	vec2 q = fragCoord.xy/iResolution.xy;
	vec2 p = -1.0+2.0*q;
	p.x *= iResolution.x/iResolution.y;
	
	// camera	
	vec3 ce = vec3( cos( 0.232*time) * 10., 6.+3.*cos(0.3*time), GRIDSIZE*(time/SPEED) );
	vec3 ro = ce;
	vec3 ta = ro + vec3( -sin( 0.232*time) * 10., -2.0+cos(0.23*time), 10.0 );
	
	float roll = -0.15*sin(0.5*time);
	
	// camera tx
	vec3 cw = normalize( ta-ro );
	vec3 cp = vec3( sin(roll), cos(roll),0.0 );
	vec3 cu = normalize( cross(cw,cp) );
	vec3 cv = normalize( cross(cu,cw) );
	vec3 rd = normalize( p.x*cu + p.y*cv + 1.5*cw );
	
	// raytrace
	int material;
	vec3 normal, intersection;
	float dist;
	
	vec3 col = trace(ro, rd, intersection, normal, dist, material);

#ifdef REFLECTION
	if( material > 0 ) {
    	float f = 0.04 * clamp(pow(1. + dot(rd, normal), 5.), 0., 1.);
    	    
		vec3 ro = intersection + EPSILON*normal;
		rd = reflect( rd, normal );
		vec3 refColor = trace(ro, rd, intersection, normal, dist, material);
		if (material > 2) { 
    		col += .5 * refColor; 
		} else { // fresnell on floor
		    col += f * refColor;
		}
	}
#endif
	
	col = pow( col * .5, vec3(1./2.2) );	
	col = clamp(col, 0.0, 1.0);
	
	// vigneting
	col *= 0.25+0.75*pow( 16.0*q.x*q.y*(1.0-q.x)*(1.0-q.y), 0.15 );
	
	fragColor = vec4( col,1.0);
}`,name:`Image`,description:``,type:`image`}]},{ver:`0.1`,info:{id:`lsX3DH`,date:`1368639478`,viewed:30777,name:`More spheres`,description:`A simple pathtracer based on my shader https://www.shadertoy.com/view/lsX3WH showing motion blur, depth of field and importance sampling. Based on: https://iquilezles.org/articles/simplepathtracing/simplepathtracing.htm
`,likes:205,published:`Public API`,usePreview:0,tags:[`motionblur`,`spheres`,`pathtracer`,`depthoffield`]},renderpass:[{inputs:[],outputs:[{id:`4dfGRr`,channel:0}],code:`// More spheres. Created by Reinder Nijhoff 2013
// Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License.
// @reindernijhoff
//
// https://www.shadertoy.com/view/lsX3DH
//
// based on: https://iquilezles.org/articles/simplepathtracing
//

#define MOTIONBLUR
#define DEPTHOFFIELD

#define CUBEMAPSIZE 256

#define SAMPLES 8
#define PATHDEPTH 4
#define TARGETFPS 60.

#define FOCUSDISTANCE 17.
#define FOCUSBLUR 0.25

#define RAYCASTSTEPS 20
#define RAYCASTSTEPSRECURSIVE 2

#define EPSILON 0.001
#define MAXDISTANCE 180.
#define GRIDSIZE 8.
#define GRIDSIZESMALL 5.9
#define MAXHEIGHT 30.
#define SPEED 0.5

float time;

//
// math functions
//

float hash( const float n ) {
	return fract(sin(n)*43758.54554213);
}
vec2 hash2( const float n ) {
	return fract(sin(vec2(n,n+1.))*vec2(43758.5453123));
}
vec2 hash2( const vec2 n ) {
	return fract(sin(vec2( n.x*n.y, n.x+n.y))*vec2(25.1459123,312.3490423));
}
vec3 hash3( const vec2 n ) {
	return fract(sin(vec3(n.x, n.y, n+2.0))*vec3(36.5453123,43.1459123,11234.3490423));
}
//
// intersection functions
//

float intersectPlane( const vec3 ro, const vec3 rd, const float height) {	
	if (rd.y==0.0) return 500.;	
	float d = -(ro.y - height)/rd.y;
	if( d > 0. ) {
		return d;
	}
	return 500.;
}

float intersectUnitSphere ( const vec3 ro, const vec3 rd, const vec3 sph ) {
	vec3  ds = ro - sph;
	float bs = dot( rd, ds );
	float cs = dot( ds, ds ) - 1.0;
	float ts = bs*bs - cs;

	if( ts > 0.0 ) {
		ts = -bs - sqrt( ts );
		if( ts > 0. ) {
			return ts;
		}
	}
	return 500.;
}

//
// Scene
//

void getSphereOffset( const vec2 grid, out vec2 center ) {
	center = (hash2( grid+vec2(43.12,1.23) ) - vec2(0.5) )*(GRIDSIZESMALL);
}
void getMovingSpherePosition( const vec2 grid, const vec2 sphereOffset, out vec3 center ) {
	// falling?
	float s = 0.1+hash( grid.x*1.23114+5.342+74.324231*grid.y );
	float t = fract(14.*s + time/s*.3);
	
	float y =  s * MAXHEIGHT * abs( 4.*t*(1.-t) );
	vec2 offset = grid + sphereOffset;
	
	center = vec3( offset.x, y, offset.y ) + 0.5*vec3( GRIDSIZE, 2., GRIDSIZE );
}
void getSpherePosition( const vec2 grid, const vec2 sphereOffset, out vec3 center ) {
	vec2 offset = grid + sphereOffset;
	center = vec3( offset.x, 0., offset.y ) + 0.5*vec3( GRIDSIZE, 2., GRIDSIZE );
}
vec3 getSphereColor( const vec2 grid ) {
	vec3 col = hash3( grid+vec2(43.12*grid.y,12.23*grid.x) );
    return mix(col,col*col,.8);
}

vec3 getBackgroundColor( const vec3 ro, const vec3 rd ) {	
	return 1.4*mix(vec3(.5),vec3(.7,.9,1), .5+.5*rd.y);
}

vec3 trace(const vec3 ro, const vec3 rd, out vec3 intersection, out vec3 normal, 
           out float dist, out int material, const int steps) {
	dist = MAXDISTANCE;
	float distcheck;
	
	vec3 sphereCenter, col, normalcheck;
	
	material = 0;
	col = getBackgroundColor(ro, rd);
	
	if( (distcheck = intersectPlane( ro,  rd, 0.)) < MAXDISTANCE ) {
		dist = distcheck;
		material = 1;
		normal = vec3( 0., 1., 0. );
		col = vec3(.7);
	} 
	
	// trace grid
	vec3 pos = floor(ro/GRIDSIZE)*GRIDSIZE;
	vec3 ri = 1.0/rd;
	vec3 rs = sign(rd) * GRIDSIZE;
	vec3 dis = (pos-ro + 0.5  * GRIDSIZE + rs*0.5) * ri;
	vec3 mm = vec3(0.0);
	vec2 offset;
		
	for( int i=0; i<steps; i++ )	{
		if( material == 2 ||  distance( ro.xz, pos.xz ) > dist+GRIDSIZE ) break; {
			getSphereOffset( pos.xz, offset );
			
			getMovingSpherePosition( pos.xz, -offset, sphereCenter );			
			if( (distcheck = intersectUnitSphere( ro, rd, sphereCenter )) < dist ) {
				dist = distcheck;
				normal = normalize((ro+rd*dist)-sphereCenter);
				col = getSphereColor(pos.xz);
				material = 2;
			}
			
			getSpherePosition( pos.xz, offset, sphereCenter );
			if( (distcheck = intersectUnitSphere( ro, rd, sphereCenter )) < dist ) {
				dist = distcheck;
				normal = normalize((ro+rd*dist)-sphereCenter);
				col = getSphereColor(pos.xz+vec2(1.,2.));
				material = 2;
			}		
			mm = step(dis.xyz, dis.zyx);
			dis += mm * rs * ri;
			pos += mm * rs;		
		}
	}
	
	intersection = ro+rd*dist;
	
	return col;
}

vec2 rv2;

vec3 cosWeightedRandomHemisphereDirection2( const vec3 n ) {
	vec3  uu = normalize( cross( n, vec3(0.0,1.0,1.0) ) );
	vec3  vv = cross( uu, n );
	
	float ra = sqrt(rv2.y);
	float rx = ra*cos(6.2831*rv2.x); 
	float ry = ra*sin(6.2831*rv2.x);
	float rz = sqrt( 1.0-rv2.y );
	vec3  rr = vec3( rx*uu + ry*vv + rz*n );

    return normalize( rr );
}


void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
	time = iTime;
    vec2 q = fragCoord.xy/iResolution.xy;
	vec2 p = -1.0+2.0*q;
	p.x *= iResolution.x/iResolution.y;
	
	vec3 col = vec3( 0. );
	
	// raytrace
	int material;
	vec3 normal, intersection;
	float dist;
	float seed = time+(p.x+iResolution.x*p.y)*1.51269341231;
	
	for( int j=0; j<SAMPLES + min(0,iFrame); j++ ) {
		float fj = float(j);
		
#ifdef MOTIONBLUR
		time = iTime + fj/(float(SAMPLES)*TARGETFPS);
#endif
		
		rv2 = hash2( 24.4316544311*fj+time+seed );
		
		vec2 pt = p+rv2/(0.5*iResolution.xy);
				
		// camera	
		vec3 ro = vec3( cos( 0.232*time) * 10., 6.+3.*cos(0.3*time), GRIDSIZE*(time/SPEED) );
		vec3 ta = ro + vec3( -sin( 0.232*time) * 10., -2.0+cos(0.23*time), 10.0 );
		
		float roll = -0.15*sin(0.5*time);
		
		// camera tx
		vec3 cw = normalize( ta-ro );
		vec3 cp = vec3( sin(roll), cos(roll),0.0 );
		vec3 cu = normalize( cross(cw,cp) );
		vec3 cv = normalize( cross(cu,cw) );
	
#ifdef DEPTHOFFIELD
    // create ray with depth of field
		const float fov = 3.0;
		
        vec3 er = normalize( vec3( pt.xy, fov ) );
        vec3 rd = er.x*cu + er.y*cv + er.z*cw;

        vec3 go = FOCUSBLUR*vec3( (rv2-vec2(0.5))*2., 0.0 );
        vec3 gd = normalize( er*FOCUSDISTANCE - go );
		
        ro += go.x*cu + go.y*cv;
        rd += gd.x*cu + gd.y*cv;
		rd = normalize(rd);
#else
		vec3 rd = normalize( pt.x*cu + pt.y*cv + 1.5*cw );		
#endif			
		vec3 colsample = vec3( 1. );
		
		// first hit
		rv2 = hash2( (rv2.x*2.4543263+rv2.y)*(time+1.) );
		colsample *= trace(ro, rd, intersection, normal, dist, material, RAYCASTSTEPS);

		// bounces
		for( int i=0; i<(PATHDEPTH-1); i++ ) {
			if( material != 0 ) {
				rd = cosWeightedRandomHemisphereDirection2( normal );
				ro = intersection + EPSILON*rd;
						
				rv2 = hash2( (rv2.x*2.4543263+rv2.y)*(time+1.)+(float(i+1)*.23) );
						
				colsample *= trace(ro, rd, intersection, normal, dist, material, RAYCASTSTEPSRECURSIVE);
			}
		}	
		colsample = sqrt(clamp(colsample, 0., 1.));
		if( material == 0 ) {			
			col += colsample;	
		}
	}
	col  /= float(SAMPLES);
	
	fragColor = vec4( col,1.0);
}`,name:`Image`,description:``,type:`image`}]},{ver:`0.1`,info:{id:`XdsGWH`,date:`1368889425`,viewed:6180,name:`Mars demo`,description:`Tribute to Tim Clarke's Mars demo from 1993. Click and move your mouse to look around.

http://pouet.net/prod.php?which=4662&howmanycomments=25&page=0`,likes:32,published:`Public API`,usePreview:0,tags:[`mars`,`timclarke`,`terrainmarching`]},renderpass:[{inputs:[],outputs:[{id:`4dfGRr`,channel:0}],code:`// Mars demo. Created by Reinder Nijhoff 2013
// Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License.
// @reindernijhoff
//
// https://www.shadertoy.com/view/XdsGWH
//

#define RAYMARCHSTEPS 150

#define time iTime

//
// math functions
//

const mat2 mr = mat2 (0.84147,  0.54030,
					  0.54030, -0.84147 );
float hash( in float n ) {
	return fract(sin(n)*43758.5453);
}
float noise(in vec2 x) {
	vec2 p = floor(x);
	vec2 f = fract(x);
		
	f = f*f*(3.0-2.0*f);	
	float n = p.x + p.y*57.0;
	
	float res = mix(mix( hash(n+  0.0), hash(n+  1.0),f.x),
					mix( hash(n+ 57.0), hash(n+ 58.0),f.x),f.y);
	return res;
}
float fbm( in vec2 p ) {
	float f;
	f  =      0.5000*noise( p ); p = mr*p*2.02;
	f +=      0.2500*noise( p ); p = mr*p*2.33;
	f +=      0.1250*noise( p ); p = mr*p*2.01;
	f +=      0.0625*noise( p ); p = mr*p*5.21;
//	f +=      0.005*noise( p ); 
	return f/(0.9375);
}
float detailFbm( in vec2 p ) {
	float f;
	f  =      0.5000*noise( p ); p = mr*p*2.02;
	f +=      0.2500*noise( p ); p = mr*p*2.33;
	f +=      0.1250*noise( p ); p = mr*p*2.01;
	f +=      0.0625*noise( p ); p = mr*p*5.21;
	f +=      0.005*noise( p ); 
	return f/(0.9375);
}

//
// intersection functions
//

bool intersectPlane(vec3 ro, vec3 rd, float height, out float dist) {	
	if (rd.y==0.0) {
		return false;
	}
	
	float d = -(ro.y - height)/rd.y;
	d = min(100000.0, d);
	if( d > 0. ) {
		dist = d;
		return true;
	}
	return false;
}

//
// Scene
//

float skyDensity( vec2 p ) {
	return fbm( p*0.125 );
}
float mapHeight( vec2 p ) {
	return fbm(  p*0.35 )*4.;
}
float detailMapHeight( vec2 p ) {
	return detailFbm(  p*0.35 )*4.;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
	vec2 q = fragCoord.xy/iResolution.xy;
	vec2 p = vec2(-1.0)+2.0*q;
	p.x *= iResolution.x/iResolution.y;
	
	vec2 pos = abs(iMouse.xy)*0.025 + vec2( 0.8, 10.);
	
	vec3 ro = vec3( pos.x, mapHeight( pos )+0.25, pos.y );
	vec3 rd = ( vec3(p, 1. ) );
	
	float dist;
	vec3 col = vec3(0.);
	vec3 intersection = vec3(9999.);
	
	// sky
	if( intersectPlane( ro, rd, 8., dist ) ) {
		intersection = ro+rd*dist;
		col = mix( vec3(240./255., 0./255., 0./255.), vec3(1.), skyDensity( intersection.xz ) );
	} else {
		col = mix( vec3(112./255.,2./255.,6./255.), vec3(0.), clamp(-p.y*3., 0., 1.) );
	}
	// terrain - raymarch
	float t, h = 0.;
	const float dt=0.05;
	
	t = mod( ro.z, dt );
	
	for( int i=0; i<RAYMARCHSTEPS; i++) {
		if( h < intersection.y ) {
			t += dt;
			intersection = ro + rd*t;
			
			h = mapHeight( intersection.xz );
		}
	}
	if( h > intersection.y ) {	
		// calculate projected height of intersection and previous point
		float h1 = (h-ro.y)/(rd.z*t);
		vec3 prev =  ro + rd*(t-dt);
		float h2 = (mapHeight( prev.xz )-ro.y)/(rd.z*(t-dt));
				
		float dx1 = detailMapHeight( intersection.xz+vec2(0.001,0.0) ) - detailMapHeight( intersection.xz+vec2(-0.001, 0.0) );
		dx1 *= (1./0.002);
		float dx2 = detailMapHeight( prev.xz+vec2(0.001,0.0) ) - detailMapHeight( prev.xz+vec2(-0.001, 0.0) );
		dx2 *= (1./0.002);
		
		
		float dx = mix( dx1, dx2, clamp( (h1-p.y)/(h1-h2), 0., 1.));
		
		col = mix( vec3(232./201.,121./255.,101./255.), vec3(31./255.,0.,0.), 0.5+0.25*dx );

	}
	
	fragColor = vec4(col,1.0);
}`,name:`Image`,description:``,type:`image`}]},{ver:`0.1`,info:{id:`lds3D8`,date:`1369417084`,viewed:1685,name:`Oculus rift & Spheres`,description:`Just a modification of the shader 'lot of spheres', so you can use it with the Oculus Rift (http://www.oculusvr.com/). All constants are empircal measured. Run the shader full screen.`,likes:16,published:`Public API`,usePreview:0,tags:[`spheres`,`raytrace`,`oculusrift`]},renderpass:[{inputs:[],outputs:[{id:`4dfGRr`,channel:0}],code:`// Created by Reinder Nijhoff 2013
// Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License.
// @reindernijhoff

// empirical measured values
#define EYEDISTANCE  1. 
#define LENSDISTANCE -0.136 
#define FOV 0.62  

#define SHADOW
//#define REFLECTION

#define RAYCASTSTEPS 30

#define EXPOSURE 0.9
#define EPSILON 0.0001
#define MAXDISTANCE 400.
#define GRIDSIZE 10.
#define GRIDSIZESMALL 8.
#define MAXHEIGHT 10.
#define SPEED 2.5

float time;

//
// math functions
//

const mat2 mr = mat2 (0.84147,  0.54030,
					  0.54030, -0.84147 );
float hash( float n ) {
	return fract(sin(n)*43758.5453);
}
vec2 hash2( float n ) {
	return fract(sin(vec2(n,n+1.0))*vec2(2.1459123,3.3490423));
}
vec2 hash2( vec2 n ) {
	return fract(sin(vec2( n.x*n.y, n.x+n.y))*vec2(2.1459123,3.3490423));
}
vec3 hash3( float n ) {
	return fract(sin(vec3(n,n+1.0,n+2.0))*vec3(3.5453123,4.1459123,1.3490423));
}
vec3 hash3( vec2 n ) {
	return fract(sin(vec3(n.x, n.y, n+2.0))*vec3(3.5453123,4.1459123,1.3490423));
}
//
// intersection functions
//

bool intersectPlane(vec3 ro, vec3 rd, float height, out float dist) {	
	if (rd.y==0.0) {
		return false;
	}
	
	float d = -(ro.y - height)/rd.y;
	d = min(100000.0, d);
	if( d > 0. ) {
		dist = d;
		return true;
	}
	return false;
}

bool intersectUnitSphere ( in vec3 ro, in vec3 rd, in vec3 sph, out float dist, out vec3 normal ) {
	vec3  ds = ro - sph;
	float bs = dot( rd, ds );
	float cs = dot(  ds, ds ) - 1.0;
	float ts = bs*bs - cs;
	
	if( ts > 0.0 ) {
		ts = -bs - sqrt( ts );
		if( ts>0. ) {
			normal = normalize( (ro+ts*rd)-sph );
			dist = ts;
			return true;
		}
	}
	
	return false;
}

//
// Scene
//

void getSphereOffset( vec2 grid, inout vec2 center ) {
	center = (hash2( grid+vec2(43.12,1.23) ) - vec2(0.5) )*(GRIDSIZESMALL);
}
void getMovingSpherePosition( vec2 grid, vec2 sphereOffset, inout vec3 center ) {
	// falling?
	float s = 0.1+hash( grid.x*1.23114+5.342+754.324231*grid.y );
	float t = 14.*s + time/s;
	
	float y =  s * MAXHEIGHT * abs( cos( t ) );
	vec2 offset = grid + sphereOffset;
	
	center = vec3( offset.x, y, offset.y ) + 0.5*vec3( GRIDSIZE, 2., GRIDSIZE );
}
void getSpherePosition( vec2 grid, vec2 sphereOffset, inout vec3 center ) {
	vec2 offset = grid + sphereOffset;
	center = vec3( offset.x, 0., offset.y ) + 0.5*vec3( GRIDSIZE, 2., GRIDSIZE );
}
vec3 getSphereColor( vec2 grid ) {
	return normalize( hash3( grid+vec2(43.12*grid.y,12.23*grid.x) ) );
}

vec3 trace(vec3 ro, vec3 rd, out vec3 intersection, out vec3 normal, out float dist, out int material) {
	material = 0; // sky
	dist = MAXDISTANCE;
	float distcheck;
	
	vec3 sphereCenter, col, normalcheck;
	
	if( intersectPlane( ro,  rd, 0., distcheck) && distcheck < MAXDISTANCE ) {
		dist = distcheck;
		material = 1;
		normal = vec3( 0., 1., 0. );
		col = vec3( 1. );
	} else {
		col = vec3( 0. );
	}
	
	// trace grid
	vec2 map = floor( ro.xz / GRIDSIZE ) * GRIDSIZE;
	float deltaDistX = GRIDSIZE*sqrt(1. + (rd.z * rd.z) / (rd.x * rd.x));
	float deltaDistY = GRIDSIZE*sqrt(1. + (rd.x * rd.x) / (rd.z * rd.z));
	float stepX, stepY, sideDistX, sideDistY;
	
	//calculate step and initial sideDist
	if (rd.x < 0.) {
		stepX = -GRIDSIZE;
		sideDistX = (ro.x - map.x) * deltaDistX / GRIDSIZE;
	} else {
		stepX = GRIDSIZE;
		sideDistX = (map.x + GRIDSIZE - ro.x) * deltaDistX / GRIDSIZE;
	}
	if (rd.z < 0.) {
		stepY = -GRIDSIZE;
		sideDistY = (ro.z - map.y) * deltaDistY / GRIDSIZE;
	} else {
		stepY = GRIDSIZE;
		sideDistY = (map.y + GRIDSIZE - ro.z) * deltaDistY / GRIDSIZE;
	}
	
	bool hit = false; 
	
	for( int i=0; i<RAYCASTSTEPS; i++ ) {
		if( hit || distance( ro.xz, map ) > dist+GRIDSIZE ) continue;

		vec2 offset;
		getSphereOffset( map, offset );
		
		getMovingSpherePosition( map, -offset, sphereCenter );
		
		if( intersectUnitSphere( ro, rd, sphereCenter, distcheck, normalcheck ) && distcheck < dist ) {
			dist = distcheck;
			normal = normalcheck;
			material = 2;
			hit = true;
		}
		
		getSpherePosition( map, offset, sphereCenter );
		if( intersectUnitSphere( ro, rd, sphereCenter, distcheck, normalcheck ) && distcheck < dist ) {
			dist = distcheck;
			normal = normalcheck;
			col = vec3( 2. );
			material = 3;
			hit = true;
		}
						
		if (sideDistX < sideDistY) {
			sideDistX += deltaDistX;
			map.x += stepX;
		} else {
			sideDistY += deltaDistY;
			map.y += stepY;
		}		
	}
	
	vec3 color = vec3( 0. );
	if( (hit || material == 1) ) {
		intersection = ro + rd*dist;
		vec2 map = intersection.xz - mod( intersection.xz, vec2(GRIDSIZE,GRIDSIZE) );
		
		if( material == 1 || material == 3 ) {
			// lightning
			vec3 c = vec3( -GRIDSIZE,0., GRIDSIZE );
			for( int x=0; x<3; x++ ) {
				for( int y=0; y<3; y++ ) {
					vec2 mapoffset = map+vec2( c[x], c[y] );		
					vec2 offset;
					getSphereOffset( mapoffset, offset );
					vec3 lcolor = getSphereColor( mapoffset );
					vec3 lpos;
					getMovingSpherePosition( mapoffset, -offset, lpos );
					
					float shadow = 1.;
#ifdef SHADOW
					if( material == 1 ) {
						for( int sx=0; sx<3; sx++ ) {
							for( int sy=0; sy<3; sy++ ) {
								if( shadow < 1. ) continue;
								
								vec2 smapoffset = map+vec2( c[sx], c[sy] );		
								vec2 soffset;
								getSphereOffset( smapoffset, soffset );
								vec3 slpos, sn;
								getSpherePosition( smapoffset, soffset, slpos );
								float sd;
								if( intersectUnitSphere( intersection, normalize( lpos - intersection ), slpos, sd, sn )  ) {
									shadow = 0.;
								}							
							}
						}
					}
#endif
					color += col * lcolor * ( shadow * max( dot( normalize(lpos-intersection), normal ), 0.) *
											 (1. - clamp( distance( lpos, intersection )/GRIDSIZE, 0., 1.) ) );
				}
			}
		} else {
			// emitter
			color = (1.5+dot(normal, vec3( 0.5, 0.5, -0.5) )) *getSphereColor( map );
		}
	}
	return color;
}

// left
float w = 1.0;
float h = 1.0;
float scaleFactor = 1.0;

vec2 leftLensCenter = vec2( LENSDISTANCE, 0. );
vec2 rightLensCenter = vec2( -LENSDISTANCE, 0. );

vec2 Scale;
vec2 ScaleIn = vec2( 1., 1.);
vec4 HmdWarpParam = vec4(1., 0.22, 0.24, 0);

vec2 HmdWarp(vec2 in01, vec2 lensCenter) {
   vec2 theta = (in01-lensCenter) * ScaleIn; // Scales to [-1, 1]
   float rSq = dot(theta, theta);
   vec2 rvector = theta * 
	 (HmdWarpParam.x + HmdWarpParam.y * rSq +
      HmdWarpParam.z * rSq * rSq +
      HmdWarpParam.w * rSq * rSq * rSq);
   return lensCenter + Scale * rvector;
}





void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
    Scale = 0.65*vec2( 1., iResolution.x/iResolution.y );
    time = iTime;
	vec2 q = fragCoord.xy/iResolution.xy;
	vec2 p = 2.0*q;
	
	p.x *= 2.;
		
	bool lefteye = true;
	if( p.x > 2. ) {
		p.x -= 2.;
		lefteye = false;
	}
	p -= vec2(1.);
		
	p = HmdWarp( p, lefteye?leftLensCenter:rightLensCenter );


	p.x *= iResolution.x/iResolution.y;
	
	// camera	
	vec3 ce = vec3( cos( 0.232*time) * 10., 7.+3.*cos(0.3*time), GRIDSIZE*(time/SPEED) );
	vec3 ro = ce;
	vec3 ta = ro + vec3( -sin( 0.232*time) * 10., -2.0+cos(0.23*time), 10.0 );
	
	float roll = -0.15*sin(0.5*time);
	
	// camera tx
	vec3 cw = normalize( ta-ro );
	vec3 cp = vec3( sin(roll), cos(roll),0.0 );
	vec3 cu = normalize( cross(cw,cp) );
	vec3 cv = normalize( cross(cu,cw) );

	vec3 go = vec3( 0.0 );
	go.x = (lefteye?-0.5*EYEDISTANCE:0.5*EYEDISTANCE);
	ro += go.x*cu + go.y*cv;

	// create offset voor left or right eye
	vec3 er = normalize( vec3( p.xy, FOV ) );
	vec3 rd = er.x*cu + er.y*cv + er.z*cw;
	
	
	
	// raytrace
	int material;
	vec3 normal, intersection;
	float dist;
	
	vec3 col = trace(ro, rd, intersection, normal, dist, material);

#ifdef REFLECTION
	if( material > 0 ) {
		vec3 ro = intersection + EPSILON*normal;
		rd = reflect( rd, normal );
		col += 0.05 * trace(ro, rd, intersection, normal, dist, material);
	}
#endif
	
	col = pow( col, vec3(EXPOSURE, EXPOSURE, EXPOSURE) );	
	col = clamp(col, 0.0, 1.0);
	


	fragColor = vec4( col,1.0);
}`,name:`Image`,description:``,type:`image`}]},{ver:`0.1`,info:{id:`4ds3WS`,date:`1378461634`,viewed:31259,name:`Minecraft`,description:`port of javascript minecraft: http://jsfiddle.net/uzMPU/ combined with voxel-shader by inigo quilez (https://www.shadertoy.com/view/4dfGzs).`,likes:187,published:`Public API`,usePreview:0,tags:[`voxels`,`voxel`,`minecraft`]},renderpass:[{inputs:[{id:`XsXGRn`,filepath:`/media/a/cd4c518bc6ef165c39d4405b347b51ba40f8d7a065ab0e8d2e4f422cbc1e8a43.jpg`,type:`texture`,channel:1,sampler:{filter:`mipmap`,wrap:`repeat`,vflip:`false`,srgb:`false`,internal:`byte`},published:1},{id:`Xsf3zn`,filepath:`/media/a/f735bee5b64ef98879dc618b016ecf7939a5756040c2cde21ccb15e69a6e1cfb.png`,type:`texture`,channel:0,sampler:{filter:`mipmap`,wrap:`repeat`,vflip:`false`,srgb:`false`,internal:`byte`},published:1}],outputs:[{id:`4dfGRr`,channel:0}],code:`// Minecraft. Created by Reinder Nijhoff 2013
// Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License.
// @reindernijhoff
//
// https://www.shadertoy.com/view/4ds3WS
//
// port of javascript minecraft: http://jsfiddle.net/uzMPU/
// original code by Markus Persson: https://twitter.com/notch/status/275331530040160256
// combined with voxel-shader by inigo quilez (https://www.shadertoy.com/view/4dfGzs)
//

#define SEALEVEL -25.
#define MAXSTEPS 180 
//#define HOUSE

vec3 sundir = normalize( vec3(-0.5,0.6,0.7) );

float hash( in float n ) {
    return fract(sin(n)*43758.5453);
}
float hash( in vec3 x ) {
	float n = dot( x, vec3(1.0,113.0,257.0) );
    return fract(sin(n)*43758.5453);
}
vec3 hash3( vec3 n ) {
	return fract(sin(n)*vec3(653.5453123,4456.14123,165.340423));
}
float noise( in vec3 x ) {
    vec3 p = floor(x);
    vec3 f = fract(x);
	f = f*f*(3.0-2.0*f);
	
	vec2 uv = (p.xy+vec2(37.0,17.0)*p.z) + f.xy;
	vec2 rg = textureLod( iChannel0, (uv+ 0.5)/256.0, 0.0 ).yx;
	return mix( rg.x, rg.y, f.z );
}
float noise( in vec2 x ) {
    vec2 p = floor(x);
    vec2 f = fract(x);
	vec2 uv = p.xy + f.xy*f.xy*(3.0-2.0*f.xy);
	return textureLod( iChannel0, (uv+118.4)/256.0, 0.0 ).x;
}
float sum(vec3 v) { return dot(v, vec3(1.0)); }

// port of minecraft

bool getMaterialColor( int i, vec2 coord, out vec3 color ) {
	// 16x16 tex
	vec2 uv = floor( coord );

    float n = uv.x + uv.y*347.0 + 4321.0 * float(i);
	float h = hash(n);
		
    float br = 1. - h * (96./255.);
	color = vec3( 150./255., 108./255.,  74./255.); // 0x966C4A;
			
	float xm1 = mod((uv.x * uv.x * 3. + uv.x * 81.) / 4., 4.);
	
	if (i == 1) {
		if( uv.y < (xm1 + 18.)) {
			color = vec3( 106./255., 170./255.,  64./255.); // 0x6AAA40;
		} else if (uv.y < (xm1 + 19.)) {
			br = br * (2. / 3.);
		}
	}
	if (i == 4) {
		color = vec3( 127./255., 127./255., 127./255.); // 0x7F7F7F;
	}	
	if (i == 7) {
		color = vec3( 103./255., 82./255.,  49./255.); // 0x675231;
		if ( h < 0.5 ) {
			br = br * (1.5 - mod(uv.x, 2.));
		}	
	}	
#ifdef HOUSE
	if (i == 5) {
		color = vec3( 181./255.,  58./255.,  21./255.); // 0xB53A15;
		if ( mod(uv.x + (floor(uv.y / 4.) * 5.), 8.) == 0. || mod( uv.y, 4.) == 0.) {
			color = vec3( 188./255., 175./255., 165./255.); // 0xBCAFA5;
		}
	}
#endif
	if (i == 9) {
		color = vec3(  64./255.,  64./255., 255./255.); // 0x4040ff;
	}	
	if (i == 8) {
		color = vec3(  80./255., 217./255.,  55./255.); // 0x50D937;
		if ( h < 0.5) {
			return false;
		}
	}
	if (i == 10) {
		color = vec3(0.65,0.68,0.7)*1.35; 
		br = 1.;
	}
	color *= br;
	
	return true;
}

//=====================================================================
// Code by inigo quilez - iq/2013:

const mat3 m = mat3( 0.00,  0.80,  0.60,
                    -0.80,  0.36, -0.48,
                    -0.60, -0.48,  0.64 );

float mapTerrain( vec2 p ) {
	p *= 0.02;

	float f;
    f  = 0.500*textureLod( iChannel1, p*0.01, 0. ).x;
    f += 0.1250*noise( p*4.01 );
	return  max( 50.0*f-30., SEALEVEL);
}

vec3 gro = vec3(0.0);

bool map(in vec3 c ) {
	vec3 p = c + 0.5;
    
	float f = mapTerrain( p.xz );

	vec2 fc = floor( c.xz * 0.05 );
	vec3 h = hash3( vec3( fc*vec2(213.123,2134.125), mapTerrain(fc) ) );	
	bool hit = false;
	
	if( h.z > 0.75 ) {
		vec2 tp = floor(fc*20.+mod(h.yx*154.43125, 10.)) + 5.5;
		float h = mapTerrain( tp );
		if( h > SEALEVEL ) {		
			if( all( equal( tp, p.xz ) ) ) hit = c.y < h+4.; // treetrunk
			if( distance( p, vec3( tp.x, h+6., tp.y ) ) < 2.5 ) hit = true; // leaves
		} 
	}
	
	hit = c.y < f ? true:hit; // ground
	
	if( c.y > 8. && 
	   sin( (c.y-8.)*(3.1415/32.)) * (10./(c.y-7.)) * noise( c*0.08+(0.7*iTime)*vec3(0.3, 0.07, 0.12) ) 
	   > 0.6 ) hit = true; // clouds

#ifdef HOUSE
	vec2 hc = abs(c.xz - vec2( 32., 130.)); // house
	if( all( lessThan( hc, vec2( 6., 10. ) ) ) && c.y < -hc.x-12. ) {
		hit = true;
		if( all( lessThan( hc, vec2( 2., 10. ) ) ) && c.y < -18. && c.y > -23. ) {
			hit = false;
		}
		if( all( lessThan( hc, vec2( 5., 9. ) ) ) && c.y < -18. && c.y > -23. ) {
			hit = false;
		}
	}
#endif
	
	if( distance( gro, c ) < 1.5 ) return false;
	
	return hit;
}


int mapMaterial(in vec3 c ) {
	int mat = 0;
	vec3 p = c + 0.5;
    
	float f = ceil( mapTerrain( p.xz ) ); 
	
	if( p.y <= f ) mat = 1; // ground
	else if( p.y < f+3. ) mat = 7; // treetrunk
	else if( p.y < f+10. ) mat = 8; // leaves
	else mat = 10; // clouds
	
#ifdef HOUSE
	vec2 hc = abs(c.xz - vec2( 32., 130.));
	if( c.y < 0. && all( lessThan( hc, vec2( 6., 10. ) ) ) ) {
		mat = 5;
		if( !map( c+vec3(0.,1.,0.) ) ) mat = 6;
	}
#endif
	
	return mat;
}

float castRay( in vec3 ro, in vec3 rd, out vec3 oVos, out vec3 oDir ) {
	vec3 pos = floor(ro);
	vec3 ri = 1.0/rd;
	vec3 rs = sign(rd);
	vec3 dis = (pos-ro + 0.5 + rs*0.5) * ri;
	
	float res = 0.0;
	vec3 mm = vec3(0.0);
	bool hit = false;
	
	for( int i=0; i<MAXSTEPS; i++ ) 
	{
		if( hit ) break;
		mm = step(dis.xyz, dis.yxy) * step(dis.xyz, dis.zzx);
		dis += mm * rs * ri;
        pos += mm * rs;
		if( map(pos) ) { hit = true;}
	}

	vec3 nor = -mm*rs;
	vec3 vos = pos;
	
    // intersect the cube	
	vec3 mini = (pos-ro + 0.5 - 0.5*vec3(rs))*ri;
	float t = max ( mini.x, max ( mini.y, mini.z ) );
	
	oDir = mm;
	oVos = vos;

	return hit?t:0.;

}

float castVRay( in vec3 ro, in vec3 rd, in float maxDist ) {
	vec3 pos = floor(ro);
	vec3 ri = 1.0/rd;
	vec3 rs = sign(rd);
	vec3 dis = (pos-ro + 0.5 + rs*0.5) * ri;
	
	float res = 1.0;
	
	for( int i=0; i<18; i++ ) 
	{
		if( map(pos) ) {res=0.0; break; }
		vec3 mm = step(dis.xyz, dis.yxy) * step(dis.xyz, dis.zzx);
		dis += mm * rs * ri;
        pos += mm * rs;
	}
	
	return res;
}

vec3 path( float t ) {
    vec2 p  = 100.0*sin( 0.02*t*vec2(1.0,1.2) + vec2(0.1,0.9) );
	     p +=  50.0*sin( 0.04*t*vec2(1.3,1.0) + vec2(1.0,4.5) );
	
	return vec3( p.x, mapTerrain(p)+2.+4.*(1.-cos(iTime*0.1)), p.y );
}


//=====================================================================
// Ambient occlusion 

vec4 edges( in vec3 vos, in vec3 nor, in vec3 dir )
{
	vec3 v1 = vos + nor + dir.yzx;
	vec3 v2 = vos + nor - dir.yzx;
	vec3 v3 = vos + nor + dir.zxy;
	vec3 v4 = vos + nor - dir.zxy;

	vec4 res = vec4(0.0);
	if( map(v1) ) res.x = 1.0;
	if( map(v2) ) res.y = 1.0;
	if( map(v3) ) res.z = 1.0;
	if( map(v4) ) res.w = 1.0;

	return res;
}

vec4 corners( in vec3 vos, in vec3 nor, in vec3 dir )
{
	vec3 v1 = vos + nor + dir.yzx + dir.zxy;
	vec3 v2 = vos + nor - dir.yzx + dir.zxy;
	vec3 v3 = vos + nor - dir.yzx - dir.zxy;
	vec3 v4 = vos + nor + dir.yzx - dir.zxy;

	vec4 res = vec4(0.0);
	if( map(v1) ) res.x = 1.0;
	if( map(v2) ) res.y = 1.0;
	if( map(v3) ) res.z = 1.0;
	if( map(v4) ) res.w = 1.0;

	return res;
}


void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
    // inputs	
	vec2 q = fragCoord.xy / iResolution.xy;
    vec2 p = -1.0 + 2.0*q;
    p.x *= iResolution.x/ iResolution.y;
	
    vec2 mo = iMouse.xy / iResolution.xy;
    if( iMouse.z < 0. ) mo=vec2(0.0);
	
	float time = 2.0*iTime + 50.0*mo.x;
    // camera
	
	float cr = 0.2*cos(0.1*iTime);	
	vec3 ro = path( time );
	vec3 ta = path( time+4. );
	ta.y = ro.y;
	gro = ro;
	
	// build ray
    vec3 ww = normalize( ta - ro);
    vec3 uu = normalize(cross( vec3(sin(cr),cos(cr),0.0), ww ));
    vec3 vv = normalize(cross(ww,uu));
	float r2 = p.x*p.x*0.32 + p.y*p.y;
    p *= (7.0-sqrt(37.5-11.5*r2))/(r2+1.0);
    vec3 rd = normalize( p.x*uu + p.y*vv + 2.5*ww );

	float sun = clamp( dot(sundir,rd), 0.0, 1.0 );
	vec3 col = vec3(0.6,0.71,0.75) - rd.y*0.2*vec3(1.0,0.5,1.0) + 0.15*0.5;
	col += 0.2*vec3(1.0,.6,0.1)*pow( sun, 8.0 );
	col *= 0.95;
	
	vec3 vos, dir;
	float t = castRay( ro, rd, vos, dir );
	
	if( t>0.0 ) {
		vec3 nor = -dir*sign(rd);
		
		vec3 pos = ro + rd*t;
		int mMat = mapMaterial( vos );			
		vec3 mpos = mod( pos * 16., 16. );
		
		if( mMat == 1 ) {
			if( map( vos + vec3(0., 1., 0. ) ) ) {
				mMat = hash(vos) > 0.5?2:4; 
				if( map( vos + vec3(0., 2., 0. ) ) ) mMat = 4;
			}
			if ( vos.y < SEALEVEL ) mMat = 9;	
		} 
		
		vec3 mCol;
		getMaterialColor( mMat, nor.y!=0.?mpos.xz:nor.x!=0.?-mpos.zy+vec2(32.,32.):-mpos.xy+vec2(32.,32.),mCol );
		
		// lighting
		float dif = clamp( dot( nor, sundir ), 0.0, 1.0 );
		float sha = 0.0; if( dif>0.01) sha=castVRay(pos+nor*0.01,sundir,32.0);
		float bac = clamp( dot( nor, normalize(sundir*vec3(-1.0,0.0,-1.0)) ), 0.0, 1.0 );
		float sky = 0.5 + 0.5*nor.y;
		float amb = 1.0;//clamp(0.75 + pos.y/100.0,0.0,1.0);
			
        // ambient occlusion
		
        vec4 ed = edges( vos, nor, dir );
        vec4 co = corners( vos, nor, dir );
        vec3 uvw = pos - vos;
        vec2 uv = vec2( dot(dir.yzx, uvw), dot(dir.zxy, uvw) );
		
        float occ = 0.0; 
        // (for edges)
        occ += (    uv.x) * ed.x;
        occ += (1.0-uv.x) * ed.y;
        occ += (    uv.y) * ed.z;
        occ += (1.0-uv.y) * ed.w;
        // (for corners)
        occ += (      uv.y *     uv.x ) * co.x*(1.0-ed.x)*(1.0-ed.z);
        occ += (      uv.y *(1.0-uv.x)) * co.y*(1.0-ed.z)*(1.0-ed.y);
        occ += ( (1.0-uv.y)*(1.0-uv.x)) * co.z*(1.0-ed.y)*(1.0-ed.w);
        occ += ( (1.0-uv.y)*     uv.x ) * co.w*(1.0-ed.w)*(1.0-ed.x);
        occ = 1.0 - occ/8.0;
        occ = occ*occ;
        occ = occ*occ;
		
		
		vec3 lin = vec3(0.0);
		lin += 4.0*dif*vec3(1.)*(0.5+0.5*occ)*(0.25+0.75*sha);
		lin += 1.8*bac*vec3(1.0,0.5,1.0)*(0.5+0.5*occ);
		lin += 4.0*sky*vec3(0.6,0.71,0.75)*occ;
	
		
		if( mMat == 10 ) {
			col = mix( col, mCol*lin*0.6, 0.3);		
		} else {
			// atmospheric
			col = mix( mCol*lin*0.2, col, 1.0-exp(-0.0000001*t*t*t) );
		}			
	}
	
	col += 0.2*vec3(1.0,0.4,0.2)*pow( sun, 3.0 );
	
    // gamma	
	col = pow( col, vec3(0.45) );
	
	// contrast
    col = col* 0.25 + 0.75*col*col*(3.0-2.0*col);
		
    col = clamp( col, 0.0, 1.0 );

	// vignetting	
	col *= 0.5 + 0.5*pow( 16.0*q.x*q.y*(1.0-q.x)*(1.0-q.y), 0.1 );
	
	fragColor = vec4( col, 1.0 );
}`,name:`Image`,description:``,type:`image`}]},{ver:`0.1`,info:{id:`lslGDB`,date:`1378971661`,viewed:6570,name:`Water world`,description:`A living, surrealistic, water world showing reflections and distance field rendering.
As usual, almost al code is copy-paste from shaders by inigo quilez.
Lens flare by musk! (https://www.shadertoy.com/view/4sX3Rs).`,likes:41,published:`Public API`,usePreview:0,tags:[`distancefield`,`reflection`,`water`,`flare`]},renderpass:[{inputs:[{id:`XsfGRn`,filepath:`/media/a/1f7dca9c22f324751f2a5a59c9b181dfe3b5564a04b724c657732d0bf09c99db.jpg`,type:`texture`,channel:1,sampler:{filter:`mipmap`,wrap:`repeat`,vflip:`false`,srgb:`false`,internal:`byte`},published:1},{id:`XdXGzn`,filepath:`/media/a/3083c722c0c738cad0f468383167a0d246f91af2bfa373e9c5c094fb8c8413e0.png`,type:`texture`,channel:0,sampler:{filter:`mipmap`,wrap:`repeat`,vflip:`false`,srgb:`false`,internal:`byte`},published:1}],outputs:[{id:`4dfGRr`,channel:0}],code:`// Water world. Created by Reinder Nijhoff 2013
// Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License.
// @reindernijhoff
//
// https://www.shadertoy.com/view/lslGDB
//
// As usual, almost al code is copy-paste from shaders by inigo quilez 
// Lens flare by musk! (https://www.shadertoy.com/view/4sX3Rs)
// 

#define BUMPFACTOR 0.1
#define EPSILON 0.1
#define BUMPDISTANCE 36.
#define MAXDISTANCE 150.

vec3 lig = normalize(vec3(-0.8,0.6,-0.2));


float noise(float t) {
	return textureLod(iChannel0,vec2(t,.0)/iChannelResolution[0].xy, 0.0).x;
}

float noise( in vec2 x ) {
    vec2 p = floor(x);
    vec2 f = fract(x);

	vec2 uv = p.xy + f.xy*f.xy*(3.0-2.0*f.xy);

	return -1.0 + 2.0*textureLod( iChannel0, (uv+0.5)/256.0, 0.0 ).x;
}

float noise( in vec3 x )
{
	float  z = x.z*64.0;
	vec2 offz = vec2(0.317,0.123);
	vec2 uv1 = x.xy + offz*floor(z); 
	vec2 uv2 = uv1  + offz;
	return mix(textureLod( iChannel0, uv1 ,0.0).x,textureLod( iChannel0, uv2 ,0.0).x,fract(z))-0.5;
}

const mat2 m2 = mat2( 0.80, -0.60, 0.60, 0.80 );

const mat3 m3 = mat3( 0.00,  0.80,  0.60,
                     -0.80,  0.36, -0.48,
                     -0.60, -0.48,  0.64 );

float fbm( vec3 p ) {
    float f = 0.0;
    f += 0.5000*noise( p ); p = m3*p*2.02;
    f += 0.2500*noise( p ); p = m3*p*2.03;
    f += 0.1250*noise( p ); p = m3*p*2.01;
    f += 0.0625*noise( p );
    return f/0.9375;
}

float base( in vec3 p){
	return noise(p*0.005)*20.0;
}

vec3 terrainOffset;
float terrainYFactor;

float mapTerrain( in vec3 p ) {
	vec3 c = p  + terrainOffset;
	return base(c)+7.0+0.03*base(c*10.)+2.0*p.y*terrainYFactor;
}

// intersection functions

bool intersectPlane(vec3 ro, vec3 rd, float height, out float dist) {	
	if (rd.y==0.0) {
		return false;
	}
		
	float d = -(ro.y - height)/rd.y;
	d = min(100000.0, d);
	if( d > 0. ) {
		dist = d;
		return true;
	}
	return false;
}

vec3 intersect( in vec3 ro, in vec3 rd, in float maxd ) {
	float precis = 0.0005;
    float h=precis*2.0;
    float t = 0.0;
	float d = 0.0;
    float m = 1.0;
    for( int i=0; i<150; i++ ) {
		if( abs(h) < precis || t > maxd ) break; {
	        t += h;
		    h = 0.15*mapTerrain( ro+rd*t );
		}
    }

    if( t>maxd ) m=-1.0;
    return vec3( t, d, m );
}

vec3 calcNormal( vec3 pos ) {
    vec3 eps = vec3(0.1,0.0,0.0);

	return normalize( vec3(
           mapTerrain(pos+eps.xyy) - mapTerrain(pos-eps.xyy),
           mapTerrain(pos+eps.yxy) - mapTerrain(pos-eps.yxy),
           mapTerrain(pos+eps.yyx) - mapTerrain(pos-eps.yyx) ) );
}

float softshadow( in vec3 ro, in vec3 rd, float mint, float k )
{
    float res = 1.0;
    float t = mint;
	float h = 1.0;
    for( int i=0; i<32; i++ ) {
        h = 0.15*mapTerrain(ro + rd*t);
        res = min( res, k*h/t );
		t += clamp( h, 0.02, 2.0 );
		
		if( h<0.0001 ) break;
    }
    return clamp(res,0.0,1.0);
}

vec4 texcube( sampler2D sam, in vec3 p, in vec3 n ) {
	vec4 x = texture( sam, p.yz );
	vec4 y = texture( sam, p.zx );
	vec4 z = texture( sam, p.xy );

	return x*abs(n.x) + y*abs(n.y) + z*abs(n.z);
}

float waterHeightMap( vec2 pos, float time ) {
	vec2 posm = 0.01*pos * m2;
	posm.x += 0.001*time;
	float f = fbm( vec3( posm*1.9, time*0.01 ));
	float height = 0.5+0.1*f;
	height += 0.05*sin( posm.x*6.0 + 10.0*f );
	
	float h1 = 1.*mapTerrain( vec3(pos.x, -2.0, pos.y ) );
	float h2 = 1.*mapTerrain( vec3(pos.x, -1.5, pos.y ) );
	float h = min(h1,h2);
	height += 0.25*sin( 4.*h-(time+0.8*noise( pos.xy*2. ))*6. )/(1.5*h1+1.0);
	
	return  height;
}

//-----------------------------------------------------
// Lens flare
//
// by musk License Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.
//
// Trying to get some interesting looking lens flares.
// 
//  13/08/13: 
// 	published
// 
// muuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuusk!
//-----------------------------------------------------

vec3 lensflare(vec2 uv,vec2 pos) {
	vec2 main = uv-pos;
	vec2 uvd = uv*(length(uv));
	
	float ang = atan(main.x,main.y);
	float dist=length(main); dist = pow(dist,.1);
	float n = noise(vec2(ang*16.0,dist*32.0));
	
	float f0 = 1.0/(length(uv-pos)*16.0+1.0);
	
	f0 = f0+f0*(sin(noise((pos.x+pos.y)*2.2+ang*4.0+5.954)*16.0)*.1+dist*.1+.8);
	
	float f1 = max(0.01-pow(length(uv+1.2*pos),1.9),.0)*7.0;

	float f2 = max(1.0/(1.0+32.0*pow(length(uvd+0.8*pos),2.0)),.0)*00.25;
	float f22 = max(1.0/(1.0+32.0*pow(length(uvd+0.85*pos),2.0)),.0)*00.23;
	float f23 = max(1.0/(1.0+32.0*pow(length(uvd+0.9*pos),2.0)),.0)*00.21;
	
	vec2 uvx = mix(uv,uvd,-0.5);
	
	float f4 = max(0.01-pow(length(uvx+0.4*pos),2.4),.0)*6.0;
	float f42 = max(0.01-pow(length(uvx+0.45*pos),2.4),.0)*5.0;
	float f43 = max(0.01-pow(length(uvx+0.5*pos),2.4),.0)*3.0;
	
	uvx = mix(uv,uvd,-.4);
	
	float f5 = max(0.01-pow(length(uvx+0.2*pos),5.5),.0)*2.0;
	float f52 = max(0.01-pow(length(uvx+0.4*pos),5.5),.0)*2.0;
	float f53 = max(0.01-pow(length(uvx+0.6*pos),5.5),.0)*2.0;
	
	uvx = mix(uv,uvd,-0.5);
	
	float f6 = max(0.01-pow(length(uvx-0.3*pos),1.6),.0)*6.0;
	float f62 = max(0.01-pow(length(uvx-0.325*pos),1.6),.0)*3.0;
	float f63 = max(0.01-pow(length(uvx-0.35*pos),1.6),.0)*5.0;
	
	vec3 c = vec3(.0);
	
	c.r+=f2+f4+f5+f6; c.g+=f22+f42+f52+f62; c.b+=f23+f43+f53+f63;
	c = c*1.3 - vec3(length(uvd)*.05);
	c+=vec3(f0);
	
	return c;
}

//-----------------------------------------------------
	

vec3 path( float time ) {
	return vec3( 26.0*cos(0.2+0.35*.1*time*1.5), 1.5, 26.0*sin(0.1+0.5*0.099*time*1.5) );	
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    float time = iTime + 350.;
    terrainOffset =  0.5*vec3( 0., -0.4, 0. )*(time+0.12*sin(time*4.));
    terrainYFactor = (1.1+sin(time*0.125));

    vec2 q = fragCoord.xy / iResolution.xy;
	vec2 p = -1.0 + 2.0*q;
	p.x *= iResolution.x / iResolution.y;
	
	
    // camera	
	float off = step( 0.001, iMouse.z )*6.0*iMouse.x/iResolution.x;
	time += off;
	vec3 ro = path( time+0.0 );
	vec3 ta = path( time+1.6 );
	
	ro.y += clamp(0.4-mapTerrain(ro), 0., 1.);
	
	ta.y *= 0.8 + 0.25*sin(0.09*time);
	float roll = 0.3*sin(1.0+0.07*time);
	
	// camera tx
	vec3 cw = normalize(ta-ro);
	vec3 cp = vec3(sin(roll), cos(roll),0.0);
	vec3 cu = normalize(cross(cw,cp));
	vec3 cv = normalize(cross(cu,cw));
	
	vec3 rd = normalize( p.x*cu + p.y*cv + 2.1*cw );

	float flare = dot( lig, normalize(ta-ro) );
	
    //-----------------------------------------------------
	// render
    //-----------------------------------------------------
	
	// raymarch
	bool reflection = false;	
	float dist, totaldist = 0., depth = 0.;
	vec3 normal;
	bool planeIntersect = intersectPlane( ro, rd, -2., dist );
		
    vec3 tmat = intersect(ro,rd, planeIntersect?dist:MAXDISTANCE );
	
	if( planeIntersect && dist < tmat.x ) {			
		ro = ro+rd*dist;
		totaldist = dist;
		
		depth = mapTerrain(ro);
		
		vec2 coord = ro.xz;
		vec2 dx = vec2( EPSILON, 0. );
		vec2 dz = vec2( 0., EPSILON );
		
		float bumpfactor = BUMPFACTOR * (1. - smoothstep( 0., BUMPDISTANCE, dist) );
		
		normal = vec3( 0., 1., 0. );
		normal.x = -bumpfactor * (waterHeightMap(coord + dx, time) - waterHeightMap(coord-dx, time) ) / (2. * EPSILON);
		normal.z = -bumpfactor * (waterHeightMap(coord + dz, time) - waterHeightMap(coord-dz, time) ) / (2. * EPSILON);
		normal = normalize( normal );
		
		rd = reflect( rd, normal );
		
		tmat = intersect(ro,rd, MAXDISTANCE);
		reflection = true;
	} 
		
	totaldist += tmat.x;
	
	// sky	 
	vec3 col = 2.0*vec3(0.32,0.36,0.4) - rd.y*0.6;
    float sun = clamp( dot(rd,lig), 0.0, 1.0 );
	col += vec3(1.0,0.8,0.4)*0.2*pow( sun, 6.0 );
		
	col += 0.1*vec3( fbm( rd*0.2 ) );
	
    vec3 bgcol = col;
			
    if( tmat.z>-0.5 && totaldist < MAXDISTANCE)
    {
        // geometry
        vec3 pos = ro + tmat.x*rd;
        vec3 nor = calcNormal(pos);
		vec3 ref = reflect( rd, nor );
				
        // material
		vec4 mate = vec4(0.0);
		vec3 matpos = pos+terrainOffset;
		
		mate.w = 0.0;
		mate.xyz = texcube( iChannel1, 0.1*matpos*vec3(1.0,2.2,1.0), nor ).xyz;
		mate.xyz *= vec3(0.4,0.4,0.4);
		
		mate.xyz *= 3.0*vec3(0.32,0.36,0.4) - nor.y*0.6;

		// lighting
		float occ = 1.0;//(0.5 + 0.5*nor.y);//*mate2.y;
        float amb = clamp(0.5 + 0.5*nor.y,0.0,1.0);
		float bou = clamp(-nor.y,0.0,1.0)*clamp(1.0-pos.y/10.0,0.0,1.0);
		float dif = max(dot(nor,lig),0.0);
        float bac = max(0.2 + 0.8*dot(nor,normalize(vec3(-lig.x,0.0,-lig.z))),0.0);
		float sha = 0.0; if( dif>0.01 ) sha=softshadow( pos+0.05*nor, lig, 0.0005, 32.0 );
        float fre = mate.w;//pow( clamp( 1.0 + dot(nor,rd), 0.0, 1.0 ), 2.0 );
        float spe = max( 0.0, pow( clamp( dot(lig,reflect(rd,nor)), 0.0, 1.0), 100.0 ) );
		
		// lights
		vec3 brdf = vec3(0.0);
        brdf += 3.0*dif*vec3(1.10,0.90,0.80)*pow(vec3(sha),vec3(1.0,1.2,1.5));
		brdf += 1.0*amb*vec3(0.10,0.15,0.30)*occ;
		brdf += 1.0*bac*vec3(0.09,0.06,0.04)*occ;
		brdf += 2.5*bou*vec3(0.02,0.06,0.09)*occ;
		
		brdf += 50.0*spe*vec3(1.0)*occ*dif*sha*clamp( (4.-pos.y)/6., 0., 1.)*clamp( 0.5+fbm(matpos), 0., 1.);

		// surface-light interacion
		col = mate.xyz* brdf + 0.7*sha*vec3(0.3,0.5,0.6)*fre*mate.w + mate.w*vec3(1.0,0.9,0.8)*spe*sha;			
	} 

	if( reflection ) {
		col = mix( bgcol, col, exp(-0.000001*pow(totaldist-dist,3.0)) );
		
		col *= 0.9*vec3( 0.8, 0.9, 1. )*(0.5+clamp( depth*2., 0.0, 0.5));

        float spe = max( 0.0, pow( clamp( dot(lig,rd), 0.0, 1.0), 100.0 ) )*softshadow( ro, lig, 0.0005, 32.0 );
		
		col += 2.0*spe*vec3(1.0);
		
		if( dist != totaldist ) totaldist = dist;
	} 
	col = mix( bgcol, col, exp(-0.000001*pow(totaldist,3.0)) );
	
	// sun glow
    col += vec3(1.0,0.6,0.2)*0.2*pow( sun, 2.0 )*clamp( (rd.y+0.4)/(0.0+0.4),0.0,1.0);

	
	vec2 sunuv =  2.7*vec2( dot( lig, cu ), dot( lig, cv ) );
	
	col += vec3(1.4,1.2,1.0)*lensflare(p, sunuv)
		*clamp( 3.*flare, 0., 1.);	
	
	//-----------------------------------------------------
	// postprocessing
    //-----------------------------------------------------
    // gamma
	col = clamp( col, 0.0, 1.0 );
	col = pow( clamp(col,0.0,1.0), vec3(0.45) );
	
    // contrast, desat, tint and vignetting	
	col = col*0.7 + 0.3*col*col*(3.0-2.0*col);
	col = mix( col, vec3(col.x+col.y+col.z)*0.33, 0.1 );
	col *= vec3(1.03,1.02,1.0);
	col *= 0.5 + 0.5*pow( 16.0*q.x*q.y*(1.0-q.x)*(1.0-q.y), 0.1 );
	
    fragColor = vec4( col, 1.0 );
}
`,name:`Image`,description:``,type:`image`}]},{ver:`0.1`,info:{id:`MdXGW2`,date:`1379503432`,viewed:24665,name:`Venice`,description:`My attempt to create a procedural city with a lot of lights. The city is inspired by Venice. The shader is a combination of my shaders: https://www.shadertoy.com/view/Mdf3zM and https://www.shadertoy.com/view/lslGDB.
(I have never been in Venice btw)`,likes:189,published:`Public API`,usePreview:0,tags:[`procedural`,`distancefield`,`reflection`,`water`,`city`]},renderpass:[{inputs:[{id:`4dXGRn`,filepath:`/media/a/10eb4fe0ac8a7dc348a2cc282ca5df1759ab8bf680117e4047728100969e7b43.jpg`,type:`texture`,channel:1,sampler:{filter:`mipmap`,wrap:`repeat`,vflip:`false`,srgb:`false`,internal:`byte`},published:1},{id:`XsfGRn`,filepath:`/media/a/1f7dca9c22f324751f2a5a59c9b181dfe3b5564a04b724c657732d0bf09c99db.jpg`,type:`texture`,channel:3,sampler:{filter:`mipmap`,wrap:`repeat`,vflip:`false`,srgb:`false`,internal:`byte`},published:1},{id:`XsX3Rn`,filepath:`/media/a/92d7758c402f0927011ca8d0a7e40251439fba3a1dac26f5b8b62026323501aa.jpg`,type:`texture`,channel:2,sampler:{filter:`mipmap`,wrap:`repeat`,vflip:`false`,srgb:`false`,internal:`byte`},published:1},{id:`XdXGzn`,filepath:`/media/a/3083c722c0c738cad0f468383167a0d246f91af2bfa373e9c5c094fb8c8413e0.png`,type:`texture`,channel:0,sampler:{filter:`mipmap`,wrap:`repeat`,vflip:`false`,srgb:`false`,internal:`byte`},published:1}],outputs:[{id:`4dfGRr`,channel:0}],code:`// Venice. Created by Reinder Nijhoff 2013
// Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License.
// @reindernijhoff
//
// https://www.shadertoy.com/view/MdXGW2
//
// My attempt to create a procedural city with a lot of lights. The city is inspired by Venice. 
// The shader is a combination of my shaders: https://www.shadertoy.com/view/Mdf3zM and 
// https://www.shadertoy.com/view/lslGDB.
// (I have never been in Venice btw)
//

// #define SHOW_ORNAMENTS
#define SHOW_GALLERY
#define SHOW_LIGHTS
#define SHOW_BRIDGES
#define SHOW_MOON_AND_CLOUDS

//----------------------------------------------------------------------

#define BUMPFACTOR 0.2
#define EPSILON 0.1
#define BUMPDISTANCE 200.

#define CAMERASPEED 15.

#define BUILDINGSPACING 20.
#define MAXBUILDINGINSET 12.

#define GALLERYHEIGHT 10.5
#define GALLERYINSET 2.5

float time;

float hash( float n ) {
	return fract(sin(n)*32.5454412211233);
}
vec2 hash2( float n ) {
	return fract(sin(vec2(n,n+1.0))*vec2(11.1451239123,34.349430423));
}
vec3 hash3( float n ) {
	return fract(sin(vec3(n,n+1.0,n+2.0))*vec3(84.54531253,42.145259123,23.349041223));
}

float noise( in vec2 x ) {
    vec2 p = floor(x);
    vec2 f = fract(x);

	vec2 uv = p.xy + f.xy*f.xy*(3.0-2.0*f.xy);

	return -1.0 + 2.0*textureLod( iChannel0, (uv+0.5)/256.0, 0.0 ).x;
}

float noise( in vec3 x )
{
	float  z = x.z*64.0;
	vec2 offz = vec2(0.317,0.123);
	vec2 uv1 = x.xy + offz*floor(z); 
	vec2 uv2 = uv1  + offz;
	return mix(texture( iChannel0, uv1 ,-100.0).x,texture( iChannel0, uv2 ,-100.0).x,fract(z))-0.5;
}

const mat2 m2 = mat2( 0.80, -0.60, 0.60, 0.80 );

const mat3 m3 = mat3( 0.00,  0.80,  0.60,
                     -0.80,  0.36, -0.48,
                     -0.60, -0.48,  0.64 );

float fbm( vec3 p ) {
    float f = 0.0;
    f += 0.5000*noise( p ); p = m3*p*2.02;
    f += 0.2500*noise( p ); p = m3*p*2.03;
    f += 0.1250*noise( p ); p = m3*p*2.01;
    f += 0.0625*noise( p );
    return f/0.9375;
}

//----------------------------------------------------------------------
// distance functions

float sdBox( vec3 p, vec3 b ) {
  vec3 d = abs(p) - b;
  return min(max(d.x,max(d.y,d.z)),0.0) +
         length(max(d,0.0));
}
float sdSphere( vec3 p, float s ) {
    return length(p)-s;
}
float udBox( vec3 p, vec3 b) {
  return length(max(abs(p)-b,0.0));
}
float sdCylinderXY( vec3 p, vec2 h ) {
  return length(p.xy)-h.x; //max( length(p.xy)-h.x, abs(p.z)-h.y );
}
float sdCylinderXZ( vec3 p, vec2 h ) {
  return max( length(p.xz)-h.x, abs(p.y)-h.y );
}
float sdTriPrism( vec3 p, vec2 h ) {
    vec3 q = abs(p);
    return max(q.z-h.y,max(q.x*0.866025+p.y*0.5,-p.y)-h.x*0.5);
}

//----------------------------------------------------------------------

float opS( float d1, float d2 ) {
    return max(-d2,d1);
}
float opU( float d1, float d2 ) {
    return min(d2,d1);
}
vec2 opU( vec2 d1, vec2 d2 ) {
	return (d1.x<d2.x) ? d1 : d2;
}
float opI( float d1, float d2 ) {
    return max(d1,d2);
}

//----------------------------------------------------------------------
// building functions

float getXoffset( float z ) {
	return 20.*sin( z*0.02);
}

vec2 getBuildingInfo( in vec3 pos ) {
	vec2 res;
	// base index	
	res.x = floor( pos.z/BUILDINGSPACING + 0.5 );
	// base z coord
	res.y = res.x * BUILDINGSPACING;
	
	// negative index for buildings at the right side
	res.x *= sign( pos.x + getXoffset(pos.z) );
	
	return res;
}

vec4 getBuildingParams( in float buildingindex ) {
	vec3 h = hash3( buildingindex );
	return vec4(
		20. + 4.5*floor( h.x*7. ),	 // height
		h.y*MAXBUILDINGINSET,
		step(h.z, 0.5),				 // sidewalk
		step(abs(h.z-0.4),0.25)		 // balcony
	);
}

float baseBuilding( in vec3 pos, in float h ) {
	vec3 tpos = vec3( pos.z, pos.y, pos.x );
	
	float res = 
	opS(		
		// main building
		udBox( tpos, vec3( 8.75, h, 8.75 ) ),
			// windows
		opS(
			opU(
				sdBox( vec3( mod(tpos.x+1.75, 3.5)-1.75, mod(tpos.y+4.5, 9.)-2.5, tpos.z-5.), vec3( 1.,2.,4.) ),
				sdCylinderXY( vec3( mod(tpos.x+1.75, 3.5)-1.75, mod(tpos.y+4.5, 9.)-4.5, tpos.z-5.), vec2( 1.,4.) )
			),
			udBox( tpos+vec3(0.,-h,0.), vec3( 9.0, 1.0, 9.0 ) )
		)		
	);
	
	res =
	opU( 
		res,
		opI( // main building windows
			udBox( tpos, vec3( 8.75, h, 8.75 ) ), 
			opU(
				udBox(  vec3( mod(tpos.x+1.75, 3.5)-1.75, tpos.y, tpos.z-8.45), vec3( 0.05, h, 0.05 ) ),
				udBox(  vec3( tpos.x, mod(tpos.y+0.425, 1.75)-0.875, tpos.z-8.45), vec3( 10.0, 0.05, 0.05 ) )
			)
		)
	);
	return res;	
}

float baseGallery( in vec3 pos ) {
	vec3 tpos = vec3( pos.z, pos.y, pos.x );
	
	float res = 
	opU(	
		opS(
			udBox( tpos+vec3(0.,0.,-GALLERYINSET), vec3( 8.75, GALLERYHEIGHT, 0.125 ) ),
			opU(
				sdBox( vec3( mod(tpos.x+1.75, 3.5)-1.75, tpos.y-5., tpos.z-5.), vec3( 1.6,3.,10.) ),
				sdCylinderXY( vec3( mod(tpos.x+1.75, 3.5)-1.75, tpos.y-8., tpos.z-5.), vec2( 1.6,10.) )
			)
		),
		sdTriPrism( vec3( tpos.z+3.4,-44.4+3.9*tpos.y, tpos.x), vec2( 7.5, 8.7 ) )
	);
	
	return res;	
}

float baseBalcony( in vec3 pos, in float h ) {
	float res = opI(		
		// main building
		udBox( pos, vec3( 9.0, h, 9.0 ) ),
			// balcony
		sdBox( vec3( pos.x, mod(pos.y+4.5, 9.)-7.5, pos.z-5.), vec3( 40.,0.5,40.) )
	);
	return res;		
}

float baseBridge( in vec3 pos ) {
	pos.x *= 0.38;
	float res = 
	opS(	
		opU( 
			sdBox( pos, vec3( 4., 2., 2.5 ) ),
			sdTriPrism( vec3( pos.x,-8.+3.*pos.y, pos.z), vec2( 4.5, 2.5 ) )
		),
		sdCylinderXY( pos+vec3( 0., 1.5, 0. ), vec2( 3.8, 3. ) )
	);
	return res;
}

// dinstancefield definitions

float mapSimpleTerrain( in vec3 p ) {	
	p.x += getXoffset( p.z );	
	p.x = -abs( p.x );
	vec2 res = vec2( udBox( vec3(p.x+30., p.y-1., p.z) , vec3( 20., 100.25, 99999. ) ), 1.);

#ifdef SHOW_BRIDGES
	float zcenter = mod(p.z+60.,120.)-70.;
	res = opU( res, vec2( baseBridge( vec3( p.x, p.y, zcenter) ), 8. ) ); // bridge
#endif
	
	return min( res.x, p.y+10. );
}

vec2 mapTerrain( in vec3 p ) {	
	vec2 buildingInfo = getBuildingInfo( p );
	vec4 buildingParams = getBuildingParams( buildingInfo.x );
	
	vec3 pos = p;
	pos.x += getXoffset( pos.z );
	pos.x = -abs( pos.x );
	
	vec2 res = vec2( udBox( vec3(pos.x+30., pos.y, pos.z) , vec3( 20., 0.25, 99999. ) ), 1.); // ground
	
	float z = buildingInfo.y;
	float zcenter = mod(pos.z+10.,20.)-10.;

#ifdef SHOW_BRIDGES
	res = opU( res, vec2( baseBridge( vec3( pos.x, pos.y,  mod(pos.z+60.,120.)-70.) ), 8. ) ); // bridge
#endif
		
	res =  opU( res, vec2( sdSphere( vec3( pos.x+11.5, pos.y-6.0, zcenter) , 0.5 ), 3. ) ); // light	
	res =  opU( res, vec2( sdSphere( vec3( pos.x+11.5, pos.y-5.4, zcenter+0.6) , 0.35 ), 3. ) ); // light	
	res =  opU( res, vec2( sdSphere( vec3( pos.x+11.5, pos.y-5.4, zcenter-0.6) , 0.35 ), 3. ) ); // light
	
	res =  opU( res, vec2( sdCylinderXZ( vec3( pos.x+11.5, pos.y, zcenter), vec2( 0.1, 6.0) ), 4.)); // 
						  
	pos += vec3( 28.75+buildingParams.y, 2.5, 0.);		
	res =  opU( res, vec2( baseBuilding( vec3( pos.x, pos.y, zcenter), buildingParams.x+2.5  ), 2. ) );

#ifdef SHOW_ORNAMENTS
	res = mix( res, opU( res, vec2( baseBalcony( vec3( pos.x, pos.y, zcenter), buildingParams.x+2.5  ), 9. ) ), buildingParams.w );
#endif
	
#ifdef SHOW_GALLERY
	pos.x += -8.75-GALLERYINSET;		
	res = mix( res, opU( res, vec2( baseGallery( vec3( pos.x, pos.y, zcenter) ), 5. ) ), buildingParams.z );
#endif	
									  
	return vec2( min( res.x,  11.-zcenter ), res.y );
}

float waterHeightMap( vec2 pos ) {
	vec2 posm = 0.02*pos * m2;
	posm.x += 0.001*time;
	float f = fbm( vec3( posm*1.9, time*0.01 ));
	float height = 0.5+0.1*f;
	height += 0.05*sin( posm.x*6.0 + 10.0*f );
	
	return  height;
}

// intersection functions

bool intersectPlane(vec3 ro, vec3 rd, float height, out float dist) {	
	if (rd.y==0.0) {
		return false;
	}
		
	float d = -(ro.y - height)/rd.y;
	d = min(100000.0, d);
	if( d > 0. ) {
		dist = d;
		return true;
	}
	return false;
}

bool intersectSphere ( in vec3 ro, in vec3 rd, in vec4 sph, out vec3 normal ) {
    vec3  ds = ro - sph.xyz;
    float bs = dot( rd, ds );
    float cs = dot(  ds, ds ) - sph.w*sph.w;
    float ts = bs*bs - cs;
	
    if( ts > 0.0 ) {
        ts = -bs - sqrt( ts );
		if( ts>0. ) {
			normal = normalize( ((ro+ts*rd)-sph.xyz)/sph.w );
			return true;
		}
    }

    return false;
}

vec3 intersect( const vec3 ro, const vec3 rd ) {
	float maxd = 1500.0;
	float precis = 0.01;
    float h=precis*2.0;
    float t = 0.0;
	float d = 0.0;
    float m = 1.0;
    for( int i=0; i<140; i++ ) {
		if( abs(h)<precis || t>maxd ) break; {
			t += h;
			vec2 mt = mapTerrain( ro+rd*t );
			h = 0.96*mt.x;
			m = mt.y;
		}
    }

    if( t>maxd ) m=-1.0;
    return vec3( t, d, m );
}

float intersectSimple( const vec3 ro, const vec3 rd ) {
	float maxd = 10000.0;
	float precis = 0.01;
    float h=precis*2.0;
    float t = 0.0;
    for( int i=0; i<50; i++ ) {
		if( abs(h)<precis || t>maxd ) break;  {
			t += h;
			h = mapSimpleTerrain( ro+rd*t );
		}
    }

    return t;
}

vec3 calcNormal( const vec3 pos ) {
    vec3 eps = vec3(0.1,0.0,0.0);

	return normalize( vec3(
           mapTerrain(pos+eps.xyy).x - mapTerrain(pos-eps.xyy).x,
           mapTerrain(pos+eps.yxy).x - mapTerrain(pos-eps.yxy).x,
           mapTerrain(pos+eps.yyx).x - mapTerrain(pos-eps.yyx).x ) );
}

float calcAO( const vec3 pos, const vec3 nor ) {
	float totao = 0.0;
    float sca = 1.0;
    for( int aoi=0; aoi<5; aoi++ ) {
        float hr = 0.01 + 0.05*float(aoi);
        vec3 aopos =  nor * hr + pos;
        float dd = mapTerrain( aopos ).x;
        totao += -(dd-hr)*sca;
        sca *= 0.75;
    }
    return clamp( 1.0 - 4.0*totao, 0.0, 1.0 );
}

vec4 texcube( sampler2D sam, in vec3 p, in vec3 n )
{
	vec4 x = texture( sam, p.yz );
	vec4 y = texture( sam, p.zx );
	vec4 z = texture( sam, p.xy );

	return x*abs(n.x) + y*abs(n.y) + z*abs(n.z);
}

void getSkyColor( in vec3 rd, out vec3 bgcol, out vec3 col ) {
	vec3 lig = normalize( vec3( -2.5, 1.7, 2.5 ) );
	
	bgcol = 1.1*vec3(0.15,0.15,0.4) - rd.y*0.4;	
	bgcol *= 0.3;
    float moon = clamp( dot(rd,lig), 0.0, 1.0 );
	bgcol += vec3(2.0,1.5,0.8)*0.015*pow( moon, 32.0 );
	
	col = bgcol;
	
#ifdef SHOW_MOON_AND_CLOUDS	
	// moon!
	vec3 normal;
	if( intersectSphere( vec3(0., 0., 0.), rd, vec4( lig, 0.03), normal ) ) {
		float l = dot( normalize( vec3( 2.2, -1.9, 0.5)), normal )*(0.4+texture( iChannel2, normal.xy*0.5 ).y);
		col += 0.2*clamp( 2.5*vec3(2.0,1.5,0.8)*clamp(l, 0.0, 1.), vec3(0.), vec3(1.) );
	}			
	
// cloud function by inigo: https://www.shadertoy.com/view/Mds3z2 
	vec2 cuv = rd.xz*(100.0)/rd.y;
	float cc = texture( iChannel2, 0.0001*cuv +0.1+ 0.0013*time ).x;
	cc = 0.65*cc + 0.35*texture( iChannel2, 0.0001*2.0*cuv + 0.0013*.5*time ).x;
	cc = smoothstep( 0.3, 1.0, 1.1*cc );
	col = mix( col, 0.1*vec3(0.05,0.05,0.4), 0.99*cc );
#endif
}

//-----------------------------------------------------

vec3 path( float _time ) {
	float z = _time*CAMERASPEED;	
	return vec3( -getXoffset(z)+5.*cos(_time*0.1), 1.25, z );	
}

void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
    time = iTime + 43.;
    vec2 q = fragCoord.xy / iResolution.xy;
	vec2 p = -1.0 + 2.0*q;
	p.x *= iResolution.x / iResolution.y;
	
	
    // camera	
	float off = step( 0.001, iMouse.z )*6.0*iMouse.x/iResolution.x;
	time += off;
	vec3 ro = path( time+0.0 );
	vec3 ta = path( time+1.6 );
	
	ta.y *= 1.1 + 0.25*sin(0.09*time);
	float roll = 0.3*sin(1.0+0.07*time);
	
	// camera tx
	vec3 cw = normalize(ta-ro);
	vec3 cp = vec3(sin(roll), cos(roll),0.0);
	vec3 cu = normalize(cross(cw,cp));
	vec3 cv = normalize(cross(cu,cw));
	
	vec3 rd = normalize( p.x*cu + p.y*cv + 2.1*cw );

	
    //-----------------------------------------------------
	// render
    //-----------------------------------------------------
	
	// raymarch
    float distSimple = intersectSimple(ro,rd);
	bool reflection = false;
	
	float dist, totaldist = 0., depth = 0.;
	vec3 normal, tmat, lp, lig;
	
	if( intersectPlane( ro, rd, 0., dist ) && dist < distSimple ) {			
		ro = ro+rd*dist;
		totaldist = dist;
		
		depth = mapTerrain(ro).x;
		
		vec2 coord = ro.xz;
		vec2 dx = vec2( EPSILON, 0. );
		vec2 dz = vec2( 0., EPSILON );
		
		float bumpfactor = BUMPFACTOR * (1. - smoothstep( 0., BUMPDISTANCE, dist) );
				
		normal = vec3( 0., 1., 0. );
		normal.x = -bumpfactor * (waterHeightMap(coord + dx) - waterHeightMap(coord-dx) ) / (2. * EPSILON);
		normal.z = -bumpfactor * (waterHeightMap(coord + dz) - waterHeightMap(coord-dz) ) / (2. * EPSILON);
		normal = normalize( normal );
		
		rd = reflect( rd, normal );
		reflection = true;
	} 
	
	// intersect scene	
	tmat = intersect(ro,rd);
	totaldist += tmat.x;
	
	// sky	 
	vec3 col, bgcol;
	getSkyColor( rd, bgcol, col );
			
    vec3 pos = ro + tmat.x*rd;
	
    if( tmat.z>-0.5 && totaldist < 500.) {
		// info building hit
		vec2 buildingInfo = getBuildingInfo( pos );			
		vec4 buildingParams = getBuildingParams( buildingInfo.x );
			
		float z = buildingInfo.y;
		lp = vec3( 11.5*sign(buildingInfo.x)-getXoffset(z), 6.0, z );
		lig = normalize(lp-pos);
		
		// geometry
        vec3 nor = calcNormal(pos);
				
        // material
		vec3 mate, origmate;
		vec3 matpos = pos*0.3;
		
#ifdef SHOW_GALLERY
		if( tmat.z == 5. )
		mate.xyz = texcube(iChannel3, matpos, nor ).xyz*0.2;
			else
#endif
		origmate = mate.xyz = texcube(iChannel1, matpos, nor ).xyz*0.4;
		
		bool aboveGallery = false;
		
		if( tmat.z == 3. ) mate.xyz = 160.*vec3(1.30,1.10,0.40);
		else if( tmat.z == 2. ) mate.xyz *= 
			clamp( 4.*texture( iChannel2, buildingInfo.x*vec2(1.4231153121) ).xyz
			,vec3(0.), vec3(1.) );
			
		// lighting
		float occ = calcAO( pos, nor );
        float amb = clamp(0.5 + 0.5*nor.y,0.0,1.0);
		float dif = max(dot(nor,lig),0.0);
		if( tmat.z == 5. && pos.y > GALLERYHEIGHT-2.6 ) {
			dif = abs(dot(nor,lig));
			mate.xyz = vec3(0.3,0.,0.);
		}
		dif /= dot( lp-pos,lp-pos );
		
        float bac = max(0.2 + 0.8*dot(nor,normalize(vec3(-lig.x,0.0,-lig.z))),0.0);
		
		if( buildingParams.z == 1. && pos.y > GALLERYHEIGHT ) {
			aboveGallery=true;
		}		
		vec3 lcol = aboveGallery?vec3(2.9, 1.65, 0.65 ):vec3(1.30,0.60,0.40);
		
		// lights
		vec3 brdf = vec3(0.0);
        brdf += (60.0*dif)*lcol;
		brdf += (0.1*amb)*vec3(0.10,0.15,0.30);
		brdf += (0.1*bac)*vec3(0.09,0.03,0.01);
		
		// surface-light interacion
		col = (mate.xyz*brdf)*occ;
		
		// in room ?
		float isLeft = sign(buildingInfo.x);
		
		if( ((pos.x+getXoffset( pos.z ))*isLeft > buildingParams.y+20.25 &&
		    abs( pos.z-buildingInfo.y ) < 8.5 &&
		  	pos.y < buildingParams.x-0.5) || false ) {
			
			vec2 roomcoord = pos.zy;
			roomcoord.x = floor( (roomcoord.x-buildingInfo.y+5.) / 3.5 ) * 3.5 +
						  floor( (buildingInfo.y+5. ) / 10.) * 10.;
			roomcoord.y = floor( roomcoord.y / 9. ) * 9.;
			
			if( noise( vec3(roomcoord*1.15321*isLeft, time*0.0005 ) ) > -0.1 ) {
				vec3 rlc = vec3( 
					(buildingParams.y+3.+20.25)*isLeft-getXoffset( roomcoord.x-5. ), 
					roomcoord.y+5.5, 
					roomcoord.x-5. );
					vec3 ld = rlc-pos;
					dif = max(dot(nor,normalize(ld) ),0.0)/dot(ld,ld);
					col += origmate*(dif*120.)*texture( iChannel2, roomcoord*0.1231 ).xyz;
			}
		}

#ifdef SHOW_LIGHTS
		// and extra lights!
		float basez = floor( (pos.z)/2. )*2.-2.0;
		for(int i=0; i<3; i++) {
			buildingInfo = getBuildingInfo( vec3( pos.x, pos.y, basez ) );
			// check if building lights here
			if( abs( basez - buildingInfo.y ) > 8.75 ||
			  	noise( buildingInfo ) > 0.15 ) {
				basez += 2.;
				continue;
			}
			buildingParams = getBuildingParams( buildingInfo.x );
			vec3 rlc = vec3( (buildingParams.y-1.+20.25)*isLeft-getXoffset( basez ),
						7.7-1.5*abs(sin(basez*0.3)), basez );
			vec3 ld = rlc-pos;
			dif = max(dot(nor,normalize(ld) ),0.0)/dot(ld,ld);
			col += mate.xyz*(dif*6.0)*texture( iChannel2, vec2(basez*time*0.0001)*0.1231 ).xyz;	
			basez += 2.;
		}
#endif
	
		if( reflection ) {
			col = mix( bgcol, col, exp(-0.00000001*pow(totaldist-dist,3.0)) );		
			col *= 0.9*vec3( 0.8, 0.9, 1. )*(0.5+clamp( depth*2., 0.0, 0.5));		
			if( dist != totaldist ) totaldist = dist;
		} 
		col = mix( bgcol, col, exp(-0.00000001*pow(totaldist,3.0)) );
	} 

	
	//-----------------------------------------------------
	// postprocessing
    //-----------------------------------------------------
    // gamma
	col = clamp( col, 0.0, 1.0 );
	col = pow( clamp(col,0.0,1.0), vec3(0.45) );
	
	col *= vec3(1.03,1.02,1.0);
	col *= 0.5 + 0.5*pow( 16.0*q.x*q.y*(1.0-q.x)*(1.0-q.y), 0.1 );
	
    fragColor = vec4( col, 1.0 );
}
`,name:`Image`,description:``,type:`image`}]},{ver:`0.1`,info:{id:`4sfGWX`,date:`1380117630`,viewed:146859,name:`Wolfenstein 3D`,description:`Experiment to generate some well-known textures (from the [url=https://en.wikipedia.org/wiki/Wolfenstein_3D]first-person shooter video game developed by id Software[/url]) in a textureless shader.`,likes:266,published:`Public API`,usePreview:1,tags:[`procedural`,`voxel`,`textures`,`wolfenstein`]},renderpass:[{inputs:[],outputs:[{id:`4dfGRr`,channel:0}],code:`// Wolfenstein. Created by Reinder Nijhoff 2013
// Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License.
// @reindernijhoff
//
// https://www.shadertoy.com/view/4sfGWX
//

#define NUM_MATERIALS 3
#define NUM_OBJECTS 1
#define SECONDS_IN_ROOM 3.
#define ROOM_SIZE 10.
#define MAXSTEPS 17
#define MATERIAL_DOOR 200
#define MATERIAL_DOORWAY 201

#define COL(r,g,b) vec3(r/255.,g/255.,b/255.)

#define time (iTime+40.)
vec3 rdcenter;

//----------------------------------------------------------------------
// Math functions

float hash( const float n ) {
    return fract(sin(n*14.1234512)*51231.545341231);
}
float hash( const vec2 x ) {
	float n = dot( x, vec2(14.1432,1131.15532) );
    return fract(sin(n)*51231.545341231);
}
float crossp( const vec2 a, const vec2 b ) { return a.x*b.y - a.y*b.x; }
vec3 rotate(vec3 r, float v){ return vec3(r.x*cos(v)+r.z*sin(v),r.y,r.z*cos(v)-r.x*sin(v));}
bool intersectSegment(const vec3 ro, const vec3 rd, const vec2 a, const vec2 b, out float dist, out float u) {
	vec2 p = ro.xz;	vec2 r = rd.xz;
	vec2 q = a-p;	vec2 s = b-a;
	float rCrossS = crossp(r, s);
	
	if( rCrossS == 0.){
		return false;
    } else {
		dist = crossp(q, s) / rCrossS;
		u = crossp(q, r) / rCrossS;
	
		if(0. <= dist && 0. <= u && u <= 1.){
			return true;
        } else {
			return false;
        }
    }
}

//----------------------------------------------------------------------
// Material helper functions

float onCircle( const vec2 c, const vec2 centre, const float radius ) {
	return clamp( 4.*(radius - distance(c,centre)), 0., 1. );
}
float onCircleLine( const vec2 c, const vec2 centre, const float radius ) {
	return clamp( 1.-1.5*abs(radius - distance(c,centre)), 0., 1. );
}
float onLine( const float c, const float b ) {
	return clamp( 1.-abs(b-c), 0., 1. );
}
float onBand( const float c, const float mi, const float ma ) {
	return clamp( (ma-c+1.), 0., 1. )*clamp( (c-mi+1.), 0., 1. );
}
float onLineSegmentX( const vec2 c, const float b, const float mi, const float ma ) {
	return onLine( c.x, b )*onBand( c.y, mi, ma );
}
float onLineSegmentY( const vec2 c, const float b, const float mi, const float ma ) {
	return onLine( c.y, b )*onBand( c.x, mi, ma );
}
float onRect( const vec2 c, const vec2 lt, const vec2 rb ) {
	return onBand( c.x, lt.x, rb.x )*onBand( c.y, lt.y, rb.y );
}
vec3 addBevel( const vec2 c, const vec2 lt, const vec2 rb, const float size, const float strength, const float lil, const float lit, const vec3 col ) {
	float xl = clamp( (c.x-lt.x)/size, 0., 1. ); 
	float xr = clamp( (rb.x-c.x)/size, 0., 1. );	
	float yt = clamp( (c.y-lt.y)/size, 0., 1. ); 
	float yb = clamp( (rb.y-c.y)/size, 0., 1. );	

	return mix( col, col*clamp(1.0+strength*(lil*(xl-xr)+lit*(yb-yt)), 0., 2.), onRect( c, lt, rb ) );
}
vec3 addKnob( const vec2 c, const vec2 centre, const float radius, const float strength, const vec3 col ) {
	vec2 lv = normalize( centre-c );
	return mix( col, col*(1.0+strength*dot(lv,vec2(-0.7071,0.7071))), onCircle(c, centre, radius ) );
}
float stepeq( float a, float b ) { 
	return step( a, b )*step( b, a );
}
//----------------------------------------------------------------------
// Generate materials!

void getMaterialColor( const int material, in vec2 uv, const float decorationHash, out vec3 col ) {	
	vec3 fgcol;
	
	uv = floor( mod(uv+64., vec2(64.)) );
	vec2 uvs = uv / 64.;
	
	// basecolor
	vec3 basecol = vec3( mix(55./255.,84./255.,uvs.y ) );	
	float br = hash(uv);
	col = basecol;
// grey bricks
	if( material == 0 || material == 1 ) {
		vec2 buv = vec2( mod(uv.x+1. + (floor((uv.y+1.) / 16.) * 16.), 32.) , mod( uv.y+1., 16.) );
		float bbr = mix( 190./255., 91./255., (buv.y)/14. ) + 0.05*br;
		if ( buv.x < 2. || buv.y < 2.) {
			bbr = 72./255.; 
		}
		col = vec3(bbr*0.95);
		col = addBevel( buv, vec2(1.,1.), vec2( 31.5, 15.), 2., 0.35, 1., 1., col);
	// blue wall
		if( material == 1 ) {
			col *= 1.3*COL(11.,50.,209.);
			col = mix( col, COL(2.,15.,86.), onBand(uv.y,14.,49.));
			col = mix( col, COL(9.,44.,185.)*(0.9+0.1*br), onBand(uv.y,16.,47.));
			col = mix( col, COL(3.,25.,122.), onBand(uv.y,21.,42.));
			col = addBevel( uv, vec2(-1.,16.), vec2( 65., 21.), 1., 0.35, 1., 1., col);
			col = addBevel( uv, vec2(-1.,43.), vec2( 65., 48.), 1., 0.35, 1., 1., col);
			
			col = mix( col, COL(2.,11.,74.), onRect(uv, vec2(22.,22.), vec2(42.,42.)));		
			col = mix( col, COL(9.,44.,185.)*(0.95+0.1*br), onRect(uv, vec2(22.,23.), vec2(42.,40.)));
			col = addBevel( uv, vec2(22.,23.), vec2(42.,40.), 1., 0.2, -1., 1., col);
			col = mix( col, mix(COL(2.,11.,74.), COL(3.,25.,122.), (uv.x-26.)/3.), onRect(uv, vec2(26.,23.), vec2(29.,29.)));
			col = mix( col, mix(COL(2.,11.,74.), COL(3.,25.,122.), (uv.y-34.)/2.), onRect(uv, vec2(22.,34.), vec2(29.,36.)));
			col = mix( col, mix(COL(2.,11.,74.), COL(3.,25.,122.), (uv.y-27.)/2.), onRect(uv, vec2(35.,27.), vec2(42.,29.)));
			col = mix( col, mix(COL(2.,11.,74.), COL(3.,25.,122.), (uv.y-34.)/8.), onRect(uv, vec2(35.,34.), vec2(38.,42.)));
		}
	}
// wooden wall
	else if( material == 2 ) {
		float mx = mod( uv.x, 64./5. ); 
		float h1 = hash( floor(uv.x/(64./5.)) );
		float h2 = hash( 1.+1431.16*floor(uv.x/(64./5.)) );
		col = mix( COL(115.,75.,43.),COL( 71.,56.,26.), smoothstep( 0.2, 1., (0.7+h2)*abs(mod( h2-uv.y*(0.05+0.1*h2)+(1.+h1+h2)*sin(mx*(0.1+0.2*h2)), 2. )-1.) ) );

		col = mix( col, mix(COL(40.,31.,13.), COL(142.,91.,56.), (uv.x)/2.), step(uv.x,2.) );
		col = mix( col, mix(COL(40.,31.,13.), COL(142.,91.,56.), (uv.x-10.)/2.), step(10.,uv.x)*step(uv.x,12.) );
		col = mix( col, mix(COL(40.,31.,13.), COL(142.,91.,56.), (uv.x-26.)/2.), step(26.,uv.x)*step(uv.x,28.) );
		col = mix( col, mix(COL(40.,31.,13.), COL(142.,91.,56.), (uv.x-40.)/2.), step(40.,uv.x)*step(uv.x,42.) );
		col = mix( col, mix(COL(40.,31.,13.), COL(142.,91.,56.), (uv.x-54.)/2.), step(54.,uv.x)*step(uv.x,56.) );

		col = mix( col, mix(COL(83.,60.,31.), COL(142.,91.,56.), (uv.x- 8.)), step( 8.,uv.x)*step(uv.x,9.) );
		col = mix( col, mix(COL(83.,60.,31.), COL(142.,91.,56.), (uv.x-24.)), step(24.,uv.x)*step(uv.x,25.) );
		col = mix( col, mix(COL(83.,60.,31.), COL(142.,91.,56.), (uv.x-38.)), step(38.,uv.x)*step(uv.x,39.) );
		col = mix( col, mix(COL(83.,60.,31.), COL(142.,91.,56.), (uv.x-52.)), step(52.,uv.x)*step(uv.x,53.) );
		col = mix( col, mix(COL(83.,60.,31.), COL(142.,91.,56.), (uv.x-62.)), step(62.,uv.x) );
		
		col = mix( col, mix(COL(40.,31.,13.), COL(142.,91.,56.), (uv.y)/2.), step(uv.y,2.) );
		col *= 1.-0.3*stepeq(uv.y,3.);
	}
// door
	else if( material == MATERIAL_DOOR ) {
		fgcol = COL(44., 176., 175.)*(0.95+0.15*sin(-0.25+ 4.*((-0.9-uvs.y)/(1.3-0.8*uvs.x)) ) );
		fgcol = addBevel( uv, vec2(-1.,1.), vec2(62.,66.), 2., 0.4, -1., -1., fgcol);
		fgcol = addBevel( uv, vec2( 6.,6.), vec2(57.,57.), 2.25, 0.5, -1., -1., fgcol);	
		fgcol = mix( addKnob( mod( uv, vec2(8.) ), vec2(3.5), 1.65, 0.5, fgcol ), fgcol, onRect( uv,  vec2( 6.,6.), vec2(57.,57.)) ) ;
		
		//knob
		fgcol *= 1.-0.2*onRect( uv, vec2( 13.5, 28.5 ), vec2( 22.5, 44.5 ) );
		fgcol = mix( fgcol, mix( COL(44.,44.,44.),COL(152.,152.,152.), ((uv.x+(43.-uv.y)-15.)/25. ) ), onRect( uv, vec2( 15., 27. ), vec2( 24., 43. ) ) );
		fgcol = addBevel( uv, vec2( 15., 27. ), vec2( 24., 43. ), 1., 0.45, 1., 1., fgcol);	
		fgcol = mix( fgcol, addKnob( mod( uv, vec2(6.) ), vec2(4.25,5.5), 1.15, 0.75, fgcol ), onRect( uv,  vec2( 15., 27. ), vec2( 24., 43. ) ) ) ;

		fgcol *= 1.-0.5*onRect( uv, vec2( 16.5, 33.5 ), vec2( 20.5, 38.5 ) );
		fgcol = mix( fgcol, mix( COL(88.,84.,11.),COL(251.,242.,53.), ((uv.x+(37.-uv.y)-18.)/7. ) ), onRect( uv, vec2( 18., 33. ), vec2( 21., 37. ) ) );
		fgcol = mix( fgcol, COL(0.,0.,0.), onRect( uv, vec2( 19., 34. ), vec2( 20., 35.7 ) ) );

		fgcol *= 1.-0.2*onRect( uv, vec2( 6.5, 29.5 ), vec2( 10.5, 41.5 ) );
		fgcol = mix( fgcol, mix( COL(88.,84.,11.),COL(251.,242.,53.), ((uv.x+(40.-uv.y)-9.)/13. ) ), onRect( uv, vec2( 9., 29. ), vec2( 11., 40. ) ) );
		fgcol = addBevel( uv, vec2( 9., 29. ), vec2( 11., 40. ), 0.75, 0.5, 1., 1., fgcol);	
		
		col = mix( basecol, fgcol, onRect( uv, vec2(1.,1.), vec2(62.,62.) ) );	
	}
// doorway
	else if( material == MATERIAL_DOORWAY ) {
		fgcol = COL(44., 176., 175.)*(0.95+0.15*sin(-0.25+ 4.*((-0.9-uvs.y)/(1.3-0.8*uvs.x)) ) );
		vec2 uvhx = vec2( 32.-abs(uv.x-32.), uv.y );
		fgcol = addBevel( uvhx, vec2(-1.,1.), vec2(28.,66.), 2., 0.4, -1., -1., fgcol);
		fgcol = addBevel( uvhx, vec2( 6.,6.), vec2(23.,57.), 2.25, 0.5, -1., -1., fgcol);	
		fgcol = mix( addKnob( vec2( mod( uvhx.x, 22. ), mod( uvhx.y, 28. )), vec2(3.5), 1.65, 0.5, fgcol ), fgcol, onRect( uvhx,  vec2( 6.,6.), vec2(24.,57.)) ) ;
		fgcol = mix( fgcol, vec3(0.), onRect( uv, vec2( 29., 1.), vec2( 35., 63.) ) );
		col = mix( basecol, fgcol, onRect( uv, vec2(1.,1.), vec2(62.,62.) ) );	
	}
	
// prison door	
	if( decorationHash > 0.93 && material < (NUM_MATERIALS+1) ) {	
		vec4 prisoncoords = vec4(12.,14.,52.,62.);
	// shadow
		col *= 1.-0.5*onRect( uv,  vec2( 11., 13. ), vec2( 53., 63. ) );
	// hinge
		col = mix( col, COL(72.,72.,72.), stepeq(uv.x, 53.)*step( mod(uv.y+2.,25.), 5.)*step(13.,uv.y) );
		col = mix( col, COL(100.,100.,100.), stepeq(uv.x, 53.)*step( mod(uv.y+1.,25.), 3.)*step(13.,uv.y) );
		
		vec3 pcol = vec3(0.)+COL(100.,100.,100.)*step( mod(uv.x-4., 7.), 0. ); 
		pcol += COL(55.,55.,55.)*step( mod(uv.x-5., 7.), 0. ); 
		pcol = addBevel(uv, vec2(0.,17.), vec2(63.,70.), 3., 0.8, 0., -1., pcol);
		pcol = addBevel(uv, vec2(0.,45.), vec2(22.,70.), 3., 0.8, 0., -1., pcol);
		
		fgcol = COL(72.,72.,72.);
		fgcol = addBevel(uv, prisoncoords.xy, prisoncoords.zw+vec2(1.,1.), 1., 0.5, -1., 1., fgcol );
		fgcol = addBevel(uv, prisoncoords.xy+vec2(3.,3.), prisoncoords.zw-vec2(2.,1.), 1., 0.5, 1., -1., fgcol );
		fgcol = mix( fgcol, pcol, onRect( uv, prisoncoords.xy+vec2(3.,3.), prisoncoords.zw-vec2(3.,2.) ) );
		fgcol = mix( fgcol, COL(72.,72.,72.), onRect( uv, vec2(15.,32.5), vec2(21.,44.) ) );
		
		fgcol = mix( fgcol, mix( COL(0.,0.,0.), COL(43.,43.,43.), (uv.y-37.) ), stepeq(uv.x, 15.)*step(37.,uv.y)*step(uv.y,38.) );
		fgcol = mix( fgcol, mix( COL(0.,0.,0.), COL(43.,43.,43.), (uv.y-37.)/3. ), stepeq(uv.x, 17.)*step(37.,uv.y)*step(uv.y,40.) );
		fgcol = mix( fgcol, COL(43.,43.,43.), stepeq(uv.x, 18.)*step(37.,uv.y)*step(uv.y,41.) );
		fgcol = mix( fgcol, mix( COL(0.,0.,0.), COL(100.,100.,100.), (uv.y-37.)/3. ), stepeq(uv.x, 18.)*step(36.,uv.y)*step(uv.y,40.) );
		fgcol = mix( fgcol, COL(43.,43.,43.), stepeq(uv.x, 19.)*step(37.,uv.y)*step(uv.y,40.) );

		fgcol = mix( fgcol, mix( COL(84.,84.,84.), COL(108.,108.,108.), (uv.x-15.)/2. ), stepeq(uv.y, 32.)*step(15.,uv.x)*step(uv.x,17.) );
		fgcol = mix( fgcol, COL(81.,81.,81.), stepeq(uv.y, 32.)*step(20.,uv.x)*step(uv.x,21.) );

		col = mix( col, fgcol, onRect( uv, prisoncoords.xy, prisoncoords.zw ) );
	}
// flag
	else if( decorationHash > 0.63 && material < (NUM_MATERIALS+1) ) {		
		vec2 uvc = uv-vec2(32.,30.);
	
	// shadow	
		vec4 shadowcoords = vec4( 14., 7., 
								  54., max( 56. + sin( uv.x*0.32-1. ),56.) ); 
		col *= 1.-0.3*onRect( uv,  vec2( 6., 6. ), vec2( 61., 7. ) );
		col *= 1.-0.3*clamp( 0.25*(56.-uv.x), 0., 1.)*onRect( uv, shadowcoords.xy, shadowcoords.zw );

	// rod
		col = mix( col, COL(250.,167.,98.), onLineSegmentX( vec2( abs(uv.x-32.), uv.y ), 26., 4., 6.5 ) );
		col = mix( col, COL(251.,242.,53.), onLineSegmentY( uv, 5., 4., 60. ) );
		col = mix( col, COL(155.,76.,17.), onLineSegmentY( uv, 6., 4., 60. ) );
		col = mix( col, COL(202.,96.,25.), onLineSegmentY( vec2( abs(uv.x-32.), uv.y ), 6., 26., 28. ) );
		col = mix( col, COL(251.,242.,53.), onLineSegmentX( vec2( abs(uv.x-32.), uv.y ), 25., 3., 7. ) );
		col = mix( col, COL(252.,252.,217.), onLineSegmentX( vec2( abs(uv.x-32.), uv.y ), 25., 4.3, 5.5 ) );
		col = mix( col, COL(252.,252.,217.), onLineSegmentX( vec2( abs(uv.x-32.), uv.y ), 26., 5.3, 5.5 ) );
		col = mix( col, COL(0.,0.,0.), onLineSegmentY( vec2( abs(uv.x-32.), uv.y ), 6., 18.3, 19.5 ) );

	// flag	
		vec4 flagcoords = vec4( 13., min( 9.5 - pow(5.5* (uvs.x-0.5), 2.), 9. ), 
						    51., max( 55. + sin( uv.x*0.4+2.7 ),55.) ); 
	
		fgcol = COL(249.,41.,27.);
		
		fgcol = mix( fgcol, COL(255.,255.,255.), onBand( min(abs(uvc.x), abs(uvc.y)), 2., 4. ) );
		fgcol = mix( fgcol, COL(72.,72.,72.), onLine( min(abs(uvc.x), abs(uvc.y)), 3. ) );		
		
		fgcol = mix( fgcol, COL(255.,255.,255.), onCircle( uv, vec2(32.,30.), 12.5 ) );	
		fgcol = mix( fgcol, COL(0.,0.,0.), onCircleLine( uv, vec2(32.,30.), 11. ) );	
		fgcol = mix( fgcol, COL(0.,0.,0.), onCircleLine( uv, vec2(32.,30.), 9. ) );
		
		vec2 uvr = vec2( (uvc.x-uvc.y)*0.7071, (uvc.y+uvc.x)*0.7071)*sign( uvc.x+0.5 );
		fgcol = mix( fgcol, COL(72.,72.,72.), onRect( uvr, vec2(-1.,-1.), vec2(1.,4.) ) );
		fgcol = mix( fgcol, COL(72.,72.,72.), onRect( uvr, vec2(-4.2, 4.2), vec2(1.,6.15) ) );
		fgcol = mix( fgcol, COL(72.,72.,72.), onRect( uvr, vec2(-1.,-1.), vec2(4.,1.) ) );
		fgcol = mix( fgcol, COL(72.,72.,72.), onRect( uvr, vec2( 4.2,-1.), vec2(6.15,4.2) ) );
	
		fgcol *= (0.8+0.2*sin( uv.x*0.4+2.7 ));
		fgcol *= (0.8+0.2*clamp( 0.5*(uv.y-7.), 0., 1.));
	
	// mix flag on background
		col = mix( col, fgcol, onRect( uv, flagcoords.xy, flagcoords.zw ) );
	}
	
// fake 8-bit color palette and dithering	
	col = floor( (col+0.5*mod(uv.x+uv.y,2.)/32.)*32.)/32.;
}
bool getObjectColor( const int object, in vec2 uv, inout vec3 icol ) {
	uv = floor( mod(uv, vec2(64.)) );
	vec2 uvs = uv / 64.;
	vec3 col = vec3(20./255.);
	float d;
	
// only a lamp for now
	
	// lamp top
	d = distance( uv*vec2(1.,2.), vec2(28.1, 5.8)*vec2(1.,2.) );
	col = mix( col, mix( COL(41.,250.,46.), COL(13.,99.,12.), clamp( d/8.-0.2, 0., 1.) ), 
			  onCircle(uv, vec2(31.,13.6), 11.7 )*step( uv.y, 6. )); 
	col = mix( col, COL(9.,75.,6.), onCircleLine( uv, vec2(31.,14.), 11.6 ) *
			  step( length(uv-vec2(31.,13.6)), 11.7 )*step( uv.y, 6. ) );
	col = mix( col, COL(100.,100.,100.), onLine( abs(uv.x-31.), 1. )*step( uv.y, 1. ) );
	col = mix( col, COL(140.,140.,140.), onLine( abs(uv.x-31.), 0.25 )*step( uv.y, 1. )*step( 1., uv.y ) );
	
	// lamp bottom
	d = distance( uv*vec2(1.,2.), vec2(30.5, 6.5)*vec2(1.,2.) );
	col = mix( col, mix( COL(41.,250.,46.), COL(13.,99.,12.), clamp( abs(uv.x-31.)/4.-1.25, 0., 1. )), step( abs(uv.x-31.), 9. )*stepeq( uv.y, 7.) );
	col = mix( col, mix( COL(41.,250.,46.), COL(16.,123.,17.), clamp( abs(uv.x-31.)/4.-1.25, 0., 1. )), step( abs(uv.x-31.), 9. )*stepeq( uv.y, 8.) );
	col = mix( col, mix( COL(133.,250.,130.), COL(22.,150.,23.), clamp( abs(uv.x-31.)/4.-0.75, 0., 1. )), step( abs(uv.x-31.), 7. )*stepeq( uv.y, 9.) );

	col = mix( col, mix( COL(255.,251.,187.), col, clamp( d/4.5-0.6, 0., 1.) ), 
			  onCircle(uv, vec2(31.,1.), 10.2 )*step( uv.y, 8. )*step( 7., uv.y )); 
	col = mix( col, mix( COL(255.,255.,255.), col, clamp( d/4.-0.7, 0., 1.) ), 
			  onCircle(uv, vec2(31.,1.), 7.2 )*step( uv.y, 8. )*step( 7., uv.y )); 
		
	// floor
	d = distance( vec2(mod(uv.x, 32.),uv.y)*vec2(1.5,30./3.), vec2(16., 61.5)*vec2(1.5,30./3.) );
	col = mix( col, mix( COL(168.,168.,168.), COL(124.,124.,124.), clamp(d/15.-0.5, 0., 1.) ), step(d,24.5)); 
	col = mix( col, mix( COL(124.,124.,124.), COL(140.,140.,140.), clamp((uv.y-59.)/1., 0., 1.)), step(59.,uv.y)*step(uv.x, 57.)*step(7.,uv.x)); 
	col = mix( col, mix( COL(168.,168.,168.), COL(124.,124.,124.), clamp(abs(32.-uv.x)/10.-2., 0., 1.)), step(uv.y, 62.)*step(62.,uv.y)*step(uv.x, 61.)*step(3.,uv.x)); 
	col = mix( col, mix( COL(152.,152.,152.), COL(124.,124.,124.), clamp(abs(32.-uv.x)/10.-2.25, 0., 1.)), step(uv.y, 61.)*step(61.,uv.y)*step(uv.x, 59.)*step(5.,uv.x)); 

	col = floor( (col)*32.)/32.;
	if( any(notEqual(col, vec3(floor((20./255.)*32.)/32.))) ) {
		icol = col;
		return true;
	}
	return false;
}

//----------------------------------------------------------------------
// Proocedural MAP functions

bool isWall( const vec2 vos ) {
	return vos.y<0.4*ROOM_SIZE || vos.y>2.75*ROOM_SIZE || any( equal( mod( vos, vec2( ROOM_SIZE ) ), vec2(0.,0.) ) );
}
bool isDoor( const vec2 vos ) {
	return isWall(vos) && ((hash(vos)>0.75 &&  any( equal( mod( vos, vec2( ROOM_SIZE*0.5 ) ), vec2(2.) ) )) 
		    || any( equal( mod( vos, vec2( ROOM_SIZE ) ), vec2(ROOM_SIZE*0.5) ) )); 
}
bool isObject( const vec2 vos ) {
	return hash( vos*10. ) > 0.95;
}
bool map( const vec2 vos ) {
	return isObject( vos ) || isWall( vos );
}

//----------------------------------------------------------------------
// Render MAP functions

bool intersectSprite( const vec3 ro, const vec3 rd, const vec3 vos, const vec3 nor, out vec2 uv ) {
	float dist, u;
	vec2 a = vos.xz + nor.zx*vec2(-0.5,0.5) + vec2(0.5, 0.5);
	vec2 b = vos.xz - nor.zx*vec2(-0.5,0.5) + vec2(0.5, 0.5);
	if( intersectSegment( ro, rd, a, b, dist, u) ) {
		uv.x = u; uv.y = 1.-(ro+dist*rd).y;
		if( sign(nor.x)<0. ) uv.x = 1.-uv.x;
		return uv.y>0.&&uv.y<1.;
	}
	return false;
}
int getMaterialId( const vec2 vos ) {
	return int( mod( 521.21 * hash( floor((vos-vec2(0.5))/ROOM_SIZE )  ), float(NUM_MATERIALS)) );
}
bool getColorForPosition( const vec3 ro, const vec3 rd, const vec3 vos, const vec3 pos, const vec3 nor, inout vec3 col ) {	
	vec2 uv;

	if( isWall( vos.xz ) ) {
		if( isDoor( vos.xz ) ) {
			if( intersectSprite( ro, rd, vos+nor*0.03, nor, uv ) ) {
				// open the door
				uv.x -= clamp( 2.-0.75*distance( ro.xz, vos.xz+vec2(0.5) ), 0., 1.);
				if( uv.x > 0. ) {
					getMaterialColor( MATERIAL_DOOR, uv*64., 0., col );
					return true;
				}	
			}	
			return false;
		}
		// a wall is hit
		if( pos.y <= 1. && pos.y >= 0. ) {
			vec2 mpos = vec2( dot(vec3(-nor.z,0.0,nor.x),pos), -pos.y );
    		float sha = 0.6 + 0.4*abs(nor.z);		
			getMaterialColor( isDoor( vos.xz+nor.xz )?MATERIAL_DOORWAY:getMaterialId(vos.xz), mpos*64., hash( vos.xz ), col );
			col *= sha;
			return true;
		}
		return true;
	}
	if( isObject( vos.xz ) && !isWall( vos.xz+vec2(1.,0.) ) && !isWall( vos.xz+vec2(-1.,0.) )
	    && !isWall( vos.xz+vec2(0.,-1.) ) && !isWall( vos.xz+vec2(0.,1.) ) &&
	    intersectSprite( ro, rd, vos, rdcenter, uv ) ) {
		return getObjectColor( 0, uv*64., col );
	}
	return false;
}

bool castRay( const vec3 ro, const vec3 rd, inout vec3 col ) {
	vec3 pos = floor(ro);
	vec3 ri = 1.0/rd;
	vec3 rs = sign(rd);
	vec3 dis = (pos-ro + 0.5 + rs*0.5) * ri;
	
	float res = 0.0;
	vec3 mm = vec3(0.0);
	bool hit = false;
	
	for( int i=0; i<MAXSTEPS; i++ )	{
		if( hit ) continue;
		
		mm = step(dis.xyz, dis.zyx);
		dis += mm * rs * ri;
        pos += mm * rs;
		
		if( map(pos.xz) ) { 
			vec3 mini = (pos-ro + 0.5 - 0.5*vec3(rs))*ri;
			float t = max ( mini.x, mini.z );			
			hit = getColorForPosition( ro, rd, pos, ro+rd*t, -mm*sign(rd), col );
		}
	}
	return hit;
}

//----------------------------------------------------------------------
// Some really ugly code

#define CCOS(a) cos(clamp(a,0.,1.)*1.57079632679)
#define CSIN(a) sin(clamp(a,0.,1.)*1.57079632679)
vec3 path( const float t ) {
	float tmod = mod( t/SECONDS_IN_ROOM, 8. );
	float tfloor = floor( tmod );
	
	vec3 pos = vec3( 4.*ROOM_SIZE*floor(t/(SECONDS_IN_ROOM*8.))+0.5, 0.5, 0.5*ROOM_SIZE+0.5 );	
	return pos + ROOM_SIZE*vec3(
		clamp(tmod,0.,1.)+clamp(tmod-4.,0.,1.)+0.5*(2.+CSIN(tmod-1.)-CCOS(tmod-3.)+CSIN(tmod-5.)-CCOS(tmod-7.)), 0.,
		clamp(tmod-2.,0.,1.)-clamp(tmod-6.,0.,1.)+0.5*(-CCOS(tmod-1.)+CSIN(tmod-3.)+CCOS(tmod-5.)-CSIN(tmod-7.)) );
}


//----------------------------------------------------------------------
// Main

void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
	vec2 q = fragCoord.xy / iResolution.xy;
    vec2 p = -1.0 + 2.0*q;
    p.x *= iResolution.x/ iResolution.y;
	
	vec3 ro = path( time );
	vec3 ta = path( time+0.1 );
	
    rdcenter = rotate( normalize( ta - ro), 0.3*cos(time*0.75) );
    vec3 uu = normalize(cross( vec3(0.,1.,0.), rdcenter ));
    vec3 vv = normalize(cross(rdcenter,uu));
    vec3 rd = normalize( p.x*uu + p.y*vv + 2.5*rdcenter );
	
	vec3 col = rd.y>0.?vec3(56./255.):vec3(112./255.);
	castRay( ro, rd, col );
		
	fragColor = vec4( col, 1.0 );
}`,name:`Image`,description:``,type:`image`}]},{ver:`0.1`,info:{id:`lsB3zD`,date:`1384716411`,viewed:16628,name:`Doom 2`,description:`Reconstructing the first level of Doom 2 in a shader. This is, just like my shader 'Wolfenstein' ([url]https://www.shadertoy.com/view/4sfGWX[/url]), an experiment to reconstruct some well-known textures in a textureless shader.`,likes:75,published:`Public API`,usePreview:0,tags:[`procedural`,`textures`,`doom2`]},renderpass:[{inputs:[],outputs:[{id:`4dfGRr`,channel:0}],code:`// Doom 2. Reinder Nijhoff 2013
// Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License.
// @reindernijhoff
//
// https://www.shadertoy.com/view/lsB3zD
//

#define COL(r,g,b) vec3(r/255.,g/255.,b/255.)

#define time iTime

//----------------------------------------------------------------------
// Math functions

float hash( const float n ) {
    return fract(sin(n*14.1234512)*51231.545341231);
}
float hash( const vec2 x ) {
	float n = dot( x, vec2(14.1432,1131.15532) );
    return fract(sin(n)*51231.545341231);
}
float crossp( const vec2 a, const vec2 b ) { return a.x*b.y - a.y*b.x; }
vec3 rotate(vec3 r, float v){ return vec3(r.x*cos(v)+r.z*sin(v),r.y,r.z*cos(v)-r.x*sin(v));}

//----------------------------------------------------------------------
// Intersection functions

bool intersectWall(const vec3 ro, const vec3 rd, const vec2 a, const vec2 b, const float height, 
					  inout float dist, inout vec2 uv ) {
	vec2 p = ro.xz;	vec2 r = rd.xz;
	vec2 q = a-p;	vec2 s = b-a;
	float rCrossS = crossp(r, s);
	
	if( rCrossS == 0.) {
		return false;
	}
	float d = crossp(q, s) / rCrossS;
	float u = crossp(q, r) / rCrossS;
	float he = ro.y+rd.y*d;
	
	if(0. <= d && d < dist && 0. <= u && u <= 1. && he*sign(height) < height ) {
		dist = d;
		uv = vec2( -u*length(s), height-he );
		return true;
	}
	return false;
}
bool intersectFloor(const vec3 ro, const vec3 rd, const float height, 
					inout float dist, inout vec2 uv ) {	
	if (rd.y==0.0) {
		return false;
	}
		
	float d = -(ro.y - height)/rd.y;
	d = min(100000.0, d);
	if( d > 0. && d < dist) {
		dist = d;
		uv = ro.xz+dist*rd.xz;
		return true;
	}
	return false;
}

//----------------------------------------------------------------------
// Material helper functions

float sat( const float a ) { return clamp(a,0.,1.); }
float onCircleAA( const vec2 c, const vec2 centre, const float radius, const float aa ) {
	return sat( aa*(radius - distance(c,centre)) );
}
float onLineX( const vec2 c, const float x ) {
	return step(x,c.x)*step(c.x,x);
}
float onLineY( const vec2 c, const float y ) {
	return step(y,c.y)*step(c.y,y);
}
float onBand( const float c, const float mi, const float ma ) {
	return step(mi,c)*step(c,ma);
}
float onRect( const vec2 c, const vec2 lt, const vec2 rb ) {
	return onBand( c.x, lt.x, rb.x )*onBand( c.y, lt.y, rb.y );
}
vec3 addKnobAA( const vec2 c, const vec2 centre, const float radius, const float strength, const vec3 col ) {
	vec2 lv = normalize( centre-c );
	return mix( col, col*(1.0+strength*dot(lv,vec2(-0.7071,0.7071))), onCircleAA(c, centre, radius, 4. ) );
}
float onBandAA( const float c, const float mi, const float ma ) {
	return sat( (ma-c+1.) )*sat( (c-mi+1.) );
}
float onRectAA( const vec2 c, const vec2 lt, const vec2 rb ) {
	return onBandAA( c.x, lt.x, rb.x )*onBandAA( c.y, lt.y, rb.y );
}
vec3 addBevel( const vec2 c, const vec2 lt, const vec2 rb, const float size, const float strength, const float lil, const float lit, const vec3 col ) {
	float xl = sat( (c.x-lt.x)/size); 
	float xr = sat( (rb.x-c.x)/size);	
	float yt = sat( (c.y-lt.y)/size); 
	float yb = sat( (rb.y-c.y)/size);
	return mix( col, col*clamp(1.0+strength*(lil*(xl-xr)+lit*(yb-yt)), 0., 2.), onRectAA( c, lt, rb ) );
}

//----------------------------------------------------------------------
// Generate materials!

void getMaterialColor( const int material, in vec2 uv, out vec3 col ) {	
	uv = floor( uv );
	float huv = hash(uv), huvx = hash(uv.x);
	
	if( material == 0 ) { // ceiling GRNLITE1
		uv = mod(uv, vec2(64.)); vec2 centre = mod(uv,vec2(32.,16.));
		col = mix( COL(90.,98.,69.),COL(152.,149.,125.),(0.75*huv+0.25*mod(uv.x,2.)) );
		col = mix( col, mix(vec3(243./255.),vec3(169./255.), distance(centre,vec2(16.,8.))/6.5), onCircleAA(centre, vec2(16.,8.), 6.25, 0.75) );
	} 
	else if( material == 1 ) { // ceiling FLOOR_1
		uv = mod(uv, vec2(64.)); vec2 uv8 = mod(uv, vec2(32.,7.7));
		float h = huv*huvx;
		col = mix( COL(136.,114.,95.), COL(143.,122.,92.), sat(4.*h) );	
		col = mix( col, COL(175.,126.,89.), sat( 2.*(hash(floor(uv*0.125))+huv-1.35) ) );
		col = mix( col, COL(121.,103.,83.), sat( onLineX(uv,0.)+onLineY(uv,63.)) );
		col = mix( col, COL(121.,103.,83.), onLineX(uv,31.)*huv );
		uv8.x = abs(16.-uv8.x);
		float d = min( max( uv8.x-8.,abs(uv8.y-4.) ), abs(distance(uv8,vec2(11.,4.))) )+huv;
		vec3 fgcol = mix( col, col*sat(((16.-uv8.y)/12.)), step(d,3.) );
		col = mix( mix( fgcol, COL(114.,94.,78.), sat(d*(3.5-d)/4.)*step(2.,d) ), col, onRect(uv, vec2(32.,23),vec2(63.,39.) ) );
	}
	else if( material == 2 ) { // wall TEKGREN2 & TEKGREN5
		uv = mod(uv, vec2(128.,128)); vec2 uv64 = mod(uv, vec2(64.,65.) ); vec2 uv24 = mod(uv64, vec2(64.,24.) );
		float h = huv*huvx;
		col = mix( vec3(114./255.), vec3(98./255.), sat(2.*h) );
		col = mix( col, mix( COL(111.,114.,87.), COL(90.,98.,69.), sat(2.*h) ), sat( 100.*(hash(uv+vec2(523.,53.))*hash(150.-uv.x)-0.15)) );	
		col = addKnobAA( mod( uv24, vec2(3.,32.) ), vec2(0.,4.5), 1.1, 0.4, col );
		col = mix( col, COL(137.,141.,115.), 0.7*sat( onLineX(uv64,1.)+onLineY(uv,1.)+onLineY(uv24,0.)+onLineY(uv24,19.)+onLineY(uv64,59.) ) ); 
		col = mix( col, COL(73.,81.,55.), sat( onLineX(uv64,0.)+onLineX(uv64,62.) ) ); 
		col = mix( col, mix(COL(73.,81.,55.),vec3(38./255.),uv24.y-22.), onBand(uv24.y,22.,23.) ); 
		col = mix( col, mix(COL(73.,81.,55.),vec3(38./255.),uv64.y-63.), onBand(uv64.y,63.,64.) ); 
		col = mix( col, vec3(38./255.), sat( onLineY(uv,0.)+onLineX(uv64,63.) ) ); 
		col = mix( col, COL(137.,141.,115.), onRect(uv,vec2(3.),vec2(60.,12.)) ); 
		col = mix( col, mix( vec3(1.), COL(255.,253.,110.), sat( abs(uv.x-32.)/20.)-0.25*mod(uv.x,2.)), onRect(uv,vec2(4.),vec2(59.,11.)) ); 
	}	
	else if( material == 3 ) { // wall BRONZE2
		uv = mod(uv, vec2(64.,128)); float s = sin(31.15926*uv.x/64.);
		col = mix( vec3(75./255.), vec3(64./255.), huv );
		col = mix( col, COL(106.,86.,51.),  sat( 5.*(huv+(s+1.2)*(1.-(uv.y+44.)/64.))) * onBand(uv.y, 0., 30. ) );
		col = mix( col, COL(123.,105.,85.), sat( 2.*(0.5*huvx+huv+(s+1.7)*(1.-(uv.y+44.)/64.)-0.5) ) * onBand(uv.y, 0., 30. ) );
		col = mix( col, COL(106.,86.,51.),  sat( 5.*(huv+(s+0.7)*(1.-(uv.y+14.)/64.))) * onBand(uv.y, 30., 98. ) );
		col = mix( col, COL(123.,105.,85.), sat( 2.*(1.1*huvx+(s+1.7)*(1.-(uv.y+14.)/64.)-0.5) ) * onBand(uv.y, 30., 98. ) );
		col = mix( col, COL(7.,59.,20.), sat( huv*uv.y/96.-0.5) );
		col = mix( col, COL(106.,86.,51.),  sat( 5.*(huv+(s+1.2)*(1.-(uv.y-40.)/64.))) * onBand(uv.y, 98., 128. ) );
		col = mix( col, COL(123.,105.,85.), sat( 2.*(huvx+(s+1.7)*(1.-(uv.y-40.)/64.)-0.5) ) * onBand(uv.y, 98., 128. ) );	
		col = mix( col, mix(COL(110.,89.,70.),COL(130.,112.,92.),sat((uv.y-3.)/18.)), onRectAA(mod(uv,vec2(16.,128.)),vec2(6.5,1.5),vec2(12.5,21.5)) );
		col = addBevel( mod(uv,vec2(16.,128.)),vec2(5.5,-2.5),vec2(12.5,21.5), 2.3, 1., 0.1, 0.7, col );
		col = mix( col, addBevel( abs(mod(uv+vec2(0.,-85.),vec2(64.))-vec2(32.,0.)), vec2(15.5,0.5), vec2(34.5,52.5), 1.2, 1., 0.5, -0.7, col ), onBand(uv.y, 30.,97.));
		col = mix( col, 0.7*col, sat( onLineY(uv,127.)+onLineX(uv,0.)+onBand(uv.y, 97.,98.)+onBand(uv.y, 29.,30.)) );
		col = mix( col, 1.2*col, sat( onBand(uv.y, 98.,99.)+onBand(uv.y, 0.,1.)+onLineX(uv, 63.)) );
		col = mix( col, 0.75*col*uv.x, onBand(uv.x, 0., 1.)*onBand(uv.y, 30.,97.) );
		col *= 1.0-0.1*huv;
	}	
	else if( material == 4 ) { // wall STEP2
		uv = mod(uv, vec2(64.,16.));
		col = mix( COL(182.,133.,93.), COL(132.,98.,66.), sat(huv-0.5) );
		col = mix( col, COL(129.,111.,79.), sat(1.-(uv.y-4.)/8.) );
		col = mix( col, COL(102.,82.,50.), sat((huv+1.)*onRectAA(mod(uv,vec2(32.,16.)), vec2(1.5,9.7), vec2(29.5,13.5))) );
		col = mix( col, COL(102.,82.,50.), 0.6*sat((huv+1.)*onRectAA(mod(uv,vec2(8.,16.)), vec2(2.5,3.5), vec2(5.5,6.2))) );
		col = mix( col, COL(143.,122.,92.), onLineY(uv,0.) );
		col = mix( col, COL(106.,86.,61.), onLineY(uv,2.) );
		col *= 1.-0.2*onLineY(uv,3.);
	}
	else if( material == 5 ) { // wall PIPE4
		uv = mod(uv, vec2(128.,64.)); float huv2 = hash( uv*5312. );
		col = mix( mix(COL(184.,165.,144.),COL(136.,102.,67.),uv.x/128.), 
				   mix(COL(142.,122.,104.),COL(93.,77.,50.),uv.x/128.), sat(huv+huvx) );
		col *= 1.+0.5*sat(hash(uv.y)-0.7);
		col *= 1.-0.2*sat(hash(uv.y-1.)-0.7);
		col = mix( col, COL(102.,82.,50.), sat(0.2*huv2+3.*(huvx-0.7)) );
		col = mix( col, COL(165.,122.,85.), (0.75+0.5*huv2)*sat( onBandAA(uv.x,122.5,123.5)+onBandAA(uv.x,117.5,118.5)+onBandAA(uv.x,108.5,109.5) ) );
		col = mix( col, mix(  (1.-sat(0.2*abs(2.8-mod(uv.x,6.))))*mix(COL(175.,126.,89.),COL(143.,107.,71.),0.4*distance( mod(uv,vec2(6.)), vec2 (1.5))), COL(77.,68.,40.), onBandAA(mod(uv.x+1.,6.),0.,1.5)),
								   (0.75+0.5*huv2)*sat( onBandAA(uv.x,6.5,11.5)+onBandAA(uv.x,54.5,59.5)+onBandAA(uv.x,66.5,70.5)+onBandAA(uv.x,72.5,78.5) ) );
		col = mix( col, mix( COL(82.,90.,64.), 1.2*COL(118.,125.,99.), huv*(sat(abs(uv.x-14.)-huv)+sat(abs(uv.x-62.)-huv)) ), onBandAA(uv.x,12.8,13.8) + onBandAA(uv.x,60.8,61.8));
		col = mix( col, vec3(0.), 0.3*(onBandAA(uv.y,18.8,21.8)*onBandAA(uv.x,40.8,52.8) + onBandAA(uv.x,0.1,3.7) + onBandAA(uv.x,41.3,44.2) + onBandAA(uv.x,48.9,51.8)+0.6*onBandAA(uv.x,80.1,81.6)));
		col = mix( col, mix( 1.2*COL(205.,186.,167.), COL(143.,122.,92.), 0.3*(sat(abs(uv.x-2.)+huv)+sat(abs(uv.x-43.)+huv)+sat(abs(uv.x-51.)+huv)) ), onBandAA(uv.x,0.8,2.8) + onBandAA(uv.x,42.1,43.3) + onBandAA(uv.x,49.8,51.2)+0.6*onBandAA(uv.x,80.8,81.5));
		col = mix( col, mix( 1.2*COL(205.,186.,167.), COL(154.,133.,105.), (sat(abs(uv.y-20.5)+huv)) ), onBandAA(uv.y,19.3,21.2)*onBandAA(uv.x,40.8,52.1));
		float d = min( min( min( min( min( min( distance(uv,vec2(6.,39.)), 0.8*distance(uv,vec2(23.,45.)) ), 1.2*distance(uv,vec2(39.,30.)) )
					  , 1.5*distance(uv,vec2(48.,42.)) ), distance(uv,vec2(90.,32.)) ), 0.8*distance(uv,vec2(98.,50.)) ), 1.15*distance(uv,vec2(120.,44.)) );;
		d *= (1.-0.8*(sat(hash(uv.x+uv.y)-0.6)+sat(huvx-0.6)));
		col = mix( col,COL(93.,77.,50.), sat((7.-d)/8.) );
		col = mix( col, vec3(0.), pow(sat((5.-d)/6.),1.5) );
	}
	else if( material == 6 ) { // floor FLOOR_3_3
		uv = mod(uv, vec2(64.));
		col = mix( COL(147.,126.,108.), COL(175.,152.,134.), sat( 1.5*(huv+hash(uv.x-uv.y)-0.95-uv.y/128.)) );
		col = mix( col, COL(175.,152.,134.), sat( 1.5*(huv+hash(uv.x-uv.y*1.1+5.)-1.8+uv.y/64.)) );
		col = mix( col, COL(130.,133.,108.), sat( 10.*(huv+hash(uv.x*1.1-uv.y+3.)-1.25)) );
		col = mix( col, mix( COL(118.,125.,99.), COL(130.,133.,108.), 1.-huv), sat(5.*(huv-1.5+uv.y/64.)) );
		col = mix( col, COL(129.,111.,91.), sat( onLineX(uv,0.)+onLineY(uv,63.) ) );
		col *= sat(0.92+huv);		
	} 
	else if( material == 7 ) { // floor FLOOR_0_1
		uv = mod(uv, vec2(64.)); 
		float h = hash(3.*uv.x+uv.y);
		col = mix( COL(136.,114.,95.), COL(143.,122.,104.), sat(4.*h*huv) );
		col = mix( col, COL(129.,111.,91.), sat(h-0.5) );	
		col *= 1.+0.05*sat( 0.3+mod(uv.x,2.)*cos(uv.y*0.2)*huv );
		col = mix( col, COL(175.,126.,89.), sat( 2.*(hash(floor(uv*0.125))+huv-1.5) ) );
		vec3 ncol = mix( col, COL(114.,94.,78.), sat( 
			(0.4*huv+0.4)*onRectAA( mod(uv+vec2(0.,33.),vec2(64.)), vec2(6.5,0.5), vec2(36.5,58.5) )
						 -onRectAA( mod(uv+vec2(0.,33.),vec2(64.)), vec2(9.5,3.5), vec2(33.5,55.5) ) ));
		ncol = mix( ncol, COL(114.,94.,78.), sat( (0.6*huv+0.3)*onRectAA( mod(uv+vec2(0.,5.),vec2(64.)), vec2(33.5,0.5), vec2(59.5,60.5) ) ));
		ncol = mix( ncol, col, sat(               0.8*onRectAA( mod(uv+vec2(0.,5.),vec2(64.)), vec2(35.5,2.5), vec2(57.5,58.5) ) ));
		ncol = mix( ncol, COL(121.,103.,81.), sat( (0.8*huv+0.9)*onRectAA( mod(uv+vec2(0.,53.),vec2(64.)), vec2(18.5,0.5), vec2(41.5,22.5) ) ));
		ncol = mix( ncol, col, sat(               onRectAA( mod(uv+vec2(0.,53.),vec2(64.)), vec2(19.5,1.5), vec2(40.5,21.5) ) ));
		ncol = mix( ncol, COL(114.,94.,78. ), sat( (0.8*huv+0.6)*onRectAA( mod(uv+vec2(8.,46.),vec2(64.)), vec2(0.5,0.5), vec2(20.5,36.5) ) ));
		col  = mix( ncol, col, sat(               onRectAA( mod(uv+vec2(8.,46.),vec2(64.)), vec2(1.5,1.5), vec2(19.5,35.5) ) ));
	} else  {
		col = vec3(0.5);
	}
}

//----------------------------------------------------------------------
// Render MAP functions

struct lineDef { vec2 a, b; float h; float l; int m; };

vec3 castRay( const vec3 ro, const vec3 rd ) {
	lineDef ldfs[14];
	ldfs[0]  = lineDef(vec2(192.,-448.), vec2(320.,-320.), 264., 128., 5 );
	ldfs[1]  = lineDef(vec2(320.,-320.), vec2(256.,0.),    264., 128., 5 );
	ldfs[2]  = lineDef(vec2(256.,0.),    vec2(64.,0.),     264., 128., 5 );
	ldfs[4]  = lineDef(vec2(64.,0.),     vec2(0.,0.),       56., 208., 4 );
	ldfs[3]  = lineDef(vec2(0.,448.),    vec2(320.,448.),  128., 224., 2 );
	ldfs[5]  = lineDef(vec2(64.,0.),     vec2(-64.,0.),   -128., 208., 5 );
	ldfs[6]  = lineDef(vec2(192.,-320.), vec2(128.,-320.), 264., 128., 3 );
	ldfs[7]  = lineDef(vec2(128.,-320.), vec2(128.,-256.), 264., 128., 3 );
	ldfs[8]  = lineDef(vec2(192.,0.),    vec2(0.,-320.),    16., 144., 4 );
	ldfs[9]  = lineDef(vec2(160.,0.),    vec2(0.,-256.),    24., 160., 4 );
	ldfs[10] = lineDef(vec2(128.,0.),    vec2(0.,-192.),    32., 176., 4 );
	ldfs[11] = lineDef(vec2(96.,0.),     vec2(0.,-128.),    40., 192., 4 );
	ldfs[12] = lineDef(vec2(64.,0.),     vec2(0.,-64.),     48., 208., 4 );
	ldfs[13] = lineDef(vec2(64.,0.),     vec2(64.,320.),   128., 224., 2 );
	
	float dist = 999999., curdist; vec2 uv, curuv;
	vec3 col = vec3( 0. ); float lightning = 128.; int mat = 0;

	// check walls
	for( int i=0; i<14; i++ ) {
		vec2 a = ldfs[i].a, b = ldfs[i].b; float h=ldfs[i].h; 		
		if( intersectWall(ro, rd, a, b, h, dist, uv) || 
			intersectWall(ro, rd, b*vec2(-1.,1.), a*vec2(-1.,1.), h, dist, uv) ) {
			mat = ldfs[i].m;
			lightning = ldfs[i].l * (1.-0.2*abs( normalize( (a-b).yx ).y ));
		}
	}
	if( mat == 5 ) { // fix large texture on wall above portal
		vec3 intersection = ro + rd*dist;
		if( intersection.z > -0.1 ) {
			uv = -intersection.xy+vec2(64.,0.);
			lightning = 0.8*max(128., min(208., 248.-20.*floor(abs(intersection.x)/32.)));
		}
		uv *= 0.5;
	}
	
	// check floor and ceiling
	if( intersectFloor(ro, rd, 264., dist, uv ) ) {
		mat = 1;
		lightning =128.;
		float c1=320., c2=196.;
		for( int i=4; i>=0; i-- ) {
			if( abs(uv.x)*(c1/c2)-uv.y < c1 ) {
				lightning = float(208-i*16);
			}
			c1-=64.; c2-=32.;
		}
	}
	if( intersectFloor(ro, rd, 8., dist, uv ) ) {
		mat = 7;
		lightning =128.;
	}		
	float c1=64., c2=64., c3=48.;
	for( int i=0; i<5; i++ ) {
		curdist = dist;
		if( intersectFloor(ro, rd, c3, curdist, curuv ) && abs(curuv.x)*(c1/c2)-curuv.y < c1 ) {
			uv = curuv;
			mat = 7;
			dist = curdist;
			lightning = float(208-i*16);
		}
		c3-=8.; c1+=64.; c2+=32.;
	}
	// and hall	
	curdist = dist;
	if( (intersectFloor(ro, rd, 56., curdist, curuv ) || intersectFloor(ro, rd, 128., curdist, curuv ) ) && curuv.y > 0. ) {
		dist = curdist;
		uv = curuv;
		mat = rd.y>0.?0:6;
		lightning = 224.;
	}
	
	getMaterialColor( mat, uv, col );
		
	col *= 0.3*pow(2.*lightning/255., 2.5)*sat( 1.-curdist/2000. );	
	// fake 8-bit pallete
	col = floor((col)*64.+vec3(0.5))/64.;
	return col;
}

//----------------------------------------------------------------------
// Camera path

float getPathHeight( const float z, const float t ) {
	return max( 0.+step(0.,z)*56.+step(z,-448.)*56.+
		mix(56.,8.,(448.+z)/32.)*step(-448.,z)*step(z,-416.)+
		mix(8.,56.,(320.+z)/320.)*step(z,0.)*step(-320.,z), 8.) + 56.;
}
vec2 path( const float t ) {
	return vec2(32.*sin(t*0.21), -200.-249.*cos( max(0.,mod(t,30.)-10.)*(3.1415936/10.) ) );
}


//----------------------------------------------------------------------
// Main

void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
	vec2 q = fragCoord.xy/iResolution.xy;
	vec2 p = -1.0 + 2.0*q;
    p.x *= iResolution.x/ iResolution.y;

	vec3 ro; ro.xz = path(time); 
	vec3 ta; ta.xz = path(time+0.1) + vec2(0.,20.);
	ta.y = ro.y = getPathHeight(ro.z, time);
	
    vec3 rdcenter =  rotate( normalize(ta - ro), 0.5*cos(time*0.5) );
    vec3 uu = normalize(cross( vec3(0.,1.,0.), rdcenter ));
    vec3 vv = normalize(cross(rdcenter,uu));
    vec3 rd = normalize( p.x*uu + p.y*vv + 1.25*rdcenter );
	
	vec3 col = castRay( ro, rd );
		
	fragColor = vec4( col, 1.0 );
}`,name:`Image`,description:``,type:`image`}]},{ver:`0.1`,info:{id:`MsB3WR`,date:`1385938213`,viewed:37024,name:`Misty Lake`,description:`A misty lake in the morning. Cloud and noise functions by Inigo Quilez.

You can use your mouse to look around.`,likes:311,published:`Public API`,usePreview:0,tags:[`raymarching`,`reflection`,`clouds`,`refraction`,`water`,`fog`,`mountains`,`lake`]},renderpass:[{inputs:[{id:`4sfGRn`,filepath:`/media/a/fb918796edc3d2221218db0811e240e72e340350008338b0c07a52bd353666a6.jpg`,type:`texture`,channel:2,sampler:{filter:`mipmap`,wrap:`repeat`,vflip:`false`,srgb:`false`,internal:`byte`},published:1},{id:`XdX3Rn`,filepath:`/media/a/52d2a8f514c4fd2d9866587f4d7b2a5bfa1a11a0e772077d7682deb8b3b517e5.jpg`,type:`texture`,channel:1,sampler:{filter:`mipmap`,wrap:`repeat`,vflip:`false`,srgb:`false`,internal:`byte`},published:1},{id:`Xsf3zn`,filepath:`/media/a/f735bee5b64ef98879dc618b016ecf7939a5756040c2cde21ccb15e69a6e1cfb.png`,type:`texture`,channel:0,sampler:{filter:`mipmap`,wrap:`repeat`,vflip:`false`,srgb:`false`,internal:`byte`},published:1}],outputs:[{id:`4dfGRr`,channel:0}],code:`// Misty Lake. Created by Reinder Nijhoff 2013
// Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License.
// @reindernijhoff
//
// https://www.shadertoy.com/view/MsB3WR
//

#define BUMPFACTOR 0.1
#define EPSILON 0.1
#define BUMPDISTANCE 60.

#define time (iTime+285.)

// Noise functions by inigo quilez 

float noise( const in vec2 x ) {
    vec2 p = floor(x);
    vec2 f = fract(x);
	f = f*f*(3.0-2.0*f);
	
	vec2 uv = (p.xy) + f.xy;
	return textureLod( iChannel0, (uv+ 0.5)/256.0, 0.0 ).x;
}

float noise( const in vec3 x ) {
    vec3 p = floor(x);
    vec3 f = fract(x);
	f = f*f*(3.0-2.0*f);
	
	vec2 uv = (p.xy+vec2(37.0,17.0)*p.z) + f.xy;
	vec2 rg = textureLod( iChannel0, (uv+ 0.5)/256.0, 0.0 ).yx;
	return mix( rg.x, rg.y, f.z );
}

mat2 rot(const in float a) {
	return mat2(cos(a),sin(a),-sin(a),cos(a));	
}

const mat2 m2 = mat2( 0.60, -0.80, 0.80, 0.60 );

const mat3 m3 = mat3( 0.00,  0.80,  0.60,
                     -0.80,  0.36, -0.48,
                     -0.60, -0.48,  0.64 );

float fbm( in vec3 p ) {
    float f = 0.0;
    f += 0.5000*noise( p ); p = m3*p*2.02;
    f += 0.2500*noise( p ); p = m3*p*2.03;
    f += 0.1250*noise( p ); p = m3*p*2.01;
    f += 0.0625*noise( p );
    return f/0.9375;
}

float hash( in float n ) {
    return fract(sin(n)*43758.5453);
}

// intersection functions

bool intersectPlane(const in vec3 ro, const in vec3 rd, const in float height, inout float dist) {	
	if (rd.y==0.0) {
		return false;
	}
		
	float d = -(ro.y - height)/rd.y;
	d = min(100000.0, d);
	if( d > 0. && d < dist ) {
		dist = d;
		return true;
    } else {
		return false;
	}
}

// light direction

vec3 lig = normalize(vec3( 0.3,0.5, 0.6));

vec3 bgColor( const in vec3 rd ) {
	float sun = clamp( dot(lig,rd), 0.0, 1.0 );
	vec3 col = vec3(0.5, 0.52, 0.55) - rd.y*0.2*vec3(1.0,0.8,1.0) + 0.15*0.75;
	col += vec3(1.0,.6,0.1)*pow( sun, 8.0 );
	col *= 0.95;
	return col;
}

// coulds functions by inigo quilez

#define CLOUDSCALE (500./(64.*0.03))

float cloudMap( const in vec3 p, const in float ani ) {
	vec3 r = p/CLOUDSCALE;

	float den = -1.8+cos(r.y*5.-4.3);
		
	float f;
	vec3 q = 2.5*r*vec3(0.75,1.0,0.75)  + vec3(1.0,2.0,1.0)*ani*0.15;
    f  = 0.50000*noise( q ); q = q*2.02 - vec3(-1.0,1.0,-1.0)*ani*0.15;
    f += 0.25000*noise( q ); q = q*2.03 + vec3(1.0,-1.0,1.0)*ani*0.15;
    f += 0.12500*noise( q ); q = q*2.01 - vec3(1.0,1.0,-1.0)*ani*0.15;
    f += 0.06250*noise( q ); q = q*2.02 + vec3(1.0,1.0,1.0)*ani*0.15;
    f += 0.03125*noise( q );
	
	return 0.065*clamp( den + 4.4*f, 0.0, 1.0 );
}

vec3 raymarchClouds( const in vec3 ro, const in vec3 rd, const in vec3 bgc, const in vec3 fgc, const in float startdist, const in float maxdist, const in float ani ) {
    // dithering	
	float t = startdist+CLOUDSCALE*0.02*hash(rd.x+35.6987221*rd.y+time);//0.1*texture( iChannel0, fragCoord.xy/iChannelResolution[0].x ).x;
	
    // raymarch	
	vec4 sum = vec4( 0.0 );
	for( int i=0; i<64; i++ ) {
		if( sum.a > 0.99 || t > maxdist ) continue;
		
		vec3 pos = ro + t*rd;
		float a = cloudMap( pos, ani );

        // lighting	
		float dif = clamp(0.1 + 0.8*(a - cloudMap( pos + lig*0.15*CLOUDSCALE, ani )), 0., 0.5);
		vec4 col = vec4( (1.+dif)*fgc, a );
		// fog		
	//	col.xyz = mix( col.xyz, fgc, 1.0-exp(-0.0000005*t*t) );
		
		col.rgb *= col.a;
		sum = sum + col*(1.0 - sum.a);	

        // advance ray with LOD
		t += (0.03*CLOUDSCALE)+t*0.012;
	}

    // blend with background	
	sum.xyz = mix( bgc, sum.xyz/(sum.w+0.0001), sum.w );
	
	return clamp( sum.xyz, 0.0, 1.0 );
}

// terrain functions
float terrainMap( const in vec3 p ) {
	return (textureLod( iChannel1, (-p.zx*m2)*0.000046, 0. ).x*600.) * smoothstep( 820., 1000., length(p.xz) ) - 2. + noise(p.xz*0.5)*15.;
}

vec3 raymarchTerrain( const in vec3 ro, const in vec3 rd, const in vec3 bgc, const in float startdist, inout float dist ) {
	float t = startdist;

    // raymarch	
	vec4 sum = vec4( 0.0 );
	bool hit = false;
	vec3 col = bgc;
	
	for( int i=0; i<80; i++ ) {
		if( hit ) break;
		
		t += 8. + t/300.;
		vec3 pos = ro + t*rd;
		
		if( pos.y < terrainMap(pos) ) {
			hit = true;
		}		
	}
	if( hit ) {
		// binary search for hit		
		float dt = 4.+t/400.;
		t -= dt;
		
		vec3 pos = ro + t*rd;	
		t += (0.5 - step( pos.y , terrainMap(pos) )) * dt;		
		for( int j=0; j<2; j++ ) {
			pos = ro + t*rd;
			dt *= 0.5;
			t += (0.5 - step( pos.y , terrainMap(pos) )) * dt;
		}
		pos = ro + t*rd;
		
		vec3 dx = vec3( 100.*EPSILON, 0., 0. );
		vec3 dz = vec3( 0., 0., 100.*EPSILON );
		
		vec3 normal = vec3( 0., 0., 0. );
		normal.x = (terrainMap(pos + dx) - terrainMap(pos-dx) ) / (200. * EPSILON);
		normal.z = (terrainMap(pos + dz) - terrainMap(pos-dz) ) / (200. * EPSILON);
		normal.y = 1.;
		normal = normalize( normal );		

		col = vec3(0.2) + 0.7*texture( iChannel2, pos.xz * 0.01 ).xyz * 
				   vec3(1.,.9,0.6);
		
		float veg = 0.3*fbm(pos*0.2)+normal.y;
					
		if( veg > 0.75 ) {
			col = vec3( 0.45, 0.6, 0.3 )*(0.5+0.5*fbm(pos*0.5))*0.6;
		} else 
		if( veg > 0.66 ) {
			col = col*0.6+vec3( 0.4, 0.5, 0.3 )*(0.5+0.5*fbm(pos*0.25))*0.3;
		}
		col *= vec3(0.5, 0.52, 0.65)*vec3(1.,.9,0.8);
		
		vec3 brdf = col;
		
		float diff = clamp( dot( normal, -lig ), 0., 1.);
		
		col = brdf*diff*vec3(1.0,.6,0.1);
		col += brdf*clamp( dot( normal, lig ), 0., 1.)*vec3(0.8,.6,0.5)*0.8;
		col += brdf*clamp( dot( normal, vec3(0.,1.,0.) ), 0., 1.)*vec3(0.8,.8,1.)*0.2;
		
		dist = t;
		t -= pos.y*3.5;
		col = mix( col, bgc, 1.0-exp(-0.0000005*t*t) );
		
	}
	return col;
}

float waterMap( vec2 pos ) {
	vec2 posm = pos * m2;
	
	return abs( fbm( vec3( 8.*posm, time ))-0.5 )* 0.1;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
	vec2 q = fragCoord.xy / iResolution.xy;
    vec2 p = -1.0 + 2.0*q;
    p.x *= iResolution.x/ iResolution.y;
	
	// camera parameters
	vec3 ro = vec3(0.0, 0.5, 0.0);
	vec3 ta = vec3(0.0, 0.45,1.0);
	if (iMouse.z>=1.) {
		ta.xz *= rot( (iMouse.x/iResolution.x-.5)*7. );
	}
		
	ta.xz *= rot( mod(iTime * 0.05, 6.2831852) );
    
	// build ray
    vec3 ww = normalize( ta - ro);
    vec3 uu = normalize(cross( vec3(0.0,1.0,0.0), ww ));
    vec3 vv = normalize(cross(ww,uu));
    vec3 rd = normalize( p.x*uu + p.y*vv + 2.5*ww );

	float fresnel, refldist = 5000., maxdist = 5000.;
	bool reflected = false;
	vec3 normal, col = bgColor( rd );
	vec3 roo = ro, rdo = rd, bgc = col;
	
	if( intersectPlane( ro, rd, 0., refldist ) && refldist < 200. ) {
		ro += refldist*rd;	
		vec2 coord = ro.xz;
		float bumpfactor = BUMPFACTOR * (1. - smoothstep( 0., BUMPDISTANCE, refldist) );
				
		vec2 dx = vec2( EPSILON, 0. );
		vec2 dz = vec2( 0., EPSILON );
		
		normal = vec3( 0., 1., 0. );
		normal.x = -bumpfactor * (waterMap(coord + dx) - waterMap(coord-dx) ) / (2. * EPSILON);
		normal.z = -bumpfactor * (waterMap(coord + dz) - waterMap(coord-dz) ) / (2. * EPSILON);
		normal = normalize( normal );		
		
		float ndotr = dot(normal,rd);
		fresnel = pow(1.0-abs(ndotr),5.);

		rd = reflect( rd, normal);

		reflected = true;
		bgc = col = bgColor( rd );
	}

	col = raymarchTerrain( ro, rd, col, reflected?(800.-refldist):800., maxdist );
    col = raymarchClouds( ro, rd, col, bgc, reflected?max(0.,min(150.,(150.-refldist))):150., maxdist, time*0.05 );
	
	if( reflected ) {
		col = mix( col.xyz, bgc, 1.0-exp(-0.0000005*refldist*refldist) );
		col *= fresnel*0.9;		
		vec3 refr = refract( rdo, normal, 1./1.3330 );
		intersectPlane( ro, refr, -2., refldist );
		col += mix( texture( iChannel2, (roo+refldist*refr).xz*1.3 ).xyz * 
				   vec3(1.,.9,0.6), vec3(1.,.9,0.8)*0.5, clamp( refldist / 3., 0., 1.) ) 
			   * (1.-fresnel)*0.125;
	}
	
	col = pow( col, vec3(0.7) );
	
	// contrast, saturation and vignetting	
	col = col*col*(3.0-2.0*col);
    col = mix( col, vec3(dot(col,vec3(0.33))), -0.5 );
 	col *= 0.25 + 0.75*pow( 16.0*q.x*q.y*(1.0-q.x)*(1.0-q.y), 0.1 );
	
    fragColor = vec4( col, 1.0 );
}
`,name:`Image`,description:``,type:`image`}]},{ver:`0.1`,info:{id:`XsSSRW`,date:`1409422111`,viewed:19975,name:`Abandoned base`,description:`My entry to the in-official, nonexistent st mine compo :) If you like shiny things, define 'GOLD' at line 3. Use your mouse to look around.`,likes:203,published:`Public API`,usePreview:0,tags:[`raymarching`,`distancefield`,`tunnel`,`water`,`reflections`]},renderpass:[{inputs:[{id:`4sXGRn`,filepath:`/media/a/95b90082f799f48677b4f206d856ad572f1d178c676269eac6347631d4447258.jpg`,type:`texture`,channel:0,sampler:{filter:`mipmap`,wrap:`repeat`,vflip:`false`,srgb:`false`,internal:`byte`},published:1}],outputs:[{id:`4dfGRr`,channel:0}],code:`// Abandoned base. Created by Reinder Nijhoff 2014
// Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License.
// @reindernijhoff
//
// https://www.shadertoy.com/view/XsSSRW
//

// #define GOLD
#define BUMPMAP
#define MARCHSTEPS 128
#define MARCHSTEPSREFLECTION 64
#define SPHERE

//----------------------------------------------------------------------
const vec2 dropPosition = vec2(1.05,2.1);
const vec3 backgroundColor = vec3(0.9,0.5,0.2);
#define time iTime
#define stime2 sin(time*2.)
#define ctime2 cos(time*2.)

//----------------------------------------------------------------------
// noises

float hash( float n ) {
    return fract(sin(n)*43758.5453123);
}

float noise( in vec2 x ) {
    vec2 p = floor(x);
    vec2 f = fract(x);
    f = f*f*(3.0-2.0*f);
    float n = p.x + p.y*157.0;
    return mix(mix( hash(n+  0.0), hash(n+  1.0),f.x),
               mix( hash(n+157.0), hash(n+158.0),f.x),f.y);
}

const mat2 m2 = mat2( 0.80, -0.60, 0.60, 0.80 );

float fbm( vec2 p ) {
    float f = 0.0;
    f += 0.5000*noise( p ); p = m2*p*2.02;
    f += 0.2500*noise( p ); p = m2*p*2.03;
    f += 0.1250*noise( p ); p = m2*p*2.01;
    f += 0.0625*noise( p );
    
    return f/0.9375;
}

mat2 rot(const in float a) {
	return mat2(cos(a),sin(a),-sin(a),cos(a));	
}

//----------------------------------------------------------------------
// distance primitives

float sdBox( in vec3 p, in vec3 b ) {
    vec3 d = abs(p) - b;
    return min(max(d.x,max(d.y,d.z)),0.0) + length(max(d,0.0));
}

float sdSphere( in vec3 p, in float s ) {
    return length(p)-s;
}

float sdCylinder( in vec3 p, in vec2 h ) {
    vec2 d = abs(vec2(length(p.xz),p.y)) - h;
    return min(max(d.x,d.y),0.0) + length(max(d,0.0));
}

float sdPipe( in vec3 p, in vec3 h ) {
    return length(h.xy-p.xy) - h.z;
}

float sdPPipe( in vec3 p, in vec3 h ) {
    return length(h.xy-p.xy) - h.z - 0.02*(max(sin(p.z*20.)-0.8,0.));
}

//----------------------------------------------------------------------
// distance operators

float opU( float d2, float d1 ) { return min( d1,d2); }
float opS( float d2, float d1 ) { return max(-d1,d2); }
vec2  opU( vec2  d2, vec2  d1 ) { return mix(d1,d2,step(d2.x,d1.x)); }//( d2.x<d1.x)? d2:d1; }
vec2  opS( vec2  d2, vec2  d1 ) { return mix(-d1,d2,step(-d1.x,d2.x)); }//(-d1.x>d2.x)?-d1:d2; }

//----------------------------------------------------------------------
// Map functions

#ifdef SPHERE
vec3 sP;
#endif

float xoffset( float z) { 
    return 2.1*sin(z*0.1);
}

vec2 getSectorId( float z ) {
    float id = floor( (z+6.)/12.);
    return vec2( id, hash(id) );
}

float map( vec3 p ) {
    float zorig = p.z;
    p = vec3( p.x+xoffset(p.z), p.y-2., mod( p.z + 6., 12. ) - 6.);
    
    float x = p.x*2., y = p.y-0.8, z = p.z;
    float d =  -sdBox( vec3((x+y)*0.7071, (y-x)*0.7071, z), vec3(3.8,3.8,20.) );

	d = opS( d, sdBox( p, vec3( 2.5, 2., 5.75 ) )  ); 
    d = opU( d, sdPPipe( vec3(abs(p.x),p.y,p.z), vec3( 2.2, -1.7, 0.25 ) ) );
    d = opU( d, sdPipe( vec3(p.x,abs(p.y-0.2),p.z), vec3( 2.4, 1.5, 0.1 ) ) ); 
    d = opU( d, sdPipe( vec3(p.x,p.y+0.6*cos(p.z*3.1415926/12.),p.z), vec3( -2.4, 1.8, 0.12 ) ) );
    
    d = opU( d, 2.2-p.y );
    float l = distance( p.xz, dropPosition );
	p.y += 0.003*sin(40.*l-6.*time)*exp(-4.*l);
    
    d = opU( d, p.y+2.03 );  
    d = opU( d,  sdSphere( vec3( p.x, p.y-2.3, p.z*0.3), 0.2) );
    
    if( getSectorId(zorig).y > 0.75 ) {
        d = opS( d,  sdCylinder( vec3(p.x, p.y-9., p.z), vec2(1.5,10.) ) );

        vec3 pr = vec3( stime2*p.x+ctime2*p.z, p.y-2.4, stime2*p.z-ctime2*p.x);
        d = opU( d, sdBox( pr, vec3(3.0,0.1,0.1) ) );
        d = opU( d, sdBox( pr, vec3(0.1,0.1,3.0) ) );
    } 
#ifdef SPHERE
    d = opU( d,  sdSphere( vec3( p.x, p.y, zorig)-sP, 0.2) );
#endif    
	return d;
}

float mapMaterial( vec3 p ) {
    float zorig = p.z;
    p = vec3( p.x+xoffset(p.z), p.y-2., mod( p.z + 6., 12. ) - 6.);
    
    float x = p.x*2., y = p.y-0.8, z = p.z;
    vec2 d = vec2( -sdBox( vec3((x+y)*0.7071, (y-x)*0.7071, z), vec3(3.8,3.8,20.) ), 5.);

	d = opS( d, vec2( sdBox( p, vec3( 2.5, 2., 5.75 ) ), 3. ) );
    d = opU( d, vec2( sdPPipe( vec3(abs(p.x),p.y,p.z), vec3( 2.2, -1.7, 0.25 ) ), 1. ) );    
    d = opU( d, vec2( sdPipe( vec3(p.x,abs(p.y-0.2),p.z), vec3( 2.4, 1.5, 0.1 ) ), 4. ) );
    d = opU( d, vec2( sdPipe( vec3(p.x,p.y+0.6*cos(p.z*3.1415926/12.),p.z), vec3( -2.4, 1.8, 0.12 ) ), 4. ) );
    

    d = opU( d, vec2( 2.2-p.y, 5. ) );
    d = opU( d, vec2( p.y+2.03, 2. ) );  
    d = opU( d, vec2( sdSphere( vec3( p.x, p.y-2.3, p.z*0.3), 0.2), 6.) );
    
    if( getSectorId(zorig).y > 0.75 ) {
        d = opS( d, vec2( sdCylinder( vec3(p.x, p.y-4., p.z), vec2(1.5,2.) ), 5.) );

        vec3 pr = vec3( stime2*p.x+ctime2*p.z, p.y-2.4, stime2*p.z-ctime2*p.x);
        d = opU( d, vec2( sdBox( pr, vec3(3.0,0.1,0.1) ), 4.) );
        d = opU( d, vec2( sdBox( pr, vec3(0.1,0.1,3.0) ), 4.) );
    } 
    
#ifdef SPHERE
    d = opU( d,  vec2( sdSphere( vec3( p.x, p.y, zorig)-sP, 0.2), 7.) );
#endif
    
	return abs(d.y);
}

//----------------------------------------------------------------------

vec3 calcNormal( in vec3 pos ) {
    const vec2 e = vec2(1.0,-1.0)*0.005;

    vec3 n = normalize( e.xyy*map( pos + e.xyy ) + 
					    e.yyx*map( pos + e.yyx )   + 
					    e.yxy*map( pos + e.yxy )   + 
					    e.xxx*map( pos + e.xxx )   );  
    
#ifdef BUMPMAP
    vec3 p = pos * 20.;
    if( abs(pos.x+xoffset(pos.z))>2.48 )n = normalize( n + 0.1*vec3(0.,fbm(p.yz)-0.5,fbm(p.zy)-0.5));
#endif
    
    return n;
}

vec3 int1, int2;

float intersect( in vec3 ro, in vec3 rd ) {
	const float maxd = 60.0;
	const float precis = 0.001;
    float h = precis*2.0;
    float t = 0.;
    int1.z = -1.;
    
	for( int i=0; i < MARCHSTEPS; i++ ) {
        if( h < precis ) {
            int1 = ro+rd*t;
            break;
        } 
        h = map( ro+rd*t );
        t += h;
    }
    if( int1.z < 0. ) return -1.;

    ro = ro + rd*t;
    vec3 nor = calcNormal(ro);           
    rd = reflect( rd, nor );
    ro += 0.1 * nor;
    t = 0.0;
    h = precis*2.0;
    
    for( int i=0; i < MARCHSTEPSREFLECTION; i++ ) {
        if( h < precis ) {
            int2 = ro+rd*t;
            return 1.;
        }   
        h = map( ro+rd*t );
        t += h;
    }

    return 0.;
}

float softshadow( in vec3 ro, in vec3 rd, in float mint, in float maxt, in float k ) {
	float res = 1.0;
    float t = mint;
    for( int i=0; i<16; i++ ) {
		if( t>maxt ) break;
        float h = map( ro + rd*t );
        res = min( res, k*h/t );
        t += 0.03 + h;
    }
    return clamp( res, 0.0, 1.0 );

}

float calcOcc( in vec3 pos, in vec3 nor ) {
	float totao = 0.0;
    float sca = 1.0;
    for( int i=0; i<5; i++ )
    {
        float h = 0.02 + float(i)/4.0;
        float d = map( pos + h*nor );
        totao += clamp(h-d,0.0,1.0)*sca;
        sca *= 0.4;
    }
    return clamp( 1.0 - 2.0*totao, 0.0, 1.0 );
}


//----------------------------------------------------------------------
// shade

vec4 texcube( sampler2D sam, in vec3 p, in vec3 n )
{
	vec4 x = texture( sam, p.yz );
	vec4 y = texture( sam, p.zx );
	vec4 z = texture( sam, p.xy );
	return x*abs(n.x) + y*abs(n.y) + z*abs(n.z);
}

float calcLightning( in vec3 pos, in vec3 light, in vec3 nor, in float maxDist, in bool shadow ) {
    float sh = 1.;
    vec3 lig = ( light-pos );
    float im = length( lig );
	lig /= im;
   	if(shadow) sh = softshadow( pos, lig, 1.02, im, 32.0  );
    sh /= im;
    sh *= clamp(dot(nor,lig),0.,1.);
    return sh * (1.-smoothstep(0.,maxDist,im));
}

vec3 shade( in vec3 ro, in vec3 pos, in bool shadow, in float m, in float r ) {
    vec3 light, col = vec3(0.);
    vec3 nor = calcNormal(pos);
    
	vec2 id = getSectorId(pos.z);

    float occ = calcOcc( pos, nor );
    float dist, sh = 1., xo = xoffset(pos.z);

    float rc = hash(id.x+43.);
    float gc = hash(id.x+153.);
    vec3 lc = normalize(vec3( max(rc,gc), min(rc,gc), 0.1 ) );
    
    if( id.y > 0.75 ) {
    	light = vec3( -xo, 6.5, id*12. );
        light.xz += vec2( hash(id.x+56423.), hash(id.x+124.) ) - 0.5;
        sh =  8.;
        dist = 8.;
    } else {
	    light = vec3( -xo, 3.9, id*12. );
        sh = 3.;
        dist = 5.3;
        if( hash(id.x+234.) < 0.15 ) lc *= 1.-clamp( 10.*(fbm( vec2(time*10., id.x) )-2.5*id.y), 0., 1.);
        if( pos.y > 4. ) sh*=0.5;
    }
    
    sh *=  calcLightning( pos, light, nor, dist, shadow );
    
       
    if( m < 6.5 ) col = texcube( iChannel0, pos*0.5, nor ).xyz;
    if( m == 1. ) col *= 0.05;
    if( m == 4. && pos.y > 2. ) col *= vec3(0.1,0.,0.);
    if( m == 4. && pos.y < 2. ) col *= vec3(0.1,0.4,1.2);
    
    if( m == 5. ) col *= (1.+0.5*fbm(pos.yz*2.))*vec3(0.2,0.1,0.05);
    if( m == 2. ) col *= vec3(0.8,0.6,0.4);
    
    col *= lc * occ * sh;  
    
    if( m == 6. ) col = mix( 0.1*col, col*fbm(pos.xz*10.) + 0.8*lc, 
                           (1.-smoothstep( 4.15, 4.2,pos.y)) *
                           smoothstep( 0.01, 0.04,abs(mod(pos.z+0.15,0.3)-0.15)) *
                           smoothstep( 0.01, 0.02,abs(pos.x+xo)));

    col *= clamp(1.-2.*r, 0.65, 1.);
    
	col = mix(  0.05*backgroundColor, col, exp( -0.04*distance(pos, ro) ) );
  

    return col;
}

//----------------------------------------------------------------------
// main

void mainImage( out vec4 fragColor, in vec2 fragCoord ) {    
    vec2 q = fragCoord.xy / iResolution.xy;
	vec2 p = -1.0 + 2.0*q;
	p.x *= iResolution.x / iResolution.y;
       
    if (q.y < .12 || q.y >= .88) {
		fragColor=vec4(0.,0.,0.,1.);
		return;
	}
    
    // camera
    float o = 0.2*noise(vec2(time,0.));
    float z = 2.*time+o;
    float x = -0.95*xoffset(z);
	vec3 ro = vec3(x,1.7+0.02*sin(time*1.13*2.*3.1415926+o), z-1.);
    vec3 ta = vec3(x,1.7, z+5.);
	
#ifdef SPHERE
	sP = vec3(sin(time), 1.6*cos(time*0.4), ro.z+9.+6.*sin(time*0.15) );
//    ta = mix(ta,sP+vec3(0.,2.,0.),0.2);
#endif
    
    if (iMouse.z>=1.) {
		ta.yz *= rot( -(0.5-iMouse.y/iResolution.y)*0.15 );
		ta.xz *= rot( -(0.5-iMouse.x/iResolution.x)*0.5 );
	}
    
    vec3 ww = normalize( ta - ro );
    vec3 uu = normalize( cross(ww,vec3(0.0,1.0,0.0) ) );
    vec3 vv = normalize( cross(uu,ww));
	vec3 rd = normalize( -p.x*uu + p.y*vv + 2.2*ww );
    
    vec3 col = 0.035*backgroundColor;

    // raymarch
    float ints = intersect(ro ,rd );
    if(  ints > -0.5 ) {
        float m = mapMaterial(int1);        
   
#ifdef GOLD
		float r = .8;
#else        
        float xo = xoffset(int1.z);
    	vec3 p = vec3( int1.x+xo, int1.y-2., mod( int1.z + 6., 12. ) - 6.);
        float l = m == 2.?exp(-2.*distance( p.xz, dropPosition )):0.;
        
        float r = 0.6 * clamp(2.*(fbm( int1.xz )-0.6+l), 0.0125, 1.)*clamp(2.-int1.y, 0., 1.);
        if(m == 1.) r = 0.05+0.3 * fbm( int1.xz * 20. );
         if(m == 7.) r = .8;       
        
        if(abs(int1.x+xo) > 2.49) {
            r = fbm(int1.yz*0.5)*0.4*
            clamp(2.*(fbm( int1.yz*vec2(3.2,24.)+vec2(0.5*time,0.) )-0.5+l), 0.0, 1.)
            *clamp(0.5*int1.y, 0., 1.);
        }
        if(m == 4.) { r = 0.1; }
#endif
        col = shade( ro, int1.xyz, true, m, r );
        
        if( ints > 0.5 ) {
            col += r * shade( int1.xyz, int2.xyz, false, mapMaterial(int2), 0. );
        }
	}
    
    // gamma
	col = pow( clamp(col*2.,0.0,1.0), vec3(0.4545) );
	col *= 1.2*vec3(1.,0.99,0.95);   
	col = clamp(1.06*col-0.03, 0., 1.);   

    fragColor = vec4( col, 1.0 );
}
`,name:`Image`,description:``,type:`image`},{inputs:[{id:`Xsf3zn`,filepath:`/media/a/f735bee5b64ef98879dc618b016ecf7939a5756040c2cde21ccb15e69a6e1cfb.png`,type:`texture`,channel:0,sampler:{filter:`mipmap`,wrap:`repeat`,vflip:`false`,srgb:`false`,internal:`byte`},published:1}],outputs:[{id:`XsfGRr`,channel:0}],code:`//----------------------------------------------------------------------
// noises

float hash( float n ) {
    return fract(sin(n)*43758.5453123);
}

float noise( in vec2 x ) {
    vec2 p = floor(x);
    vec2 f = fract(x);
    f = f*f*(3.0-2.0*f);
    float n = p.x + p.y*157.0;
    return mix(mix( hash(n+  0.0), hash(n+  1.0),f.x),
               mix( hash(n+157.0), hash(n+158.0),f.x),f.y);
}

const mat2 m2 = mat2( 0.80, -0.60, 0.60, 0.80 );

float fbm( vec2 p ) {
    float f = 0.0;
    f += 0.5000*noise( p ); p = m2*p*2.32;
    f += 0.2500*noise( p ); p = m2*p*2.23;
    f += 0.1250*noise( p ); p = m2*p*2.31;
    f += 0.0625*noise( p ); p = m2*p*2.21;
    f += 0.03125*noise( p );
  
    return f;
}

//----------------------------------------------------------------------
// Wind function by Dave Hoskins https://www.shadertoy.com/view/4ssXW2

vec2 Hash( vec2 n)
{
	vec4 p = texture( iChannel0, n*vec2(.78271, .32837), -100.0 );
    return (p.xy + p.zw) * .5; 
}


//--------------------------------------------------------------------------
vec2 Noise( in vec2 x ) {
    vec2 p = floor(x);
    vec2 f = fract(x);
    f = f*f*(3.0-2.0*f);
    vec2 res = mix(mix( Hash(p + 0.0), Hash(p + vec2(1.0, 0.0)),f.x),
                   mix( Hash(p + vec2(0.0, 1.0) ), Hash(p + vec2(1.0, 1.0)),f.x),f.y);
    return res-.5;
}

//--------------------------------------------------------------------------
vec2 FBM( vec2 p ) {
    vec2 f;
	f  = 0.5000	 * Noise(p); p = p * 2.32;
	f += 0.2500  * Noise(p); p = p * 2.23;
	f += 0.1250  * Noise(p); p = p * 2.31;
    f += 0.0625  * Noise(p); p = p * 2.28;
    f += 0.03125 * Noise(p);
    return f;
}

//--------------------------------------------------------------------------
vec2 Wind(float n) {
    vec2 pos = vec2(n * (162.017331), n * (132.066927));
    vec2 vol = Noise(vec2(n*23.131, -n*42.13254))*1.0 + 1.0;
    
    vec2 noise = vec2(FBM(pos*33.313))* vol.x *.5 + vec2(FBM(pos*4.519)) * vol.y;
    
	return noise;
}

//----------------------------------------------------------------------

vec2 getSectorId( float z ) {
    float id = floor( (z+6.)/12.);
    return vec2( id, hash(id) );
}

float soundLampExist(in float z) {
    vec2 id = getSectorId(z);
    if( hash(id.x+234.) < 0.15 && id.y < 0.75) return 1.;
	return 0.;
}

float soundCeilExist(in float z) { 
    vec2 id = getSectorId(z);
    if( id.y < 0.75) return 0.;
	return 1.;
}

vec2 soundLamp(in float t) {
    float l = 1. - clamp(2.*fbm( vec2(t*10., 2.) ), 0., 1.);
	return 0.1*vec2( hash(t*0.001), hash(t*0.001+0.1) ) * l;
}

vec2 soundCeil(in float t) {
	return (Wind(t*0.025) + Wind(t*4.)*0.15) * (0.75+0.2*sin(t*8.));
}

vec2 soundStep(in float t) {
    float o = 0.2*noise(vec2(t,0.));
    float i = fract(t*1.23+o);
    
    return Wind(t*0.025) * clamp(i*10.,0.,1.) * clamp(1.-i*6., 0., 1.);
}

vec2 getSound(in vec2 sl, in vec2 sc, in float z) {
    return 0.9*soundLampExist(z)*sl + 0.2*soundCeilExist(z)*sc;
}

vec2 mixSounds(in float t, in float z) {
    float zm = floor( (z+6.)/12. ) * 12.;
    
    vec2 sound = vec2(0.);
    vec2 sl = soundLamp(t);
    vec2 sc = soundCeil(t);
    
    sound += getSound(sl, sc, zm-24.) * pow( mix(1., 0., clamp( abs(zm-24. - z)/24., 0., 1. ) ), 2.);
    sound += getSound(sl, sc, zm+24.) * pow( mix(1., 0., clamp( abs(zm+24. - z)/24., 0., 1. ) ), 2.);
    sound += getSound(sl, sc, zm-12.) * pow( mix(1., 0., clamp( abs(zm-12. - z)/24., 0., 1. ) ), 2.);
    sound += getSound(sl, sc, zm+12.) * pow( mix(1., 0., clamp( abs(zm+12. - z)/24., 0., 1. ) ), 2.);
    sound += getSound(sl, sc, zm)     * pow( mix(1., 0., clamp( abs(zm - z)/24., 0., 1. ) ), 2.);
    
    return sound + soundStep(t);    
}

vec2 getSounds(in float t, in float z) {
    vec2 m2 = mixSounds(t, z); 
    
    return 6.*m2;
}

vec2 mainSound( in int samp,float time) {
    float z = time*2.;
	return getSounds(time, z);
}`,name:`Sound`,description:``,type:`sound`}]},{ver:`0.1`,info:{id:`MdjXDV`,date:`1416338272`,viewed:2260,name:`Folding`,description:`I was hoping that 'folding' the input domain of the distance function would lead to some elegant math. Unfortunately, the math isn't that elegant at all, and also it isn't stable for large folding-angles (hence the 'clipping hack' at lines 90 to 99).`,likes:15,published:`Public API`,usePreview:0,tags:[`distancefields`,`folding`,`paper`,`inputdomain`]},renderpass:[{inputs:[],outputs:[{id:`4dfGRr`,channel:0}],code:`// Folding. Created by Reinder Nijhoff 2014
// Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License.
// @reindernijhoff
//
// https://www.shadertoy.com/view/MdjXDV
//

#define MARCHSTEPS 250
#define PAPERHEIGHT 0.002
#define PI 3.1415926

float time;

//----------------------------------------------------------------------

vec3 RotateY( const in vec3 vPos, const in float fAngle ) {
    float s = sin(fAngle);
    float c = cos(fAngle);
   
    vec3 vResult = vec3( c * vPos.x + s * vPos.z, vPos.y, -s * vPos.x + c * vPos.z);
   
    return vResult;
}
   
vec3 RotateZ( const in vec3 vPos, const in float fAngle ) {
    float s = sin(fAngle);
    float c = cos(fAngle);
   
    vec3 vResult = vec3( c * vPos.x + s * vPos.y, -s * vPos.x + c * vPos.y, vPos.z);
   
    return vResult;
}

//----------------------------------------------------------------------
// distance primitives

float opS( float d2, float d1 ) { return max(-d1,d2); }

float sdBox( in vec3 p, in vec3 b ) {
    vec3 d = abs(p) - b;
    return min(max(d.x,max(d.y,d.z)),0.0) + length(max(d,0.0));
}

//----------------------------------------------------------------------
// Map functions

vec3 fold( const in vec3 p, in float offset, const in float rot, in float a, const bool left ) {    
    a = clamp( a, -PI, PI );
    float b = PI-a;   
    vec3 rp = p;

    if( !left ) offset = -offset;
    
	rp.x -= offset;
    rp = RotateY( rp, rot );
    
	float angle = atan( rp.y, rp.x * (left?-1.:1.) );
     
    if( angle < 0. ) {
        if(  angle >  - b * 0.5 ) {
            rp = RotateZ( rp, a * (left?-1.:1.) );
        }
    } else {
        if( angle - a < b * 0.5 ) {
	        rp = RotateZ( rp, a * (left?-1.:1.) );
        }
    }
    
    rp = RotateY( rp, -rot );      
    rp += vec3(offset,0.,0.);
    
   
    return rp;
}

float timedAngle( const in float starttime, const in float totaltime, const in float angle ) {
	float i = clamp( time - starttime, 0., totaltime );
    return 3.1415926 * angle * i / totaltime;
}

float map( in vec3 p ) {
    
	// folding input domain
    p = fold( p, 0.,    0.,  		   timedAngle( 6., 2., 0.25), false );
    p = fold( p, 0.,    0.,  		   timedAngle(10., 2., 0.25), true );
    p = fold( p, -0.25,  0., 		   timedAngle( 8., 2.,-0.25), false  );
    p = fold( p, -0.25,  0., 		   timedAngle(12., 2.,-0.25), true  );
    
    if( time < 6.  ) 
    	p = fold( p, -1.4, PI*0.25,  timedAngle( 4., 2., -0.8 ) , true );
    if( time < 4.  ) 
		p = fold( p, -1.4, -PI*0.25, timedAngle( 2., 2., -0.8 ) , false );
    
    // just one paper plane
    float d = sdBox( p, vec3( 1., PAPERHEIGHT, 1.4) );
    
    if( time >= 6.  ) { // clip the plane hack :(
        vec3 po = p + vec3( 1.53, 0., 2.707 ); po = RotateY( po, PI*0.25 );
        d = opS( d, sdBox( po, vec3( 2., 1., 2. ) ) );
    } 
    
    if( time >= 4.  ) { // clip the plane hack :(
        vec3 po = p + vec3( -1.53, 0., 2.707 ); po = RotateY( po, PI*0.25 );
        d = opS( d, sdBox( po, vec3( 2., 1., 2. ) ) );
    } 
    
	return d;
}

//----------------------------------------------------------------------

vec3 calcNormal( in vec3 pos ) {
    const vec2 e = vec2(1.0,-1.0)*0.0025;

    vec3 n = normalize( e.xyy*map( pos + e.xyy ) + 
					    e.yyx*map( pos + e.yyx )   + 
					    e.yxy*map( pos + e.yxy )   + 
					    e.xxx*map( pos + e.xxx )   );  
    return n;
}

vec2 intersect( in vec3 ro, in vec3 rd ) {
	const float maxd = 60.0;
	const float precis = 0.001;
    float d = precis*2.0;
    float t = 0.;
    float m = 1.;
    
    for( int i=0; i<MARCHSTEPS; i++ ) {
	    d = 0.2 * map( ro+rd*t );
		t+=d;
        if( d<precis||t>maxd ) break;
    
    }

    if( t>maxd ) m=-1.0;
    return vec2( t, m );
}

void mainImage( out vec4 fragColor, in vec2 fragCoord ) {    
    time = mod( iTime + 8., 32. );
    vec2 q = fragCoord.xy / iResolution.xy;
	vec2 p = -1.0 + 2.0*q;
	p.x *= iResolution.x / iResolution.y;
        
    if (q.y < .12 || q.y >= .88) {
		fragColor=vec4(vec4(0.0));
		return;
	}
    
    if ( time > 16. ) { time = 32.-time; }
    
    //-----------------------------------------------------
    // camera
    //-----------------------------------------------------

	vec3 ro = vec3(0.,1.75 + 0.25*sin( iTime * 0.42 ), 3.);
    ro = RotateY( ro, iTime*0.05 );
    vec3 ta = vec3( 0. ,0., 0. );

    vec3 ww = normalize( ta - ro );
    vec3 uu = normalize( cross(ww,vec3(0.0,1.0,0.0) ) );
    vec3 vv = normalize( cross(uu,ww));
	vec3 rd = normalize( -p.x*uu + p.y*vv + 2.2*ww );
    
    
     vec3 col = vec3(0.01);

    // raymarch
    vec2 ints = intersect(ro ,rd );
    if(  ints.y > -0.5 ) {
        vec3 i = ro + ints.x * rd;
        vec3 nor =  calcNormal( i );
    	col = vec3(1.) * (0.1+0.9 * clamp(dot( nor, normalize(vec3(0.5, 0.8, 0.2))),0.,1.));
	}
    
    // gamma
	col = pow( clamp(col,0.0,1.0), vec3(0.4545) );


    fragColor = vec4( col, 1.0 );
}
`,name:`Image`,description:``,type:`image`}]},{ver:`0.1`,info:{id:`Xtf3zn`,date:`1417961720`,viewed:62225,name:`Tokyo`,description:`Tokyo by night in the rain. The car model is made by Eiffie (Shiny Toy': https://www.shadertoy.com/view/ldsGWB). I have never been in Tokyo btw.`,likes:293,published:`Public API`,usePreview:0,tags:[`raymarching`,`reflection`,`rain`,`city`,`car`]},renderpass:[{inputs:[],outputs:[{id:`4dfGRr`,channel:0}],code:`// Created by Reinder Nijhoff 2014
// Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License.
// @reindernijhoff
//
// https://www.shadertoy.com/view/Xtf3zn
//
// Tokyo by night in the rain. The car model is made by Eiffie
// (Shiny Toy': https://www.shadertoy.com/view/ldsGWB). 
// I have never been in Tokyo btw.

#define BUMPMAP
#define MARCHSTEPS 128
#define MARCHSTEPSREFLECTION 48
#define LIGHTINTENSITY 5.

//----------------------------------------------------------------------

const vec3 backgroundColor = vec3(0.2,0.4,0.6) * 0.09;
#define time (iTime + 90.)

//----------------------------------------------------------------------
// noises

float hash( float n ) {
    return fract(sin(n)*687.3123);
}

float noise( in vec2 x ) {
    vec2 p = floor(x);
    vec2 f = fract(x);
    f = f*f*(3.0-2.0*f);
    float n = p.x + p.y*157.0;
    return mix(mix( hash(n+  0.0), hash(n+  1.0),f.x),
               mix( hash(n+157.0), hash(n+158.0),f.x),f.y);
}

const mat2 m2 = mat2( 0.80, -0.60, 0.60, 0.80 );

float fbm( vec2 p ) {
    float f = 0.0;
    f += 0.5000*noise( p ); p = m2*p*2.02;
    f += 0.2500*noise( p ); p = m2*p*2.03;
    f += 0.1250*noise( p ); p = m2*p*2.01;
//    f += 0.0625*noise( p );
    
    return f/0.9375;
}

//----------------------------------------------------------------------
// distance primitives

float udRoundBox( vec3 p, vec3 b, float r ) {
  return length(max(abs(p)-b,0.0))-r;
}

float sdBox( in vec3 p, in vec3 b ) {
    vec3 d = abs(p) - b;
    return min(max(d.x,max(d.y,d.z)),0.0) + length(max(d,0.0));
}

float sdSphere( in vec3 p, in float s ) {
    return length(p)-s;
}

float sdCylinder( in vec3 p, in vec2 h ) {
    vec2 d = abs(vec2(length(p.xz),p.y)) - h;
    return min(max(d.x,d.y),0.0) + length(max(d,0.0));
}

//----------------------------------------------------------------------
// distance operators

float opU( float d2, float d1 ) { return min( d1,d2); }
float opS( float d2, float d1 ) { return max(-d1,d2); }
float smin( float a, float b, float k ) { return -log(exp(-k*a)+exp(-k*b))/k; } //from iq

//----------------------------------------------------------------------
// Map functions

// car model is made by Eiffie
// shader 'Shiny Toy': https://www.shadertoy.com/view/ldsGWB

float mapCar(in vec3 p0){ 
	vec3 p=p0+vec3(0.0,1.24,0.0);
	float r=length(p.yz);
	float d= length(max(vec3(abs(p.x)-0.35,r-1.92,-p.y+1.4),0.0))-0.05;
	d=max(d,p.z-1.0);
	p=p0+vec3(0.0,-0.22,0.39);
	p.xz=abs(p.xz)-vec2(0.5300,0.9600);p.x=abs(p.x);
	r=length(p.yz);
	d=smin(d,length(max(vec3(p.x-0.08,r-0.25,-p.y-0.08),0.0))-0.04,8.0);
	d=max(d,-max(p.x-0.165,r-0.24));
	float d2=length(vec2(max(p.x-0.13,0.0),r-0.2))-0.02;
	d=min(d,d2);

	return d;
}

float dL; // minimal distance to light

float map( const in vec3 p ) {
	vec3 pd = p;
    float d;
    
    pd.x = abs( pd.x );
    pd.z *= -sign( p.x );
    
    float ch = hash( floor( (pd.z+18.*time)/40. ) );
    float lh = hash( floor( pd.z/13. ) );
    
    vec3 pdm = vec3( pd.x, pd.y, mod( pd.z, 10.) - 5. );
    dL = sdSphere( vec3(pdm.x-8.1,pdm.y-4.5,pdm.z), 0.1 );
    
    dL = opU( dL, sdBox( vec3(pdm.x-12., pdm.y-9.5-lh,  mod( pd.z, 91.) - 45.5 ), vec3(0.2,4.5, 0.2) ) );
    dL = opU( dL, sdBox( vec3(pdm.x-12., pdm.y-11.5+lh, mod( pd.z, 31.) - 15.5 ), vec3(0.22,5.5, 0.2) ) );
    dL = opU( dL, sdBox( vec3(pdm.x-12., pdm.y-8.5-lh,  mod( pd.z, 41.) - 20.5 ), vec3(0.24,3.5, 0.2) ) );
   
    if( lh > 0.5 ) {
	    dL = opU( dL, sdBox( vec3(pdm.x-12.5,pdm.y-2.75-lh,  mod( pd.z, 13.) - 6.5 ), vec3(0.1,0.25, 3.2) ) );
    }
    
    vec3 pm = vec3( mod( pd.x + floor( pd.z * 4. )*0.25, 0.5 ) - 0.25, pd.y, mod( pd.z, 0.25 ) - 0.125 );
	d = udRoundBox( pm, vec3( 0.245,0.1, 0.12 ), 0.005 ); 
    
    d = opS( d, -(p.x+8.) );
    d = opU( d, pd.y );

    vec3 pdc = vec3( pd.x, pd.y, mod( pd.z+18.*time, 40.) - 20. );
    
    // car
    if( ch > 0.75 ) {
        pdc.x += (ch-0.75)*4.;
	    dL = opU( dL, sdSphere( vec3( abs(pdc.x-5.)-1.05, pdc.y-0.55, pdc.z ),    0.025 ) );
	    dL = opU( dL, sdSphere( vec3( abs(pdc.x-5.)-1.2,  pdc.y-0.65,  pdc.z+6.05 ), 0.025 ) );

        d = opU( d,  mapCar( (pdc-vec3(5.,-0.025,-2.3))*0.45 ) );
 	}
    
    d = opU( d, 13.-pd.x );
    d = opU( d, sdCylinder( vec3(pdm.x-8.5, pdm.y, pdm.z), vec2(0.075,4.5)) );
    d = opU( d, dL );
    
	return d;
}

//----------------------------------------------------------------------

vec3 calcNormalSimple( in vec3 pos ) {   
    const vec2 e = vec2(1.0,-1.0)*0.005;

    vec3 n = normalize( e.xyy*map( pos + e.xyy ) + 
					    e.yyx*map( pos + e.yyx )   + 
					    e.yxy*map( pos + e.yxy )   + 
					    e.xxx*map( pos + e.xxx )   );  
    return n;
}

vec3 calcNormal( in vec3 pos ) {
    vec3 n = calcNormalSimple( pos );
    if( pos.y > 0.12 ) return n;

#ifdef BUMPMAP
    vec2 oc = floor( vec2(pos.x+floor( pos.z * 4. )*0.25, pos.z) * vec2( 2., 4. ) );

    if( abs(pos.x)<8. ) {
		oc = pos.xz;
    }
    
     vec3 p = pos * 250.;
   	 vec3 xn = 0.05*vec3(noise(p.xz)-0.5,0.,noise(p.zx)-0.5);
     xn += 0.1*vec3(fbm(oc.xy)-0.5,0.,fbm(oc.yx)-0.5);
    
    n = normalize( xn + n );
#endif
    
    return n;
}

vec3 int1, int2, nor1;
vec4 lint1, lint2;

float intersect( in vec3 ro, in vec3 rd ) {
	const float precis = 0.001;
    float h = precis*2.0;
    float t = 0.;
    int1 = int2 = vec3( -500. );
    lint1 = lint2 = vec4( -500. );
    float mld = 100.;
    
	for( int i=0; i < MARCHSTEPS; i++ ) {
        h = map( ro+rd*t );
		if(dL < mld){
			mld=dL;
            lint1.xyz = ro+rd*t;
			lint1.w = abs(dL);
		}
        if( h < precis ) {
            int1.xyz = ro+rd*t;
            break;
        } 
        t += max(h, precis*2.);
    }
    
    if( int1.z < -400. || t > 300.) {
        // check intersection with plane y = -0.1;
        float d = -(ro.y + 0.1)/rd.y;
		if( d > 0. ) {
			int1.xyz = ro+rd*d;
	    } else {
        	return -1.;
    	}
    }
    
    ro = ro + rd*t;
    nor1 = calcNormal(ro);
    ro += 0.01*nor1;
    rd = reflect( rd, nor1 );
    t = 0.0;
    h = precis*2.0;
    mld = 100.;
    
    for( int i=0; i < MARCHSTEPSREFLECTION; i++ ) {
        h = map( ro+rd*t );
		if(dL < mld){
			mld=dL;            
            lint2.xyz = ro+rd*t;
			lint2.w = abs(dL);
		}
        if( h < precis ) {
   			int2.xyz = ro+rd*t;
            return 1.;
        }   
        t += max(h, precis*2.);
    }

    return 0.;
}

//----------------------------------------------------------------------
// shade

vec3 shade( in vec3 ro, in vec3 pos, in vec3 nor ) {
    vec3  col = vec3(0.5);
    
    if( abs(pos.x) > 15. || abs(pos.x) < 8. ) col = vec3( 0.02 );
    if( pos.y < 0.01 ) {
        if( abs( int1.x ) < 0.1 ) col = vec3( 0.9 );
        if( abs( abs( int1.x )-7.4 ) < 0.1 ) col = vec3( 0.9 );
    }    
    
    float sh = clamp( dot( nor, normalize( vec3( -0.3, 0.3, -0.5 ) ) ), 0., 1.);
  	col *= (sh * backgroundColor);  
 
    if( abs( pos.x ) > 12.9 && pos.y > 9.) { // windows
        float ha = hash(  133.1234*floor( pos.y / 3. ) + floor( (pos.z) / 3. ) );
        if( ha > 0.95) {
            col = ( (ha-0.95)*10.) * vec3( 1., 0.7, 0.4 );
        }
    }
    
	col = mix(  backgroundColor, col, exp( min(max(0.1*pos.y,0.25)-0.065*distance(pos, ro),0.) ) );
  
    return col;
}

vec3 getLightColor( in vec3 pos ) {
    vec3 lcol = vec3( 1., .7, .5 );
    
	vec3 pd = pos;
    pd.x = abs( pd.x );
    pd.z *= -sign( pos.x );
    
    float ch = hash( floor( (pd.z+18.*time)/40. ) );
    vec3 pdc = vec3( pd.x, pd.y, mod( pd.z+18.*time, 40.) - 20. );

    if( ch > 0.75 ) { // car
        pdc.x += (ch-0.75)*4.;
        if(  sdSphere( vec3( abs(pdc.x-5.)-1.05, pdc.y-0.55, pdc.z ), 0.25) < 2. ) {
            lcol = vec3( 1., 0.05, 0.01 );
        }
    }
    if( pd.y > 2. && abs(pd.x) > 10. && pd.y < 5. ) {
        float fl = floor( pd.z/13. );
        lcol = 0.4*lcol+0.5*vec3( hash( .1562+fl ), hash( .423134+fl ), 0. );
    }
    if(  abs(pd.x) > 10. && pd.y > 5. ) {
        float fl = floor( pd.z/2. );
        lcol = 0.5*lcol+0.5*vec3( hash( .1562+fl ),  hash( .923134+fl ), hash( .423134+fl ) );
    }
   
    return lcol;
}

float randomStart(vec2 co){return 0.8+0.2*hash(dot(co,vec2(123.42,117.853))*412.453);}

//----------------------------------------------------------------------
// main

void mainImage( out vec4 fragColor, in vec2 fragCoord ) {    
    vec2 q = fragCoord.xy / iResolution.xy;
	vec2 p = -1.0 + 2.0*q;
	p.x *= iResolution.x / iResolution.y;
        
    if (q.y < .12 || q.y >= .88) {
		fragColor=vec4(0.,0.,0.,1.);
		return;
    } else {
    
        // camera
        float z = time;
        float x = -10.9+1.*sin(time*0.2);
        vec3 ro = vec3(x,  1.3+.3*cos(time*0.26), z-1.);
        vec3 ta = vec3(-8.,1.3+.4*cos(time*0.26), z+4.+cos(time*0.04));

        vec3 ww = normalize( ta - ro );
        vec3 uu = normalize( cross(ww,vec3(0.0,1.0,0.0) ) );
        vec3 vv = normalize( cross(uu,ww));
        vec3 rd = normalize( -p.x*uu + p.y*vv + 2.2*ww );

        vec3 col = backgroundColor;

        // raymarch
        float ints = intersect(ro+randomStart(p)*rd ,rd );
        if(  ints > -0.5 ) {

            // calculate reflectance
            float r = 0.09;     	        
            if( int1.y > 0.129 ) r = 0.025 * hash(  133.1234*floor( int1.y / 3. ) + floor( int1.z / 3. ) );
            if( abs(int1.x) < 8. ) {
                if( int1.y < 0.01 ) { // road
                    r = 0.007*fbm(int1.xz);
                } else { // car
                    r = 0.02;
                }
            }
            if( abs( int1.x ) < 0.1 ) r *= 4.;
            if( abs( abs( int1.x )-7.4 ) < 0.1 ) r *= 4.;

            r *= 2.;

            col = shade( ro, int1.xyz, nor1 );

            if( ints > 0.5 ) {
                col += r * shade( int1.xyz, int2.xyz, calcNormalSimple(int2.xyz) );
            }  
            if( lint2.w > 0. ) {            
                col += (r*LIGHTINTENSITY*exp(-lint2.w*7.0)) * getLightColor(lint2.xyz);
            } 
        } 

        // Rain (by Dave Hoskins)
        vec2 st = 256. * ( p* vec2(.5, .01)+vec2(time*.13-q.y*.6, time*.13) );
        float f = noise( st ) * noise( st*0.773) * 1.55;
        f = 0.25+ clamp(pow(abs(f), 13.0) * 13.0, 0.0, q.y*.14);

        if( lint1.w > 0. ) {
            col += (f*LIGHTINTENSITY*exp(-lint1.w*7.0)) * getLightColor(lint1.xyz);
        }  

        col += 0.25*f*(0.2+backgroundColor);

        // post processing
        col = pow( clamp(col,0.0,1.0), vec3(0.4545) );
        col *= 1.2*vec3(1.,0.99,0.95);   
        col = clamp(1.06*col-0.03, 0., 1.);  
        q.y = (q.y-.12)*(1./0.76);
        col *= 0.5 + 0.5*pow( 16.0*q.x*q.y*(1.0-q.x)*(1.0-q.y), 0.1 ); 

        fragColor = vec4( col, 1.0 );
    }
}
`,name:`Image`,description:``,type:`image`}]},{ver:`0.1`,info:{id:`MtfGR4`,date:`1419015939`,viewed:8757,name:`Bidirectional path tracing`,description:`Yesterday, I found out about bidirectional path tracing. I didn't read the articles, but looked at the images and I tried to implement something myself. Therefore, I think most of the math will be incorrect - but it looks nice. Only diffuse lighting.`,likes:54,published:`Public API`,usePreview:0,tags:[`box`,`tracing`,`cornell`,`path`,`bidirectional`]},renderpass:[{inputs:[],outputs:[{id:`4dfGRr`,channel:0}],code:`// Bidirectional path tracing. Created by Reinder Nijhoff 2014
// Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License.
// @reindernijhoff
//
// https://www.shadertoy.com/view/MtfGR4
//

#define eps 0.0001
#define LIGHTPATHLENGTH 2
#define EYEPATHLENGTH 3
#define MAXPATHLENGTH 4
#define SAMPLES 12

#define FULLBOX

#define DOF
#define ANIMATENOISE
#define MOTIONBLUR

#define MOTIONBLURFPS 12.

#define LIGHTCOLOR vec3(16.86, 10.76, 8.2)*1.3
#define WHITECOLOR vec3(.7295, .7355, .729)*0.7
#define GREENCOLOR vec3(.117, .4125, .115)*0.7
#define REDCOLOR vec3(.611, .0555, .062)*0.7

struct LightPathNode {
    vec3 color;
    vec3 position;
    vec3 normal;
};
    

float hash1(inout float seed) {
    return fract(sin(seed += 0.1)*43758.5453123);
}

vec2 hash2(inout float seed) {
    return fract(sin(vec2(seed+=0.1,seed+=0.1))*vec2(43758.5453123,22578.1459123));
}

vec3 hash3(inout float seed) {
    return fract(sin(vec3(seed+=0.1,seed+=0.1,seed+=0.1))*vec3(43758.5453123,22578.1459123,19642.3490423));
}

//-----------------------------------------------------
// Intersection functions (by iq)
//-----------------------------------------------------

vec3 nSphere( in vec3 pos, in vec4 sph ) {
    return (pos-sph.xyz)/sph.w;
}

float iSphere( in vec3 ro, in vec3 rd, in vec4 sph ) {
	vec3 oc = ro - sph.xyz;
	float b = dot( oc, rd );
	float c = dot( oc, oc ) - sph.w*sph.w;
	float h = b*b - c;
	if( h<0.0 ) return -1.0;
	return -b - sqrt( h );
}

vec3 nPlane( in vec3 ro, in vec4 obj ) {
    return obj.xyz;
}

float iPlane( in vec3 ro, in vec3 rd, in vec4 pla ) {
    return (-pla.w - dot(pla.xyz,ro)) / dot( pla.xyz, rd );
}

//-----------------------------------------------------
// scene
//-----------------------------------------------------

vec3 cosWeightedRandomHemisphereDirection( const vec3 n, inout float seed ) {
  	vec2 rv2 = hash2(seed);
    
	vec3  uu = normalize( cross( n, vec3(0.0,1.0,1.0) ) );
	vec3  vv = normalize( cross( uu, n ) );
	
	float ra = sqrt(rv2.y);
	float rx = ra*cos(6.2831*rv2.x); 
	float ry = ra*sin(6.2831*rv2.x);
	float rz = sqrt( 1.0-rv2.y );
	vec3  rr = vec3( rx*uu + ry*vv + rz*n );
    
    return normalize( rr );
}

vec3 randomSphereDirection(inout float seed) {
    vec2 h = hash2(seed) * vec2(2.,6.28318530718)-vec2(1,0);
    float phi = h.y;
	return vec3(sqrt(1.-h.x*h.x)*vec2(sin(phi),cos(phi)),h.x);
}

vec3 randomHemisphereDirection( const vec3 n, inout float seed ) {
	vec3 dr = randomSphereDirection(seed);
	return dot(dr,n) * dr;
}

//-----------------------------------------------------
// renderer
//-----------------------------------------------------

vec4 lightSphere;
LightPathNode lpNodes[LIGHTPATHLENGTH];

void initLightSphere( float time ) {
	lightSphere = vec4( 3.0+2.*sin(time),2.8+2.*sin(time*0.9),3.0+4.*cos(time*0.7),0.5);
}

vec2 intersect( in vec3 ro, in vec3 rd, inout vec3 normal ) {
	vec2 res = vec2( 1e20, -1.0 );
    float t;
	
	t = iPlane( ro, rd, vec4( 0.0, 1.0, 0.0,0.0 ) ); if( t>eps && t<res.x ) { res = vec2( t, 0. ); normal = vec3( 0., 1., 0.); }
	t = iPlane( ro, rd, vec4( 0.0, 0.0,-1.0,8.0 ) ); if( t>eps && t<res.x ) { res = vec2( t, 0. ); normal = vec3( 0., 0.,-1.); }
    t = iPlane( ro, rd, vec4( 1.0, 0.0, 0.0,0.0 ) ); if( t>eps && t<res.x ) { res = vec2( t, 2. ); normal = vec3( 1., 0., 0.); }
#ifdef FULLBOX
    t = iPlane( ro, rd, vec4( 0.0,-1.0, 0.0,5.49) ); if( t>eps && t<res.x ) { res = vec2( t, 0. ); normal = vec3( 0., -1., 0.); }
    t = iPlane( ro, rd, vec4(-1.0, 0.0, 0.0,5.59) ); if( t>eps && t<res.x ) { res = vec2( t, 1. ); normal = vec3(-1., 0., 0.); }
#endif

	t = iSphere( ro, rd, vec4( 1.5,1.0, 2.7, 1.0) ); if( t>eps && t<res.x ) { res = vec2( t, 0. ); normal = nSphere( ro+t*rd, vec4( 1.5,1.0, 2.7,1.0) ); }
    t = iSphere( ro, rd, vec4( 4.0,1.0, 4.0, 1.0) ); if( t>eps && t<res.x ) { res = vec2( t, 2. ); normal = nSphere( ro+t*rd, vec4( 4.0,1.0, 4.0,1.0) ); }
    t = iSphere( ro, rd, lightSphere ); if( t>eps && t<res.x ) { res = vec2( t, 4.0 );  normal = nSphere( ro+t*rd, lightSphere ); }
					  
    return res;					  
}

bool intersectShadow( in vec3 ro, in vec3 rd, in float dist ) {
    float t;
	
	t = iSphere( ro, rd, vec4( 1.5,1.0, 2.7,1.0) );  if( t>eps && t<dist ) { return true; }
    t = iSphere( ro, rd, vec4( 4.0,1.0, 4.0,1.0) );  if( t>eps && t<dist ) { return true; }

    return false; // optimisation: planes don't cast shadows in this scene
}

vec3 calcColor( in float mat ) {
	vec3 nor = vec3(0.0);
	
	if( mat<4.5 ) nor = LIGHTCOLOR;
	if( mat<3.5 ) nor = WHITECOLOR;
    if( mat<2.5 ) nor = GREENCOLOR;
	if( mat<1.5 ) nor = REDCOLOR;
	if( mat<0.5 ) nor = WHITECOLOR;
					  
    return nor;					  
}

//-----------------------------------------------------
// lightpath
//-----------------------------------------------------

void constructLightPath(inout float seed) {
    vec3 ro = normalize( hash3(seed)-vec3(0.5) );
    vec3 rd = randomHemisphereDirection( ro, seed );
    ro = lightSphere.xyz + ro*0.5;
    vec3 color = LIGHTCOLOR;
    
    lpNodes[0].position = ro;
    lpNodes[0].color = color;
    lpNodes[0].normal = rd;
    
    for( int i=1; i<LIGHTPATHLENGTH; ++i ) {
        lpNodes[i].position = lpNodes[i].color = lpNodes[i].normal = vec3(0.);
    }
    
    for( int i=1; i<LIGHTPATHLENGTH; i++ ) {
		vec3 normal;
        vec2 res = intersect( ro, rd, normal );
        if( res.y > -0.5 && res.y < 4. ) {
            ro = ro + rd*res.x;
            color *= calcColor( res.y );
            lpNodes[i].position = ro;
            lpNodes[i].color = color;
            lpNodes[i].normal = normal;

            rd = cosWeightedRandomHemisphereDirection( normal, seed );
        } else break;
    }
}

//-----------------------------------------------------
// eyepath
//-----------------------------------------------------

vec3 traceEyePath( in vec3 ro, in vec3 rd, inout float seed ) {
    vec3 col = vec3(0.);
    vec3 basecol = vec3(1.);
    
    for( int j=0; j<EYEPATHLENGTH; ++j ) {
        vec3 normal;
        
        vec2 res = intersect( ro, rd, normal );
        if( res.y < -0.5 ) return col;
        if( res.y > 3.5 ) {
            return col + basecol*LIGHTCOLOR / float( j+1 ); 
        }
        
        ro = ro + res.x * rd;
        rd = cosWeightedRandomHemisphereDirection( normal, seed );
        
        basecol *= calcColor( res.y );
        
	    for( int i=0; i<LIGHTPATHLENGTH; ++i ) {
            if( i+j >= MAXPATHLENGTH ) continue;
            
            vec3 lp = lpNodes[i].position - ro;
            vec3 lpn = normalize( lp );
            vec3 lc = lpNodes[i].color;
            
            if( !intersectShadow(ro, lpn, length(lp)-eps) ) {
                col += clamp( dot( lpn, normal ), 0., 1.) * lc * basecol
                    * clamp(  dot( lpNodes[i].normal, -lpn ), 0., 1.)
                    * clamp( 1./dot(lp,lp), 0., 1. )
                    / float( i+j+1 );
            }
        }
    }    
    return col;
}

//-----------------------------------------------------
// main
//-----------------------------------------------------

void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
	vec2 q = fragCoord.xy / iResolution.xy;
    
    //-----------------------------------------------------
    // camera
    //-----------------------------------------------------

    vec2 p = -1.0 + 2.0 * (fragCoord.xy) / iResolution.xy;
    p.x *= iResolution.x/iResolution.y;

#ifdef ANIMATENOISE
    float seed = p.x + fract(p.y * 18753.43121412313) + fract(12.12345314312*iTime);
#else
    float seed = p.x + fract(p.y * 18753.43121412313);
#endif
    
    vec3 ro = vec3(2.78, 2.73, -8.00);
    vec3 ta = vec3(2.78, 2.73,  0.00);
    vec3 ww = normalize( ta - ro );
    vec3 uu = normalize( cross(ww,vec3(0.0,1.0,0.0) ) );
    vec3 vv = normalize( cross(uu,ww));

    //-----------------------------------------------------
    // render
    //-----------------------------------------------------

    vec3 col = vec3(0.0);
    vec3 tot = vec3(0.0);
    vec3 uvw = vec3(0.0);

    for( int a=0; a<SAMPLES; a++ ) {
        
        vec2 rpof = 4.*(hash2(seed)-vec2(0.5)) / iResolution.xy;
	    vec3 rd = normalize( (p.x+rpof.x)*uu + (p.y+rpof.y)*vv + 3.0*ww );
        
#ifdef DOF
	    vec3 fp = ro + rd * 12.0;
   		vec3 rof = ro + (uu*(hash1(seed)-0.5) + vv*(hash1(seed)-0.5))*0.125;
    	rd = normalize( fp - rof );
#else
        vec3 rof = ro;
#endif        
        
#ifdef MOTIONBLUR
        initLightSphere( iTime + hash1(seed) / MOTIONBLURFPS );
#else
        initLightSphere( iTime );        
#endif
        
        constructLightPath(seed);
        col = traceEyePath( rof, rd, seed );

        tot += col;
        
        seed = mod( seed*1.1234567893490423, 13. );
    }
    
    tot /= float(SAMPLES);

	tot = pow( clamp(tot,0.0,1.0), vec3(0.45) );

    fragColor = vec4( tot, 1.0 );
}`,name:`Image`,description:``,type:`image`}]},{ver:`0.1`,info:{id:`4tl3z4`,date:`1419368177`,viewed:13879,name:`Simple path tracer`,description:`This shader shows the difference between a path tracer with, and without, direct light sampling.`,likes:134,published:`Public API`,usePreview:0,tags:[`light`,`sampling`,`tracer`,`path`,`direct`]},renderpass:[{inputs:[],outputs:[{id:`4dfGRr`,channel:0}],code:`// Simple path tracer. Created by Reinder Nijhoff 2014
// Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License.
// @reindernijhoff
//
// https://www.shadertoy.com/view/4tl3z4
//

#define eps 0.0001
#define EYEPATHLENGTH 4
#define SAMPLES 12

#define SHOWSPLITLINE
#define FULLBOX

#define DOF
#define ANIMATENOISE
#define MOTIONBLUR

#define MOTIONBLURFPS 12.

#define LIGHTCOLOR vec3(16.86, 10.76, 8.2)*1.3
#define WHITECOLOR vec3(.7295, .7355, .729)*0.7
#define GREENCOLOR vec3(.117, .4125, .115)*0.7
#define REDCOLOR vec3(.611, .0555, .062)*0.7


float hash1(inout float seed) {
    return fract(sin(seed += 0.1)*43758.5453123);
}

vec2 hash2(inout float seed) {
    return fract(sin(vec2(seed+=0.1,seed+=0.1))*vec2(43758.5453123,22578.1459123));
}

vec3 hash3(inout float seed) {
    return fract(sin(vec3(seed+=0.1,seed+=0.1,seed+=0.1))*vec3(43758.5453123,22578.1459123,19642.3490423));
}

//-----------------------------------------------------
// Intersection functions (by iq)
//-----------------------------------------------------

vec3 nSphere( in vec3 pos, in vec4 sph ) {
    return (pos-sph.xyz)/sph.w;
}

float iSphere( in vec3 ro, in vec3 rd, in vec4 sph ) {
    vec3 oc = ro - sph.xyz;
    float b = dot(oc, rd);
    float c = dot(oc, oc) - sph.w * sph.w;
    float h = b * b - c;
    if (h < 0.0) return -1.0;

	float s = sqrt(h);
	float t1 = -b - s;
	float t2 = -b + s;
	
	return t1 < 0.0 ? t2 : t1;
}

vec3 nPlane( in vec3 ro, in vec4 obj ) {
    return obj.xyz;
}

float iPlane( in vec3 ro, in vec3 rd, in vec4 pla ) {
    return (-pla.w - dot(pla.xyz,ro)) / dot( pla.xyz, rd );
}

//-----------------------------------------------------
// scene
//-----------------------------------------------------

vec3 cosWeightedRandomHemisphereDirection( const vec3 n, inout float seed ) {
  	vec2 r = hash2(seed);
    
	vec3  uu = normalize( cross( n, vec3(0.0,1.0,1.0) ) );
	vec3  vv = cross( uu, n );
	
	float ra = sqrt(r.y);
	float rx = ra*cos(6.2831*r.x); 
	float ry = ra*sin(6.2831*r.x);
	float rz = sqrt( 1.0-r.y );
	vec3  rr = vec3( rx*uu + ry*vv + rz*n );
    
    return normalize( rr );
}

vec3 randomSphereDirection(inout float seed) {
    vec2 h = hash2(seed) * vec2(2.,6.28318530718)-vec2(1,0);
    float phi = h.y;
	return vec3(sqrt(1.-h.x*h.x)*vec2(sin(phi),cos(phi)),h.x);
}

vec3 randomHemisphereDirection( const vec3 n, inout float seed ) {
	vec3 dr = randomSphereDirection(seed);
	return dot(dr,n) * dr;
}

//-----------------------------------------------------
// light
//-----------------------------------------------------

vec4 lightSphere;

void initLightSphere( float time ) {
	lightSphere = vec4( 3.0+2.*sin(time),2.8+2.*sin(time*0.9),3.0+4.*cos(time*0.7), .5 );
}

vec3 sampleLight( const in vec3 ro, inout float seed ) {
    vec3 n = randomSphereDirection( seed ) * lightSphere.w;
    return lightSphere.xyz + n;
}

//-----------------------------------------------------
// scene
//-----------------------------------------------------

vec2 intersect( in vec3 ro, in vec3 rd, inout vec3 normal ) {
	vec2 res = vec2( 1e20, -1.0 );
    float t;
	
	t = iPlane( ro, rd, vec4( 0.0, 1.0, 0.0,0.0 ) ); if( t>eps && t<res.x ) { res = vec2( t, 1. ); normal = vec3( 0., 1., 0.); }
	t = iPlane( ro, rd, vec4( 0.0, 0.0,-1.0,8.0 ) ); if( t>eps && t<res.x ) { res = vec2( t, 1. ); normal = vec3( 0., 0.,-1.); }
    t = iPlane( ro, rd, vec4( 1.0, 0.0, 0.0,0.0 ) ); if( t>eps && t<res.x ) { res = vec2( t, 2. ); normal = vec3( 1., 0., 0.); }
#ifdef FULLBOX
    t = iPlane( ro, rd, vec4( 0.0,-1.0, 0.0,5.49) ); if( t>eps && t<res.x ) { res = vec2( t, 1. ); normal = vec3( 0., -1., 0.); }
    t = iPlane( ro, rd, vec4(-1.0, 0.0, 0.0,5.59) ); if( t>eps && t<res.x ) { res = vec2( t, 3. ); normal = vec3(-1., 0., 0.); }
#endif

	t = iSphere( ro, rd, vec4( 1.5,1.0, 2.7, 1.0) ); if( t>eps && t<res.x ) { res = vec2( t, 1. ); normal = nSphere( ro+t*rd, vec4( 1.5,1.0, 2.7,1.0) ); }
    t = iSphere( ro, rd, vec4( 4.0,1.0, 4.0, 1.0) ); if( t>eps && t<res.x ) { res = vec2( t, 6. ); normal = nSphere( ro+t*rd, vec4( 4.0,1.0, 4.0,1.0) ); }
    t = iSphere( ro, rd, lightSphere ); if( t>eps && t<res.x ) { res = vec2( t, 0.0 );  normal = nSphere( ro+t*rd, lightSphere ); }
					  
    return res;					  
}

bool intersectShadow( in vec3 ro, in vec3 rd, in float dist ) {
    float t;
	
	t = iSphere( ro, rd, vec4( 1.5,1.0, 2.7,1.0) );  if( t>eps && t<dist ) { return true; }
    t = iSphere( ro, rd, vec4( 4.0,1.0, 4.0,1.0) );  if( t>eps && t<dist ) { return true; }

    return false; // optimisation: planes don't cast shadows in this scene
}

//-----------------------------------------------------
// materials
//-----------------------------------------------------

vec3 matColor( const in float mat ) {
	vec3 nor = vec3(0., 0.95, 0.);
	
	if( mat<3.5 ) nor = REDCOLOR;
    if( mat<2.5 ) nor = GREENCOLOR;
	if( mat<1.5 ) nor = WHITECOLOR;
	if( mat<0.5 ) nor = LIGHTCOLOR;
					  
    return nor;					  
}

bool matIsSpecular( const in float mat ) {
    return mat > 4.5;
}

bool matIsLight( const in float mat ) {
    return mat < 0.5;
}

//-----------------------------------------------------
// brdf
//-----------------------------------------------------

vec3 getBRDFRay( in vec3 n, const in vec3 rd, const in float m, inout bool specularBounce, inout float seed ) {
    specularBounce = false;
    
    vec3 r = cosWeightedRandomHemisphereDirection( n, seed );
    if(  !matIsSpecular( m ) ) {
        return r;
    } else {
        specularBounce = true;
        
        float n1, n2, ndotr = dot(rd,n);
        
        if( ndotr > 0. ) {
            n1 = 1.0; 
            n2 = 1.5;
            n = -n;
        } else {
            n1 = 1.5;
            n2 = 1.0; 
        }
                
        float r0 = (n1-n2)/(n1+n2); r0 *= r0;
		float fresnel = r0 + (1.-r0) * pow(1.0-abs(ndotr),5.);
        
        vec3 ref =  refract( rd, n, n2/n1 );        
        if( ref == vec3(0) || hash1(seed) < fresnel ) {
            ref = reflect( rd, n );
        } 
        
        return ref;
	}
}

//-----------------------------------------------------
// eyepath
//-----------------------------------------------------

vec3 traceEyePath( in vec3 ro, in vec3 rd, const in bool directLightSampling, inout float seed ) {
    vec3 tcol = vec3(0.);
    vec3 fcol  = vec3(1.);
    
    bool specularBounce = true;
    
    for( int j=0; j<EYEPATHLENGTH; ++j ) {
        vec3 normal;
        
        vec2 res = intersect( ro, rd, normal );
        if( res.y < -0.5 ) {
            return tcol;
        }
        
        if( matIsLight( res.y ) ) {
            if( directLightSampling ) {
            	if( specularBounce ) tcol += fcol*LIGHTCOLOR;
            } else {
                tcol += fcol*LIGHTCOLOR;
            }
            return tcol;
        }
        
        ro = ro + res.x * rd;
        rd = getBRDFRay( normal, rd, res.y, specularBounce, seed );
            
        if(!specularBounce || dot(rd,normal) < 0.) {  
        	fcol *= matColor( res.y );
        }
        
        if( directLightSampling ) {
        	vec3 ld = sampleLight( ro, seed ) - ro;
			vec3 nld = normalize(ld);
            if( !specularBounce && j < EYEPATHLENGTH-1 && !intersectShadow( ro, nld, length(ld)) ) {

                float cos_a_max = sqrt(1. - clamp(lightSphere.w * lightSphere.w / dot(lightSphere.xyz-ro, lightSphere.xyz-ro), 0., 1.));
                float weight = 2. * (1. - cos_a_max);

                tcol += (fcol * LIGHTCOLOR) * (weight * clamp(dot( nld, normal ), 0., 1.));
            }
        }
    }    
    return tcol;
}

//-----------------------------------------------------
// main
//-----------------------------------------------------

void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
	vec2 q = fragCoord.xy / iResolution.xy;
    
	float splitCoord = (iMouse.x == 0.0) ? iResolution.x/2. + iResolution.x*cos(iTime*.5) : iMouse.x;
    bool directLightSampling = fragCoord.x < splitCoord;
    
    //-----------------------------------------------------
    // camera
    //-----------------------------------------------------

    vec2 p = -1.0 + 2.0 * (fragCoord.xy) / iResolution.xy;
    p.x *= iResolution.x/iResolution.y;

#ifdef ANIMATENOISE
    float seed = p.x + p.y * 3.43121412313 + fract(1.12345314312*iTime);
#else
    float seed = p.x + p.y * 3.43121412313;
#endif
    
    vec3 ro = vec3(2.78, 2.73, -8.00);
    vec3 ta = vec3(2.78, 2.73,  0.00);
    vec3 ww = normalize( ta - ro );
    vec3 uu = normalize( cross(ww,vec3(0.0,1.0,0.0) ) );
    vec3 vv = normalize( cross(uu,ww));

    //-----------------------------------------------------
    // render
    //-----------------------------------------------------

    vec3 col = vec3(0.0);
    vec3 tot = vec3(0.0);
    vec3 uvw = vec3(0.0);
    
    for( int a=0; a<SAMPLES; a++ ) {

        vec2 rpof = 2.*(hash2(seed)-vec2(0.5)) / iResolution.y;
	    vec3 rd = normalize( (p.x+rpof.x)*uu + (p.y+rpof.y)*vv + 3.0*ww );
        
#ifdef DOF
	    vec3 fp = ro + rd * 12.0;
   		vec3 rof = ro + (uu*(hash1(seed)-0.5) + vv*(hash1(seed)-0.5))*0.125;
    	rd = normalize( fp - rof );
#else
        vec3 rof = ro;
#endif        
        
#ifdef MOTIONBLUR
        initLightSphere( iTime + hash1(seed) / MOTIONBLURFPS );
#else
        initLightSphere( iTime );        
#endif
        
        col = traceEyePath( rof, rd, directLightSampling, seed );

        tot += col;
        
        seed = mod( seed*1.1234567893490423, 13. );
    }
    
    tot /= float(SAMPLES);
    
#ifdef SHOWSPLITLINE
	if (abs(fragCoord.x - splitCoord) < 1.0) {
		tot.x = 1.0;
	}
#endif
    
	tot = pow( clamp(tot,0.0,1.0), vec3(0.45) );

    fragColor = vec4( tot, 1.0 );
}`,name:`Image`,description:``,type:`image`}]},{ver:`0.1`,info:{id:`4lfGWr`,date:`1420563049`,viewed:10469,name:`Bidirectional path tracer 2`,description:`My second try of creating a bidirectional path tracer. I really should read those articles :( (all weights of the paths are guessed)
The shader shows a scene with indirect lighting, using a bidirectional path tracer and a classical path tracer.`,likes:70,published:`Public API`,usePreview:0,tags:[`lighting`,`indirect`,`tracer`,`path`,`bidirectional`]},renderpass:[{inputs:[],outputs:[{id:`4dfGRr`,channel:0}],code:`// Bidirectional path tracer 2. Created by Reinder Nijhoff 2014
// Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License.
// @reindernijhoff
//
// https://www.shadertoy.com/view/4lfGWr
//

#define eps 0.00001
#define LIGHTPATHLENGTH 2
#define EYEPATHLENGTH 3
#define SAMPLES 8

#define SHOWSPLITLINE
#define FULLBOX

#define DOF
#define ANIMATENOISE
#define MOTIONBLUR

#define MOTIONBLURFPS 12.

#define LIGHTCOLOR vec3(16.86, 10.76, 8.2)*200.
#define WHITECOLOR vec3(.7295, .7355, .729)*0.7
#define GREENCOLOR vec3(.117, .4125, .115)*0.7
#define REDCOLOR vec3(.611, .0555, .062)*0.7

float hash1(inout float seed) {
    return fract(sin(seed += 0.1)*43758.5453123);
}

vec2 hash2(inout float seed) {
    return fract(sin(vec2(seed+=0.1,seed+=0.1))*vec2(43758.5453123,22578.1459123));
}

vec3 hash3(inout float seed) {
    return fract(sin(vec3(seed+=0.1,seed+=0.1,seed+=0.1))*vec3(43758.5453123,22578.1459123,19642.3490423));
}

//-----------------------------------------------------
// Intersection functions (by iq)
//-----------------------------------------------------

vec3 nSphere( in vec3 pos, in vec4 sph ) {
    return (pos-sph.xyz)/sph.w;
}

float iSphere( in vec3 ro, in vec3 rd, in vec4 sph ) {
    vec3 oc = ro - sph.xyz;
    float b = dot(oc, rd);
    float c = dot(oc, oc) - sph.w * sph.w;
    float h = b * b - c;
    if (h < 0.0) return -1.0;

	float s = sqrt(h);
	float t1 = -b - s;
	float t2 = -b + s;
	
	return t1 < 0.0 ? t2 : t1;
}

vec3 nPlane( in vec3 ro, in vec4 obj ) {
    return obj.xyz;
}

float iPlane( in vec3 ro, in vec3 rd, in vec4 pla ) {
    return (-pla.w - dot(pla.xyz,ro)) / dot( pla.xyz, rd );
}

//-----------------------------------------------------
// scene
//-----------------------------------------------------

vec3 cosWeightedRandomHemisphereDirection( const vec3 n, inout float seed ) {
  	vec2 r = hash2(seed);
    
	vec3  uu = normalize( cross( n, vec3(0.0,1.0,1.0) ) );
	vec3  vv = cross( uu, n );
	
	float ra = sqrt(r.y);
	float rx = ra*cos(6.2831*r.x); 
	float ry = ra*sin(6.2831*r.x);
	float rz = sqrt( 1.0-r.y );
	vec3  rr = vec3( rx*uu + ry*vv + rz*n );
    
    return normalize( rr );
}

vec3 randomSphereDirection(inout float seed) {
    vec2 h = hash2(seed) * vec2(2.,6.28318530718)-vec2(1,0);
    float phi = h.y;
	return vec3(sqrt(1.-h.x*h.x)*vec2(sin(phi),cos(phi)),h.x);
}

vec3 randomHemisphereDirection( const vec3 n, inout float seed ) {
	vec3 dr = randomSphereDirection(seed);
	return dot(dr,n) * dr;
}

//-----------------------------------------------------
// light
//-----------------------------------------------------

const vec4 lightSphere = vec4( 3.0,7.5,2.5, .5 );
vec4 movingSphere;

void initMovingSphere( float time ) {
	movingSphere = vec4( 1.+abs(1.0*sin(time*1.3)), 1.+abs(2.0*sin(time)), 7.-abs(6.*cos(time*0.4)), 1.0);
}

vec3 sampleLight( const in vec3 ro, inout float seed ) {
    vec3 n = randomSphereDirection(seed) * lightSphere.w;
    return lightSphere.xyz + n;
}

//-----------------------------------------------------
// scene
//-----------------------------------------------------

vec2 intersect( in vec3 ro, in vec3 rd, inout vec3 normal ) {
	vec2 res = vec2( 1e20, -1.0 );
    float t;
	
	t = iPlane( ro, rd, vec4( 0.0, 1.0, 0.0,0.0 ) ); if( t>eps && t<res.x ) { res = vec2( t, 1. ); normal = vec3( 0., 1., 0.); }
	t = iPlane( ro, rd, vec4( 0.0, 0.0,-1.0,8.0 ) ); if( t>eps && t<res.x ) { res = vec2( t, 1. ); normal = vec3( 0., 0.,-1.); }
    t = iPlane( ro, rd, vec4( 1.0, 0.0, 0.0,0.0 ) ); if( t>eps && t<res.x ) { res = vec2( t, 2. ); normal = vec3( 1., 0., 0.); }
#ifdef FULLBOX
    t = iPlane( ro, rd, vec4( 0.0,-1.0, 0.0,5.49) ); if( t>eps && t<res.x && ro.z+rd.z*t < 5.5 ) { res = vec2( t, 1. ); normal = vec3( 0.,-1., 0.); }
    t = iPlane( ro, rd, vec4(-1.0, 0.0, 0.0,5.59) ); if( t>eps && t<res.x ) { res = vec2( t, 3. ); normal = vec3(-1., 0., 0.); }
#endif

	t = iSphere( ro, rd, movingSphere             ); if( t>eps && t<res.x ) { res = vec2( t, 1. ); normal = nSphere( ro+t*rd, movingSphere ); }
    t = iSphere( ro, rd, vec4( 4.0,1.0, 4.0, 1.0) ); if( t>eps && t<res.x ) { res = vec2( t, 5. ); normal = nSphere( ro+t*rd, vec4( 4.0,1.0, 4.0,1.0) ); }
    t = iSphere( ro, rd, lightSphere ); if( t>eps && t<res.x ) { res = vec2( t, 0.0 );  normal = nSphere( ro+t*rd, lightSphere ); }
					  
    return res;					  
}

bool intersectShadow( in vec3 ro, in vec3 rd, in float dist ) {
    float t;
	
	t = iSphere( ro, rd, movingSphere            );  if( t>eps && t<dist ) { return true; }
    t = iSphere( ro, rd, vec4( 4.0,1.0, 4.0,1.0) );  if( t>eps && t<dist ) { return true; }
#ifdef FULLBOX    
    t = iPlane( ro, rd, vec4( 0.0,-1.0, 0.0,5.49) ); if( t>eps && t<dist && ro.z+rd.z*t < 5.5 ) { return true; }
#endif
    return false; // optimisation: other planes don't cast shadows in this scene
}

//-----------------------------------------------------
// materials
//-----------------------------------------------------

vec3 matColor( const in float mat ) {
	vec3 nor = vec3(0., 0.95, 0.);
	
	if( mat<3.5 ) nor = REDCOLOR;
    if( mat<2.5 ) nor = GREENCOLOR;
	if( mat<1.5 ) nor = WHITECOLOR;
	if( mat<0.5 ) nor = LIGHTCOLOR;
					  
    return nor;					  
}

bool matIsSpecular( const in float mat ) {
    return mat > 4.5;
}

bool matIsLight( const in float mat ) {
    return mat < 0.5;
}

//-----------------------------------------------------
// brdf
//-----------------------------------------------------

vec3 getBRDFRay( in vec3 n, const in vec3 rd, const in float m, inout bool specularBounce, inout float seed ) {
    specularBounce = false;
    
    vec3 r = cosWeightedRandomHemisphereDirection( n, seed );
    if(  !matIsSpecular( m ) ) {
        return r;
    } else {
        specularBounce = true;
        
        float n1, n2, ndotr = dot(rd,n);
        
        if( ndotr > 0. ) {
            n1 = 1./1.5; n2 = 1.;
            n = -n;
        } else {
            n2 = 1./1.5; n1 = 1.;
        }
                
        float r0 = (n1-n2)/(n1+n2); r0 *= r0;
		float fresnel = r0 + (1.-r0) * pow(1.0-abs(ndotr),5.);
        
        vec3 ref = refract( rd, n, n2/n1 );        
        if( ref == vec3(0) || hash1(seed) < fresnel || m > 6.5 ) {
            ref = reflect( rd, n );
        }
        
        return ref; // normalize( ref + 0.1 * r );
	}
}

//-----------------------------------------------------
// lightpath
//-----------------------------------------------------

struct LightPathNode {
    vec3 color;
    vec3 position;
    vec3 normal;
};

LightPathNode lpNodes[LIGHTPATHLENGTH];

void constructLightPath( inout float seed ) {
    vec3 ro = randomSphereDirection( seed );
    vec3 rd = cosWeightedRandomHemisphereDirection( ro, seed );
    ro = lightSphere.xyz - ro*lightSphere.w;
    vec3 color = LIGHTCOLOR;
 
    for( int i=0; i<LIGHTPATHLENGTH; ++i ) {
        lpNodes[i].position = lpNodes[i].color = lpNodes[i].normal = vec3(0.);
    }
    
    bool specularBounce;
    float w = 0.;
    
    for( int i=0; i<LIGHTPATHLENGTH; i++ ) {
		vec3 normal;
        vec2 res = intersect( ro, rd, normal );
        
        if( res.y > 0.5 && dot( rd, normal ) < 0. ) {
            ro = ro + rd*res.x;            
            color *= matColor( res.y );
            
            lpNodes[i].position = ro;
            if( !matIsSpecular( res.y ) ) lpNodes[i].color = color;// * clamp( dot( normal, -rd ), 0., 1.);
            lpNodes[i].normal = normal;
            
            rd = getBRDFRay( normal, rd, res.y, specularBounce, seed );
        } else break;
    }
}

//-----------------------------------------------------
// eyepath
//-----------------------------------------------------

float getWeightForPath( int e, int l ) {
    return float(e + l + 2);
}

vec3 traceEyePath( in vec3 ro, in vec3 rd, const in bool bidirectTrace, inout float seed ) {
    vec3 tcol = vec3(0.);
    vec3 fcol  = vec3(1.);
    
    bool specularBounce = true; 
	int jdiff = 0;
    
    for( int j=0; j<EYEPATHLENGTH; ++j ) {
        vec3 normal;
        
        vec2 res = intersect( ro, rd, normal );
        if( res.y < -0.5 ) {
            return tcol;
        }
        
        if( matIsLight( res.y ) ) {
            if( bidirectTrace ) {
            	if( specularBounce ) tcol += fcol*LIGHTCOLOR;
            } else {
               tcol += fcol*LIGHTCOLOR;
            }
            return tcol; // the light has no diffuse component, therefore we can return col
        }
        
        ro = ro + res.x * rd;   
        vec3 rdi = rd;
        rd = getBRDFRay( normal, rd, res.y, specularBounce, seed );
            
        if(!specularBounce || dot(rd,normal) < 0.) {  
        	fcol *= matColor( res.y );
        }
        
        if( bidirectTrace  ) {
		    vec3 ld = sampleLight( ro, seed ) - ro;       
            
            // path of (j+1) eyepath-nodes, and 1 lightpath-node ( = direct light sampling )
            vec3 nld = normalize(ld);
            if( !specularBounce &&  !intersectShadow( ro, nld, length(ld)) ) {
                float cos_a_max = sqrt(1. - clamp(lightSphere.w * lightSphere.w / dot(lightSphere.xyz-ro, lightSphere.xyz-ro), 0., 1.));
                float weight = 2. * (1. - cos_a_max);

                tcol += (fcol * LIGHTCOLOR) * (weight * clamp(dot( nld, normal ), 0., 1.))
                    / getWeightForPath(jdiff,-1);
            }

            
            if( !matIsSpecular( res.y ) ) {
                for( int i=0; i<LIGHTPATHLENGTH; ++i ) {
                    // path of (j+1) eyepath-nodes, and i+2 lightpath-nodes.
                    vec3 lp = lpNodes[i].position - ro;
                    vec3 lpn = normalize( lp );
                    vec3 lc = lpNodes[i].color;

                    if( !intersectShadow(ro, lpn, length(lp)) ) {
                        // weight for going from (j+1)th eyepath-node to (i+2)th lightpath-node
                        
                        // IS THIS CORRECT ???
                        
                        float weight = 
                                 clamp( dot( lpn, normal ), 0.0, 1.) 
                               * clamp( dot( -lpn, lpNodes[i].normal ), 0., 1.)
                               * clamp(1. / dot(lp, lp), 0., 1.)
                            ;

                        tcol += lc * fcol * weight / getWeightForPath(jdiff,i);
                    }
                }
            }
        }
        
        if( !specularBounce) jdiff++; else jdiff = 0;
    }  
    
    return tcol;
}

//-----------------------------------------------------
// main
//-----------------------------------------------------

void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
	vec2 q = fragCoord.xy / iResolution.xy;
    
	float splitCoord = (iMouse.x == 0.0) ? iResolution.x/2. + iResolution.x*cos(iTime*.5) : iMouse.x;
    bool bidirectTrace = fragCoord.x < splitCoord;
    
    //-----------------------------------------------------
    // camera
    //-----------------------------------------------------

    vec2 p = -1.0 + 2.0 * (fragCoord.xy) / iResolution.xy;
    p.x *= iResolution.x/iResolution.y;

#ifdef ANIMATENOISE
    float seed = p.x + p.y * 3.43121412313 + fract(1.12345314312*iTime);
#else
    float seed = p.x + p.y * 3.43121412313;
#endif
    
    vec3 ro = vec3(2.78, 2.73, -8.00);
    vec3 ta = vec3(2.78, 2.73,  0.00);
    vec3 ww = normalize( ta - ro );
    vec3 uu = normalize( cross(ww,vec3(0.0,1.0,0.0) ) );
    vec3 vv = normalize( cross(uu,ww));

    //-----------------------------------------------------
    // render
    //-----------------------------------------------------

    vec3 col = vec3(0.0);
    vec3 tot = vec3(0.0);
    vec3 uvw = vec3(0.0);
    
    for( int a=0; a<SAMPLES; a++ ) {

        vec2 rpof = 4.*(hash2(seed)-vec2(0.5)) / iResolution.xy;
	    vec3 rd = normalize( (p.x+rpof.x)*uu + (p.y+rpof.y)*vv + 3.0*ww );
        
#ifdef DOF
	    vec3 fp = ro + rd * 12.0;
   		vec3 rof = ro + (uu*(hash1(seed)-0.5) + vv*(hash1(seed)-0.5))*0.125;
    	rd = normalize( fp - rof );
#else
        vec3 rof = ro;
#endif        
        
#ifdef MOTIONBLUR
        initMovingSphere( iTime + hash1(seed) / MOTIONBLURFPS );
#else
        initMovingSphere( iTime );        
#endif
        
        if( bidirectTrace ) {
            constructLightPath( seed );
        }
        
        col = traceEyePath( rof, rd, bidirectTrace, seed );

        tot += col;
        
        seed = mod( seed*1.1234567893490423, 13. );
    }
    
    tot /= float(SAMPLES);
    
#ifdef SHOWSPLITLINE
	if (abs(fragCoord.x - splitCoord) < 1.0) {
		tot.x = 1.0;
	}
#endif
    
	tot = pow( clamp(tot,0.0,1.0), vec3(0.45) );

    fragColor = vec4( tot, 1.0 );
}`,name:`Image`,description:``,type:`image`}]},{ver:`0.1`,info:{id:`Xls3WM`,date:`1422520157`,viewed:2916,name:`[2TC 15] Toxic lake`,description:`I am just one day at home between two holidays, so I don't have the time to really participate in this contest :(. This shader is based on  https://www.shadertoy.com/view/4ls3D4 by Dave_Hoskins. I have added fbm and color. `,likes:41,published:`Public API`,usePreview:0,tags:[`3d`,`raymarching`,`fbm`,`2tc15`]},renderpass:[{inputs:[{id:`Xsf3zn`,filepath:`/media/a/f735bee5b64ef98879dc618b016ecf7939a5756040c2cde21ccb15e69a6e1cfb.png`,type:`texture`,channel:0,sampler:{filter:`mipmap`,wrap:`repeat`,vflip:`false`,srgb:`false`,internal:`byte`},published:1}],outputs:[],code:`// Created by Reinder Nijhoff 2015
// Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License.
// @reindernijhoff
//
// Based on https://www.shadertoy.com/view/4ls3D4 by Dave_Hoskins

#define n b = .5*(b + texture(iChannel0, (c.xy + vec2(37, 17) * floor(c.z)) / 256.).x); c *= .4;

void mainImage( out vec4 f, in vec2 w ) {
    vec3 p = vec3(w.xy / iResolution.xy - .5, .2), 
	d = p, a = p, b = p-p, c;

    for(int i = 0; i<99; i++) {
        c = p; c.z += iTime * 5.;
        n
        n
        n
        a += (1. - a) * b.x * abs(p.y) / 4e2;
        p += d;
    }
    f = vec4(1. - a*a,1);
}

`,name:`Image`,description:``,type:`image`}]},{ver:`0.1`,info:{id:`4tsGD7`,date:`1422535702`,viewed:6720,name:`[2TC 15] Minecraft`,description:`A voxel landscape in two tweets (280 chars). (Remake of this shader: [url]https://www.shadertoy.com/view/4ds3WS[/url])`,likes:25,published:`Public API`,usePreview:0,tags:[`3d`,`raymarching`,`voxel`,`2tc15`]},renderpass:[{inputs:[],outputs:[],code:`// [2TC 15] Minecraft. Created by Reinder Nijhoff 2015
// Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License.
// @reindernijhoff
//
// https://www.shadertoy.com/view/4tsGD7
// 

void mainImage( out vec4 z, in vec2 w ) {
    vec3 d = vec3(w,1)/iResolution-.5, p, c, f, g=d, o, y=vec3(1,2,0);
 	o.y = 3.*cos((o.x=.3)*(o.z=iDate.w));

    for( float i=.0; i<9.; i+=.01 ) {
        f = fract(c = o += d*i*.01), p = floor( c )*.3;
        if( cos(p.z) + sin(p.x) > ++p.y ) {
	    	g = (f.y-.04*cos((c.x+c.z)*40.)>.8?y:f.y*y.yxz) / i;
            break;
        }
    }
    z.xyz = g;
}

/*

// original:


void main() {
    vec3 d = gl_fragCoord.xyw/iResolution-.5, p, c, f, g=d, o, y=vec3(1,2,0);
 	o.y = 3.*cos((o.x=.3)*(o.z=iDate.w));

    for( float i=.0; i<9.; i+=.01 ) {
        f = fract(c = o += d*i*.01), p = floor( c )*.3;
        if( cos(p.z) + sin(p.x) > ++p.y ) {
	    	g = (f.y-.04*cos((c.x+c.z)*40.)>.8?y:f.y*y.yxz) / i;
            break;
        }
    }
    gl_fragColor.xyz = g;
}

*/`,name:`Image`,description:``,type:`image`}]},{ver:`0.1`,info:{id:`MtlGWM`,date:`1422556895`,viewed:5755,name:`[2TC 15] Psychedelic Sand Dunes`,description:`Psychedelic sand dunes in two tweets. Based on my shader [2TC 15] Minecraft ([url]https://www.shadertoy.com/view/4tsGD7[/url]).
There are some chars left, so please give suggestions to improve this one!`,likes:70,published:`Public API`,usePreview:0,tags:[`3d`,`raymarching`,`2tc15`,`dunes`]},renderpass:[{inputs:[],outputs:[],code:`// [2TC 15] Psychedelic Sand Dunes. Created by Reinder Nijhoff 2015
// Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License.
// @reindernijhoff
//
// https://www.shadertoy.com/view/MtlGWM
//

void mainImage( out vec4 f, in vec2 w ) {
    vec3 d = vec3(w.xy,1)/iResolution-.5, p=d-d, o=d;
 	
    o.z+=iDate.w*4.;
    float i=.0;
    
    for( ; i<9. && cos(p.z) - abs(sin(p.x*.7+cos(p.z))) < ++p.y; i+=.01 ) 
        p = (o += d*i*.05)*.3;

    f.xyz = mix( (3.+p.y) * vec3(.6,.3,0), d, i/9.);
}

/* or, in 218 char:

void main() {
    vec3 d = gl_fragCoord.xyw/iResolution-.5, p, c, g=d, o=d;

    for( float i=.0; i<9.; i+=.01 ) {
        p = (c = o += d*i*.05)*.3;
        if(  abs(sin(p.x+cos(p.z+iDate.w))) > p.y+2. ) {
	    	g = mix( (3.+p.y) * vec3(.6,.3,0), d, i/9.);
            break;
        }
    }
    gl_fragColor.xyz = g;
}

*/`,name:`Image`,description:``,type:`image`}]},{ver:`0.1`,info:{id:`ltjGRz`,date:`1426806534`,viewed:7374,name:`[NV15] Space`,description:`Space - winner of the 'best visuals' category of the Shadertoy Hackathon @ NVSCENE 2015.

See [url=https://www.shadertoy.com/view/4tjGRh]4tjGRh[/url] for the updated shader with space-to-surface flight.`,likes:65,published:`Public API`,usePreview:0,tags:[`space`]},renderpass:[{inputs:[],outputs:[{id:`4dfGRr`,channel:0}],code:`// [NV15] Space. Created by Reinder Nijhoff 2015
// Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License.
// @reindernijhoff
//
// https://www.shadertoy.com/view/ltjGRz
//

#define SHOW_ASTEROIDS
//#define HIGH_QUALITY

const float PI = 3.14159265359;
const float DEG_TO_RAD = (PI / 180.0);
const float MAX = 10000.0;

const float EARTH_RADIUS = 1000.;
const float EARTH_ATMOSPHERE = 10.;
const float RING_INNER_RADIUS = 1500.;
const float RING_OUTER_RADIUS = 2300.;
const float RING_DETAIL_DISTANCE = 40.;
const float RING_HEIGHT = 2.;
const float RING_VOXEL_STEP_SIZE = .03;
const vec3  RING_COLOR_1 = vec3(0.42,0.3,0.2);
const vec3  RING_COLOR_2 = vec3(0.51,0.41,0.32) * 0.2;

const int   ASTEROID_NUM_STEPS = 10;
const float ASTEROID_TRESHOLD 	= 0.001;
const float ASTEROID_EPSILON 	= 1e-6;
const float ASTEROID_DISPLACEMENT = 0.1;

#ifdef HIGH_QUALITY
const int   RING_VOXEL_STEPS = 60;
const float ASTEROID_MAX_DISTANCE = 2.7; 
const float ASTEROID_RADIUS = 0.12;
#else
const int   RING_VOXEL_STEPS = 26;
const float ASTEROID_MAX_DISTANCE = 1.; // RING_VOXEL_STEPS * RING_VOXEL_STEP_SIZE
const float ASTEROID_RADIUS = 0.13;
#endif

const vec3  SUN_DIRECTION = vec3( .940721,  .28221626, .18814417 );
const vec3 SUN_COLOR = vec3(1.0, .7, .55)*.2;

//-----------------------------------------------------
// Noise functions
//-----------------------------------------------------

float hash( float n ) {
    return fract(sin(n)*43758.5453123);
}
float hash( vec2 p ) {
	float h = dot(p,vec2(127.1,311.7));	
    return fract(sin(h)*43758.5453123);
}
float hash( vec3 p ) {
	float h = dot(p,vec3(127.1,311.7,758.5453123));	
    return fract(sin(h)*43758.5453123);
}
vec3 hash31(float p) {
	vec3 h = vec3(1275.231,4461.7,7182.423) * p;	
    return fract(sin(h)*43758.543123);
}
vec3 hash33( vec3 p) {
    return vec3( hash(p), hash(p.zyx), hash(p.yxz) );
}
float noise( in float p ) {    
    float i = floor( p );
    float f = fract( p );	
	float u = f*f*(3.0-2.0*f);
    return -1.0+2.0* mix( hash( i + 0. ), hash( i + 1. ), u);
}
float noise( in vec2 p ) {    
    vec2 i = floor( p );
    vec2 f = fract( p );	
	vec2 u = f*f*(3.0-2.0*f);
    return -1.0+2.0*mix( mix( hash( i + vec2(0.0,0.0) ), 
                     hash( i + vec2(1.0,0.0) ), u.x),
                mix( hash( i + vec2(0.0,1.0) ), 
                     hash( i + vec2(1.0,1.0) ), u.x), u.y);
}
float noise( in vec3 x ) {
    vec3 p = floor(x);
    vec3 f = fract(x);
    f = f*f*(3.0-2.0*f);
    float n = p.x + p.y*157.0 + 113.0*p.z;
    return mix(mix(mix( hash(n+  0.0), hash(n+  1.0),f.x),
                   mix( hash(n+157.0), hash(n+158.0),f.x),f.y),
               mix(mix( hash(n+113.0), hash(n+114.0),f.x),
                   mix( hash(n+270.0), hash(n+271.0),f.x),f.y),f.z);
}

const mat2 m2 = mat2( 0.80, -0.60, 0.60, 0.80 );

float fbm( vec2 p ) {
    float f = 0.0;
    f += 0.5000*noise( p ); p = m2*p*2.02;
    f += 0.2500*noise( p ); p = m2*p*2.03;
    f += 0.1250*noise( p ); p = m2*p*2.01;
    f += 0.0625*noise( p );
    
    return f/0.9375;
}

// fBm
float fbm3(vec3 p, float a, float f) {
    return noise(p);
}

float fbm3_high(vec3 p, float a, float f) {
    float ret = 0.0;    
    float amp = 1.0;
    float frq = 1.0;
    for(int i = 0; i < 4; i++) {
        float n = pow(noise(p * frq),2.0);
        ret += n * amp;
        frq *= f;
        amp *= a * (pow(n,0.2));
    }
    return ret;
}

//-----------------------------------------------------
// Lightning functions
//-----------------------------------------------------

float diffuse(vec3 n,vec3 l) { 
    return clamp(dot(n,l),0.,1.);
}

float specular(vec3 n,vec3 l,vec3 e,float s) {    
    float nrm = (s + 8.0) / (3.1415 * 8.0);
    return pow(max(dot(reflect(e,n),l),0.0),s) * nrm;
}

//-----------------------------------------------------
// Math functions
//-----------------------------------------------------

vec2 rotate(float angle, vec2 v) {
    return vec2(cos(angle) * v.x + sin(angle) * v.y, cos(angle) * v.y - sin(angle) * v.x);
}

float boolSub(float a,float b) { 
    return max(a,-b); 
}
float sphere(vec3 p,float r) {
	return length(p)-r;
}

//-----------------------------------------------------
// Intersection functions (by iq)
//-----------------------------------------------------

vec3 nSphere( in vec3 pos, in vec4 sph ) {
    return (pos-sph.xyz)/sph.w;
}

float iSphere( in vec3 ro, in vec3 rd, in vec4 sph ) {
	vec3 oc = ro - sph.xyz;
	float b = dot( oc, rd );
	float c = dot( oc, oc ) - sph.w*sph.w;
	float h = b*b - c;
	if( h<0.0 ) return -1.0;
	return -b - sqrt( h );
}

vec3 nPlane( in vec3 ro, in vec4 obj ) {
    return obj.xyz;
}

float iPlane( in vec3 ro, in vec3 rd, in vec4 pla ) {
    return (-pla.w - dot(pla.xyz,ro)) / dot( pla.xyz, rd );
}


//-----------------------------------------------------
// Wet stone by TDM
// 
// https://www.shadertoy.com/view/ldSSzV
//-----------------------------------------------------

float rock( const in vec3 p, const in vec3 id ) {  
    float d = sphere(p,ASTEROID_RADIUS);    
    for(int i = 0; i < 7; i++) {
        float ii = float(i)+id.x;
        float r = (ASTEROID_RADIUS*2.5) + ASTEROID_RADIUS*hash(ii);
        vec3 v = normalize(hash31(ii) * 2.0 - 1.0);
    	d = boolSub(d,sphere(p+v*r,r * 0.8));       
    }
    return d;
}

float map( const in vec3 p, const in vec3 id) {
    float d = rock(p, id) + fbm3(p*4.0,0.4,2.96) * ASTEROID_DISPLACEMENT;
    return d;
}

float map_detailed( const in vec3 p, const in vec3 id) {
    float d = rock(p, id) + fbm3_high(p*4.0,0.4,2.96) * ASTEROID_DISPLACEMENT;
    return d;
}

void asteroidTransForm(inout vec3 ro, const in vec3 id ) {
    float xyangle = (id.x-.5)*iTime*2.;
    ro.xy = rotate( xyangle, ro.xy );
    
    float yzangle = (id.y-.5)*iTime*2.;
    ro.yz = rotate( yzangle, ro.yz );
}
void asteroidUnTransForm(inout vec3 ro, const in vec3 id ) {
    float yzangle = (id.y-.5)*iTime*2.;
    ro.yz = rotate( -yzangle, ro.yz );

    float xyangle = (id.x-.5)*iTime*2.;
    ro.xy = rotate( -xyangle, ro.xy );  
}
// tracing
vec3 asteroidGetNormal(vec3 p, vec3 id) {
    asteroidTransForm( p, id );
    
    vec3 n;
    n.x = map_detailed(vec3(p.x+ASTEROID_EPSILON,p.y,p.z), id);
    n.y = map_detailed(vec3(p.x,p.y+ASTEROID_EPSILON,p.z), id);
    n.z = map_detailed(vec3(p.x,p.y,p.z+ASTEROID_EPSILON), id);
    n = normalize(n-map_detailed(p, id));
    
    asteroidUnTransForm( n, id );
    return n;
}

vec2 asteroidSpheretracing(vec3 ori, vec3 dir, vec3 id) {

    asteroidTransForm( ori, id );
    asteroidTransForm( dir, id );
    
    vec2 td = vec2(0.0);
    for(int i = 0; i < ASTEROID_NUM_STEPS; i++) {
        vec3 p = ori + dir * td.x;
        td.y = map(p, id);
        if(td.y < ASTEROID_TRESHOLD) break;
        td.x += (td.y-ASTEROID_TRESHOLD) * 0.9;
    }
    return td;
}

// stone
vec3 asteroidGetStoneColor(vec3 p, float c, vec3 l, vec3 n, vec3 e) {
   vec3 color = RING_COLOR_1;
        
	float fresnel = .5*pow(1.0-abs(dot(n,e)),5.);
    color = mix( diffuse(n,l)*color*SUN_COLOR, SUN_COLOR*specular(n,l,e,3.0),fresnel);    
    
    return color;
}


//-----------------------------------------------------
// Ring (by me ;))
//-----------------------------------------------------

vec3 ringShadowColor( const in vec3 ro ) {
    if( iSphere( ro, SUN_DIRECTION, vec4( 0., 0., 0., EARTH_RADIUS ) ) > 0. ) {
        return vec3(0.);
    }
    return vec3(1.);
}

bool ringMap( const in vec3 ro ) {
    return ro.z < RING_HEIGHT/RING_VOXEL_STEP_SIZE && hash(ro)<.5;
}

vec4 renderRingNear( const in vec3 ro, const in vec3 rd ) { 
// find startpoint 
    float d1 = iPlane( ro, rd, vec4( 0., 0., 1., RING_HEIGHT ) );
    float d2 = iPlane( ro, rd, vec4( 0., 0., 1., -RING_HEIGHT ) );
   
    if( d1 < 0. && d2 < 0. ) return vec4( 0. );
    
    float d = min( max(d1,0.), max(d2,0.) );
    
    if( d > ASTEROID_MAX_DISTANCE ) return vec4( 0. );
    
    vec3 ros = ro + rd*d;
    
    // avoid precision problems..
    vec2 mroxy = mod(ros.xy, vec2(5.));
    vec2 roxy = ros.xy - mroxy;
    ros.xy -= roxy;
    
    ros /= RING_VOXEL_STEP_SIZE;
    
	vec3 pos = floor(ros);
	vec3 ri = 1.0/rd;
	vec3 rs = sign(rd);
	vec3 dis = (pos-ros + 0.5 + rs*0.5) * ri;
	
    float alpha = 0., dint;
	vec3 offset = vec3(0.), id, asteroidro;
    vec2 asteroid;
    
	for( int i=0; i<RING_VOXEL_STEPS; i++ ) {
		if( ringMap(pos) ) {
            id = hash33(pos);
            offset = id*(1.-2.*ASTEROID_RADIUS)+ASTEROID_RADIUS;
            dint = iSphere( ros, rd, vec4(pos+offset, ASTEROID_RADIUS) );
            
#ifdef SHOW_ASTEROIDS   
            if( dint > 0. ) {
                asteroidro = ros+rd*dint-(pos+offset);
    	        asteroid = asteroidSpheretracing( asteroidro, rd, id );
				
                if( asteroid.y < .1 ) {
	                alpha = 1.;
        	    	break;	    
                }
            }
#else
        if( dint > 0. ) {
            alpha = 1.;
            break;	    
        }
#endif
        }
		vec3 mm = step(dis.xyz, dis.yxy) * step(dis.xyz, dis.zzx);
		dis += mm * rs * ri;
        pos += mm * rs;
	}
    
    if( alpha > 0. ) {
        
#ifdef SHOW_ASTEROIDS            
        vec3 intersection = ros + rd*(asteroid.x+dint);
        vec3 n = asteroidGetNormal( asteroidro + rd*asteroid.x, id );
#else
        vec3 intersection = ros + rd*dint;
        vec3 n = nSphere( intersection, vec4(pos+offset, ASTEROID_RADIUS) );     
#endif
        vec3 col = asteroidGetStoneColor(intersection, .1, SUN_DIRECTION, n, rd);

        intersection *= RING_VOXEL_STEP_SIZE;
        intersection.xy += roxy;
        col *= ringShadowColor( intersection );
         
	    return vec4( col, 1.-smoothstep(0.4*ASTEROID_MAX_DISTANCE, 0.5* ASTEROID_MAX_DISTANCE, distance( intersection, ro ) ) );
    }
    
	return vec4(0.);
}

//-----------------------------------------------------
// Ring (by me ;))
//-----------------------------------------------------

vec4 renderRingFar( const in vec3 ro, const in vec3 rd, inout float maxd ) {
    // intersect plane
    float d = iPlane( ro, rd, vec4( 0., 0., 1., 0.) );
    
    if( d > 0. && d < maxd ) {
        maxd = d;
	    vec3 intersection = ro + rd*d;
        float l = length(intersection.xy);
        
        if( l > RING_INNER_RADIUS && l < RING_OUTER_RADIUS ) {
            float dens = .5 + .5 * (.2+.8*noise( l*.07 )) * (.5+.5*noise(intersection.xy));
            vec3 col = mix( RING_COLOR_1, RING_COLOR_2, abs( noise(l*0.2) ) ) * abs(dens) * 1.5;
            
            col *= ringShadowColor( intersection );
    		col *= .8+.3*diffuse( vec3(0,0,1), SUN_DIRECTION );
			col *= SUN_COLOR;
            return vec4( col, dens );
        }
    }
    return vec4(0.);
}

vec4 renderRing( const in vec3 ro, const in vec3 rd, inout float maxd ) {
    vec4 far = renderRingFar( ro, rd, maxd );
	
    float l = length( ro.xy );
    
    // detail needed ?
    
    if( abs(ro.z) < RING_HEIGHT+RING_DETAIL_DISTANCE 
        && l < RING_OUTER_RADIUS+RING_DETAIL_DISTANCE 
        && l > RING_INNER_RADIUS-RING_DETAIL_DISTANCE ) {
     	
	    float d = iPlane( ro, rd, vec4( 0., 0., 1., 0.) );
        float detail = mix( .5 * noise( fract(ro.xy+rd.xy*d) * 92.1)+.25, 1., smoothstep( 0.,RING_DETAIL_DISTANCE, d) );
        far.xyz *= detail;    
    }
    
	// are asteroids neaded ?
    if( abs(ro.z) < RING_HEIGHT+ASTEROID_MAX_DISTANCE 
        && l < RING_OUTER_RADIUS+ASTEROID_MAX_DISTANCE 
        && l > RING_INNER_RADIUS-ASTEROID_MAX_DISTANCE ) {
        
        vec4 near = renderRingNear( ro, rd );
        far = mix( far, near, near.w );
        maxd=0.;
    }
    
    return far;
}

//-----------------------------------------------------
// Planet (by me ;))
//-----------------------------------------------------

vec4 renderStars( const in vec3 rd ) {
	vec3 rds = rd;
	vec3 col = vec3(0);
    float v = 1.0/( 2. * ( 1. + rds.z ) );
    
    vec2 xy = vec2(rds.y * v, rds.x * v);
    float s = noise(rds*134.);
 //   s += noise_3(rds*370.);
    s += noise(rds*470.);
    s = pow(s,19.0) * 0.00001;
    if (s > 0.5) {
        vec3 backStars = vec3(s)*.5 * vec3(0.95,0.8,0.9); 
        col += backStars;
    }
	return   vec4( col, 1 ); 
} 

//-----------------------------------------------------
// Planet (by me ;))
//-----------------------------------------------------

vec4 renderPlanet( const in vec3 ro, const in vec3 rd, inout float maxd ) {
    float d = iSphere( ro, rd, vec4( 0., 0., 0., EARTH_RADIUS ) );
                      
	if( d < 0. || d > maxd) {
        return vec4(0);
	}
    maxd = d;
    vec3 col = vec3( .2, 7., 4. ) * 0.4;
    
    col *= diffuse( normalize( ro+rd*d ), SUN_DIRECTION ) * SUN_COLOR;
                 
    float m = MAX;
    col *= (1. - renderRingFar( ro+rd*d, SUN_DIRECTION, m ).w );
    
 	return vec4( col, 1 ); 
}

//-----------------------------------------------------
// Atmospheric Scattering by GLtracy
// 
// https://www.shadertoy.com/view/lslXDr
//-----------------------------------------------------

// scatter const
const float K_R = 0.166;
const float K_M = 0.0025;
const float E = 14.3; 						// light intensity
const vec3  C_R = vec3( 0.3, 0.7, 1.0 ); 	// 1 / wavelength ^ 4
const float G_M = -0.85;					// Mie g

const float SCALE_H = 4.0 / ( EARTH_ATMOSPHERE );
const float SCALE_L = 1.0 / ( EARTH_ATMOSPHERE );

const int NUM_OUT_SCATTER = 8;
const float FNUM_OUT_SCATTER = 8.0;

const int NUM_IN_SCATTER = 8;
const float FNUM_IN_SCATTER = 8.0;


// ray intersects sphere
// e = -b +/- sqrt( b^2 - c )
vec2 ray_vs_sphere( vec3 p, vec3 dir, float r ) {
	float b = dot( p, dir );
	float c = dot( p, p ) - r * r;
	
	float d = b * b - c;
	if ( d < 0.0 ) {
		return vec2( MAX, -MAX );
	}
	d = sqrt( d );
	
	return vec2( -b - d, -b + d );
}

// Mie
// g : ( -0.75, -0.999 )
//      3 * ( 1 - g^2 )               1 + c^2
// F = ----------------- * -------------------------------
//      2 * ( 2 + g^2 )     ( 1 + g^2 - 2 * g * c )^(3/2)
float phase_mie( float g, float c, float cc ) {
	float gg = g * g;
	
	float a = ( 1.0 - gg ) * ( 1.0 + cc );

	float b = 1.0 + gg - 2.0 * g * c;
	b *= sqrt( b );
	b *= 2.0 + gg;	
	
	return 1.5 * a / b;
}

// Reyleigh
// g : 0
// F = 3/4 * ( 1 + c^2 )
float phase_reyleigh( float cc ) {
	return 0.75 * ( 1.0 + cc );
}

float density( vec3 p ){
	return exp( -( length( p ) - EARTH_RADIUS ) * SCALE_H );
}

float optic( vec3 p, vec3 q ) {
	vec3 step = ( q - p ) / FNUM_OUT_SCATTER;
	vec3 v = p + step * 0.5;
	
	float sum = 0.0;
	for ( int i = 0; i < NUM_OUT_SCATTER; i++ ) {
		sum += density( v );
		v += step;
	}
	sum *= length( step ) * SCALE_L;
	
	return sum;
}

vec4 in_scatter( vec3 o, vec3 dir, vec2 e, vec3 l ) {
	float len = ( e.y - e.x ) / FNUM_IN_SCATTER;
	vec3 step = dir * len;
	vec3 p = o + dir * e.x;
	vec3 v = p + dir * ( len * 0.5 );

    float sumdensity = 0.;
	vec3 sum = vec3( 0.0 );

    for ( int i = 0; i < NUM_IN_SCATTER; i++ ) {
		vec2 f = ray_vs_sphere( v, l, EARTH_RADIUS + EARTH_ATMOSPHERE );
		vec3 u = v + l * f.y;
		
		float n = ( optic( p, v ) + optic( v, u ) ) * ( PI * 4.0 );
		
        float dens = density( v );
        
	    float m = MAX;
		sum += dens * exp( -n * ( K_R * C_R + K_M ) ) 
    		* (1. - renderRingFar( u, SUN_DIRECTION, m ).w );
        
		sumdensity += dens;
        
		v += step;
	}
	sum *= len * SCALE_L;
	
	float c  = dot( dir, -l );
	float cc = c * c;
	
	return vec4( sum * ( K_R * C_R * phase_reyleigh( cc ) + K_M * phase_mie( G_M, c, cc ) ) * E, sumdensity * len * SCALE_L);
}

vec4 renderAtmospheric( const in vec3 ro, const in vec3 rd, inout float d ) {
	vec2 e = ray_vs_sphere( ro, rd, EARTH_RADIUS + EARTH_ATMOSPHERE );
	if ( e.x > e.y ) {
        d = MAX;
		return vec4(0.);
	}
	
	vec2 f = ray_vs_sphere( ro, rd, EARTH_RADIUS + 3. );
	e.y = min( e.y, f.x );
	d = e.y;
    
    return in_scatter( ro, rd, e, SUN_DIRECTION );
}

//-----------------------------------------------------
// Lens flare by musk
//
// https://www.shadertoy.com/view/4sX3Rs
//-----------------------------------------------------

vec3 lensflare(vec2 uv,vec2 pos) {
	vec2 main = uv-pos;
	vec2 uvd = uv*(length(uv));
	
	float f0 = 1.5/(length(uv-pos)*16.0+1.0);
	
	float f1 = max(0.01-pow(length(uv+1.2*pos),1.9),.0)*7.0;

	float f2 = max(1.0/(1.0+32.0*pow(length(uvd+0.8*pos),2.0)),.0)*00.25;
	float f22 = max(1.0/(1.0+32.0*pow(length(uvd+0.85*pos),2.0)),.0)*00.23;
	float f23 = max(1.0/(1.0+32.0*pow(length(uvd+0.9*pos),2.0)),.0)*00.21;
	
	vec2 uvx = mix(uv,uvd,-0.5);
	
	float f4 = max(0.01-pow(length(uvx+0.4*pos),2.4),.0)*6.0;
	float f42 = max(0.01-pow(length(uvx+0.45*pos),2.4),.0)*5.0;
	float f43 = max(0.01-pow(length(uvx+0.5*pos),2.4),.0)*3.0;
	
	vec3 c = vec3(.0);
	
	c.r+=f2+f4; c.g+=f22+f42; c.b+=f23+f43;
	c = c*.5 - vec3(length(uvd)*.05);
	c+=vec3(f0);
	
	return c;
}

//-----------------------------------------------------
// cameraPath
//-----------------------------------------------------

vec3 pro, pta, pup;
float dro, dta, dup;

void camint( inout vec3 ret, const in float t, const in float duration, const in vec3 dest, inout vec3 prev, inout float prevt ) {

    if( t >= prevt && t <= prevt+duration ) {
    	ret = mix( prev, dest, smoothstep(prevt, prevt+duration, t) );
    }
    
    prev = dest;
    prevt += duration;
}

void cameraPath( in float t, out vec3 ro, out vec3 ta, out vec3 up ) {
    t = mod( t, 66. );
    
    dro = dta = dup = 0.;
    
    pro = ro = vec3(-6300. ,-5000. ,1500. );
    pta = ta = vec3(    0. ,    0. ,   0. );
    pup = up = vec3(    0. ,    0.2,   1. ); 
 
  
    camint( ro, t, 5., vec3(-4300. ,-1000. , 500. ), pro, dro );
    camint( ta, t, 5., vec3(    0. ,    0. ,   0. ), pta, dta );
    camint( up, t, 7., vec3(    0. ,    0.1,   1. ), pup, dup ); 
    
//    camint( ro, t, 5., vec3(-3300. , 1000. , 200. ), pro, dro );
//    camint( ta, t, 5., vec3(    0. ,    0. ,   0. ), pta, dta );
//    camint( up, t, 6., vec3(    0. ,  -0.3,    1. ), pup, dup ); 
    
    camint( ro, t, 8., vec3(-2000. , 1600. , 200. ), pro, dro );
    camint( ta, t, 5., vec3(    0. ,  700. ,-100. ), pta, dta );
    camint( up, t, 4., vec3(    0. ,  -0.3,    1. ), pup, dup ); 
    

    camint( ro, t, 3., vec3(-1355. , 1795. , 1.2 ), pro, dro );
    camint( ta, t, 1., vec3(    0. , 300. ,-600. ), pta, dta );
    camint( up, t, 6., vec3(    0. ,  0.1,    1. ), pup, dup );

    camint( ro, t, 15., vec3(-1354.95 , 1795.11 , 1.19 ), pro, dro );
    camint( ta, t, 19., vec3(    0. , 100. ,   600. ), pta, dta );
    camint( up, t, 14., vec3(    0. ,  0.3,    1. ), pup, dup );
    
    
    camint( ro, t, 7., vec3(-1354.93 , 1795.51 , 1.4 ), pro, dro );
    camint( ta, t, 7., vec3(    0. , 0. , 0. ), pta, dta );
    camint( up, t, 7., vec3(    0. ,  0.25,    1. ), pup, dup );
    
    
    camint( ro, t, 7., vec3(2900.5 , 3102. , 200.5 ), pro, dro );
    camint( ta, t, 7., vec3(    0. , 0. , 0. ), pta, dta );
    camint( up, t, 6., vec3(    0. ,  0.2,    1. ), pup, dup );
    
    camint( ro, t, 11., vec3(4102. , -2900. , 450. ), pro, dro );
    camint( ta, t, 11., vec3(    0. ,   -100. ,   0. ), pta, dta );
    camint( up, t, 18., vec3(    0. ,    0.15,   1. ), pup, dup ); 
    
    camint( ro, t, 10., vec3(-6300. ,-5000. , 1500. ), pro, dro );
    camint( ta, t, 10., vec3(    0. ,    0. ,   0. ), pta, dta );
    camint( up, t, 3., vec3(    0. ,    0.2,   1. ), pup, dup ); 
    
    up = normalize( up );
}

//-----------------------------------------------------
// mainImage
//-----------------------------------------------------

void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
	vec2 uv = fragCoord.xy / iResolution.xy;
    
    vec2 p = -1.0 + 2.0 * (fragCoord.xy) / iResolution.xy;
    p.x *= iResolution.x/iResolution.y;
    
    // black bands
    vec2 bandy = vec2(.1,.9);
    if( uv.y < bandy.x || uv.y > bandy.y ) {
        fragColor = vec4(0.,0.,0.,1.);
        return;
    }
    
    // camera
	vec3 ro, ta, up;
    cameraPath( iTime*.7, ro, ta, up );
      
    vec3 ww = normalize( ta - ro );
    vec3 uu = normalize( cross(ww,up) );
    vec3 vv = normalize( cross(uu,ww));
	vec3 rd = normalize( -p.x*uu + p.y*vv + 2.2*ww );
    
    float maxd = MAX;  
	vec3 col = renderStars( rd ).xyz;
    
    vec4 planet = renderPlanet( ro, rd, maxd );       
    if( planet.w > 0. ) col.xyz = planet.xyz;
    
    float atmosphered = MAX;
    vec4 atmosphere = renderAtmospheric( ro, rd, atmosphered );
    col = col * (1.-atmosphere.w ) + atmosphere.xyz; 

    vec4 ring = renderRing( ro, rd, maxd );
    if( ring.w > 0. && atmosphered < maxd ) {
	    ring.xyz = ring.xyz * (1.-atmosphere.w ) + atmosphere.xyz; 
    }
    col = col * (1.-ring.w ) + ring.xyz;
    
    // post processing
	col = pow( clamp(col,0.0,1.0), vec3(0.4545) );
	col *= vec3(1.,0.99,0.95);   
	col = clamp(1.06*col-0.03, 0., 1.);      
    
    
	vec2 sunuv =  2.7*vec2( dot( SUN_DIRECTION, -uu ), dot( SUN_DIRECTION, vv ) );
	float flare = dot( SUN_DIRECTION, normalize(ta-ro) );
	col += vec3(1.4,1.2,1.0)*lensflare(p, sunuv)*clamp( flare+.3, 0., 1.);
    
    fragColor = vec4( col ,1.0);
}
`,name:`Image`,description:``,type:`image`},{inputs:[],outputs:[{id:`XsfGRr`,channel:0}],code:`
//----------------------------------------------------------------------
// Wind function by Dave Hoskins https://www.shadertoy.com/view/4ssXW2


float hash( float n ) {
    return fract(sin(n)*43758.5453123);
}
vec2 Hash( vec2 p) {
    return vec2( hash(p.x), hash(p.y) );
}

//--------------------------------------------------------------------------
vec2 Noise( in vec2 x ) {
    vec2 p = floor(x);
    vec2 f = fract(x);
    f = f*f*(3.0-2.0*f);
    vec2 res = mix(mix( Hash(p + 0.0), Hash(p + vec2(1.0, 0.0)),f.x),
                   mix( Hash(p + vec2(0.0, 1.0) ), Hash(p + vec2(1.0, 1.0)),f.x),f.y);
    return res-.5;
}

//--------------------------------------------------------------------------
vec2 FBM( vec2 p ) {
    vec2 f;
	f  = 0.5000	 * Noise(p); p = p * 2.32;
	f += 0.2500  * Noise(p); p = p * 2.23;
	f += 0.1250  * Noise(p); p = p * 2.31;
    f += 0.0625  * Noise(p); p = p * 2.28;
    f += 0.03125 * Noise(p);
    return f;
}

//--------------------------------------------------------------------------
vec2 Wind(float n) {
    vec2 pos = vec2(n * (162.017331), n * (132.066927));
    vec2 vol = Noise(vec2(n*23.131, -n*42.13254))*1.0 + 1.0;
    
    vec2 noise = vec2(FBM(pos*33.313))* vol.x *.5 + vec2(FBM(pos*4.519)) * vol.y;
    
	return noise;
}

//----------------------------------------------------------------------



vec2 mainSound( in int samp,float time) {
    //16 - 38
 //   time -= 7.5;
    time *= .7;
    float vol = 1.-smoothstep(14.,16.5, time);
    vol += smoothstep(34.5,38., time);
    vol = vol*.8+.2;
    
	return Wind(time*.05) * vol;
}`,name:`Sound`,description:``,type:`sound`}]},{ver:`0.1`,info:{id:`4tjGRh`,date:`1427737621`,viewed:134114,name:`Planet Shadertoy`,description:`A seamless space-to-surface flight. This is a tribute to all the great shaders on Shadertoy! Use chrome without angle (or a Mac) and run this shader on med, or high settings (line 4 or 5) to get the full shader and the detail I was aiming for.`,likes:505,published:`Public API`,usePreview:1,tags:[`terrain`,`sea`,`space`,`ocean`,`planet`,`shadertoy`,`vr`,`asteroids`]},renderpass:[{inputs:[],outputs:[{id:`4dfGRr`,channel:0}],code:`// Planet Shadertoy. Created by Reinder Nijhoff 2015
// Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License.
// @reindernijhoff
//
// https://www.shadertoy.com/view/4tjGRh
//
// It uses code from the following shaders:
//
// Wet stone by TDM
// Atmospheric Scattering by GLtracy
// Seascape by TDM
// Elevated and Terrain Tubes by IQ
// LLamels by Eiffie
// Lens flare by Musk
// 

//#define HIGH_QUALITY
//#define MED_QUALITY
//#define LOW_QUALITY
#define VERY_LOW_QUALITY

const float PI = 3.14159265359;
const float DEG_TO_RAD = (PI / 180.0);
const float MAX = 10000.0;

const float EARTH_RADIUS = 1000.;
const float EARTH_ATMOSPHERE = 5.;
const float EARTH_CLOUDS = 1.;

const float RING_INNER_RADIUS = 1500.;
const float RING_OUTER_RADIUS = 2300.;
const float RING_HEIGHT = 2.;

#ifdef HIGH_QUALITY
    const int   SEA_NUM_STEPS = 7;
    const int	TERRAIN_NUM_STEPS = 140;
    const int   ASTEROID_NUM_STEPS = 11;
	const int	ASTEROID_NUM_BOOL_SUB = 7;
    const int   RING_VOXEL_STEPS = 25;
    const float ASTEROID_MAX_DISTANCE = 1.1; 
	const int   FBM_STEPS = 4;
    const int   ATMOSPHERE_NUM_OUT_SCATTER = 5;
    const int   ATMOSPHERE_NUM_IN_SCATTER = 7;

    #define DISPLAY_LLAMEL
    #define DISPLAY_CLOUDS
    #define DISPLAY_CLOUDS_DETAIL
    #define DISPLAY_TERRAIN_DETAIL
#endif

#ifdef MED_QUALITY
    const int   SEA_NUM_STEPS = 6;
    const int	TERRAIN_NUM_STEPS = 100;
    const int   ASTEROID_NUM_STEPS = 10;
	const int	ASTEROID_NUM_BOOL_SUB = 6;
    const int   RING_VOXEL_STEPS = 24;
    const float ASTEROID_MAX_DISTANCE = 1.; 
	const int   FBM_STEPS = 4;
    const int   ATMOSPHERE_NUM_OUT_SCATTER = 4;
    const int   ATMOSPHERE_NUM_IN_SCATTER = 6;
    #define DISPLAY_CLOUDS
    #define DISPLAY_TERRAIN_DETAIL
    #define DISPLAY_CLOUDS_DETAIL
#endif

#ifdef LOW_QUALITY
    const int   SEA_NUM_STEPS = 5;
    const int	TERRAIN_NUM_STEPS = 75;
    const int   ASTEROID_NUM_STEPS = 9;
	const int	ASTEROID_NUM_BOOL_SUB = 5;
    const int   RING_VOXEL_STEPS = 20;
    const float ASTEROID_MAX_DISTANCE = .85; 
	const int   FBM_STEPS = 3;
    const int   ATMOSPHERE_NUM_OUT_SCATTER = 3;
    const int   ATMOSPHERE_NUM_IN_SCATTER = 5;
#endif

#ifdef VERY_LOW_QUALITY
    const int   SEA_NUM_STEPS = 4;
    const int	TERRAIN_NUM_STEPS = 60;
    const int   ASTEROID_NUM_STEPS = 7;
	const int	ASTEROID_NUM_BOOL_SUB = 4;
    const int   RING_VOXEL_STEPS = 16;
    const float ASTEROID_MAX_DISTANCE = .67; 
	const int   FBM_STEPS = 3;
    const int   ATMOSPHERE_NUM_OUT_SCATTER = 2;
    const int   ATMOSPHERE_NUM_IN_SCATTER = 4;
	#define HIDE_TERRAIN
#endif

const vec3  SUN_DIRECTION = vec3( .940721,  .28221626, .18814417 );
const vec3  SUN_COLOR = vec3(.3, .21, .165);

float time;

//-----------------------------------------------------
// Noise functions
//-----------------------------------------------------

float hash( const in float n ) {
    return fract(sin(n)*43758.5453123);
}
float hash( const in vec2 p ) {
	float h = dot(p,vec2(127.1,311.7));	
    return fract(sin(h)*43758.5453123);
}
float hash( const in vec3 p ) {
	float h = dot(p,vec3(127.1,311.7,758.5453123));	
    return fract(sin(h)*43758.5453123);
}
vec3 hash31( const in float p) {
	vec3 h = vec3(1275.231,4461.7,7182.423) * p;	
    return fract(sin(h)*43758.543123);
}
vec3 hash33( const in vec3 p) {
    return vec3( hash(p), hash(p.zyx), hash(p.yxz) );
}

float noise( const in  float p ) {    
    float i = floor( p );
    float f = fract( p );	
	float u = f*f*(3.0-2.0*f);
    return -1.0+2.0* mix( hash( i + 0. ), hash( i + 1. ), u);
}

float noise( const in  vec2 p ) {    
    vec2 i = floor( p );
    vec2 f = fract( p );	
	vec2 u = f*f*(3.0-2.0*f);
    return -1.0+2.0*mix( mix( hash( i + vec2(0.0,0.0) ), 
                     hash( i + vec2(1.0,0.0) ), u.x),
                mix( hash( i + vec2(0.0,1.0) ), 
                     hash( i + vec2(1.0,1.0) ), u.x), u.y);
}
float noise( const in  vec3 x ) {
    vec3 p = floor(x);
    vec3 f = fract(x);
    f = f*f*(3.0-2.0*f);
    float n = p.x + p.y*157.0 + 113.0*p.z;
    return mix(mix(mix( hash(n+  0.0), hash(n+  1.0),f.x),
                   mix( hash(n+157.0), hash(n+158.0),f.x),f.y),
               mix(mix( hash(n+113.0), hash(n+114.0),f.x),
                   mix( hash(n+270.0), hash(n+271.0),f.x),f.y),f.z);
}

float tri( const in vec2 p ) {
    return 0.5*(cos(6.2831*p.x) + cos(6.2831*p.y));
   
}

const mat2 m2 = mat2( 0.80, -0.60, 0.60, 0.80 );

float fbm( in vec2 p ) {
    float f = 0.0;
    f += 0.5000*noise( p ); p = m2*p*2.02;
    f += 0.2500*noise( p ); p = m2*p*2.03;
    f += 0.1250*noise( p ); 
    
#ifndef LOW_QUALITY
#ifndef VERY_LOW_QUALITY
    p = m2*p*2.01;
    f += 0.0625*noise( p );
#endif
#endif
    return f/0.9375;
}

float fbm( const in vec3 p, const in float a, const in float f) {
    float ret = 0.0;    
    float amp = 1.0;
    float frq = 1.0;
    for(int i = 0; i < FBM_STEPS; i++) {
        float n = pow(noise(p * frq),2.0);
        ret += n * amp;
        frq *= f;
        amp *= a * (pow(n,0.2));
    }
    return ret;
}

//-----------------------------------------------------
// Lightning functions
//-----------------------------------------------------

float diffuse( const in vec3 n, const in vec3 l) { 
    return clamp(dot(n,l),0.,1.);
}

float specular( const in vec3 n, const in vec3 l, const in vec3 e, const in float s) {    
    float nrm = (s + 8.0) / (3.1415 * 8.0);
    return pow(max(dot(reflect(e,n),l),0.0),s) * nrm;
}

float fresnel( const in vec3 n, const in vec3 e, float s ) {
    return pow(clamp(1.-dot(n,e), 0., 1.),s);
}

//-----------------------------------------------------
// Math functions
//-----------------------------------------------------

vec2 rotate(float angle, vec2 v) {
    return vec2(cos(angle) * v.x + sin(angle) * v.y, cos(angle) * v.y - sin(angle) * v.x);
}

float boolSub(float a,float b) { 
    return max(a,-b); 
}
float sphere(vec3 p,float r) {
	return length(p)-r;
}

//-----------------------------------------------------
// Intersection functions (by iq)
//-----------------------------------------------------

vec3 nSphere( in vec3 pos, in vec4 sph ) {
    return (pos-sph.xyz)/sph.w;
}

float iSphere( in vec3 ro, in vec3 rd, in vec4 sph ) {
	vec3 oc = ro - sph.xyz;
	float b = dot( oc, rd );
	float c = dot( oc, oc ) - sph.w*sph.w;
	float h = b*b - c;
	if( h<0.0 ) return -1.0;
	return -b - sqrt( h );
}

float iCSphereF( vec3 p, vec3 dir, float r ) {
	float b = dot( p, dir );
	float c = dot( p, p ) - r * r;
	float d = b * b - c;
	if ( d < 0.0 ) return -MAX;
	return -b + sqrt( d );
}

vec2 iCSphere2( vec3 p, vec3 dir, float r ) {
	float b = dot( p, dir );
	float c = dot( p, p ) - r * r;
	float d = b * b - c;
	if ( d < 0.0 ) return vec2( MAX, -MAX );
	d = sqrt( d );
	return vec2( -b - d, -b + d );
}

vec3 nPlane( in vec3 ro, in vec4 obj ) {
    return obj.xyz;
}

float iPlane( in vec3 ro, in vec3 rd, in vec4 pla ) {
    return (-pla.w - dot(pla.xyz,ro)) / dot( pla.xyz, rd );
}

//-----------------------------------------------------
// Wet stone by TDM
// 
// https://www.shadertoy.com/view/ldSSzV
//-----------------------------------------------------

const float ASTEROID_TRESHOLD 	= 0.001;
const float ASTEROID_EPSILON 	= 1e-6;
const float ASTEROID_DISPLACEMENT = 0.1;
const float ASTEROID_RADIUS = 0.13;

const vec3  RING_COLOR_1 = vec3(0.42,0.3,0.2);
const vec3  RING_COLOR_2 = vec3(0.41,0.51,0.52);

float asteroidRock( const in vec3 p, const in vec3 id ) {  
    float d = sphere(p,ASTEROID_RADIUS);    
    for(int i = 0; i < ASTEROID_NUM_BOOL_SUB; i++) {
        float ii = float(i)+id.x;
        float r = (ASTEROID_RADIUS*2.5) + ASTEROID_RADIUS*hash(ii);
        vec3 v = normalize(hash31(ii) * 2.0 - 1.0);
    	d = boolSub(d,sphere(p+v*r,r * 0.8));       
    }
    return d;
}

float asteroidMap( const in vec3 p, const in vec3 id) {
    float d = asteroidRock(p, id) + noise(p*4.0) * ASTEROID_DISPLACEMENT;
    return d;
}

float asteroidMapDetailed( const in vec3 p, const in vec3 id) {
    float d = asteroidRock(p, id) + fbm(p*4.0,0.4,2.96) * ASTEROID_DISPLACEMENT;
    return d;
}

void asteroidTransForm(inout vec3 ro, const in vec3 id ) {
    float xyangle = (id.x-.5)*time*2.;
    ro.xy = rotate( xyangle, ro.xy );
    
    float yzangle = (id.y-.5)*time*2.;
    ro.yz = rotate( yzangle, ro.yz );
}

void asteroidUnTransForm(inout vec3 ro, const in vec3 id ) {
    float yzangle = (id.y-.5)*time*2.;
    ro.yz = rotate( -yzangle, ro.yz );

    float xyangle = (id.x-.5)*time*2.;
    ro.xy = rotate( -xyangle, ro.xy );  
}

vec3 asteroidGetNormal(vec3 p, vec3 id) {
    asteroidTransForm( p, id );
    
    vec3 n;
    n.x = asteroidMapDetailed(vec3(p.x+ASTEROID_EPSILON,p.y,p.z), id);
    n.y = asteroidMapDetailed(vec3(p.x,p.y+ASTEROID_EPSILON,p.z), id);
    n.z = asteroidMapDetailed(vec3(p.x,p.y,p.z+ASTEROID_EPSILON), id);
    n = normalize(n-asteroidMapDetailed(p, id));
    
    asteroidUnTransForm( n, id );
    return n;
}

vec2 asteroidSpheretracing(vec3 ori, vec3 dir, vec3 id) {
    asteroidTransForm( ori, id );
    asteroidTransForm( dir, id );
    
    vec2 td = vec2(0,1);
    for(int i = 0; i < ASTEROID_NUM_STEPS && abs(td.y) > ASTEROID_TRESHOLD; i++) {
        td.y = asteroidMap(ori + dir * td.x, id);
        td.x += td.y;
    }
    return td;
}

vec3 asteroidGetStoneColor(vec3 p, float c, vec3 l, vec3 n, vec3 e) {
	return mix( diffuse(n,l)*RING_COLOR_1*SUN_COLOR, SUN_COLOR*specular(n,l,e,3.0), .5*fresnel(n,e,5.));    
}

//-----------------------------------------------------
// Ring (by me ;))
//-----------------------------------------------------

const float RING_DETAIL_DISTANCE = 40.;
const float RING_VOXEL_STEP_SIZE = .03;

vec3 ringShadowColor( const in vec3 ro ) {
    if( iSphere( ro, SUN_DIRECTION, vec4( 0., 0., 0., EARTH_RADIUS ) ) > 0. ) {
        return vec3(0.);
    }
    return vec3(1.);
}

bool ringMap( const in vec3 ro ) {
    return ro.z < RING_HEIGHT/RING_VOXEL_STEP_SIZE && hash(ro)<.5;
}

vec4 renderRingNear( const in vec3 ro, const in vec3 rd ) { 
// find startpoint 
    float d1 = iPlane( ro, rd, vec4( 0., 0., 1., RING_HEIGHT ) );
    float d2 = iPlane( ro, rd, vec4( 0., 0., 1., -RING_HEIGHT ) );
    
    float d = min( max(d1,0.), max(d2,0.) );
   
    if( (d1 < 0. && d2 < 0.) || d > ASTEROID_MAX_DISTANCE ) {
        return vec4( 0. );
    } else {
        vec3 ros = ro + rd*d;

        // avoid precision problems..
        vec2 mroxy = mod(ros.xy, vec2(10.));
        vec2 roxy = ros.xy - mroxy;
        ros.xy -= roxy;
        ros /= RING_VOXEL_STEP_SIZE;
        //ros.xy -= vec2(.013,.112)*time*.5;

        vec3 pos = floor(ros);
        vec3 ri = 1.0/rd;
        vec3 rs = sign(rd);
        vec3 dis = (pos-ros + 0.5 + rs*0.5) * ri;

        float alpha = 0., dint;
        vec3 offset = vec3(0), id, asteroidro;
        vec2 asteroid = vec2(0);

        for( int i=0; i<RING_VOXEL_STEPS; i++ ) {
            if( ringMap(pos) ) {
                id = hash33(pos);
                offset = id*(1.-2.*ASTEROID_RADIUS)+ASTEROID_RADIUS;
                dint = iSphere( ros, rd, vec4(pos+offset, ASTEROID_RADIUS) );

                if( dint > 0. ) {
                    asteroidro = ros+rd*dint-(pos+offset);
                    asteroid = asteroidSpheretracing( asteroidro, rd, id );

                    if( asteroid.y < .1 ) {
                        alpha = 1.;
                        break;	    
                    }
                }

            }
            vec3 mm = step(dis.xyz, dis.yxy) * step(dis.xyz, dis.zzx);
            dis += mm * rs * ri;
            pos += mm * rs;
        }

        if( alpha > 0. ) {       
            vec3 intersection = ros + rd*(asteroid.x+dint);
            vec3 n = asteroidGetNormal( asteroidro + rd*asteroid.x, id );

            vec3 col = asteroidGetStoneColor(intersection, .1, SUN_DIRECTION, n, rd);

            intersection *= RING_VOXEL_STEP_SIZE;
            intersection.xy += roxy;
          //  col *= ringShadowColor( intersection );

            return vec4( col, 1.-smoothstep(0.4*ASTEROID_MAX_DISTANCE, 0.5* ASTEROID_MAX_DISTANCE, distance( intersection, ro ) ) );
        } else {
            return vec4(0.);
        }
    }
}

//-----------------------------------------------------
// Ring (by me ;))
//-----------------------------------------------------

float renderRingFarShadow( const in vec3 ro, const in vec3 rd ) {
    // intersect plane
    float d = iPlane( ro, rd, vec4( 0., 0., 1., 0.) );
    
    if( d > 0. ) {
	    vec3 intersection = ro + rd*d;
        float l = length(intersection.xy);
        
        if( l > RING_INNER_RADIUS && l < RING_OUTER_RADIUS ) {
            return .5 + .5 * (.2+.8*noise( l*.07 )) * (.5+.5*noise(intersection.xy));
        } else {
            return 0.;
        }
    } else {
	    return 0.;
    }
}

vec4 renderRingFar( const in vec3 ro, const in vec3 rd, inout float maxd ) {
    // intersect plane
    float d = iPlane( ro, rd, vec4( 0., 0., 1., 0.) );
    
    if( d > 0. && d < maxd ) {
        maxd = d;
	    vec3 intersection = ro + rd*d;
        float l = length(intersection.xy);
        
        if( l > RING_INNER_RADIUS && l < RING_OUTER_RADIUS ) {
            float dens = .5 + .5 * (.2+.8*noise( l*.07 )) * (.5+.5*noise(intersection.xy));
            vec3 col = mix( RING_COLOR_1, RING_COLOR_2, abs( noise(l*0.2) ) ) * abs(dens) * 1.5;
            
            col *= ringShadowColor( intersection );
    		col *= .8+.3*diffuse( vec3(0,0,1), SUN_DIRECTION );
			col *= SUN_COLOR;
            return vec4( col, dens );
        } else {
            return vec4(0.);
        }
    } else {
	    return vec4(0.);
    }
}

vec4 renderRing( const in vec3 ro, const in vec3 rd, inout float maxd ) {
    vec4 far = renderRingFar( ro, rd, maxd );
    float l = length( ro.xy );

    if( abs(ro.z) < RING_HEIGHT+RING_DETAIL_DISTANCE 
        && l < RING_OUTER_RADIUS+RING_DETAIL_DISTANCE 
        && l > RING_INNER_RADIUS-RING_DETAIL_DISTANCE ) {
     	
	    float d = iPlane( ro, rd, vec4( 0., 0., 1., 0.) );
        float detail = mix( .5 * noise( fract(ro.xy+rd.xy*d) * 92.1)+.25, 1., smoothstep( 0.,RING_DETAIL_DISTANCE, d) );
        far.xyz *= detail;    
    }
    
	// are asteroids neaded ?
    if( abs(ro.z) < RING_HEIGHT+ASTEROID_MAX_DISTANCE 
        && l < RING_OUTER_RADIUS+ASTEROID_MAX_DISTANCE 
        && l > RING_INNER_RADIUS-ASTEROID_MAX_DISTANCE ) {
        
        vec4 near = renderRingNear( ro, rd );
        far = mix( far, near, near.w );
        maxd=0.;
    }
            
    return far;
}

//-----------------------------------------------------
// Stars (by me ;))
//-----------------------------------------------------

vec4 renderStars( const in vec3 rd ) {
	vec3 rds = rd;
	vec3 col = vec3(0);
    float v = 1.0/( 2. * ( 1. + rds.z ) );
    
    vec2 xy = vec2(rds.y * v, rds.x * v);
    float s = noise(rds*134.);
    
    s += noise(rds*470.);
    s = pow(s,19.0) * 0.00001;
    if (s > 0.5) {
        vec3 backStars = vec3(s)*.5 * vec3(0.95,0.8,0.9); 
        col += backStars;
    }
	return   vec4( col, 1 ); 
} 

//-----------------------------------------------------
// Atmospheric Scattering by GLtracy
// 
// https://www.shadertoy.com/view/lslXDr
//-----------------------------------------------------

const float ATMOSPHERE_K_R = 0.166;
const float ATMOSPHERE_K_M = 0.0025;
const float ATMOSPHERE_E = 12.3;
const vec3  ATMOSPHERE_C_R = vec3( 0.3, 0.7, 1.0 );
const float ATMOSPHERE_G_M = -0.85;

const float ATMOSPHERE_SCALE_H = 4.0 / ( EARTH_ATMOSPHERE );
const float ATMOSPHERE_SCALE_L = 1.0 / ( EARTH_ATMOSPHERE );

const float ATMOSPHERE_FNUM_OUT_SCATTER = float(ATMOSPHERE_NUM_OUT_SCATTER);
const float ATMOSPHERE_FNUM_IN_SCATTER = float(ATMOSPHERE_NUM_IN_SCATTER);

const int   ATMOSPHERE_NUM_OUT_SCATTER_LOW = 2;
const int   ATMOSPHERE_NUM_IN_SCATTER_LOW = 4;
const float ATMOSPHERE_FNUM_OUT_SCATTER_LOW = float(ATMOSPHERE_NUM_OUT_SCATTER_LOW);
const float ATMOSPHERE_FNUM_IN_SCATTER_LOW = float(ATMOSPHERE_NUM_IN_SCATTER_LOW);

float atmosphericPhaseMie( float g, float c, float cc ) {
	float gg = g * g;
	float a = ( 1.0 - gg ) * ( 1.0 + cc );
	float b = 1.0 + gg - 2.0 * g * c;
    
	b *= sqrt( b );
	b *= 2.0 + gg;	
	
	return 1.5 * a / b;
}

float atmosphericPhaseReyleigh( float cc ) {
	return 0.75 * ( 1.0 + cc );
}

float atmosphericDensity( vec3 p ){
	return exp( -( length( p ) - EARTH_RADIUS ) * ATMOSPHERE_SCALE_H );
}

float atmosphericOptic( vec3 p, vec3 q ) {
	vec3 step = ( q - p ) / ATMOSPHERE_FNUM_OUT_SCATTER;
	vec3 v = p + step * 0.5;
	
	float sum = 0.0;
	for ( int i = 0; i < ATMOSPHERE_NUM_OUT_SCATTER; i++ ) {
		sum += atmosphericDensity( v );
		v += step;
	}
	sum *= length( step ) * ATMOSPHERE_SCALE_L;
	
	return sum;
}

vec4 atmosphericInScatter( vec3 o, vec3 dir, vec2 e, vec3 l ) {
	float len = ( e.y - e.x ) / ATMOSPHERE_FNUM_IN_SCATTER;
	vec3 step = dir * len;
	vec3 p = o + dir * e.x;
	vec3 v = p + dir * ( len * 0.5 );

    float sumdensity = 0.;
	vec3 sum = vec3( 0.0 );

    for ( int i = 0; i < ATMOSPHERE_NUM_IN_SCATTER; i++ ) {
        vec3 u = v + l * iCSphereF( v, l, EARTH_RADIUS + EARTH_ATMOSPHERE );
		float n = ( atmosphericOptic( p, v ) + atmosphericOptic( v, u ) ) * ( PI * 4.0 );
		float dens = atmosphericDensity( v );
  
	    float m = MAX;
		sum += dens * exp( -n * ( ATMOSPHERE_K_R * ATMOSPHERE_C_R + ATMOSPHERE_K_M ) ) 
    		* (1. - renderRingFarShadow( u, SUN_DIRECTION ) );
 		sumdensity += dens;
        
		v += step;
	}
	sum *= len * ATMOSPHERE_SCALE_L;
	
	float c  = dot( dir, -l );
	float cc = c * c;
	
	return vec4( sum * ( ATMOSPHERE_K_R * ATMOSPHERE_C_R * atmosphericPhaseReyleigh( cc ) + 
                         ATMOSPHERE_K_M * atmosphericPhaseMie( ATMOSPHERE_G_M, c, cc ) ) * ATMOSPHERE_E, 
                	     clamp(sumdensity * len * ATMOSPHERE_SCALE_L,0.,1.));
}

float atmosphericOpticLow( vec3 p, vec3 q ) {
	vec3 step = ( q - p ) / ATMOSPHERE_FNUM_OUT_SCATTER_LOW;
	vec3 v = p + step * 0.5;
	
	float sum = 0.0;
	for ( int i = 0; i < ATMOSPHERE_NUM_OUT_SCATTER_LOW; i++ ) {
		sum += atmosphericDensity( v );
		v += step;
	}
	sum *= length( step ) * ATMOSPHERE_SCALE_L;
	
	return sum;
}

vec3 atmosphericInScatterLow( vec3 o, vec3 dir, vec2 e, vec3 l ) {
	float len = ( e.y - e.x ) / ATMOSPHERE_FNUM_IN_SCATTER_LOW;
	vec3 step = dir * len;
	vec3 p = o + dir * e.x;
	vec3 v = p + dir * ( len * 0.5 );

	vec3 sum = vec3( 0.0 );

    for ( int i = 0; i < ATMOSPHERE_NUM_IN_SCATTER_LOW; i++ ) {
		vec3 u = v + l * iCSphereF( v, l, EARTH_RADIUS + EARTH_ATMOSPHERE );
		float n = ( atmosphericOpticLow( p, v ) + atmosphericOpticLow( v, u ) ) * ( PI * 4.0 );
	    float m = MAX;
		sum += atmosphericDensity( v ) * exp( -n * ( ATMOSPHERE_K_R * ATMOSPHERE_C_R + ATMOSPHERE_K_M ) );
		v += step;
	}
	sum *= len * ATMOSPHERE_SCALE_L;
	
	float c  = dot( dir, -l );
	float cc = c * c;
	
	return sum * ( ATMOSPHERE_K_R * ATMOSPHERE_C_R * atmosphericPhaseReyleigh( cc ) + 
                   ATMOSPHERE_K_M * atmosphericPhaseMie( ATMOSPHERE_G_M, c, cc ) ) * ATMOSPHERE_E;
}

vec4 renderAtmospheric( const in vec3 ro, const in vec3 rd, inout float d ) {    
    // inside or outside atmosphere?
    vec2 e = iCSphere2( ro, rd, EARTH_RADIUS + EARTH_ATMOSPHERE );
	vec2 f = iCSphere2( ro, rd, EARTH_RADIUS );
        
    if( length(ro) <= EARTH_RADIUS + EARTH_ATMOSPHERE ) {
        if( d < e.y ) {
            e.y = d;
        }
		d = e.y;
	    e.x = 0.;
        
	    if ( iSphere( ro, rd, vec4(0,0,0,EARTH_RADIUS)) > 0. ) {
	        d = iSphere( ro, rd, vec4(0,0,0,EARTH_RADIUS));
		}
    } else {
    	if(  iSphere( ro, rd, vec4(0,0,0,EARTH_RADIUS + EARTH_ATMOSPHERE )) < 0. ) return vec4(0.);
        
        if ( e.x > e.y ) {
        	d = MAX;
			return vec4(0.);
		}
		d = e.y = min( e.y, f.x );
    }
	return atmosphericInScatter( ro, rd, e, SUN_DIRECTION );
}

vec3 renderAtmosphericLow( const in vec3 ro, const in vec3 rd ) {    
    vec2 e = iCSphere2( ro, rd, EARTH_RADIUS + EARTH_ATMOSPHERE );
    e.x = 0.;
    return atmosphericInScatterLow( ro, rd, e, SUN_DIRECTION );
}

//-----------------------------------------------------
// Seascape by TDM
// 
// https://www.shadertoy.com/view/Ms2SD1
//-----------------------------------------------------

const int   SEA_ITER_GEOMETRY = 3;
const int   SEA_ITER_FRAGMENT = 5;

const float SEA_EPSILON	= 1e-3;
#define       SEA_EPSILON_NRM	(0.1 / iResolution.x)
const float SEA_HEIGHT = 0.6;
const float SEA_CHOPPY = 4.0;
const float SEA_SPEED = 0.8;
const float SEA_FREQ = 0.16;
const vec3  SEA_BASE = vec3(0.1,0.19,0.22);
const vec3  SEA_WATER_COLOR = vec3(0.8,0.9,0.6);
float       SEA_TIME;
const mat2  sea_octave_m = mat2(1.6,1.2,-1.2,1.6);

float seaOctave( in vec2 uv, const in float choppy) {
    uv += noise(uv);        
    vec2 wv = 1.0-abs(sin(uv));
    vec2 swv = abs(cos(uv));    
    wv = mix(wv,swv,wv);
    return pow(1.0-pow(wv.x * wv.y,0.65),choppy);
}

float seaMap(const in vec3 p) {
    float freq = SEA_FREQ;
    float amp = SEA_HEIGHT;
    float choppy = SEA_CHOPPY;
    vec2 uv = p.xz; uv.x *= 0.75;
    
    float d, h = 0.0;    
    for(int i = 0; i < SEA_ITER_GEOMETRY; i++) {        
    	d = seaOctave((uv+SEA_TIME)*freq,choppy);
    	d += seaOctave((uv-SEA_TIME)*freq,choppy);
        h += d * amp;        
    	uv *= sea_octave_m; freq *= 1.9; amp *= 0.22;
        choppy = mix(choppy,1.0,0.2);
    }
    return p.y - h;
}

float seaMapHigh(const in vec3 p) {
    float freq = SEA_FREQ;
    float amp = SEA_HEIGHT;
    float choppy = SEA_CHOPPY;
    vec2 uv = p.xz; uv.x *= 0.75;
    
    float d, h = 0.0;    
    for(int i = 0; i < SEA_ITER_FRAGMENT; i++) {        
    	d = seaOctave((uv+SEA_TIME)*freq,choppy);
    	d += seaOctave((uv-SEA_TIME)*freq,choppy);
        h += d * amp;        
    	uv *= sea_octave_m; freq *= 1.9; amp *= 0.22;
        choppy = mix(choppy,1.0,0.2);
    }
    return p.y - h;
}

vec3 seaGetColor( const in vec3 n, vec3 eye, const in vec3 l, const in float att, 
                  const in vec3 sunc, const in vec3 upc, const in vec3 reflected) {  
    vec3 refracted = SEA_BASE * upc + diffuse(n,l) * SEA_WATER_COLOR * 0.12 * sunc; 
    vec3 color = mix(refracted,reflected,fresnel(n, -eye, 3.)*.65 );
    
    color += upc*SEA_WATER_COLOR * (att * 0.18);
    color += sunc * vec3(specular(n,l,eye,60.0));
    
    return color;
}

vec3 seaGetNormal(const in vec3 p, const in float eps) {
    vec3 n;
    n.y = seaMapHigh(p);    
    n.x = seaMapHigh(vec3(p.x+eps,p.y,p.z)) - n.y;
    n.z = seaMapHigh(vec3(p.x,p.y,p.z+eps)) - n.y;
    n.y = eps;
    return normalize(n);
}

float seaHeightMapTracing(const in vec3 ori, const in vec3 dir, out vec3 p) {  
    float tm = 0.0;
    float tx = 1000.0;    
    float hx = seaMap(ori + dir * tx);
    if(hx > 0.0) return tx;   
    float hm = seaMap(ori + dir * tm);    
    float tmid = 0.0;
    for(int i = 0; i < SEA_NUM_STEPS; i++) {
        tmid = mix(tm,tx, hm/(hm-hx));                   
        p = ori + dir * tmid;                   
    	float hmid = seaMap(p);
		if(hmid < 0.0) {
        	tx = tmid;
            hx = hmid;
        } else {
            tm = tmid;
            hm = hmid;
        }
    }
    return tmid;
}

vec3 seaTransform( in vec3 x ) {
    x.yz = rotate( 0.8, x.yz );
    return x;
}

vec3 seaUntransform( in vec3 x ) {
    x.yz = rotate( -0.8, x.yz );
    return x;
}

void renderSea( const in vec3 ro, const in vec3 rd, inout vec3 n, inout float att ) {    
    vec3 p,
    rom = seaTransform(ro),
    rdm = seaTransform(rd);
    
    rom.y -= EARTH_RADIUS;
    rom *= 1000.;
    rom.xz += vec2(3.1,.2)*time;

    SEA_TIME = time * SEA_SPEED;
    
    seaHeightMapTracing(rom,rdm,p);
    float squareddist = dot(p - rom, p-rom );
    n = seaGetNormal(p, squareddist * SEA_EPSILON_NRM );
    
    n = seaUntransform(n);
    
    att = clamp(SEA_HEIGHT+p.y, 0.,1.);
}

//-----------------------------------------------------
// Terrain based on Elevated and Terrain Tubes by IQ
//
// https://www.shadertoy.com/view/MdX3Rr
// https://www.shadertoy.com/view/4sjXzG
//-----------------------------------------------------

#ifndef HIDE_TERRAIN

const mat2 terrainM2 = mat2(1.6,-1.2,1.2,1.6);

float terrainLow( vec2 p ) {
    p *= 0.0013;

    float s = 1.0;
	float t = 0.0;
	for( int i=0; i<2; i++ ) {
        t += s*tri( p );
		s *= 0.5 + 0.1*t;
        p = 0.97*terrainM2*p + (t-0.5)*0.12;
	}
	return t*33.0;
}

float terrainMed( vec2 p ) {
    p *= 0.0013;

    float s = 1.0;
	float t = 0.0;
	for( int i=0; i<6; i++ ) {
        t += s*tri( p );
		s *= 0.5 + 0.1*t;
        p = 0.97*terrainM2*p + (t-0.5)*0.12;
	}
            
    return t*33.0;
}

float terrainHigh( vec2 p ) {
    vec2 q = p;
    p *= 0.0013;

    float s = 1.0;
	float t = 0.0;
	for( int i=0; i<7; i++ ) {
        t += s*tri( p );
		s *= 0.5 + 0.1*t;
        p = 0.97*terrainM2*p + (t-0.5)*0.12;
	}
    
    t += t*0.015*fbm( q );
	return t*33.0;
}

float terrainMap( const in vec3 pos ) {
	return pos.y - terrainMed(pos.xz);  
}

float terrainMapH( const in vec3 pos ) {
    float y = terrainHigh(pos.xz);
    float h = pos.y - y;
    return h;
}

float terrainIntersect( in vec3 ro, in vec3 rd, in float tmin, in float tmax ) {
    float t = tmin;
	for( int i=0; i<TERRAIN_NUM_STEPS; i++ ) {
        vec3 pos = ro + t*rd;
        float res = terrainMap( pos );
        if( res<(0.001*t) || t>tmax  ) break;
        t += res*.9;
	}

	return t;
}

float terrainCalcShadow(in vec3 ro, in vec3 rd ) {
	vec2  eps = vec2(150.0,0.0);
    float h1 = terrainMed( ro.xz );
    float h2 = terrainLow( ro.xz );
    
    float d1 = 10.0;
    float d2 = 80.0;
    float d3 = 200.0;
    float s1 = clamp( 1.0*(h1 + rd.y*d1 - terrainMed(ro.xz + d1*rd.xz)), 0.0, 1.0 );
    float s2 = clamp( 0.5*(h1 + rd.y*d2 - terrainMed(ro.xz + d2*rd.xz)), 0.0, 1.0 );
    float s3 = clamp( 0.2*(h2 + rd.y*d3 - terrainLow(ro.xz + d3*rd.xz)), 0.0, 1.0 );

    return min(min(s1,s2),s3);
}
vec3 terrainCalcNormalHigh( in vec3 pos, float t ) {
    vec2 e = vec2(1.0,-1.0)*0.001*t;

    return normalize( e.xyy*terrainMapH( pos + e.xyy ) + 
					  e.yyx*terrainMapH( pos + e.yyx ) + 
					  e.yxy*terrainMapH( pos + e.yxy ) + 
					  e.xxx*terrainMapH( pos + e.xxx ) );
}

vec3 terrainCalcNormalMed( in vec3 pos, float t ) {
	float e = 0.005*t;
    vec2  eps = vec2(e,0.0);
    float h = terrainMed( pos.xz );
    return normalize(vec3( terrainMed(pos.xz-eps.xy)-h, e, terrainMed(pos.xz-eps.yx)-h ));
}

vec3 terrainTransform( in vec3 x ) {
    x.zy = rotate( -.83, x.zy );
    return x;
}

vec3 terrainUntransform( in vec3 x ) {
    x.zy = rotate( .83, x.zy );
    return x;
}


float llamelTime;
const float llamelScale = 5.;

vec3 llamelPosition() {
    llamelTime = time*2.5;
    vec2 pos = vec2( -400., 135.-llamelTime*0.075* llamelScale);
    return vec3( pos.x, terrainMed( pos ), pos.y );
}

vec3 terrainShade( const in vec3 col, const in vec3 pos, const in vec3 rd, const in vec3 n, const in float spec, 
                   const in vec3 sunc, const in vec3 upc, const in vec3 reflc ) {
	vec3 sunDirection =  terrainTransform(SUN_DIRECTION);
    float dif = diffuse( n, sunDirection );
    float bac = diffuse( n, vec3(-sunDirection.x, sunDirection.y, -sunDirection.z) );
    float sha = terrainCalcShadow( pos, sunDirection );
    float amb = clamp( n.y,0.0,1.0);
        
    vec3 lin  = vec3(0.0);
    lin += 2.*dif*sunc*vec3( sha, sha*sha*0.1+0.9*sha, sha*sha*0.2+0.8*sha );
    lin += 0.2*amb*upc;
    lin += 0.08*bac*clamp(vec3(1.)-sunc, vec3(0.), vec3(1.));
    return mix( col*lin*3., reflc, spec*fresnel(n,-terrainTransform(rd),5.0) );
}

vec3 terrainGetColor( const in vec3 pos, const in vec3 rd, const in float t, const in vec3 sunc, const in vec3 upc, const in vec3 reflc ) {
    vec3 nor = terrainCalcNormalHigh( pos, t );
    vec3 sor = terrainCalcNormalMed( pos, t );
        
    float spec = 0.005;

#ifdef DISPLAY_TERRAIN_DETAIL
    float no = noise(5.*fbm(1.11*pos.xz));
#else
    const float no = 0.;
#endif
    float r = .5+.5*fbm(.95*pos.xz);
	vec3 col = (r*0.25+0.75)*0.9*mix( vec3(0.08,0.07,0.07), vec3(0.10,0.09,0.08), noise(0.4267*vec2(pos.x*2.,pos.y*9.8))+.01*no );
    col = mix( col, 0.20*vec3(0.45,.30,0.15)*(0.50+0.50*r),smoothstep(0.825,0.925,nor.y+.025*no) );
	col = mix( col, 0.15*vec3(0.30,.30,0.10)*(0.25+0.75*r),smoothstep(0.95,1.0,nor.y+.025*no) );
    col *= .88+.12*no;
        
    float s = nor.y + 0.03*pos.y + 0.35*fbm(0.05*pos.xz) - .35;
    float sf = fwidth(s) * 1.5;
    s = smoothstep(0.84-sf, 0.84+sf, s );
    col = mix( col, 0.29*vec3(0.62,0.65,0.7), s);
    nor = mix( nor, sor, 0.7*smoothstep(0.9, 0.95, s ) );
    spec = mix( spec, 0.45, smoothstep(0.9, 0.95, s ) );

   	col = terrainShade( col, pos, rd, nor, spec, sunc, upc, reflc );

#ifdef DISPLAY_LLAMEL
    col *= clamp( distance(pos.xz, llamelPosition().xz )*0.4, 0.4, 1.);
#endif
    
    return col;
}

vec3 terrainTransformRo( const in vec3 ro ) {
    vec3 rom = terrainTransform(ro);
    rom.y -= EARTH_RADIUS - 100.;
    rom.xz *= 5.;
    rom.xz += vec2(-170.,50.)+vec2(-4.,.4)*time;    
    rom.y += (terrainLow( rom.xz ) - 86.)*clamp( 1.-1.*(length(ro)-EARTH_RADIUS), 0., 1.);
    return rom;
}

vec4 renderTerrain( const in vec3 ro, const in vec3 rd, inout vec3 intersection, inout vec3 n ) {    
    vec3 p,
    rom = terrainTransformRo(ro),
    rdm = terrainTransform(rd);
        
    float tmin = 10.0;
    float tmax = 3200.0;
    
    float res = terrainIntersect( rom, rdm, tmin, tmax );
    
    if( res > tmax ) {
        res = -1.;
    } else {
        vec3 pos =  rom+rdm*res;
        n = terrainCalcNormalMed( pos, res );
        n = terrainUntransform( n );
        
        intersection = ro+rd*res/100.;
    }
    return vec4(res, rom+rdm*res);
}

#endif

//-----------------------------------------------------
// LLamels by Eiffie
//
// https://www.shadertoy.com/view/ltsGz4
//-----------------------------------------------------
#ifdef DISPLAY_LLAMEL
float llamelMapSMin(const in float a,const in float b,const in float k){
    float h=clamp(0.5+0.5*(b-a)/k,0.0,1.0);return b+h*(a-b-k+k*h);
}

float llamelMapLeg(vec3 p, vec3 j0, vec3 j3, vec3 l, vec4 r, vec3 rt){//z joint with tapered legs
	float lx2z=l.x/(l.x+l.z),h=l.y*lx2z;
	vec3 u=(j3-j0)*lx2z,q=u*(0.5+0.5*(l.x*l.x-h*h)/dot(u,u));
	q+=sqrt(max(0.0,l.x*l.x-dot(q,q)))*normalize(cross(u,rt));
	vec3 j1=j0+q,j2=j3-q*(1.0-lx2z)/lx2z;
	u=p-j0;q=j1-j0;
	h=clamp(dot(u,q)/dot(q,q),0.0,1.0);
	float d=length(u-q*h)-r.x-(r.y-r.x)*h;
	u=p-j1;q=j2-j1;
	h=clamp(dot(u,q)/dot(q,q),0.0,1.0);
	d=min(d,length(u-q*h)-r.y-(r.z-r.y)*h);
	u=p-j2;q=j3-j2;
	h=clamp(dot(u,q)/dot(q,q),0.0,1.0);
	return min(d,length(u-q*h)-r.z-(r.w-r.z)*h);
}

float llamelMap(in vec3 p) {
	const vec3 rt=vec3(0.0,0.0,1.0);	
	p.y += 0.25*llamelScale;
    p.xz -= 0.5*llamelScale;
    p.xz = vec2(-p.z, p.x);
    vec3 pori = p;
        
    p /= llamelScale;
    
	vec2 c=floor(p.xz);
	p.xz=fract(p.xz)-vec2(0.5);
    p.y -= p.x*.04*llamelScale;
	float sa=sin(c.x*2.0+c.y*4.5+llamelTime*0.05)*0.15;

    float b=0.83-abs(p.z);
	float a=c.x+117.0*c.y+sign(p.x)*1.57+sign(p.z)*1.57+llamelTime,ca=cos(a);
	vec3 j0=vec3(sign(p.x)*0.125,ca*0.01,sign(p.z)*0.05),j3=vec3(j0.x+sin(a)*0.1,max(-0.25+ca*0.1,-0.25),j0.z);
	float dL=llamelMapLeg(p,j0,j3,vec3(0.08,0.075,0.12),vec4(0.03,0.02,0.015,0.01),rt*sign(p.x));
	p.y-=0.03;
	float dB=(length(p.xyz*vec3(1.0,1.75,1.75))-0.14)*0.75;
	a=c.x+117.0*c.y+llamelTime;ca=cos(a);sa*=0.4;
	j0=vec3(0.125,0.03+abs(ca)*0.03,ca*0.01),j3=vec3(0.3,0.07+ca*sa,sa);
	float dH=llamelMapLeg(p,j0,j3,vec3(0.075,0.075,0.06),vec4(0.03,0.035,0.03,0.01),rt);
	dB=llamelMapSMin(min(dL,dH),dB,clamp(0.04+p.y,0.0,1.0));
	a=max(abs(p.z),p.y)+0.05;
	return max(min(dB,min(a,b)),length(pori.xz-vec2(0.5)*llamelScale)-.5*llamelScale);
}

vec3 llamelGetNormal( in vec3 ro ) {
    vec2 e = vec2(1.0,-1.0)*0.001;

    return normalize( e.xyy*llamelMap( ro + e.xyy ) + 
					  e.yyx*llamelMap( ro + e.yyx ) + 
					  e.yxy*llamelMap( ro + e.yxy ) + 
					  e.xxx*llamelMap( ro + e.xxx ) );
}

vec4 renderLlamel( in vec3 ro, const in vec3 rd, const in vec3 sunc, const in vec3 upc, const in vec3 reflc ) {
    ro -= llamelPosition();
	float t=.1*hash(rd.xy),d,dm=10.0,tm;
	for(int i=0;i<36;i++){
		t+=d=llamelMap(ro+rd*t);
		if(d<dm){dm=d;tm=t;}
		if(t>1000.0 || d<0.00001)break;
	}
	dm=max(0.0,dm);
    if( dm < .02 ) {
        vec3 col = vec3(0.45,.30,0.15)*.2;
        vec3 pos = ro + rd*tm;
        vec3 nor = llamelGetNormal( pos );
        col = terrainShade( col, pos, rd, nor, .01, sunc, upc, reflc );        
        return vec4(col, clamp( 1.-(dm-0.01)/0.01,0., 1.) );
    }
    
    return vec4(0.);
}
#endif

//-----------------------------------------------------
// Clouds (by me ;))
//-----------------------------------------------------

vec4 renderClouds( const in vec3 ro, const in vec3 rd, const in float d, const in vec3 n, const in float land, 
                   const in vec3 sunColor, const in vec3 upColor, inout float shadow ) {
	vec3 intersection = ro+rd*d;
    vec3 cint = intersection*0.009;
    float rot = -.2*length(cint.xy) + .6*fbm( cint*.4,0.5,2.96 ) + .05*land;

    cint.xy = rotate( rot, cint.xy );

    vec3 cdetail = mod(intersection*3.23,vec3(50.));
    cdetail.xy = rotate( .25*rot, cdetail.xy );

    float clouds = 1.3*(fbm( cint*(1.+.02*noise(intersection)),0.5,2.96)+.4*land-.3);

#ifdef DISPLAY_CLOUDS_DETAIL
    if( d < 200. ) {
        clouds += .3*(fbm(cdetail,0.5,2.96)-.5)*(1.-smoothstep(0.,200.,d));
    }
#endif

    shadow = clamp(1.-clouds, 0., 1.);

    clouds = clamp(clouds, 0., 1.);
    clouds *= clouds;
    clouds *= smoothstep(0.,0.4,d);

    vec3 clbasecolor = vec3(1.);
    vec3 clcol = .1*clbasecolor*sunColor * vec3(specular(n,SUN_DIRECTION,rd,36.0));
    clcol += .3*clbasecolor*sunColor;
    clcol += clbasecolor*(diffuse(n,SUN_DIRECTION)*sunColor+upColor);  
    
    return vec4( clcol, clouds );
}

//-----------------------------------------------------
// Planet (by me ;))
//-----------------------------------------------------

vec4 renderPlanet( const in vec3 ro, const in vec3 rd, const in vec3 up, inout float maxd ) {
    float d = iSphere( ro, rd, vec4( 0., 0., 0., EARTH_RADIUS ) );

    vec3 intersection = ro + rd*d;
    vec3 n = nSphere( intersection, vec4( 0., 0., 0., EARTH_RADIUS ) );
    vec4 res;

#ifndef HIDE_TERRAIN
    bool renderTerrainDetail = length(ro) < EARTH_RADIUS+EARTH_ATMOSPHERE && 
        					   dot( terrainUntransform( vec3(0.,1.,0.) ), normalize(ro) ) > .9996;
#endif
    bool renderSeaDetail     = d < 1. && dot( seaUntransform( vec3(0.,1.,0.) ), normalize(ro) ) > .9999; 
    float mixDetailColor = 0.;
        
	if( d < 0. || d > maxd) {
#ifndef HIDE_TERRAIN
        if( renderTerrainDetail ) {
       		intersection = ro;
            n = normalize( ro );
        } else { 	       
	        return vec4(0);
        }
#else 
      	return vec4(0.);
#endif
	}
    if( d > 0. ) {
	    maxd = d;
    }
    float att = 0.;
    
    if( dot(n,SUN_DIRECTION) < -0.1 ) return vec4( 0., 0., 0., 1. );
    
    float dm = MAX, e = 0.;
    vec3 col, detailCol, nDetail;
    
    // normal and intersection 
#ifndef HIDE_TERRAIN
    if( renderTerrainDetail ) {   
        res = renderTerrain( ro, rd, intersection, nDetail );
        if( res.x < 0. && d < 0. ) {
	        return vec4(0);
        }
        if( res.x >= 0. ) {
            maxd = pow(res.x/4000.,4.)*50.;
            e = -10.;
        }
        mixDetailColor = 1.-smoothstep(.75, 1., (length(ro)-EARTH_RADIUS) / EARTH_ATMOSPHERE);
        n = normalize( mix( n, nDetail, mixDetailColor ) );
    } else 
#endif        
    if( renderSeaDetail ) {    
        float attsea, mf = smoothstep(.5,1.,d);

        renderSea( ro, rd, nDetail, attsea );

        n = normalize(mix( nDetail, n, mf ));
        att = mix( attsea, att, mf );
    } else {
        e = fbm( .003*intersection+vec3(1.),0.4,2.96) + smoothstep(.85,.95, abs(intersection.z/EARTH_RADIUS));
#ifndef HIDE_TERRAIN
        if( d < 1500. ) {
            e += (-.03+.06* fbm( intersection*0.1,0.4,2.96))*(1.-d/1500.);
        }
#endif  
    }
    
    vec3 sunColor = .25*renderAtmosphericLow( intersection, SUN_DIRECTION).xyz;  
    vec3 upColor = 2.*renderAtmosphericLow( intersection, n).xyz;  
    vec3 reflColor = renderAtmosphericLow( intersection, reflect(rd,n)).xyz; 
                 
    // color  
#ifndef HIDE_TERRAIN
    if(renderTerrainDetail ) {
        detailCol = col =  terrainGetColor(res.yzw, rd, res.x, sunColor, upColor, reflColor);
		d = 0.;
    }   
#endif
     
    if( mixDetailColor < 1. ) {
        if( e < .45 ) {
            // sea
            col = seaGetColor(n,rd,SUN_DIRECTION, att, sunColor, upColor, reflColor);    
        } else {
            // planet (land) far
            float land1 = max(0.1, fbm( intersection*0.0013,0.4,2.96) );
            float land2 = max(0.1, fbm( intersection*0.0063,0.4,2.96) );
            float iceFactor = abs(pow(intersection.z/EARTH_RADIUS,13.0))*e;

            vec3 landColor1 = vec3(0.43,0.65,0.1) * land1;
            vec3 landColor2 = RING_COLOR_1 * land2;
            vec3 mixedLand = (landColor1 + landColor2)* 0.5;
            vec3 finalLand = mix(mixedLand, vec3(7.0, 7.0, 7.0) * land1 * 1.5, max(iceFactor+.02*land2-.02, 0.));

            col = (diffuse(n,SUN_DIRECTION)*sunColor+upColor)*finalLand*.75;
#ifdef HIGH_QUALITY
            col *= (.5+.5*fbm( intersection*0.23,0.4,2.96) );
#endif
        }
    }
    
    if( mixDetailColor > 0. ) {
        col = mix( col, detailCol, mixDetailColor );
    }
        
#ifdef DISPLAY_LLAMEL
    if(renderTerrainDetail ) {
        vec3 rom = terrainTransformRo(ro),
        rdm = terrainTransform(rd);
        d = iSphere( rom, rdm, vec4( llamelPosition(), llamelScale*3. ) );
        if( d > 0. ) {
            vec4 llamel = renderLlamel( rom+rdm*d, rdm, sunColor, upColor, reflColor );
            col = mix(col, llamel.rgb, llamel.a);
        }
    }
#endif
    
    d = iSphere( ro, rd, vec4( 0., 0., 0., EARTH_RADIUS+EARTH_CLOUDS ) );
    if( d > 0. ) { 
        float shadow;
		vec4 clouds = renderClouds( ro, rd, d, n, e, sunColor, upColor, shadow);
        col *= shadow; 
        col = mix( col, clouds.rgb, clouds.w );
    }
    
    float m = MAX;
    col *= (1. - renderRingFarShadow( ro+rd*d, SUN_DIRECTION ) );

 	return vec4( col, 1. ); 
}

//-----------------------------------------------------
// Lens flare by musk
//
// https://www.shadertoy.com/view/4sX3Rs
//-----------------------------------------------------

vec3 lensFlare( const in vec2 uv, const in vec2 pos) {
	vec2 main = uv-pos;
	vec2 uvd = uv*(length(uv));
	
	float f0 = 1.5/(length(uv-pos)*16.0+1.0);
	
	float f1 = max(0.01-pow(length(uv+1.2*pos),1.9),.0)*7.0;

	float f2 = max(1.0/(1.0+32.0*pow(length(uvd+0.8*pos),2.0)),.0)*00.25;
	float f22 = max(1.0/(1.0+32.0*pow(length(uvd+0.85*pos),2.0)),.0)*00.23;
	float f23 = max(1.0/(1.0+32.0*pow(length(uvd+0.9*pos),2.0)),.0)*00.21;
	
	vec2 uvx = mix(uv,uvd,-0.5);
	
	float f4 = max(0.01-pow(length(uvx+0.4*pos),2.4),.0)*6.0;
	float f42 = max(0.01-pow(length(uvx+0.45*pos),2.4),.0)*5.0;
	float f43 = max(0.01-pow(length(uvx+0.5*pos),2.4),.0)*3.0;
	
	vec3 c = vec3(.0);
	
	c.r+=f2+f4; c.g+=f22+f42; c.b+=f23+f43;
	c = c*.5 - vec3(length(uvd)*.05);
	c+=vec3(f0);
	
	return c;
}

//-----------------------------------------------------
// cameraPath
//-----------------------------------------------------

vec3 pro, pta, pup;
float dro, dta, dup;

void camint( inout vec3 ret, const in float t, const in float duration, const in vec3 dest, inout vec3 prev, inout float prevt ) {
    if( t >= prevt && t <= prevt+duration ) {
    	ret = mix( prev, dest, smoothstep(prevt, prevt+duration, t) );
    }
    prev = dest;
    prevt += duration;
}

void cameraPath( in float t, out vec3 ro, out vec3 ta, out vec3 up ) {
#ifndef HIDE_TERRAIN
    time = t = mod( t, 92. );
#else
    time = t = mod( t, 66. );
#endif
    dro = dta = dup = 0.;

    pro = ro = vec3(900. ,7000. ,1500. );
    pta = ta = vec3(    0. ,    0. ,   0. );
    pup = up = vec3(    0. ,    0.4,   1. ); 
   
    camint( ro, t, 5., vec3(-4300. ,-1000. , 500. ), pro, dro );
    camint( ta, t, 5., vec3(    0. ,    0. ,   0. ), pta, dta );
    camint( up, t, 7., vec3(    0. ,    0.1,   1. ), pup, dup ); 
 
    camint( ro, t, 3., vec3(-1355. , 1795. , 1.2 ), pro, dro );
    camint( ta, t, 1., vec3(    0. , 300. ,-600. ), pta, dta );
    camint( up, t, 6., vec3(    0. ,  0.1,    1. ), pup, dup );

    camint( ro, t, 10., vec3(-1355. , 1795. , 1.2 ), pro, dro );
    camint( ta, t, 14., vec3(    0. , 100. ,   600. ), pta, dta );
    camint( up, t, 13., vec3(    0. ,  0.3,    1. ), pup, dup );
    
    vec3 roe = seaUntransform( vec3( 0., EARTH_RADIUS+0.004, 0. ) );
    vec3 upe = seaUntransform( vec3( 0., 1., 0. ) );
    
    camint( ro, t, 7.,roe, pro, dro );
    camint( ta, t, 7., vec3( EARTH_RADIUS + 0., EARTH_RADIUS - 500., 500. ), pta, dta );
    camint( up, t, 6., upe, pup, dup );
        
    camint( ro, t, 17.,roe, pro, dro );
    camint( ta, t, 17., vec3( EARTH_RADIUS + 500., EARTH_RADIUS + 1300., -100. ), pta, dta );
    camint( up, t, 18., vec3(.0,1.,1.), pup, dup );
    
    camint( ro, t, 11., vec3(  3102. ,  0. , 1450. ), pro, dro );
    camint( ta, t, 4., vec3(    0. ,   -100. ,   0. ), pta, dta );
    camint( up, t, 8., vec3(    0. ,    0.15,   1. ), pup, dup ); 
#ifndef HIDE_TERRAIN    
    roe = terrainUntransform( vec3( 0., EARTH_RADIUS+0.004, 0. ) );
    upe = terrainUntransform( vec3( 0., 1., 0. ) );
    
    camint( ro, t, 7., roe, pro, dro );
    camint( ta, t, 12., vec3( -EARTH_RADIUS, EARTH_RADIUS+200., 100.), pta, dta );
    camint( up, t, 2., upe, pup, dup );
        
    roe = terrainUntransform( vec3( 0., EARTH_RADIUS+0.001, 0. ) );
    camint( ro, t, 17.,roe, pro, dro );
    camint( ta, t, 18., roe + vec3( 5000., EARTH_RADIUS-100., -2000.), pta, dta );
    camint( up, t, 18., vec3(.0,1.,1.), pup, dup );
        
    roe = terrainUntransform( vec3( 0., EARTH_RADIUS+1.8, 0. ) );
    camint( ro, t, 4.,roe, pro, dro );
    camint( ta, t, 4.5, roe + vec3( EARTH_RADIUS, EARTH_RADIUS+2000., -30.), pta, dta );
    camint( up, t, 4., vec3(.0,1.,1.), pup, dup );
#endif    
    camint( ro, t, 10., vec3(900. ,7000. , 1500. ), pro, dro );
    camint( ta, t, 2., vec3(    0. ,    0. ,   0. ), pta, dta );
    camint( up, t, 10., vec3(    0. ,    0.4,   1. ), pup, dup ); 
    
    up = normalize( up );
}

//-----------------------------------------------------
// mainImage
//-----------------------------------------------------

void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
	vec2 uv = fragCoord.xy / iResolution.xy;
    
    vec2 p = -1.0 + 2.0 * (fragCoord.xy) / iResolution.xy;
    p.x *= iResolution.x/iResolution.y;
    
    vec3 col;
    
// black bands
    vec2 bandy = vec2(.1,.9);
    if( uv.y < bandy.x || uv.y > bandy.y ) {
        col = vec3(0.);
    } else {
        // camera
        vec3 ro, ta, up;
        cameraPath( iTime*.7, ro, ta, up );

        vec3 ww = normalize( ta - ro );
        vec3 uu = normalize( cross(ww,up) );
        vec3 vv = normalize( cross(uu,ww));
        vec3 rd = normalize( -p.x*uu + p.y*vv + 2.2*ww );

        float maxd = MAX;  
        col = renderStars( rd ).xyz;

        vec4 planet = renderPlanet( ro, rd, up, maxd );       
        if( planet.w > 0. ) col.xyz = planet.xyz;

        float atmosphered = maxd;
        vec4 atmosphere = .85*renderAtmospheric( ro, rd, atmosphered );
        col = col * (1.-atmosphere.w ) + atmosphere.xyz; 

        vec4 ring = renderRing( ro, rd, maxd );
        if( ring.w > 0. && atmosphered < maxd ) {
           ring.xyz = ring.xyz * (1.-atmosphere.w ) + atmosphere.xyz; 
        }
        col = col * (1.-ring.w ) + ring.xyz;

#ifdef DISPLAY_CLOUDS
        float lro = length(ro);
        if( lro < EARTH_RADIUS+EARTH_CLOUDS*1.25 ) {
            vec3 sunColor = 2.*renderAtmosphericLow( ro, SUN_DIRECTION);  
            vec3 upColor = 4.*renderAtmosphericLow( ro, vec3(-SUN_DIRECTION.x, SUN_DIRECTION.y, -SUN_DIRECTION.z));  

            if( lro < EARTH_RADIUS+EARTH_CLOUDS ) {
                // clouds
                float d = iCSphereF( ro, rd, EARTH_RADIUS + EARTH_CLOUDS );
                if( d < maxd ) {
                    float shadow;
                    vec4 clouds = renderClouds( ro, rd, d, normalize(ro), 0., sunColor, upColor, shadow );
                    clouds.w *= 1.-smoothstep(0.8*EARTH_CLOUDS,EARTH_CLOUDS,lro-EARTH_RADIUS);
                    col = mix(col, clouds.rgb, clouds.w * (1.-smoothstep( 10., 30., d)) );
                }
            }
            float offset = lro-EARTH_RADIUS-EARTH_CLOUDS;
            col = mix( col, .5*sunColor, .15*abs(noise(offset*100.))*clamp(1.-4.*abs(offset)/EARTH_CLOUDS, 0., 1.) );
        }
#endif 

        // post processing
        col = pow( clamp(col,0.0,1.0), vec3(0.4545) );
        col *= vec3(1.,0.99,0.95);   
        col = clamp(1.06*col-0.03, 0., 1.);      

        vec2 sunuv =  2.7*vec2( dot( SUN_DIRECTION, -uu ), dot( SUN_DIRECTION, vv ) );
        float flare = dot( SUN_DIRECTION, normalize(ta-ro) );
        col += vec3(1.4,1.2,1.0)*lensFlare(p, sunuv)*clamp( flare+.3, 0., 1.);

        uv.y = (uv.y-bandy.x)*(1./(bandy.y-bandy.x));
        col *= 0.5 + 0.5*pow( 16.0*uv.x*uv.y*(1.0-uv.x)*(1.0-uv.y), 0.1 ); 
    }
    fragColor = vec4( col ,1.0);
}

void mainVR( out vec4 fragColor, in vec2 fragCoord, in vec3 ro, in vec3 rd ) {
    float maxd = MAX;  
    time = iTime * .7;
    
    rd = rd.xzy;
    ro = (ro.xzy * .1) + vec3(-1355. , 1795. , 1. );
    
    vec3 col = renderStars( rd ).xyz;

    vec4 planet = renderPlanet( ro, rd, vec3(0,.1,1), maxd );       
    if( planet.w > 0. ) col.xyz = planet.xyz;

    float atmosphered = maxd;
    vec4 atmosphere = .85*renderAtmospheric( ro, rd, atmosphered );
    col = col * (1.-atmosphere.w ) + atmosphere.xyz; 

    vec4 ring = renderRing( ro, rd, maxd );
    col = col * (1.-ring.w ) + ring.xyz;
    
    // post processing
    col = pow( clamp(col,0.0,1.0), vec3(0.4545) );
    col *= vec3(1.,0.99,0.95);   
    col = clamp(1.06*col-0.03, 0., 1.);      
    fragColor = vec4( col ,1.0);
}`,name:`Image`,description:``,type:`image`},{inputs:[],outputs:[{id:`XsfGRr`,channel:0}],code:`
//----------------------------------------------------------------------
// Wind function by Dave Hoskins https://www.shadertoy.com/view/4ssXW2


float hash( float n ) {
    return fract(sin(n)*43758.5453123);
}
vec2 Hash( vec2 p) {
    return vec2( hash(p.x), hash(p.y) );
}

//--------------------------------------------------------------------------
vec2 Noise( in vec2 x ) {
    vec2 p = floor(x);
    vec2 f = fract(x);
    f = f*f*(3.0-2.0*f);
    vec2 res = mix(mix( Hash(p + 0.0), Hash(p + vec2(1.0, 0.0)),f.x),
                   mix( Hash(p + vec2(0.0, 1.0) ), Hash(p + vec2(1.0, 1.0)),f.x),f.y);
    return res-.5;
}

//--------------------------------------------------------------------------
vec2 FBM( vec2 p ) {
    vec2 f;
	f  = 0.5000	 * Noise(p); p = p * 2.32;
	f += 0.2500  * Noise(p); p = p * 2.23;
	f += 0.1250  * Noise(p); p = p * 2.31;
    f += 0.0625  * Noise(p); p = p * 2.28;
    f += 0.03125 * Noise(p);
    return f;
}

//--------------------------------------------------------------------------
vec2 Wind(float n) {
    vec2 pos = vec2(n * (162.017331), n * (132.066927));
    vec2 vol = Noise(vec2(n*23.131, -n*42.13254))*1.0 + 1.0;
    
    vec2 noise = vec2(FBM(pos*33.313))* vol.x *.5 + vec2(FBM(pos*4.519)) * vol.y;
    
	return noise;
}

//----------------------------------------------------------------------



vec2 mainSound( in int samp,float time) {
    //16 - 38
 //   time -= 7.5;
    time *= .7;
    float vol = 1.-smoothstep(6.,8.5, time);
    vol += smoothstep(16.5,20., time);
    vol *= 1.-smoothstep(23.5,25.5, time);
    vol += smoothstep(47.5,51.5, time);
    vol = vol*.8+.2;
    
	return Wind(time*.05) * vol;
}`,name:`Sound`,description:``,type:`sound`}]},{ver:`0.1`,info:{id:`MtsXzf`,date:`1438956985`,viewed:6070,name:`[SIG15] Matrix Lobby Scene`,description:`PLEASE REWIND ON FIRST LOAD (⏮), TO MAKE SURE AUDIO IS IN SYNC.`,likes:74,published:`Public API`,usePreview:0,tags:[`matrix`,`scene`,`sig15`,`lobby`]},renderpass:[{inputs:[{id:`4sfGRn`,filepath:`/media/a/fb918796edc3d2221218db0811e240e72e340350008338b0c07a52bd353666a6.jpg`,type:`texture`,channel:1,sampler:{filter:`mipmap`,wrap:`repeat`,vflip:`false`,srgb:`false`,internal:`byte`},published:1},{id:`XsX3Rn`,filepath:`/media/a/92d7758c402f0927011ca8d0a7e40251439fba3a1dac26f5b8b62026323501aa.jpg`,type:`texture`,channel:2,sampler:{filter:`mipmap`,wrap:`repeat`,vflip:`false`,srgb:`false`,internal:`byte`},published:1},{id:`Xsf3zn`,filepath:`/media/a/f735bee5b64ef98879dc618b016ecf7939a5756040c2cde21ccb15e69a6e1cfb.png`,type:`texture`,channel:0,sampler:{filter:`mipmap`,wrap:`repeat`,vflip:`false`,srgb:`false`,internal:`byte`},published:1}],outputs:[{id:`4dfGRr`,channel:0}],code:`// Created by Reinder Nijhoff 2015
// Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License.
// @reindernijhoff
//
// https://www.shadertoy.com/view/MtsXzf
//
//   *Created for the Shadertoy Competition 2015*
//
// Theme: Your Favorite Movie/Game Moment
//
// https://www.shadertoy.com/eventsAugust2015.php5
//

#define HIGHQUALITY 1
#define RENDERDEBRIS 0
#define REFLECTIONS 1

#define MARCHSTEPS 90
#define MARCHSTEPSREFLECTION 30
#define DEBRISCOUNT 8

#define BPM             (140.0)
#define STEP            (4.0 * BPM / 60.0)
#define ISTEP           (1./STEP)
#define STT(t)			(t*(60.0/BPM))

float damageMod;
vec4 ep1, ep2, ep3, ep4, ep5;  

//-----------------------------------------------------
// noise functions

#define MOD2 vec2(.16632,.17369)
float hash(float p) { // by Dave Hoskins
	vec2 p2 = fract(vec2(p) * MOD2);
    p2 += dot(p2.yx, p2.xy+19.19);
	return fract(p2.x * p2.y);
}

float noise( const in vec3 x ) {
    vec3 p = floor(x);
    vec3 f = fract(x);
	f = f*f*(3.0-2.0*f);
	
	vec2 uv = (p.xy+vec2(37.0,17.0)*p.z) + f.xy;
	vec2 rg = textureLod( iChannel0, (uv+ 0.5)/256.0, 0.0 ).yx;
	return mix( rg.x, rg.y, f.z );
}

float noise( const in vec2 x ) {
    vec2 p = floor(x);
    vec2 f = fract(x);
	vec2 uv = p.xy + f.xy*f.xy*(3.0-2.0*f.xy);
	return textureLod( iChannel0, (uv+118.4)/256.0, 0.0 ).x;
}

//-----------------------------------------------------
// intersection functions

vec3 nSphere( in vec3 pos, in vec4 sph ) {
    return (pos-sph.xyz)/sph.w;
}

float iSphere( in vec3 ro, in vec3 rd, in vec4 sph ) {
	vec3 oc = ro - sph.xyz;
	float b = dot( oc, rd );
	float c = dot( oc, oc ) - sph.w*sph.w;
	float h = b*b - c;
	if( h<0.0 ) return -1.;
	return -b - sqrt( h );
}

//----------------------------------------------------------------------
// distance primitives

float sdBox( const in vec3 p, const in vec3 b ) {
    vec3 d = abs(p) - b;
    return min(max(d.x,max(d.y,d.z)),0.0) + length(max(d,0.0));
}

float sdColumn( const in vec3 p, const in vec2 b ) {
    vec2 d = abs(p.xz) - b;
    return min(max(d.x,d.y),0.0) + length(max(d,0.0));
}

//----------------------------------------------------------------------
// distance operators

float opU( float d2, float d1 ) { return min( d1,d2); }
float opS( float d2, float d1 ) { return max(-d1,d2); }
    
//--------------------------------------------
// map

float tileId( const in vec3 p, const in vec3 nor ) { 
    if( abs(nor.y) > .9 ) return 0.;
    
    float x, y;
    if( abs(nor.z) < abs(nor.x)) {
        x = p.z-6.;
    } else {
        x = abs(p.x)-16.;
    }
    if( p.y < 2.5 ) {
    	return floor( x / 3.6 ) * sign(p.x);
    }
    return floor( x / 1.8 ) * sign(p.x) * (floor( (p.y+7.5) / 5. ));
}


vec3 bumpMapNormal( const in vec3 pos, in vec3 nor ) {
    float i = tileId( pos, nor );
    if( i > 0. ) {
        nor+= 0.0125 * vec3( hash(i), hash(i+5.), hash(i+13.) );
        nor = normalize( nor );
    }
    return nor;
}

float map( const in vec3 p ) {
    float d = -sdBox( p, vec3( 28., 14., 63. ) );

    vec3 pm = vec3( abs( p.x ) - 17.8, p.y, mod( p.z, 12.6 ) - 6.);    
    vec3 pm2 = abs(p) - vec3( 14., 25.25, 0. );
    vec3 pm3 = abs(p) - vec3( 6.8, 0., 56.4 );      

    d = opU( d, sdColumn( pm, vec2( 1.8, 1.8 ) ) );        
    d = opS( d, sdBox( p,  vec3( 2.5, 9.5, 74. ) ) );    
    d = opS( d, sdBox( p,  vec3( 5., 18., 73. ) ) );
    d = opS( d, sdBox( p,  vec3( 13.8, 14.88, 63. ) ) );
    d = opS( d, sdBox( p,  vec3( 13.2, 25., 63. ) ) );
    d = opS( d, sdColumn( p,  vec2( 9.5, 63. ) ) ); 
    d = opU( d, sdColumn( pm3, vec2( 1.8, 1.8 ) ) );
    d = opU( d, sdBox( pm2, vec3( 5., .45, 200. ) ) );
    
    return d;
}

float mapDamage( vec3 p ) {
    float d = map( p );

    float n = max( max( 1.-abs(p.z*.01), 0. )*
                   max( 1.-abs(p.y*.2-1.2), 0. ) *
                   noise( p*.3 )* (noise( p*2.3 ) +.2 )-.2 - damageMod, 0.);
   
	return d + n;
}

float mapDamageHigh( vec3 p ) {
    float d = map( p );
    
    float p1 = noise( p*2.3 );
    float p2 = noise( p*5.3 );
    
    float n = max( max( 1.-abs(p.z*.01), 0. )*
                   max( 1.-abs(p.y*.2-1.2), 0. ) *
                   noise( p*.3 )* (p1 +.2 )-.2 - damageMod, 0.);
  
    float ne = 0.;
    ne += smoothstep( -0.7, 0., -distance( p, ep1.xyz ) );
    ne += smoothstep( -0.7, 0., -distance( p, ep2.xyz ) );
    ne += smoothstep( -0.7, 0., -distance( p, ep3.xyz ) );
    ne += smoothstep( -0.7, 0., -distance( p, ep4.xyz ) );
    ne += smoothstep( -0.7, 0., -distance( p, ep5.xyz ) );
    
    n += .5 * max((ne - p2 ),0.) * ne;
  
    if( p.y < .1 ) {
        n += max(.1*(1.-abs(d)+7.*noise( p*.7 )+.9*p1+.5*p2)-4.5*damageMod,0.);
    }
    
    if( abs(n) > 0.0 ) {
        n += noise( p*11.) * .05;
        n += noise( p*23.) * .03;
    }
    
	return d + n;
}


vec3 calcNormalDamage( in vec3 pos, in float eps ) {
    if( pos.y < 0.001 && (mapDamageHigh(pos)-map(pos)) < eps ) {   		
	        return vec3( 0., 1., 0. );
    } else {    
        vec2 e = vec2(1.0,-1.0)*(0.5773*eps);
        vec3 n =  normalize( e.xyy*mapDamageHigh( pos + e.xyy ) + 
                             e.yyx*mapDamageHigh( pos + e.yyx ) + 
                             e.yxy*mapDamageHigh( pos + e.yxy ) + 
                             e.xxx*mapDamageHigh( pos + e.xxx ) );
        n = bumpMapNormal( pos, n );
        return n;  
    }
}

//----------------------------------------------------------------------
// lighting

float calcAO( in vec3 pos, in vec3 nor ) {
	float occ = 0.0;
    for( int i=0; i<6; i++ ) {
        float h = 0.1 + 1.2*float(i);
        occ += (h-map( pos + h*nor ));
    }
    return clamp( 1.0 - occ*0.025, 0.0, 1.0 );    
}

float calcFakeAOAndShadow( in vec3 pos ) { 
    float r = (1.-abs(pos.x)/30.5);
    
    r *= max( min( .35-pos.z / 40., 1.), 0.65);
    r *= .5+.5*smoothstep( -66., -.65, pos.z);
    
    if( pos.y < 25. ) r *= 1.-smoothstep( 18., 25., .5*pos.y+abs(pos.x) ) * (.6+pos.y/25.);
    r *= 1.-smoothstep(5., 8., abs(pos.x) ) * .75 * (smoothstep( 60.,63.,abs(pos.z)));
    
    return clamp(r, 0., 1.);
}

//----------------------------------------------------------------------
// materials

float matMarble( in vec3 pos, in vec3 nor ) {
    float i = tileId( pos, nor );
    
    return .072*(hash(i)+noise(pos*7.))+.12*noise(pos*25.);
}

float matSideLamp( in vec3 pos, in vec3 nor ) {
    float l = (1.-smoothstep(0.05,0.15, abs( pos.y-13.75 ) ))
        	* (1.-smoothstep(1.5,1.7, abs( mod(pos.z, 3.6)-1.8 ) ));
    return 5. * l;
}

float matOutdoorLight( in vec3 pos, in vec3 nor ) {
    float l = ( smoothstep( 0.03, 0.1, abs( mod( pos.x, 1.8 ) / 1.8 - .5) ))
			* ( smoothstep( 0.03, 0.1, abs( mod( pos.y, 3.6 ) / 3.6 - .5) ));
    return mix( 8.,12., l);
}

vec2 shade( in vec3 pos, in vec3 nor, in float m, in float t, in bool reflection ) {
    float refl = 0.1;
    float mate = 0.;
 	float light = 0.;            
    float col = 0.;
    
    if( m < .5 ) {
   		if( pos.y < .01 ) {
	    	mate = .05 * (.25+.2*texture( iChannel1, pos.xz*.05 ).r);
            float x = abs(pos.x);
            if( (x > 12. && x < 14.8) ||  (x > 3.2 && x < 6.8) || abs(pos.z) > 68.4 ) mate *= 0.25;
        } else if( pos.y > 13.5 && pos.y < 13.99 && abs( pos.x ) > 27.99 ) {
            light = matSideLamp( pos, nor ); 
        } else if( pos.z > 62. && pos.y > 52. ) {
            light = matOutdoorLight( pos, nor );
        } else {
 			mate = matMarble( pos, nor );
            refl = 0.05;
   		}
        if( abs(mapDamageHigh(pos)-map(pos)) > 0.0001 * t ) {
            refl = 0.;
            mate = 0.21;
        }
        if( abs( pos.z ) > 73.1 ) {
            mate = 0.02;
            if( mod( abs( pos.x ), 2.25 ) < .3 ||
            	mod( abs( pos.y ), 2.25 ) < .3 ) mate = 0.0025;
            refl = 0.02;
        }
            
        if( nor.y < -0.8 && pos.y > 13.49 ) {
            col += mate * (0.4 * pow( max( (abs(pos.x*.38)-7.2),0.), 2.));
        }        
    } 
#if RENDERDEBRIS
    else if( m < 1.5 ) {
            refl = 0.;
            mate = 0.1 * noise(pos);
    }
#endif
    
    col += mate * (
        25. * ( 0.02 +
        .2 * min(1., max( -nor.x * sign(pos.x), 0.)) + 
        .5 * min(1., max( nor.y, 0. )) +
        .05 * abs( nor.z ) ) * calcFakeAOAndShadow( pos ) );
    
    col *= calcAO( pos, nor );
    col += light;
    
    return vec2( col, refl );
}

//----------------------------------------------------------------------
// intersection code

float intersect( in vec3 ro, in vec3 rd ) {
	const float precis = 0.00125;
    float h = precis*2.0;
    float t = 0.1;
        
    float d = -(ro.y)/rd.y;
    float maxdist = d>0.?d:500.;
    
	for( int i=0; i < MARCHSTEPS; i++ ) {
#if HIGHQUALITY
        h = .9*mapDamage( ro+rd*t );
#else
        h = map( ro+rd*t );
#endif
        if( abs(h) < precis ) {
            return t;
        } 
        t += h;
        if( t > maxdist ) {
            return maxdist;
        }
    }
    return -1.;
}


float intersectReflection( in vec3 ro, in vec3 rd ) {
	const float precis = 0.00125;
    float h = precis*2.0;
    float t = 0.;
        
    float d = -(ro.y)/rd.y;
    float maxdist = d>0.?d:500.;
    
	for( int i=0; i < MARCHSTEPSREFLECTION; i++ ) {
        h = map( ro+rd*t );
        if( abs(h) < precis ) {
            return t;
        } 
        t += h;
        if( t > maxdist ) {
            return maxdist;
        }
    }
    return -1.;
}

//----------------------------------------------------------------------
// render functions

float renderExplosionDebris( const in vec3 ro, const in vec3 rd, in float maxdist, const in vec4 ep, inout vec3 nor, 
                             const in float time ) {
    float maxRadius = 30.*(time - ep.w - .025);
    float minRadius = 0.2 * maxRadius;
    if( maxRadius > 30. ) return maxdist;
    
    for( int i=0; i<DEBRISCOUNT; i++ ) {
        float id = hash(  ep.w+float(i) );
        vec3 dir = normalize( -1.+2.*vec3( id, hash(  ep.w+.5*float(i) ), hash(  ep.w+1.5*float(i) ) ) - vec3( 2.*sign(ep.x), 0., 0.) );
        vec3 pos = ep.xyz + dir*mix( minRadius, maxRadius, id ) + vec3(0.,-maxRadius*sin( maxRadius*0.005 ),0.);
        float d = iSphere( ro, rd, vec4( pos, 0.1*id+0.003 ) );
        if( d > 0. && d < maxdist ) {
            maxdist = d;
            nor = nSphere( ro+rd*d, vec4( pos, 0.1*id+0.003 ) );
        }
    }
    
    return maxdist;
}

void renderExplosionDust( const in vec3 ro, const in vec3 rd, in float dist, const in vec4 ep, inout vec2 col, 
                          const in float time, const in vec3 grd ) {
    float maxRadius = 10.*(time - ep.w + .25);
    if( maxRadius > 40. ) return ;
    
    float dens = 0.;
    float ho = hash( ep.w ); // id of explosion
    float fade = pow( 2., -maxRadius*0.11-2.);
    float zoom = 2.5/maxRadius;
    vec2 down = vec2(sin(maxRadius*0.005+.1), 0.);
                     
	// intersect planes
    vec2 d = -(ro.xz - ep.xz )/rd.xz;
    if( d.x > 0. ) {
        vec3 pos = ro+d.x*rd;
        float radius = distance( ep.yz, pos.yz );
        if( radius < maxRadius  ) {
            float l = max( 0.025*(dist-d.x) + .5, 0. ) 
                        			* fade 
                      				* abs( grd.x )
                     				* (1.-smoothstep( 0.8*maxRadius, maxRadius, radius ));            
	        float excol = mix( col.x, 1., pow( max(1.-2.*textureLod( iChannel2,ho+(pos.yz-ep.yz)*zoom + down, 0.0 ).x,0.),3.) );               
    	    col.x = mix( col.x, excol, l);
            col.y += l;
        }
    }
    
    if( d.y > 0. ) {
        vec3 pos = ro+d.y*rd;
        float radius = distance( ep.yx, pos.yx );
        if( radius < maxRadius  ) {
            float l = max( 0.025*(dist-d.y) + .5, 0. ) 
                        			* fade 
                      				* abs( grd.z )
                     				* (1.-smoothstep( 0.8*maxRadius, maxRadius, radius ));
	        float excol = mix( col.x, 1., pow( max(1.-2.*textureLod( iChannel2,ho+(pos.yx-ep.yx)*zoom + down, 0.0 ).x,0.),3.) );   
    	    col.x = mix( col.x, excol, l);
            col.y += l;
        }
    }
}

vec3 render( const in vec3 ro, const in vec3 rd, in float time, const in float fog, const in vec3 grd ) {
    const float eps = 0.01;
    vec2 col = vec2(0.);
    
    float t = intersect( ro, rd );
    if( time > STT(98.) ) {
        time = STT(95.5)+.4*(time-STT(95.5)); // slow motion
    }
    time += .03*hash( rd.x + rd.y*5341.1231 ); // motionblur
    
    if( t > 0. ) {
        vec3 nor;
        float m = 0.;

#if RENDERDEBRIS
        float d = renderExplosionDebris( ro, rd, t, ep1, nor, time );
        d = renderExplosionDebris( ro, rd, d, ep3, nor, time );
        d = renderExplosionDebris( ro, rd, d, ep5, nor, time );
#if HIGHQUALITY 
        d = renderExplosionDebris( ro, rd, d, ep2, nor, time );
        d = renderExplosionDebris( ro, rd, d, ep4, nor, time );
#endif
        if( d < t ) {
            m = 1.;
            t = d;
        } 
#endif
   
        vec3 pos = ro + t*rd;
        if( m < .5 ) {
	        nor = calcNormalDamage( pos, eps );
        }
        col = shade( pos, nor, m, t, false );

#if REFLECTIONS        
        vec3 rdReflect = reflect( rd, -nor );
        float tReflect = intersectReflection( pos + eps*rdReflect, rdReflect );

        if( tReflect >= 0. && col.y > 0. ) {
            vec3 posReflect = pos + tReflect*rdReflect;
            vec3 norReflect = calcNormalDamage( posReflect, eps );

            col += shade( posReflect, norReflect, 0., tReflect, true ) * col.y;
        }
#endif
    } else {
        t = 60.;
    }

    col.y = 0.; 
    renderExplosionDust( ro, rd, t, ep1, col, time, grd );
    renderExplosionDust( ro, rd, t, ep2, col, time, grd );
    renderExplosionDust( ro, rd, t, ep3, col, time, grd );
    renderExplosionDust( ro, rd, t, ep4, col, time, grd );
    renderExplosionDust( ro, rd, t, ep5, col, time, grd );
    
 // add fog
    vec3 dcol = vec3( max(col.x,0.) );
 	dcol = mix( vec3(.5), dcol, exp( -t*(.02*fog+.005*col.y) ) );
        
    return pow( dcol, vec3(0.45) );
}

//----------------------------------------------------------------------
// explosions

#define E1(a,b,c,d) t+=a;if( time >= t ){ep1 = vec4(b,c,d,t);}
#define E2(a,b,c,d) t+=a;if( time >= t ){ep2 = vec4(b,c,d,t);}
#define E3(a,b,c,d) t+=a;if( time >= t ){ep3 = vec4(b,c,d,t);}
#define E4(a,b,c,d) t+=a;if( time >= t ){ep4 = vec4(b,c,d,t);}
#define E5(a,b,c,d) t+=a;if( time >= t ){ep5 = vec4(b,c,d,t);}

void initExplosions( const in float time ) {
	ep1 = ep2 = ep3 = ep4 = ep5 = vec4(-1000.);
    
    float t = 0.;    
    E1(STT(21.), 16., 3.9, 8.2 );
    E2(.7, 16., 5.4, 6.1 );
    E3(.3, 16., 6.3, 7.7 );
    E4(1., 16., 4.8, 8.2 );
    E5(.7, 16., 5.7, 7.3 );
    
    t = 0.;
    E1(STT(34.), -16., 3.9, 5.2 );
    E2(.5, -16., 5.4, 5.1 );
    E3(.7, -16., 6.3, 6.7 );
    E4(.5, -16., 4.8, 7.2 );
    E5(.4, -16., 5.7, 6.3 );
        
    t = 0.;
    E1(STT(42.), -19.1, 3.9, -4.5 );
    E2(1.3, -17.4, 5.4, -4.5 );
    E3(.3, -18.2, 6.3, -4.5 );
    E4(.4, -17.7, 4.8, -4.5 );
    E5(.3, -16.7, 5.7, -4.5 );
  
    E3(.3, -18.2, 6.3, -4.5 );
    E2(.2, -17.4, 5.4, -4.5 );
    E3(.1, -18.2, 6.3, -4.5 );
    E4(.2, -17.7, 4.8, -4.5 );
    E5(.1, -16.7, 5.7, -4.5 );
    
    E1(.9, -16., 3.9, -5.2 );
    E2(.5, -16., 5.4, -5.1 );
    E3(.3, -16., 6.3, -6.7 );
    E4(.5, -16., 4.8, -7.2 );
    E5(.4, -16., 5.7, -6.3 );    
    
    t = 0.;    
    E1(STT(58.), 16., 3.9, 2.2 );
    E2(.2, 16., 5.4, 4.1 );
    E3(.3, 24., 6.3, 3.7 );
    E4(.5, 16., 4.8, 8.2 );
    E5(.7, 24., 5.7, 4.3 );
    E1(.1, 16., 1.9, 8.2 );
    E2(.2, 24., 5.4, -2.1 );
    
    t = 0.;
    E1(STT(66.), 16., 3.9, 6.5 );
    E2(.2, 16., 5.4, 6.1 );
    E5(.3, 16., 6.7, 7.3 );
    E3(.3, 16., 6.3, 5.7 );
    E4(.2, 16., 7.8, 6.2 );
        
    E5(.1, 16., 5.7, 4.7 );
    E1(.2, 16., 3.9, -6.2 );
    E2(.3, 17., 6.4, -4.5 );
    E3(.3, 16., 6.3, -5.7 );
    E4(.5, 16., 7.8, -6.2 );    
    E5(.3, 16., 5.7, -7.7 );
    E1(.2, 16., 3.9, -6.2 );
    E2(.3, 16., 6.4, -4.5 );
   
    t = 0.;
    E1(STT(78.), -17.1, 3.9, -4.5 );
    E2(.3, -17.4, 5.4, -4.5 );
    E3(.3, -18.2, 6.3, -4.5 );
    E4(.4, -17.7, 4.8, -4.5 );
    E5(.3, -16.7, 5.7, -4.5 );
  
    E3(1.3, -18.2, 6.3, -4.5 );
    E2(.2, -17.4, 5.4, -4.5 );
    E3(.1, -18.2, 6.3, -4.5 );
    E4(.2, -17.7, 4.8, -4.5 );
    E5(.1, -16.7, 5.7, -4.5 );
    
    E2(.5, -19.6, 5.4, -5.1 );
    E1(.9, -19.6, 3.9, -5.2 );
    E3(.3, -19.6, 6.3, -6.7 );
    E4(.5, -19.6, 4.8, -7.2 );
    E5(.4, -19.6, 5.7, -6.3 );
}

//----------------------------------------------------------------------
// camera

mat3 setCamera( const in vec3 ro, const in vec3 rt, const in float cr, const in float fl ) {
	vec3 cw = normalize(rt-ro);
	vec3 cp = vec3(sin(cr), cos(cr),0.0);
	vec3 cu = normalize( cross(cw,cp) );
	vec3 cv = normalize( cross(cu,cw) );
    return mat3( cu, cv, -fl*cw );
}

#define SCAM(a,j,h,i,f,g,b,c,d,e) if(time >= t ){damageMod=j;sro=b;ero=c;sta=d;eta=e;st=t;dt=a;sfog=h;efog=i;}t+=a;
#define CCAM(a,j,h,i,f,g,b,c,d,e) if(time >= t ){sro=ero;ero=c;sta=eta;eta=e;st=t;dt=a;sfog=efog;efog=i;}t+=a;

void getCamPath( const in float time, inout vec3 ro, inout vec3 ta, inout float fl, inout float fog ) {
    vec3 sro, sta, ero, eta;
    float st = 0., dt, t = 0., sfog, efog;
    
    SCAM(STT(12.), 0., 0.,    0., 1.5, 1.5, vec3( 0., 5., 22.5 ), vec3( 0., 5.,  18.5 ), vec3( 0., 5., 0. ), vec3( 0., 5., 0. ) ); 
    SCAM(STT(7.5), 0., 0.,    0., 1.5, 1.5, vec3( -14., 5.,  18.5 ), vec3( 18., 4., 11. ), vec3( 10., 5., -50. ), vec3( 0., 5., -50. ) ); 
    CCAM(STT(7.5), 0., 0.,  0.05, 1.5, 1.5, vec3( 18., 4., 11. ), vec3( 21.5, 4., 11.5 ),  vec3( 0., 5., -50. ), vec3( -4., 7., 0. ) ); 
    CCAM(STT(2.5), 0., 0.05, 0.1, 1.5, 1.5, vec3( 21.5, 4., 11.5 ), vec3( 21.5, 4., 11.5 ),  vec3( -4., 7., 0. ), vec3( -16., 7., 8. ) ); 
    CCAM(STT(4.), 0.,  0.1, 0.15, 1.5, 4.5, vec3( 21.5, 4., 11.5 ), vec3( 10., 4.25, 11.35 ),  vec3( -16., 7., 8. ), vec3( -16., 6., 8. ) ); 
    
    SCAM(STT(7.5),  0., 0.1,  0.3, 1.5, 1.5, vec3( -11., 5.25, 7.05 ), vec3( -13., 5., 9. ),  vec3( -19., 5.2, 7. ), vec3( -16.5, 5., 5.3 ) );     
    SCAM(STT(13.), .4, 0.1,  0.5, 1.5, 1.5, vec3( -18., 5., 4.05 ), vec3( -10., 5.25, -6. ),  vec3( -17., 5.5, 0. ), vec3( -15.5, 5.25, -7.3 ) );     
	CCAM(STT(4.), .45, 0.5,  0.65, 1.5, 1.2, vec3( -10., 5.25, -6. ), vec3( -12., 5.25, -9. ),  vec3( -15.5, 5.25, -7.3 ), vec3( -13.5, 6.25, 2.3 ) );     

    SCAM(STT(7.5), .95, 0.4,  1.9, 1.5, 1.5, vec3( 18., 4., 11. ), vec3( 25.5, 4., 11.5 ),  vec3( 0., 5., -50. ), vec3( -4., 7., 0. ) ); 

    SCAM(STT(12.2), .95, 0.8,  1.3, 1.5, 1.5, vec3( 10., 4.7, 4. ), vec3( 10., 5., -7.5 ),  vec3( 50., 5., 2. ), vec3( 40., 5., -20. ) ); 
    
    SCAM(STT(16.25), 1., 0.4,  0.8, 1.5, 1.5, vec3( -18., 4.5, 4.05 ), vec3( -26., 3.25, -6. ),  vec3( -17., 5.5, 0. ), vec3( -15.5, 6.25, -7.3 ) );     
    CCAM(STT(4.),  1., 0.8,  0.6, 1.5, 1.5, vec3( -26., 3.25, -6. ), vec3( -26., 3.25, -6. ),  vec3( -15.5, 6.25, -7.3 ), vec3( -15.5, 6.25, -7.3 ) );     

    SCAM(STT(16.), 1.1, 0.4, 0.05, 1.5, 1.5, vec3( 0., 5.,  18.5 ), vec3( 0., 5.,  18.5 ), vec3( 0., 5., 0. ), vec3( 0., 5., 0. ) ); 
  
    dt = clamp( (time-st)/dt, 0., 1. );

    if(  time > STT(65.5) && time < STT(77.75)  ) {
	    ro = mix( sro, ero, dt);
    	ta = mix( sta, eta, dt);
    } else {
	    ro = mix( sro, ero, smoothstep(0.,1., dt));
    	ta = mix( sta, eta, smoothstep(0.,1., dt));
    }
	
    fl = 1.5;    
    if( time > STT(29.5) && time < STT(33.5) ) {
        fl = mix( 1.5, 4.5, smoothstep( STT(29.5), STT(33.5), time ) );
    }
    
   	fog = mix( sfog, efog, dt);
    damageMod = .4-.4*damageMod;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
    float time = mod(iTime, 60.);

    vec2 q = fragCoord.xy/iResolution.xy;
	    
    // letterbox
    if( abs(2.*fragCoord.y-iResolution.y) > iResolution.x * 0.42 ) {
        fragColor = vec4( 0., 0., 0., 1. );
        return;
    }
    vec3 ro, ta;
    float fl, fog;
      
    getCamPath( time, ro, ta, fl, fog );
        
    initExplosions( time );
    
    mat3 ca = setCamera( ro, ta, 0.0, (1./1.5) );    
    vec2 p = (-iResolution.xy+2.*(fragCoord.xy))/iResolution.x;
    vec3 rd = normalize( ca * vec3(p,-fl) );

    vec3 col = render( ro, rd, time, fog, normalize( ta-ro ) );
    
    col *= vec3(0.704,0.778,0.704);    
	col = col*0.8 + 0.2*col*col*(3.0-2.0*col);
	col *= vec3(1.378,1.56,1.3);
        
    // vignette
    col *= 0.15 + 0.85*pow(16.0*q.x*q.y*(1.0-q.x)*(1.0-q.y), 0.1 );

    // flicker
    col *= 1.0 + 0.015*fract( 17.1*sin( 13.1*floor(12.0*iTime) ));
    
	// fade in
    col *= clamp( time*.7, 0., 1. );
    col *= clamp( abs(time-STT(12.)), 0., 1. );
    if( time < STT(33.5) ) col *= clamp( (STT(33.5)-time-.5), 0., 1. );
    col *= clamp( abs(time-STT(98.)), 0., 1. );
    
    fragColor = vec4( col, 1.0 );
}
`,name:`Image`,description:``,type:`image`},{inputs:[{id:`Xsf3zn`,filepath:`/media/a/f735bee5b64ef98879dc618b016ecf7939a5756040c2cde21ccb15e69a6e1cfb.png`,type:`texture`,channel:0,sampler:{filter:`mipmap`,wrap:`repeat`,vflip:`false`,srgb:`false`,internal:`byte`},published:1}],outputs:[{id:`XsfGRr`,channel:0}],code:`// Created by Reinder Nijhoff 2015
// @reindernijhoff
//
// https://www.shadertoy.com/view/MtsXzf
//

#define HIGHQUALITY 1

#define N(a) if(t>b)x=b;b+=a;
#define NF(a,c,g) if(t>b){x=b;f=c;v=g;d=a;}b+=a;

//----------------------------------------------------------------------------------------

#define BPM             (140.0)
#define STEP            (4.0 * BPM / 60.0)
#define ISTEP           (1./STEP)
#define LOOPCOUNT		(16.)
#define STT(t)			(t*(60.0/BPM))

#define PI2 6.283185307179586476925286766559

#define D 36.71
#define A 55.00	
#define B 61.74
#define C 65.41

//-----------------------------------------------------
// noise functions

#define MOD2 vec2(.16632,.17369)
float hash(const in float p) { // by Dave Hoskins
	vec2 p2 = fract(vec2(p) * MOD2);
    p2 += dot(p2.yx, p2.xy+19.19);
	return fract(p2.x * p2.y);
}

float sine(const in float x) {
    return sin(PI2 * x);
}

float loop(const in float t, const in float steps) {
    return mod(t, steps * ISTEP);
}

float distortion(const in float s, const in float d) {
	return clamp(s * d, -1.0, 1.0);
}

float quan(const in float s, const in float c) {
	return floor(s / c) * c;
}

bool inLoop( float time, float s, float e ) {
    float t = (time * (STEP / LOOPCOUNT));
    return ( t >= s && t < e );
}

//-----------------------------------------------------
// instruments by iq and And

float snare(const in float t, const in float f0) {
    float op3 = sine((t * f0) * 2.8020) * exp(-t * 1.0);
    float op2 = sine((t * f0) * 2.5000 + op3 * 1.00);
    float op1 = sine((t * f0) * 18.000 + op2 * 0.72);

    return op1 * exp(-t * 5.5);
}

float kick(float tb) {
	const float aa = 5.0;
	tb = sqrt(tb * aa) / aa;
	
	float amp = exp(max(tb - 0.015, 0.0) * -5.0);
	float v = sine(tb * 100.0) * amp;
	v += distortion(v, 4.0) * amp;
	return v;
}

float bass(const in float time, const in float freq, const in float duration) {
    float ph = 1.0;
    ph *= sin(6.2831*freq*time);
    ph *= 0.1+0.9*max(0.0,6.0-0.01*freq);
    ph *= exp(-time*freq*0.3);
    
    
    float y = 0.;
    y += 0.70*sin(1.00*PI2*freq*time+ph);//*exp(-0.07*time);
    y += 0.90*sin(2.01*PI2*freq*time+ph);//*exp(-0.11*time);

    y += 0.145*y*y*y;   

    y *= 1.-smoothstep( duration*0.9, duration, time * STEP );

    return y;
}

float bell(const in float t, const in float f0) {
    float op3 = sine((f0 * t) * 6.0000             ) * exp(-t * 5.0);
    float op2 = sine((f0 * t) * 7.2364 + op3 * 0.20);
    float op1 = sine((f0 * t) * 2.0000 + op2 * 0.13) * exp(-t * 2.0);

    return op1;
}

float lift(float time) {
    return sin(PI2*D*32.*time)*exp(-6.0*time) + bell(time, D*32.);
}

float gun(float time, float f, const in float d) {
    return distortion( textureLod( iChannel0, vec2(time*5.7864, time*6.9732)*f, 0. ).x *exp(-10.0*time)
                       * smoothstep(0.,0.1,time) * (1.-smoothstep(0.5,.6,time)), d);
}

//-----------------------------------------------------
// loops

float loopBass(const in float t, const in float m) {
    float x = 0., b = 0., f = 0., v = 0., d;
                
    NF(2.,D,0.9);NF(2.,D,1.);NF(1.,D,0.5);NF(1.,D,0.6);NF(1.,D,0.5);
    NF(2.,A,1.05);NF(1.,D,0.5);NF(2.,B,0.9);NF(1.,D,0.5); NF(3.,C,1.);
    f *= m;
    
    return v * bass( (t-x)*ISTEP, f, d );

}
    
float loopBassIntro(const in float t) {
    float x = 0., b = 0., f = 0., v = 0., d;
    NF(4.,A,.5);NF(2.,D,.8);NF(8.,D,1.);NF(2.,D,.25);
    
    return v * bass( (t-x)*ISTEP, f*.5, d );
}

float loopDrums(const in float t) {
    float x = 0., b = 0., r;
    
    // base
    N(3.);N(7.);N(1.);N(5.);
	r = kick( (t-x)*ISTEP*1.2 );
    
    // bell
    x = b = 0.;
    N(4.);N(4.);N(4.);N(2.);N(2.);
    r += .25 * bell( (t-x)*ISTEP*8., 100. );
    
    // hihat
    x = b = 0.;
    N(3.);N(3.);N(2.);N(2.);N(4.);
    r += .35 * snare( (t-x)*ISTEP*2., 200.+t );
    
    // snare
    x = b = 0.;
    N(4.);N(3.);N(2.);N(3.);N(1.);N(3.);
    r += .75 * snare( (t-x)*ISTEP*8., 10. );

    return r;
}

float loopDrumsIntro(const in float t) {
    float x = 0., b = 0.;
    
    // snare
    N(1.);N(3.);N(3.);N(2.);N(1.);N(1.);N(1.);N(1.);N(1.);N(1.);N(1.);
    return (t/24.) * snare( (t-x)*ISTEP*8., 10. ) + kick(  (t)*ISTEP*1.2 );
}

float loopGun( const in float time, const in float interval, const in float numshots, 
               const in float shotdelay, const in float minf, const in float maxf ) {
    float it = mod( time, interval );

#if HIGHQUALITY
    float m = 0.;
    for( float sh = 0.; sh<2.5; sh+=1.) {
        if( sh < numshots ) {
            float g = (0.5+0.5*hash(sh+.5))*gun( it - sh*shotdelay - .5*shotdelay*hash(sh), mix(minf, maxf, hash(sh+.25)), 1.5 );
    		m = m+g - abs(m)*g;
        }
    }
 
    return m;
#else
    float sh = floor( it/shotdelay );
    if( sh < numshots ) {
        return (0.5+0.5*hash(sh+.5))*gun( it - sh*shotdelay - .5*shotdelay*hash(sh), mix(minf, maxf, hash(sh+.25)), 1.5 );
    }
    return 0.;
#endif
}



//-----------------------------------------------------
// music

float loopMusic(const in float time) {
	float mtime = loop( time, 16. );
    float t = mtime * STEP;
    float m = 1.;
    
    float d = 0.;
    float b = 0.;
    
    if( inLoop( time, 2., 36. ) && !inLoop( time, 6., 8. ) && !inLoop( time, 15., 16. )  ) {
        d = loopDrums( t );
    }
    
    if( inLoop( time, 1., 2. ) || inLoop( time, 7., 8. ) || inLoop( time, 11., 12. ) ) {
        d += loopDrumsIntro( t );
    }
    
    if( inLoop( time, 10., 12. ) ) {
        m = B/D;
    }

    return loopBass( t, m ) + .5*d;
}

float loopIntro(const in float time) {
	float mtime = loop( time, 16. );
    float t = mtime * STEP;
    
	if( inLoop( time, .74, 5.25 ) ) {
        return loopBassIntro( t );
    }
    return 0.;
}
    
float loopBackground( const in float time ) {
    float m = 0., g = 0.;
    g = .5 * loopGun( time, 2., 3., .21, 1., 1.5 );
    m = m+g - abs(m)*g;
    
    g = .95 * loopGun( time-4.123, 3., 1., 1.5, 1., 1.5 );
    m = m+g - abs(m)*g;
    
    g = .7 * loopGun( time-3., 3.2, 2., .41, 1., 1.5 );
    m = m+g - abs(m)*g;
    
    return m;
}

void initExplosions( in float time );
float exTime1, exTime2;

//-----------------------------------------------------
// main
    
vec2 mainSound( in int samp,float time) {
        
    initExplosions(time);
    // align with music
    exTime1 = floor( exTime1 / ISTEP * 2.)*ISTEP*.5;
    exTime2 = floor( exTime2 / ISTEP * 2.)*ISTEP*.5;
    
    float m = 0., music = 0., gun1 = 0., gun2 = 0., bg = 0.;
    
    if( time < STT(34.) ) {
        music = loopIntro( time );
    } else if( time < STT(98.) ){
        music = loopMusic( time-STT(34.) );
    }
    music *= .25;
    
    gun1 = gun( time-exTime1, mix(1.,1.5,hash(exTime1)), 3. );
    gun2 = gun( time-exTime2, mix(1.,1.5,hash(exTime2)), 3. );
    
    if( time > STT(34.) && time < STT(84.)  ) {
        bg = loopBackground(time);
    }
    
    m = m+bg - abs(m)*bg;
    m = m+music - abs(m)*music;
    
    m = m+gun1 - abs(m)*gun1;
    m = m+gun2 - abs(m)*gun2;
    
    m *= 1.5;
    
    if( time > 44.5 ) m += .0625*lift( time-44.5);
    
    return vec2( clamp(m, -1., 1.) );
}


//----------------------------------------------------------------------
// explosions

#define E1(a,b,c,d) t+=a;if( time >= t ){exTime2=exTime1;exTime1=t;}
#define E2(a,b,c,d) t+=a;if( time >= t ){exTime2=exTime1;exTime1=t;}
#define E3(a,b,c,d) t+=a;if( time >= t ){exTime2=exTime1;exTime1=t;}
#define E4(a,b,c,d) t+=a;if( time >= t ){exTime2=exTime1;exTime1=t;}
#define E5(a,b,c,d) t+=a;if( time >= t ){exTime2=exTime1;exTime1=t;}

void initExplosions( in float time ) {
	exTime1 = exTime2 = -1000.;
    
    float t = 0.;    
    E1(STT(21.), 16., 3.9, 8.2 );
    E2(.7, 16., 5.4, 6.1 );
    E3(.3, 16., 6.3, 7.7 );
    E4(1., 16., 4.8, 8.2 );
    E5(.7, 16., 5.7, 7.3 );
    
    t = 0.;
    E1(STT(34.), -16., 3.9, 5.2 );
    E2(.5, -16., 5.4, 5.1 );
    E3(.7, -16., 6.3, 6.7 );
    E4(.5, -16., 4.8, 7.2 );
    E5(.4, -16., 5.7, 6.3 );
        
    t = 0.;
    E1(STT(42.), -19.1, 3.9, -4.5 );
    E2(1.3, -17.4, 5.4, -4.5 );
    E3(.3, -18.2, 6.3, -4.5 );
    E4(.4, -17.7, 4.8, -4.5 );
    E5(.3, -16.7, 5.7, -4.5 );
  
    E3(.3, -18.2, 6.3, -4.5 );
    E2(.2, -17.4, 5.4, -4.5 );
    E3(.1, -18.2, 6.3, -4.5 );
    E4(.2, -17.7, 4.8, -4.5 );
    E5(.1, -16.7, 5.7, -4.5 );
    
    E1(.9, -16., 3.9, -5.2 );
    E2(.5, -16., 5.4, -5.1 );
    E3(.3, -16., 6.3, -6.7 );
    E4(.5, -16., 4.8, -7.2 );
    E5(.4, -16., 5.7, -6.3 );    
    
    t = 0.;    
    E1(STT(58.), 16., 3.9, 2.2 );
    E2(.2, 16., 5.4, 4.1 );
    E3(.3, 24., 6.3, 3.7 );
    E4(.5, 16., 4.8, 8.2 );
    E5(.7, 24., 5.7, 4.3 );
    E1(.1, 16., 1.9, 8.2 );
    E2(.2, 24., 5.4, -2.1 );
    
    t = 0.;
    E1(STT(66.), 16., 3.9, 6.5 );
    E2(.2, 16., 5.4, 6.1 );
    E5(.3, 16., 6.7, 7.3 );
    E3(.3, 16., 6.3, 5.7 );
    E4(.2, 16., 7.8, 6.2 );
        
    E5(.1, 16., 5.7, 4.7 );
    E1(.2, 16., 3.9, -6.2 );
    E2(.3, 17., 6.4, -4.5 );
    E3(.3, 16., 6.3, -5.7 );
    E4(.5, 16., 7.8, -6.2 );    
    E5(.3, 16., 5.7, -7.7 );
    E1(.2, 16., 3.9, -6.2 );
    E2(.3, 16., 6.4, -4.5 );
   
    t = 0.;
    E1(STT(78.), -17.1, 3.9, -4.5 );
    E2(.3, -17.4, 5.4, -4.5 );
    E3(.3, -18.2, 6.3, -4.5 );
    E4(.4, -17.7, 4.8, -4.5 );
    E5(.3, -16.7, 5.7, -4.5 );
  
    E3(1.3, -18.2, 6.3, -4.5 );
    E2(.2, -17.4, 5.4, -4.5 );
    E3(.1, -18.2, 6.3, -4.5 );
    E4(.2, -17.7, 4.8, -4.5 );
    E5(.1, -16.7, 5.7, -4.5 );
    
    E2(.5, -19.6, 5.4, -5.1 );
    E1(.9, -19.6, 3.9, -5.2 );
    E3(.3, -19.6, 6.3, -6.7 );
    E4(.5, -19.6, 4.8, -7.2 );
    E5(.4, -19.6, 5.7, -6.3 );
}

`,name:`Sound`,description:``,type:`sound`}]},{ver:`0.1`,info:{id:`XdcGzr`,date:`1447614697`,viewed:3727,name:`Matrix rain < 200 char`,description:`Compacting [url=https://www.shadertoy.com/view/4tlXR4]matrix - 255 char[/url] by FabriceNeyret2 even more and added some color. All credits go to FabriceNeyret2.`,likes:48,published:`Public API`,usePreview:0,tags:[`font`,`2tweets`,`short`,`pseudofont`]},renderpass:[{inputs:[],outputs:[],code:`// Created by Reinder Nijhoff 2015
// Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License.
// @reindernijhoff
//
// https://www.shadertoy.com/view/XdcGzr
//
// Based on matrix - 255 char by FabriceNeyret2: https://www.shadertoy.com/view/4tlXR4
// compacting to 2-tweets patriciogv's Matrix shader https://www.shadertoy.com/view/MlfXzN ( 819 -> 255 chars ) 
// But first go see patriciogv's comments and readable sources :-D
//
// All credits go to FabriceNeyret2
//

#define R fract(43.*sin(dot(p,p)))

void mainImage( out vec4 o, vec2 i) {
    vec2 j = fract(i*=.1), 
         p = vec2(9,int(iTime*(9.+8.*sin(i-=j).x)))+i;
    o-=o; o.g=R; p*=j; o*=R>.5&&j.x<.6&&j.y<.8?1.:0.;
}`,name:`Image`,description:``,type:`image`}]},{ver:`0.1`,info:{id:`ls3GWS`,date:`1451947421`,viewed:9091,name:`Post process - FXAA`,description:`Demonstrating post process FXAA on my shader [url=https://www.shadertoy.com/view/Xtf3zn]Tokyo[/url]. 

FXAA code from: [url=http://www.geeks3d.com/20110405/fxaa-fast-approximate-anti-aliasing-demo-glsl-opengl-test-radeon-geforce/3/]geeks3d[/url].
`,likes:48,published:`Public API`,usePreview:0,tags:[`aliasing`,`post`,`fxaa`,`process`,`anti`]},renderpass:[{inputs:[{id:`4dXGR8`,filepath:`/media/previz/buffer00.png`,type:`buffer`,channel:0,sampler:{filter:`linear`,wrap:`clamp`,vflip:`true`,srgb:`false`,internal:`byte`},published:1}],outputs:[{id:`4dfGRr`,channel:0}],code:`// Created by Reinder Nijhoff 2016
// Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License.
// @reindernijhoff
//
// https://www.shadertoy.com/view/ls3GWS
//
// car model is made by Eiffie
// shader 'Shiny Toy': https://www.shadertoy.com/view/ldsGWB
//
// demonstrating post process FXAA applied to my shader 'Tokyo': 
// https://www.shadertoy.com/view/Xtf3zn
//
// FXAA code from: http://www.geeks3d.com/20110405/fxaa-fast-approximate-anti-aliasing-demo-glsl-opengl-test-radeon-geforce/3/
//

#define FXAA_SPAN_MAX 8.0
#define FXAA_REDUCE_MUL   (1.0/FXAA_SPAN_MAX)
#define FXAA_REDUCE_MIN   (1.0/128.0)
#define FXAA_SUBPIX_SHIFT (1.0/4.0)

vec3 FxaaPixelShader( vec4 uv, sampler2D tex, vec2 rcpFrame) {
    
    vec3 rgbNW = textureLod(tex, uv.zw, 0.0).xyz;
    vec3 rgbNE = textureLod(tex, uv.zw + vec2(1,0)*rcpFrame.xy, 0.0).xyz;
    vec3 rgbSW = textureLod(tex, uv.zw + vec2(0,1)*rcpFrame.xy, 0.0).xyz;
    vec3 rgbSE = textureLod(tex, uv.zw + vec2(1,1)*rcpFrame.xy, 0.0).xyz;
    vec3 rgbM  = textureLod(tex, uv.xy, 0.0).xyz;

    vec3 luma = vec3(0.299, 0.587, 0.114);
    float lumaNW = dot(rgbNW, luma);
    float lumaNE = dot(rgbNE, luma);
    float lumaSW = dot(rgbSW, luma);
    float lumaSE = dot(rgbSE, luma);
    float lumaM  = dot(rgbM,  luma);

    float lumaMin = min(lumaM, min(min(lumaNW, lumaNE), min(lumaSW, lumaSE)));
    float lumaMax = max(lumaM, max(max(lumaNW, lumaNE), max(lumaSW, lumaSE)));

    vec2 dir;
    dir.x = -((lumaNW + lumaNE) - (lumaSW + lumaSE));
    dir.y =  ((lumaNW + lumaSW) - (lumaNE + lumaSE));

    float dirReduce = max(
        (lumaNW + lumaNE + lumaSW + lumaSE) * (0.25 * FXAA_REDUCE_MUL),
        FXAA_REDUCE_MIN);
    float rcpDirMin = 1.0/(min(abs(dir.x), abs(dir.y)) + dirReduce);
    
    dir = min(vec2( FXAA_SPAN_MAX,  FXAA_SPAN_MAX),
          max(vec2(-FXAA_SPAN_MAX, -FXAA_SPAN_MAX),
          dir * rcpDirMin)) * rcpFrame.xy;

    vec3 rgbA = (1.0/2.0) * (
        textureLod(tex, uv.xy + dir * (1.0/3.0 - 0.5), 0.0).xyz +
        textureLod(tex, uv.xy + dir * (2.0/3.0 - 0.5), 0.0).xyz);
    vec3 rgbB = rgbA * (1.0/2.0) + (1.0/4.0) * (
        textureLod(tex, uv.xy + dir * (0.0/3.0 - 0.5), 0.0).xyz +
        textureLod(tex, uv.xy + dir * (3.0/3.0 - 0.5), 0.0).xyz);
    
    float lumaB = dot(rgbB, luma);

    if((lumaB < lumaMin) || (lumaB > lumaMax)) return rgbA;
    
    return rgbB; 
}


void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 rcpFrame = 1./iResolution.xy;
  	vec2 uv2 = fragCoord.xy / iResolution.xy;
        
    float splitCoord = (iMouse.x == 0.0) ? iResolution.x/2. + iResolution.x*cos(iTime*.5) : iMouse.x;
    
    vec3 col;
    
    if( uv2.x < splitCoord/iResolution.x ) {
	   	vec4 uv = vec4( uv2, uv2 - (rcpFrame * (0.5 + FXAA_SUBPIX_SHIFT)));
	    col = FxaaPixelShader( uv, iChannel0, 1./iResolution.xy );
    } else {
	    col = texture( iChannel0, uv2 ).xyz;
    }
    
    if (abs(fragCoord.x - splitCoord) < 1.0) {
		col.x = 1.0;
	}
    
    fragColor = vec4( col, 1. );
}`,name:`Image`,description:``,type:`image`},{inputs:[],outputs:[{id:`4dXGR8`,channel:0}],code:`// Created by Reinder Nijhoff 2016
// @reindernijhoff
//
// https://www.shadertoy.com/view/ls3GWS
//
// car model is made by Eiffie
// shader 'Shiny Toy': https://www.shadertoy.com/view/ldsGWB
//
// demonstrating post process FXAA on my shader 'Tokyo': 
// https://www.shadertoy.com/view/Xtf3zn
//
// FXAA code from: http://www.geeks3d.com/20110405/fxaa-fast-approximate-anti-aliasing-demo-glsl-opengl-test-radeon-geforce/3/
//

#define BUMPMAP
#define MARCHSTEPS 128
#define MARCHSTEPSREFLECTION 48
#define LIGHTINTENSITY 5.

//----------------------------------------------------------------------

const vec3 backgroundColor = vec3(0.2,0.4,0.6) * 0.09;
float time;

//----------------------------------------------------------------------
// noises

float hash( float n ) {
    return fract(sin(n)*687.3123);
}

float noise( in vec2 x ) {
    vec2 p = floor(x);
    vec2 f = fract(x);
    f = f*f*(3.0-2.0*f);
    float n = p.x + p.y*157.0;
    return mix(mix( hash(n+  0.0), hash(n+  1.0),f.x),
               mix( hash(n+157.0), hash(n+158.0),f.x),f.y);
}

const mat2 m2 = mat2( 0.80, -0.60, 0.60, 0.80 );

float fbm( vec2 p ) {
    float f = 0.0;
    f += 0.5000*noise( p ); p = m2*p*2.02;
    f += 0.2500*noise( p ); p = m2*p*2.03;
    f += 0.1250*noise( p ); p = m2*p*2.01;
//    f += 0.0625*noise( p );
    
    return f/0.9375;
}

//----------------------------------------------------------------------
// distance primitives

float udRoundBox( vec3 p, vec3 b, float r ) {
  return length(max(abs(p)-b,0.0))-r;
}

float sdBox( in vec3 p, in vec3 b ) {
    vec3 d = abs(p) - b;
    return min(max(d.x,max(d.y,d.z)),0.0) + length(max(d,0.0));
}

float sdSphere( in vec3 p, in float s ) {
    return length(p)-s;
}

float sdCylinder( in vec3 p, in vec2 h ) {
    vec2 d = abs(vec2(length(p.xz),p.y)) - h;
    return min(max(d.x,d.y),0.0) + length(max(d,0.0));
}

//----------------------------------------------------------------------
// distance operators

float opU( float d2, float d1 ) { return min( d1,d2); }
float opS( float d2, float d1 ) { return max(-d1,d2); }
float smin( float a, float b, float k ) { return -log(exp(-k*a)+exp(-k*b))/k; } //from iq

//----------------------------------------------------------------------
// Map functions

// car model is made by Eiffie
// shader 'Shiny Toy': https://www.shadertoy.com/view/ldsGWB

float mapCar(in vec3 p0){ 
	vec3 p=p0+vec3(0.0,1.24,0.0);
	float r=length(p.yz);
	float d= length(max(vec3(abs(p.x)-0.35,r-1.92,-p.y+1.4),0.0))-0.05;
	d=max(d,p.z-1.0);
	p=p0+vec3(0.0,-0.22,0.39);
	p.xz=abs(p.xz)-vec2(0.5300,0.9600);p.x=abs(p.x);
	r=length(p.yz);
	d=smin(d,length(max(vec3(p.x-0.08,r-0.25,-p.y-0.08),0.0))-0.04,8.0);
	d=max(d,-max(p.x-0.165,r-0.24));
	float d2=length(vec2(max(p.x-0.13,0.0),r-0.2))-0.02;
	d=min(d,d2);

	return d;
}

float dL; // minimal distance to light

float map( const in vec3 p ) {
	vec3 pd = p;
    float d;
    
    pd.x = abs( pd.x );
    pd.z *= -sign( p.x );
    
    float ch = hash( floor( (pd.z+18.*time)/40. ) );
    float lh = hash( floor( pd.z/13. ) );
    
    vec3 pdm = vec3( pd.x, pd.y, mod( pd.z, 10.) - 5. );
    dL = sdSphere( vec3(pdm.x-8.1,pdm.y-4.5,pdm.z), 0.1 );
    
    dL = opU( dL, sdBox( vec3(pdm.x-12., pdm.y-9.5-lh,  mod( pd.z, 91.) - 45.5 ), vec3(0.2,4.5, 0.2) ) );
    dL = opU( dL, sdBox( vec3(pdm.x-12., pdm.y-11.5+lh, mod( pd.z, 31.) - 15.5 ), vec3(0.22,5.5, 0.2) ) );
    dL = opU( dL, sdBox( vec3(pdm.x-12., pdm.y-8.5-lh,  mod( pd.z, 41.) - 20.5 ), vec3(0.24,3.5, 0.2) ) );
   
    if( lh > 0.5 ) {
	    dL = opU( dL, sdBox( vec3(pdm.x-12.5,pdm.y-2.75-lh,  mod( pd.z, 13.) - 6.5 ), vec3(0.1,0.25, 3.2) ) );
    }
    
    vec3 pm = vec3( mod( pd.x + floor( pd.z * 4. )*0.25, 0.5 ) - 0.25, pd.y, mod( pd.z, 0.25 ) - 0.125 );
	d = udRoundBox( pm, vec3( 0.245,0.1, 0.12 ), 0.005 ); 
    
    d = opS( d, -(p.x+8.) );
    d = opU( d, pd.y );

    vec3 pdc = vec3( pd.x, pd.y, mod( pd.z+18.*time, 40.) - 20. );
    
    // car
    if( ch > 0.75 ) {
        pdc.x += (ch-0.75)*4.;
	    dL = opU( dL, sdSphere( vec3( abs(pdc.x-5.)-1.05, pdc.y-0.55, pdc.z ),    0.025 ) );
	    dL = opU( dL, sdSphere( vec3( abs(pdc.x-5.)-1.2,  pdc.y-0.65,  pdc.z+6.05 ), 0.025 ) );

        d = opU( d,  mapCar( (pdc-vec3(5.,-0.025,-2.3))*0.45 ) );
 	}
    
    d = opU( d, 13.-pd.x );
    d = opU( d, sdCylinder( vec3(pdm.x-8.5, pdm.y, pdm.z), vec2(0.075,4.5)) );
    d = opU( d, dL );
    
	return d;
}

//----------------------------------------------------------------------

vec3 calcNormalSimple( in vec3 pos ) {   
    const vec2 e = vec2(1.0,-1.0)*0.005;

    vec3 n = normalize( e.xyy*map( pos + e.xyy ) + 
					    e.yyx*map( pos + e.yyx )   + 
					    e.yxy*map( pos + e.yxy )   + 
					    e.xxx*map( pos + e.xxx )   );  
    return n;
}

vec3 calcNormal( in vec3 pos ) {
    vec3 n = calcNormalSimple( pos );
    if( pos.y > 0.12 ) return n;

#ifdef BUMPMAP
    vec2 oc = floor( vec2(pos.x+floor( pos.z * 4. )*0.25, pos.z) * vec2( 2., 4. ) );

    if( abs(pos.x)<8. ) {
		oc = pos.xz;
    }
    
     vec3 p = pos * 250.;
   	 vec3 xn = 0.05*vec3(noise(p.xz)-0.5,0.,noise(p.zx)-0.5);
     xn += 0.1*vec3(fbm(oc.xy)-0.5,0.,fbm(oc.yx)-0.5);
    
    n = normalize( xn + n );
#endif
    
    return n;
}

vec3 int1, int2, nor1;
vec4 lint1, lint2;

float intersect( in vec3 ro, in vec3 rd ) {
	const float precis = 0.001;
    float h = precis*2.0;
    float t = 0.;
    int1 = int2 = vec3( -500. );
    lint1 = lint2 = vec4( -500. );
    float mld = 100.;
    
	for( int i=0; i < MARCHSTEPS; i++ ) {
        h = map( ro+rd*t );
		if(dL < mld){
			mld=dL;
            lint1.xyz = ro+rd*t;
			lint1.w = abs(dL);
		}
        if( h < precis ) {
            int1.xyz = ro+rd*t;
            break;
        } 
        t += max(h, precis*2.);
    }
    
    if( int1.z < -400. || t > 300.) {
        // check intersection with plane y = -0.1;
        float d = -(ro.y + 0.1)/rd.y;
		if( d > 0. ) {
			int1.xyz = ro+rd*d;
	    } else {
        	return -1.;
    	}
    }
    
    ro = ro + rd*t;
    nor1 = calcNormal(ro);
    ro += 0.01*nor1;
    rd = reflect( rd, nor1 );
    t = 0.0;
    h = precis*2.0;
    mld = 100.;
    
    for( int i=0; i < MARCHSTEPSREFLECTION; i++ ) {
        h = map( ro+rd*t );
		if(dL < mld){
			mld=dL;            
            lint2.xyz = ro+rd*t;
			lint2.w = abs(dL);
		}
        if( h < precis ) {
   			int2.xyz = ro+rd*t;
            return 1.;
        }   
        t += max(h, precis*2.);
    }

    return 0.;
}

//----------------------------------------------------------------------
// shade

vec3 shade( in vec3 ro, in vec3 pos, in vec3 nor ) {
    vec3  col = vec3(0.5);
    
    if( abs(pos.x) > 15. || abs(pos.x) < 8. ) col = vec3( 0.02 );
    if( pos.y < 0.01 ) {
        if( abs( int1.x ) < 0.1 ) col = vec3( 0.9 );
        if( abs( abs( int1.x )-7.4 ) < 0.1 ) col = vec3( 0.9 );
    }    
    
    float sh = clamp( dot( nor, normalize( vec3( -0.3, 0.3, -0.5 ) ) ), 0., 1.);
  	col *= (sh * backgroundColor);  
 
    if( abs( pos.x ) > 12.9 && pos.y > 9.) { // windows
        float ha = hash(  133.1234*floor( pos.y / 3. ) + floor( (pos.z) / 3. ) );
        if( ha > 0.95) {
            col = ( (ha-0.95)*10.) * vec3( 1., 0.7, 0.4 );
        }
    }
    
	col = mix(  backgroundColor, col, exp( min(max(0.1*pos.y,0.25)-0.065*distance(pos, ro),0.) ) );
  
    return col;
}

vec3 getLightColor( in vec3 pos ) {
    vec3 lcol = vec3( 1., .7, .5 );
    
	vec3 pd = pos;
    pd.x = abs( pd.x );
    pd.z *= -sign( pos.x );
    
    float ch = hash( floor( (pd.z+18.*time)/40. ) );
    vec3 pdc = vec3( pd.x, pd.y, mod( pd.z+18.*time, 40.) - 20. );

    if( ch > 0.75 ) { // car
        pdc.x += (ch-0.75)*4.;
        if(  sdSphere( vec3( abs(pdc.x-5.)-1.05, pdc.y-0.55, pdc.z ), 0.25) < 2. ) {
            lcol = vec3( 1., 0.05, 0.01 );
        }
    }
    if( pd.y > 2. && abs(pd.x) > 10. && pd.y < 5. ) {
        float fl = floor( pd.z/13. );
        lcol = 0.4*lcol+0.5*vec3( hash( .1562+fl ), hash( .423134+fl ), 0. );
    }
    if(  abs(pd.x) > 10. && pd.y > 5. ) {
        float fl = floor( pd.z/2. );
        lcol = 0.5*lcol+0.5*vec3( hash( .1562+fl ),  hash( .923134+fl ), hash( .423134+fl ) );
    }
   
    return lcol;
}

float randomStart(vec2 co){return 0.8+0.2*hash(dot(co,vec2(123.42,117.853))*412.453);}

//----------------------------------------------------------------------
// main

void mainImage( out vec4 fragColor, in vec2 fragCoord ) { 
    time = iTime + 90.;
    vec2 q = fragCoord.xy / iResolution.xy;
	vec2 p = -1.0 + 2.0*q;
	p.x *= iResolution.x / iResolution.y;
        
    if (q.y < .12 || q.y >= .88) {
		fragColor=vec4(0.,0.,0.,1.);
		return;
	}
    
    // camera
    float z = time;
    float x = -10.9+1.*sin(time*0.2);
	vec3 ro = vec3(x,  1.3+.3*cos(time*0.26), z-1.);
    vec3 ta = vec3(-8.,1.3+.4*cos(time*0.26), z+4.+cos(time*0.04));
    
    vec3 ww = normalize( ta - ro );
    vec3 uu = normalize( cross(ww,vec3(0.0,1.0,0.0) ) );
    vec3 vv = normalize( cross(uu,ww));
	vec3 rd = normalize( -p.x*uu + p.y*vv + 2.2*ww );
    
    vec3 col = backgroundColor;

    // raymarch
    float ints = intersect(ro+randomStart(p)*rd ,rd );
    if(  ints > -0.5 ) {
        
        // calculate reflectance
		float r = 0.09;     	        
        if( int1.y > 0.129 ) r = 0.025 * hash(  133.1234*floor( int1.y / 3. ) + floor( int1.z / 3. ) );
        if( abs(int1.x) < 8. ) {
            if( int1.y < 0.01 ) { // road
	            r = 0.007*fbm(int1.xz);
            } else { // car
                r = 0.02;
            }
        }
        if( abs( int1.x ) < 0.1 ) r *= 4.;
        if( abs( abs( int1.x )-7.4 ) < 0.1 ) r *= 4.;
        
        r *= 2.;
        
        col = shade( ro, int1.xyz, nor1 );
        
        if( ints > 0.5 ) {
            col += r * shade( int1.xyz, int2.xyz, calcNormalSimple(int2.xyz) );
        }  
        if( lint2.w > 0. ) {            
            col += (r*LIGHTINTENSITY*exp(-lint2.w*7.0)) * getLightColor(lint2.xyz);
        } 
    } 
      
    // Rain (by Dave Hoskins)
	vec2 st = 256. * ( p* vec2(.5, .01)+vec2(time*.13-q.y*.6, time*.13) );
    float f = noise( st ) * noise( st*0.773) * 1.55;
	f = 0.25+ clamp(pow(abs(f), 13.0) * 13.0, 0.0, q.y*.14);
    
    if( lint1.w > 0. ) {
        col += (f*LIGHTINTENSITY*exp(-lint1.w*7.0)) * getLightColor(lint1.xyz);
    }  
    
	col += 0.25*f*(0.2+backgroundColor);

    // post processing
	col = pow( clamp(col,0.0,1.0), vec3(0.4545) );
	col *= 1.2*vec3(1.,0.99,0.95);   
	col = clamp(1.06*col-0.03, 0., 1.);  
    q.y = (q.y-.12)*(1./0.76);
	col *= 0.5 + 0.5*pow( 16.0*q.x*q.y*(1.0-q.x)*(1.0-q.y), 0.1 ); 

    fragColor = vec4( col, 1.0 );
}
`,name:`Buffer A`,description:``,type:`buffer`}]},{ver:`0.1`,info:{id:`Ms33WB`,date:`1452023671`,viewed:11977,name:`Post process - SSAO`,description:`Demonstrating post process Screen Space Ambient Occlusion applied to a depth and normal map with the geometry of my shader [url=https://www.shadertoy.com/view/MtsXzf][SIG15] Matrix Lobby Scene'[/url].`,likes:84,published:`Public API`,usePreview:1,tags:[`screen`,`post`,`space`,`occlusion`,`ambient`,`ssaa`,`process`]},renderpass:[{inputs:[{id:`4dXGR8`,filepath:`/media/previz/buffer00.png`,type:`buffer`,channel:0,sampler:{filter:`linear`,wrap:`clamp`,vflip:`true`,srgb:`false`,internal:`byte`},published:1}],outputs:[{id:`4dfGRr`,channel:0}],code:`// Created by Reinder Nijhoff 2016
// Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License.
// @reindernijhoff
//
// https://www.shadertoy.com/view/ls3GWS
//
//
// demonstrating post process Screen Space Ambient Occlusion applied to a depth and normal map
// with the geometry of my shader '[SIG15] Matrix Lobby Scene': 
//
// https://www.shadertoy.com/view/MtsXzf
//


#define SAMPLES 16
#define INTENSITY 1.
#define SCALE 2.5
#define BIAS 0.05
#define SAMPLE_RAD 0.02
#define MAX_DISTANCE 0.07

#define MOD3 vec3(.1031,.11369,.13787)

float hash12(vec2 p)
{
	vec3 p3  = fract(vec3(p.xyx) * MOD3);
    p3 += dot(p3, p3.yzx + 19.19);
    return fract((p3.x + p3.y) * p3.z);
}

vec2 hash22(vec2 p)
{
	vec3 p3 = fract(vec3(p.xyx) * MOD3);
    p3 += dot(p3, p3.yzx+19.19);
    return fract(vec2((p3.x + p3.y)*p3.z, (p3.x+p3.z)*p3.y));
}

vec3 getPosition(vec2 uv) {
    float fl = textureLod(iChannel0, vec2(0.), 0.).x; 
    float d = textureLod(iChannel0, uv, 0.).w;
       
    vec2 p = uv*2.-1.;
    mat3 ca = mat3(1.,0.,0.,0.,1.,0.,0.,0.,-1./1.5);
    vec3 rd = normalize( ca * vec3(p,fl) );
    
	vec3 pos = rd * d;
    return pos;
}

vec3 getNormal(vec2 uv) {
    return textureLod(iChannel0, uv, 0.).xyz;
}

vec2 getRandom(vec2 uv) {
    return normalize(hash22(uv*126.1231) * 2. - 1.);
}


float doAmbientOcclusion(in vec2 tcoord,in vec2 uv, in vec3 p, in vec3 cnorm)
{
    vec3 diff = getPosition(tcoord + uv) - p;
    float l = length(diff);
    vec3 v = diff/l;
    float d = l*SCALE;
    float ao = max(0.0,dot(cnorm,v)-BIAS)*(1.0/(1.0+d));
    ao *= smoothstep(MAX_DISTANCE,MAX_DISTANCE * 0.5, l);
    return ao;

}

float spiralAO(vec2 uv, vec3 p, vec3 n, float rad)
{
    float goldenAngle = 2.4;
    float ao = 0.;
    float inv = 1. / float(SAMPLES);
    float radius = 0.;

    float rotatePhase = hash12( uv*100. ) * 6.28;
    float rStep = inv * rad;
    vec2 spiralUV;

    for (int i = 0; i < SAMPLES; i++) {
        spiralUV.x = sin(rotatePhase);
        spiralUV.y = cos(rotatePhase);
        radius += rStep;
        ao += doAmbientOcclusion(uv, spiralUV * radius, p, n);
        rotatePhase += goldenAngle;
    }
    ao *= inv;
    return ao;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    // letterbox
    if( abs(2.*fragCoord.y-iResolution.y) > iResolution.x * 0.42 ) {
        fragColor = vec4( 0., 0., 0., 1. );
        return;
    }
    
	vec2 uv = fragCoord.xy / iResolution.xy;
        
    vec3 p = getPosition(uv);
    vec3 n = getNormal(uv);

    float ao = 0.;
    float rad = SAMPLE_RAD/p.z;

    ao = spiralAO(uv, p, n, rad);

    ao = 1. - ao * INTENSITY;
    
	fragColor = vec4(ao,ao,ao,1.);
}`,name:`Image`,description:``,type:`image`},{inputs:[{id:`Xsf3zn`,filepath:`/media/a/f735bee5b64ef98879dc618b016ecf7939a5756040c2cde21ccb15e69a6e1cfb.png`,type:`texture`,channel:0,sampler:{filter:`mipmap`,wrap:`repeat`,vflip:`false`,srgb:`false`,internal:`byte`},published:1}],outputs:[{id:`4dXGR8`,channel:0}],code:`// Created by Reinder Nijhoff 2016
// @reindernijhoff
//
// https://www.shadertoy.com/view/ls3GWS
//
//
// demonstrating post process Screen Space Ambient Occlusion applied to a depth and normal map
// with the geometry of my shader '[SIG15] Matrix Lobby Scene': 
//
// https://www.shadertoy.com/view/MtsXzf
//


#define HIGHQUALITY 1

#define MARCHSTEPS 120

#define BPM             (140.0)
#define STEP            (4.0 * BPM / 60.0)
#define ISTEP           (1./STEP)
#define STT(t)			(t*(60.0/BPM))

float damageMod;

//-----------------------------------------------------
// noise functions

#define MOD2 vec2(.16632,.17369)
float hash(float p) { // by Dave Hoskins
	vec2 p2 = fract(vec2(p) * MOD2);
    p2 += dot(p2.yx, p2.xy+19.19);
	return fract(p2.x * p2.y);
}

float noise( const in vec3 x ) {
    vec3 p = floor(x);
    vec3 f = fract(x);
	f = f*f*(3.0-2.0*f);
	
	vec2 uv = (p.xy+vec2(37.0,17.0)*p.z) + f.xy;
	vec2 rg = textureLod( iChannel0, (uv+ 0.5)/256.0, 0.0 ).yx;
	return mix( rg.x, rg.y, f.z );
}

float noise( const in vec2 x ) {
    vec2 p = floor(x);
    vec2 f = fract(x);
	vec2 uv = p.xy + f.xy*f.xy*(3.0-2.0*f.xy);
	return textureLod( iChannel0, (uv+118.4)/256.0, 0.0 ).x;
}

//-----------------------------------------------------
// intersection functions

vec3 nSphere( in vec3 pos, in vec4 sph ) {
    return (pos-sph.xyz)/sph.w;
}

float iSphere( in vec3 ro, in vec3 rd, in vec4 sph ) {
	vec3 oc = ro - sph.xyz;
	float b = dot( oc, rd );
	float c = dot( oc, oc ) - sph.w*sph.w;
	float h = b*b - c;
	if( h<0.0 ) return -1.;
	return -b - sqrt( h );
}

//----------------------------------------------------------------------
// distance primitives

float sdBox( const in vec3 p, const in vec3 b ) {
    vec3 d = abs(p) - b;
    return min(max(d.x,max(d.y,d.z)),0.0) + length(max(d,0.0));
}

float sdColumn( const in vec3 p, const in vec2 b ) {
    vec2 d = abs(p.xz) - b;
    return min(max(d.x,d.y),0.0) + length(max(d,0.0));
}

//----------------------------------------------------------------------
// distance operators

float opU( float d2, float d1 ) { return min( d1,d2); }
float opS( float d2, float d1 ) { return max(-d1,d2); }
    
//--------------------------------------------
// map

float tileId( const in vec3 p, const in vec3 nor ) { 
    if( abs(nor.y) > .9 ) return 0.;
    
    float x, y;
    if( abs(nor.z) < abs(nor.x)) {
        x = p.z-6.;
    } else {
        x = abs(p.x)-16.;
    }
    if( p.y < 2.5 ) {
    	return floor( x / 3.6 ) * sign(p.x);
    }
    return floor( x / 1.8 ) * sign(p.x) * (floor( (p.y+7.5) / 5. ));
}


vec3 bumpMapNormal( const in vec3 pos, in vec3 nor ) {
    float i = tileId( pos, nor );
    if( i > 0. ) {
        nor+= 0.0125 * vec3( hash(i), hash(i+5.), hash(i+13.) );
        nor = normalize( nor );
    }
    return nor;
}

float map( const in vec3 p ) {
    float d = -sdBox( p, vec3( 28., 14., 63. ) );

    vec3 pm = vec3( abs( p.x ) - 17.8, p.y, mod( p.z, 12.6 ) - 6.);    
    vec3 pm2 = abs(p) - vec3( 14., 25.25, 0. );
    vec3 pm3 = abs(p) - vec3( 6.8, 0., 56.4 );      

    d = opU( d, sdColumn( pm, vec2( 1.8, 1.8 ) ) );        
    d = opS( d, sdBox( p,  vec3( 2.5, 9.5, 74. ) ) );    
    d = opS( d, sdBox( p,  vec3( 5., 18., 73. ) ) );
    d = opS( d, sdBox( p,  vec3( 13.8, 14.88, 63. ) ) );
    d = opS( d, sdBox( p,  vec3( 13.2, 25., 63. ) ) );
    d = opS( d, sdColumn( p,  vec2( 9.5, 63. ) ) ); 
    d = opU( d, sdColumn( pm3, vec2( 1.8, 1.8 ) ) );
    d = opU( d, sdBox( pm2, vec3( 5., .45, 200. ) ) );
    
    return d;
}

float mapDamage( vec3 p ) {
    float d = map( p );

    float n = max( max( 1.-abs(p.z*.01), 0. )*
                   max( 1.-abs(p.y*.2-1.2), 0. ) *
                   noise( p*.3 )* (noise( p*2.3 ) +.2 )-.2 - damageMod, 0.);
   
	return d + n;
}

float mapDamageHigh( vec3 p ) {
    float d = map( p );
    
    float p1 = noise( p*2.3 );
    float p2 = noise( p*5.3 );
    
    float n = max( max( 1.-abs(p.z*.01), 0. )*
                   max( 1.-abs(p.y*.2-1.2), 0. ) *
                   noise( p*.3 )* (p1 +.2 )-.2 - damageMod, 0.);
    
    if( p.y < .1 ) {
        n += max(.1*(1.-abs(d)+7.*noise( p*.7 )+.9*p1+.5*p2)-4.5*damageMod,0.);
    }
    
    if( abs(n) > 0.0 ) {
        n += noise( p*11.) * .05;
        n += noise( p*23.) * .03;
    }
    
	return d + n;
}


vec3 calcNormalDamage( in vec3 pos, in float eps ) {
    if( pos.y < 0.001 && (mapDamageHigh(pos)-map(pos)) < eps ) {   		
	        return vec3( 0., 1., 0. );
    }
    
    vec2 e = vec2(1.0,-1.0)*(0.5773*eps);
    vec3 n =  normalize( e.xyy*mapDamageHigh( pos + e.xyy ) + 
			     		 e.yyx*mapDamageHigh( pos + e.yyx ) + 
					  	 e.yxy*mapDamageHigh( pos + e.yxy ) + 
					  	 e.xxx*mapDamageHigh( pos + e.xxx ) );
    n = bumpMapNormal( pos, n );
    return n;    
}

//----------------------------------------------------------------------
// intersection code

float intersect( in vec3 ro, in vec3 rd ) {
	const float precis = 0.00125;
    float h = precis*2.0;
    float t = 0.1;
        
    float d = -(ro.y)/rd.y;
    float maxdist = d>0.?d:500.;
    
	for( int i=0; i < MARCHSTEPS; i++ ) {
#if HIGHQUALITY
        h = .8*mapDamage( ro+rd*t );
#else
        h = map( ro+rd*t );
#endif
        if( abs(h) < precis ) {
            return t;
        } 
        t += h;
        if( t > maxdist ) {
            return maxdist;
        }
    }
    return -1.;
}


vec4 render( const in vec3 ro, const in vec3 rd, in float time, const in float fog, const in vec3 grd ) {
    const float eps = 0.01;
    vec2 col = vec2(0.);
    
    float t = intersect( ro, rd );
    if( time > STT(98.) ) {
        time = STT(95.5)+.4*(time-STT(95.5)); // slow motion
    }
    time += .03*hash( rd.x + rd.y*5341.1231 ); // motionblur
    
    vec3 nor;
    
    if( t > 0. ) {
        float m = 0.;
   
        vec3 pos = ro + t*rd;
        if( m < .5 ) {
	        nor = calcNormalDamage( pos, eps );
        }
    } else {
        t = 60.;
    }        
    return vec4(nor, max(t/60.,0.));
}

//----------------------------------------------------------------------
// camera

mat3 setCamera( const in vec3 ro, const in vec3 rt, const in float cr, const in float fl ) {
	vec3 cw = normalize(rt-ro);
	vec3 cp = vec3(sin(cr), cos(cr),0.0);
	vec3 cu = normalize( cross(cw,cp) );
	vec3 cv = normalize( cross(cu,cw) );
    return mat3( cu, cv, -fl*cw );
}

#define SCAM(a,j,h,i,f,g,b,c,d,e) if(time >= t ){damageMod=j;sro=b;ero=c;sta=d;eta=e;st=t;dt=a;sfog=h;efog=i;}t+=a;
#define CCAM(a,j,h,i,f,g,b,c,d,e) if(time >= t ){sro=ero;ero=c;sta=eta;eta=e;st=t;dt=a;sfog=efog;efog=i;}t+=a;

void getCamPath( const in float time, inout vec3 ro, inout vec3 ta, inout float fl, inout float fog ) {
    vec3 sro, sta, ero, eta;
    float st = 0., dt, t = 0., sfog, efog;
    
    SCAM(STT(12.), 0., 0.,    0., 1.5, 1.5, vec3( 0., 5., 22.5 ), vec3( 0., 5.,  18.5 ), vec3( 0., 5., 0. ), vec3( 0., 5., 0. ) ); 
    SCAM(STT(7.5), 0., 0.,    0., 1.5, 1.5, vec3( -14., 5.,  18.5 ), vec3( 18., 4., 11. ), vec3( 10., 5., -50. ), vec3( 0., 5., -50. ) ); 
    CCAM(STT(7.5), 0., 0.,  0.05, 1.5, 1.5, vec3( 18., 4., 11. ), vec3( 21.5, 4., 11.5 ),  vec3( 0., 5., -50. ), vec3( -4., 7., 0. ) ); 
    CCAM(STT(2.5), 0., 0.05, 0.1, 1.5, 1.5, vec3( 21.5, 4., 11.5 ), vec3( 21.5, 4., 11.5 ),  vec3( -4., 7., 0. ), vec3( -16., 7., 8. ) ); 
    CCAM(STT(4.), 0.,  0.1, 0.15, 1.5, 4.5, vec3( 21.5, 4., 11.5 ), vec3( 10., 4.25, 11.35 ),  vec3( -16., 7., 8. ), vec3( -16., 6., 8. ) ); 
    
    SCAM(STT(7.5),  0., 0.1,  0.3, 1.5, 1.5, vec3( -11., 5.25, 7.05 ), vec3( -13., 5., 9. ),  vec3( -19., 5.2, 7. ), vec3( -16.5, 5., 5.3 ) );     
    SCAM(STT(13.), .4, 0.1,  0.5, 1.5, 1.5, vec3( -18., 5., 4.05 ), vec3( -10., 5.25, -6. ),  vec3( -17., 5.5, 0. ), vec3( -15.5, 5.25, -7.3 ) );     
	CCAM(STT(4.), .45, 0.5,  0.65, 1.5, 1.2, vec3( -10., 5.25, -6. ), vec3( -12., 5.25, -9. ),  vec3( -15.5, 5.25, -7.3 ), vec3( -13.5, 6.25, 2.3 ) );     

    SCAM(STT(7.5), .95, 0.4,  1.9, 1.5, 1.5, vec3( 18., 4., 11. ), vec3( 25.5, 4., 11.5 ),  vec3( 0., 5., -50. ), vec3( -4., 7., 0. ) ); 

    SCAM(STT(12.2), .95, 0.8,  1.3, 1.5, 1.5, vec3( 10., 4.7, 4. ), vec3( 10., 5., -7.5 ),  vec3( 50., 5., 2. ), vec3( 40., 5., -20. ) ); 
    
    SCAM(STT(16.25), 1., 0.4,  0.8, 1.5, 1.5, vec3( -18., 4.5, 4.05 ), vec3( -26., 3.25, -6. ),  vec3( -17., 5.5, 0. ), vec3( -15.5, 6.25, -7.3 ) );     
    CCAM(STT(4.),  1., 0.8,  0.6, 1.5, 1.5, vec3( -26., 3.25, -6. ), vec3( -26., 3.25, -6. ),  vec3( -15.5, 6.25, -7.3 ), vec3( -15.5, 6.25, -7.3 ) );     

    SCAM(STT(16.), 1.1, 0.4, 0.05, 1.5, 1.5, vec3( 0., 5.,  18.5 ), vec3( 0., 5.,  18.5 ), vec3( 0., 5., 0. ), vec3( 0., 5., 0. ) ); 
  
    dt = clamp( (time-st)/dt, 0., 1. );

    if(  time > STT(65.5) && time < STT(77.75)  ) {
	    ro = mix( sro, ero, dt);
    	ta = mix( sta, eta, dt);
    } else {
	    ro = mix( sro, ero, smoothstep(0.,1., dt));
    	ta = mix( sta, eta, smoothstep(0.,1., dt));
    }
	
    fl = 1.5;    
    if( time > STT(29.5) && time < STT(33.5) ) {
        fl = mix( 1.5, 4.5, smoothstep( STT(29.5), STT(33.5), time ) );
    }
    
   	fog = mix( sfog, efog, dt);
    damageMod = .4-.4*damageMod;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
    float time = mod(iTime, 60.);

    vec2 q = fragCoord.xy/iResolution.xy;
	 
    vec3 ro, ta;
    float fl, fog;
      
    getCamPath( time, ro, ta, fl, fog );
    
    if( dot(fragCoord.xy, fragCoord.xy) < 10. ) {
	   fragColor = vec4( fl );
       return;
    }
        
    mat3 ca = setCamera( ro, ta, 0.0, (1./1.5) );    
    vec2 p = (-iResolution.xy+2.*(fragCoord.xy))/iResolution.x;
    vec3 rd = normalize( ca * vec3(p,-fl) );

    vec4 r = render( ro, rd, time, fog, normalize( ta-ro ) ); 
    fragColor = vec4( ((r.xyz * ca)).xyz,  r.w );
}
`,name:`Buffer A`,description:``,type:`buffer`}]},{ver:`0.1`,info:{id:`MstSD8`,date:`1459155443`,viewed:2042,name:`Matrix Lobby Scene (MP)`,description:`This is my Sig15 shader [url=https://www.shadertoy.com/view/MtsXzf][SIG15] Matrix Lobby Scene[/url]. I don't know why, but the original shader keeps crashing webgl on some windows machines. Therefore I made this version which uses multiple passes.`,likes:23,published:`Public API`,usePreview:0,tags:[`matrix`,`scene`,`sig15`,`lobby`]},renderpass:[{inputs:[{id:`4sfGRn`,filepath:`/media/a/fb918796edc3d2221218db0811e240e72e340350008338b0c07a52bd353666a6.jpg`,type:`texture`,channel:1,sampler:{filter:`mipmap`,wrap:`repeat`,vflip:`true`,srgb:`false`,internal:`byte`},published:1},{id:`XsX3Rn`,filepath:`/media/a/92d7758c402f0927011ca8d0a7e40251439fba3a1dac26f5b8b62026323501aa.jpg`,type:`texture`,channel:2,sampler:{filter:`mipmap`,wrap:`repeat`,vflip:`true`,srgb:`false`,internal:`byte`},published:1},{id:`Xsf3zn`,filepath:`/media/a/f735bee5b64ef98879dc618b016ecf7939a5756040c2cde21ccb15e69a6e1cfb.png`,type:`texture`,channel:0,sampler:{filter:`linear`,wrap:`repeat`,vflip:`false`,srgb:`false`,internal:`byte`},published:1},{id:`4dXGR8`,filepath:`/media/previz/buffer00.png`,type:`buffer`,channel:3,sampler:{filter:`linear`,wrap:`clamp`,vflip:`true`,srgb:`false`,internal:`byte`},published:1}],outputs:[{id:`4dfGRr`,channel:0}],code:`// Original shader. Instead of calculating the first intersection, depth is sampled from buffer A.

// Created by Reinder Nijhoff 2015
// Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License.
// @reindernijhoff
//
// https://www.shadertoy.com/view/MtsXzf
//

float damageMod;
vec4 ep1, ep2, ep3, ep4, ep5;  

//-----------------------------------------------------
// noise functions

#define MOD2 vec2(.16632,.17369)
float hash(float p) { // by Dave Hoskins
	vec2 p2 = fract(vec2(p) * MOD2);
    p2 += dot(p2.yx, p2.xy+19.19);
	return fract(p2.x * p2.y);
}

float noise( const in vec3 x ) {
    vec3 p = floor(x);
    vec3 f = fract(x);
	f = f*f*(3.0-2.0*f);
	
	vec2 uv = (p.xy+vec2(37.0,17.0)*p.z) + f.xy;
	vec2 rg = textureLod( iChannel0, (uv+ 0.5)/256.0, 0.0 ).yx;
	return mix( rg.x, rg.y, f.z );
}

float noise( const in vec2 x ) {
    vec2 p = floor(x);
    vec2 f = fract(x);
	vec2 uv = p.xy + f.xy*f.xy*(3.0-2.0*f.xy);
	return texture( iChannel0, (uv+118.4)/256.0, -100.0 ).x;
}

//-----------------------------------------------------
// intersection functions

vec3 nSphere( in vec3 pos, in vec4 sph ) {
    return (pos-sph.xyz)/sph.w;
}

float iSphere( in vec3 ro, in vec3 rd, in vec4 sph ) {
	vec3 oc = ro - sph.xyz;
	float b = dot( oc, rd );
	float c = dot( oc, oc ) - sph.w*sph.w;
	float h = b*b - c;
	if( h<0.0 ) return -1.;
	return -b - sqrt( h );
}

//----------------------------------------------------------------------
// distance primitives

float sdBox( const in vec3 p, const in vec3 b ) {
    vec3 d = abs(p) - b;
    return min(max(d.x,max(d.y,d.z)),0.0) + length(max(d,0.0));
}

float sdColumn( const in vec3 p, const in vec2 b ) {
    vec2 d = abs(p.xz) - b;
    return min(max(d.x,d.y),0.0) + length(max(d,0.0));
}

//----------------------------------------------------------------------
// distance operators

float opU( float d2, float d1 ) { return min( d1,d2); }
float opS( float d2, float d1 ) { return max(-d1,d2); }
    
//--------------------------------------------
// map

float tileId( const in vec3 p, const in vec3 nor ) { 
    if( abs(nor.y) > .9 ) return 0.;
    
    float x, y;
    if( abs(nor.z) < abs(nor.x)) {
        x = p.z-6.;
    } else {
        x = abs(p.x)-16.;
    }
    if( p.y < 2.5 ) {
    	return floor( x / 3.6 ) * sign(p.x);
    }
    return floor( x / 1.8 ) * sign(p.x) * (floor( (p.y+7.5) / 5. ));
}


vec3 bumpMapNormal( const in vec3 pos, in vec3 nor ) {
    float i = tileId( pos, nor );
    if( i > 0. ) {
        nor+= 0.0125 * vec3( hash(i), hash(i+5.), hash(i+13.) );
        nor = normalize( nor );
    }
    return nor;
}

float map( const in vec3 p ) {
    float d = -sdBox( p, vec3( 28., 14., 63. ) );

    vec3 pm = vec3( abs( p.x ) - 17.8, p.y, mod( p.z, 12.6 ) - 6.);    
    vec3 pm2 = abs(p) - vec3( 14., 25.25, 0. );
    vec3 pm3 = abs(p) - vec3( 6.8, 0., 56.4 );      

    d = opU( d, sdColumn( pm, vec2( 1.8, 1.8 ) ) );        
    d = opS( d, sdBox( p,  vec3( 2.5, 9.5, 74. ) ) );    
    d = opS( d, sdBox( p,  vec3( 5., 18., 73. ) ) );
    d = opS( d, sdBox( p,  vec3( 13.8, 14.88, 63. ) ) );
    d = opS( d, sdBox( p,  vec3( 13.2, 25., 63. ) ) );
    d = opS( d, sdColumn( p,  vec2( 9.5, 63. ) ) ); 
    d = opU( d, sdColumn( pm3, vec2( 1.8, 1.8 ) ) );
    d = opU( d, sdBox( pm2, vec3( 5., .45, 200. ) ) );
    
    return d;
}

float mapDamage( vec3 p ) {
    float d = map( p );

    float n = max( max( 1.-abs(p.z*.01), 0. )*
                   max( 1.-abs(p.y*.2-1.2), 0. ) *
                   noise( p*.3 )* (noise( p*2.3 ) +.2 )-.2 - damageMod, 0.);
   
	return d + n;
}

float mapDamageHigh( vec3 p ) {
    float d = map( p );
    
    float p1 = noise( p*2.3 );
    float p2 = noise( p*5.3 );
    
    float n = max( max( 1.-abs(p.z*.01), 0. )*
                   max( 1.-abs(p.y*.2-1.2), 0. ) *
                   noise( p*.3 )* (p1 +.2 )-.2 - damageMod, 0.);
  
    float ne = 0.;
    ne += smoothstep( -0.7, 0., -distance( p, ep1.xyz ) );
    ne += smoothstep( -0.7, 0., -distance( p, ep2.xyz ) );
    ne += smoothstep( -0.7, 0., -distance( p, ep3.xyz ) );
    ne += smoothstep( -0.7, 0., -distance( p, ep4.xyz ) );
    ne += smoothstep( -0.7, 0., -distance( p, ep5.xyz ) );
    
    n += .5 * max((ne - p2 ),0.) * ne;
  
    if( p.y < .1 ) {
        n += max(.1*(1.-abs(d)+7.*noise( p*.7 )+.9*p1+.5*p2)-4.5*damageMod,0.);
    }
    
    if( abs(n) > 0.0 ) {
        n += noise( p*11.) * .05;
        n += noise( p*23.) * .03;
    }
    
	return d + n;
}


vec3 calcNormalDamage( in vec3 pos, in float eps ) {
    if( pos.y < 0.001 && (mapDamageHigh(pos)-map(pos)) < eps ) {   		
	        return vec3( 0., 1., 0. );
    }
    
    vec2 e = vec2(1.0,-1.0)*(0.5773*eps);
    vec3 n =  normalize( e.xyy*mapDamageHigh( pos + e.xyy ) + 
			     		 e.yyx*mapDamageHigh( pos + e.yyx ) + 
					  	 e.yxy*mapDamageHigh( pos + e.yxy ) + 
					  	 e.xxx*mapDamageHigh( pos + e.xxx ) );
    n = bumpMapNormal( pos, n );
    return n;    
}

//----------------------------------------------------------------------
// lighting

float calcAO( in vec3 pos, in vec3 nor ) {
	float occ = 0.0;
    for( int i=0; i<6; i++ ) {
        float h = 0.1 + 1.2*float(i);
        occ += (h-map( pos + h*nor ));
    }
    return clamp( 1.0 - occ*0.025, 0.0, 1.0 );    
}

float calcFakeAOAndShadow( in vec3 pos ) { 
    float r = (1.-abs(pos.x)/30.5);
    
    r *= max( min( .35-pos.z / 40., 1.), 0.65);
    r *= .5+.5*smoothstep( -66., -.65, pos.z);
    
    if( pos.y < 25. ) r *= 1.-smoothstep( 18., 25., .5*pos.y+abs(pos.x) ) * (.6+pos.y/25.);
    r *= 1.-smoothstep(5., 8., abs(pos.x) ) * .75 * (smoothstep( 60.,63.,abs(pos.z)));
    
    return clamp(r, 0., 1.);
}

//----------------------------------------------------------------------
// materials

float matMarble( in vec3 pos, in vec3 nor ) {
    float i = tileId( pos, nor );
    
    return .072*(hash(i)+noise(pos*7.))+.12*noise(pos*25.);
}

float matSideLamp( in vec3 pos, in vec3 nor ) {
    float l = (1.-smoothstep(0.05,0.15, abs( pos.y-13.75 ) ))
        	* (1.-smoothstep(1.5,1.7, abs( mod(pos.z, 3.6)-1.8 ) ));
    return 5. * l;
}

float matOutdoorLight( in vec3 pos, in vec3 nor ) {
    float l = ( smoothstep( 0.03, 0.1, abs( mod( pos.x, 1.8 ) / 1.8 - .5) ))
			* ( smoothstep( 0.03, 0.1, abs( mod( pos.y, 3.6 ) / 3.6 - .5) ));
    return mix( 8.,12., l);
}

vec2 shade( in vec3 pos, in vec3 nor, in float m, in float t, in bool reflection ) {
    float refl = 0.1;
    float mate = 0.;
 	float light = 0.;            
    float col = 0.;
    
    if( m < .5 ) {
   		if( pos.y < .01 ) {
	    	mate = .05 * (.25+.2*texture( iChannel1, pos.xz*.05 ).r);
            float x = abs(pos.x);
            if( (x > 12. && x < 14.8) ||  (x > 3.2 && x < 6.8) || abs(pos.z) > 68.4 ) mate *= 0.25;
        } else if( pos.y > 13.5 && pos.y < 13.99 && abs( pos.x ) > 27.99 ) {
            light = matSideLamp( pos, nor ); 
        } else if( pos.z > 62. && pos.y > 52. ) {
            light = matOutdoorLight( pos, nor );
        } else {
 			mate = matMarble( pos, nor );
            refl = 0.05;
   		}
        if( abs(mapDamageHigh(pos)-map(pos)) > 0.0001 * t ) {
            refl = 0.;
            mate = 0.21;
        }
        if( abs( pos.z ) > 73.1 ) {
            mate = 0.02;
            if( mod( abs( pos.x ), 2.25 ) < .3 ||
            	mod( abs( pos.y ), 2.25 ) < .3 ) mate = 0.0025;
            refl = 0.02;
        }
            
        if( nor.y < -0.8 && pos.y > 13.49 ) {
            col += mate * (0.4 * pow( max( (abs(pos.x*.38)-7.2),0.), 2.));
        }        
    } 
#if RENDERDEBRIS
    else if( m < 1.5 ) {
            refl = 0.;
            mate = 0.1 * noise(pos);
    }
#endif
    
    col += mate * (
        25. * ( 0.02 +
        .2 * min(1., max( -nor.x * sign(pos.x), 0.)) + 
        .5 * min(1., max( nor.y, 0. )) +
        .05 * abs( nor.z ) ) * calcFakeAOAndShadow( pos ) );
    
    col *= calcAO( pos, nor );
    col += light;
    
    return vec2( col, refl );
}

//----------------------------------------------------------------------
// intersection code

float intersect( in vec3 ro, in vec3 rd, in vec2 uv ) {
    vec4 dist = textureLod(iChannel3, uv, 0.);
	return dist.r + dist.g;
}


float intersectReflection( in vec3 ro, in vec3 rd ) {
	const float precis = 0.00125;
    float h = precis*2.0;
    float t = 0.;
        
    float d = -(ro.y)/rd.y;
    float maxdist = d>0.?d:500.;
    
	for( int i=0; i < MARCHSTEPSREFLECTION; i++ ) {
        h = map( ro+rd*t );
        if( h < precis ) {
            return t;
        } 
        t += h+0.01*t;
        if( t > maxdist ) {
            return maxdist;
        }
    }
    return -1.;
}

//----------------------------------------------------------------------
// render functions

float renderExplosionDebris( const in vec3 ro, const in vec3 rd, in float maxdist, const in vec4 ep, inout vec3 nor, 
                             const in float time ) {
    float maxRadius = 30.*(time - ep.w - .025);
    float minRadius = 0.2 * maxRadius;
    if( maxRadius > 30. ) return maxdist;
    
    for( int i=0; i<DEBRISCOUNT; i++ ) {
        float id = hash(  ep.w+float(i) );
        vec3 dir = normalize( -1.+2.*vec3( id, hash(  ep.w+.5*float(i) ), hash(  ep.w+1.5*float(i) ) ) - vec3( 2.*sign(ep.x), 0., 0.) );
        vec3 pos = ep.xyz + dir*mix( minRadius, maxRadius, id ) + vec3(0.,-maxRadius*sin( maxRadius*0.005 ),0.);
        float d = iSphere( ro, rd, vec4( pos, 0.1*id+0.003 ) );
        if( d > 0. && d < maxdist ) {
            maxdist = d;
            nor = nSphere( ro+rd*d, vec4( pos, 0.1*id+0.003 ) );
        }
    }
    
    return maxdist;
}

void renderExplosionDust( const in vec3 ro, const in vec3 rd, in float dist, const in vec4 ep, inout vec2 col, 
                          const in float time, const in vec3 grd ) {
    float maxRadius = 10.*(time - ep.w + .25);
    if( maxRadius > 40. ) return ;
    
    float dens = 0.;
    float ho = hash( ep.w ); // id of explosion
    float fade = pow( 2., -maxRadius*0.11-2.);
    float zoom = 2.5/maxRadius;
    vec2 down = vec2(sin(maxRadius*0.005+.1), 0.);
                     
	// intersect planes
    vec2 d = -(ro.xz - ep.xz )/rd.xz;
    if( d.x > 0. ) {
        vec3 pos = ro+d.x*rd;
        float radius = distance( ep.yz, pos.yz );
        if( radius < maxRadius  ) {
            float l = max( 0.025*(dist-d.x) + .5, 0. ) 
                        			* fade 
                      				* abs( grd.x )
                     				* (1.-smoothstep( 0.8*maxRadius, maxRadius, radius ));            
	        float excol = mix( col.x, 1., pow( max(1.-2.*texture( iChannel2,ho+(pos.yz-ep.yz)*zoom + down, -100.0 ).x,0.),3.) );               
    	    col.x = mix( col.x, excol, l);
            col.y += l;
        }
    }
    
    if( d.y > 0. ) {
        vec3 pos = ro+d.y*rd;
        float radius = distance( ep.yx, pos.yx );
        if( radius < maxRadius  ) {
            float l = max( 0.025*(dist-d.y) + .5, 0. ) 
                        			* fade 
                      				* abs( grd.z )
                     				* (1.-smoothstep( 0.8*maxRadius, maxRadius, radius ));
	        float excol = mix( col.x, 1., pow( max(1.-2.*texture( iChannel2,ho+(pos.yx-ep.yx)*zoom + down, -100.0 ).x,0.),3.) );   
    	    col.x = mix( col.x, excol, l);
            col.y += l;
        }
    }
}

vec3 render( const in vec3 ro, const in vec3 rd, in float time, const in float fog, const in vec3 grd, in vec2 uv ) {
    const float eps = 0.01;
    vec2 col = vec2(0.);
    
    float t = intersect( ro, rd, uv );
    if( time > STT(98.) ) {
        time = STT(95.5)+.4*(time-STT(95.5)); // slow motion
    }
    time += .03*hash( rd.x + rd.y*5341.1231 ); // motionblur
    
    if( t > 0. ) {
        vec3 nor;
        float m = 0.;

#if RENDERDEBRIS
        float d = renderExplosionDebris( ro, rd, t, ep1, nor, time );
        d = renderExplosionDebris( ro, rd, d, ep3, nor, time );
        d = renderExplosionDebris( ro, rd, d, ep5, nor, time );
#if HIGHQUALITY 
        d = renderExplosionDebris( ro, rd, d, ep2, nor, time );
        d = renderExplosionDebris( ro, rd, d, ep4, nor, time );
#endif
        if( d < t ) {
            m = 1.;
            t = d;
        } 
#endif
   
        vec3 pos = ro + t*rd;
        if( m < .5 ) {
	        nor = calcNormalDamage( pos, eps );
        }
        col = shade( pos, nor, m, t, false );

#if REFLECTIONS        
        vec3 rdReflect = reflect( rd, -nor );
        float tReflect = intersectReflection( pos + eps*rdReflect, rdReflect );

        if( tReflect >= 0. && col.y > 0. ) {
            vec3 posReflect = pos + tReflect*rdReflect;
            vec3 norReflect = calcNormalDamage( posReflect, eps );

            col += shade( posReflect, norReflect, 0., tReflect, true ) * col.y;
        }
#endif
    } else {
        t = 60.;
    }

    col.y = 0.; 
    renderExplosionDust( ro, rd, t, ep1, col, time, grd );
    renderExplosionDust( ro, rd, t, ep2, col, time, grd );
    renderExplosionDust( ro, rd, t, ep3, col, time, grd );
    renderExplosionDust( ro, rd, t, ep4, col, time, grd );
    renderExplosionDust( ro, rd, t, ep5, col, time, grd );
    
 // add fog
    vec3 dcol = vec3( max(col.x,0.) );
 	dcol = mix( vec3(.5), dcol, exp( -t*(.02*fog+.005*col.y) ) );
        
    return pow( dcol, vec3(0.45) );
}

//----------------------------------------------------------------------
// explosions

#define E1(a,b,c,d) t+=a;if( time >= t ){ep1 = vec4(b,c,d,t);}
#define E2(a,b,c,d) t+=a;if( time >= t ){ep2 = vec4(b,c,d,t);}
#define E3(a,b,c,d) t+=a;if( time >= t ){ep3 = vec4(b,c,d,t);}
#define E4(a,b,c,d) t+=a;if( time >= t ){ep4 = vec4(b,c,d,t);}
#define E5(a,b,c,d) t+=a;if( time >= t ){ep5 = vec4(b,c,d,t);}

void initExplosions( const in float time ) {
	ep1 = ep2 = ep3 = ep4 = ep5 = vec4(-1000.);
    
    float t = 0.;    
    E1(STT(21.), 16., 3.9, 8.2 );
    E2(.7, 16., 5.4, 6.1 );
    E3(.3, 16., 6.3, 7.7 );
    E4(1., 16., 4.8, 8.2 );
    E5(.7, 16., 5.7, 7.3 );
    
    t = 0.;
    E1(STT(34.), -16., 3.9, 5.2 );
    E2(.5, -16., 5.4, 5.1 );
    E3(.7, -16., 6.3, 6.7 );
    E4(.5, -16., 4.8, 7.2 );
    E5(.4, -16., 5.7, 6.3 );
        
    t = 0.;
    E1(STT(42.), -19.1, 3.9, -4.5 );
    E2(1.3, -17.4, 5.4, -4.5 );
    E3(.3, -18.2, 6.3, -4.5 );
    E4(.4, -17.7, 4.8, -4.5 );
    E5(.3, -16.7, 5.7, -4.5 );
  
    E3(.3, -18.2, 6.3, -4.5 );
    E2(.2, -17.4, 5.4, -4.5 );
    E3(.1, -18.2, 6.3, -4.5 );
    E4(.2, -17.7, 4.8, -4.5 );
    E5(.1, -16.7, 5.7, -4.5 );
    
    E1(.9, -16., 3.9, -5.2 );
    E2(.5, -16., 5.4, -5.1 );
    E3(.3, -16., 6.3, -6.7 );
    E4(.5, -16., 4.8, -7.2 );
    E5(.4, -16., 5.7, -6.3 );    
    
    t = 0.;    
    E1(STT(58.), 16., 3.9, 2.2 );
    E2(.2, 16., 5.4, 4.1 );
    E3(.3, 24., 6.3, 3.7 );
    E4(.5, 16., 4.8, 8.2 );
    E5(.7, 24., 5.7, 4.3 );
    E1(.1, 16., 1.9, 8.2 );
    E2(.2, 24., 5.4, -2.1 );
    
    t = 0.;
    E1(STT(66.), 16., 3.9, 6.5 );
    E2(.2, 16., 5.4, 6.1 );
    E5(.3, 16., 6.7, 7.3 );
    E3(.3, 16., 6.3, 5.7 );
    E4(.2, 16., 7.8, 6.2 );
        
    E5(.1, 16., 5.7, 4.7 );
    E1(.2, 16., 3.9, -6.2 );
    E2(.3, 17., 6.4, -4.5 );
    E3(.3, 16., 6.3, -5.7 );
    E4(.5, 16., 7.8, -6.2 );    
    E5(.3, 16., 5.7, -7.7 );
    E1(.2, 16., 3.9, -6.2 );
    E2(.3, 16., 6.4, -4.5 );
   
    t = 0.;
    E1(STT(78.), -17.1, 3.9, -4.5 );
    E2(.3, -17.4, 5.4, -4.5 );
    E3(.3, -18.2, 6.3, -4.5 );
    E4(.4, -17.7, 4.8, -4.5 );
    E5(.3, -16.7, 5.7, -4.5 );
  
    E3(1.3, -18.2, 6.3, -4.5 );
    E2(.2, -17.4, 5.4, -4.5 );
    E3(.1, -18.2, 6.3, -4.5 );
    E4(.2, -17.7, 4.8, -4.5 );
    E5(.1, -16.7, 5.7, -4.5 );
    
    E2(.5, -19.6, 5.4, -5.1 );
    E1(.9, -19.6, 3.9, -5.2 );
    E3(.3, -19.6, 6.3, -6.7 );
    E4(.5, -19.6, 4.8, -7.2 );
    E5(.4, -19.6, 5.7, -6.3 );
}

//----------------------------------------------------------------------
// camera

mat3 setCamera( const in vec3 ro, const in vec3 rt, const in float cr, const in float fl ) {
	vec3 cw = normalize(rt-ro);
	vec3 cp = vec3(sin(cr), cos(cr),0.0);
	vec3 cu = normalize( cross(cw,cp) );
	vec3 cv = normalize( cross(cu,cw) );
    return mat3( cu, cv, -fl*cw );
}

#define SCAM(a,j,h,i,f,g,b,c,d,e) if(time >= t ){damageMod=j;sro=b;ero=c;sta=d;eta=e;st=t;dt=a;sfog=h;efog=i;}t+=a;
#define CCAM(a,j,h,i,f,g,b,c,d,e) if(time >= t ){sro=ero;ero=c;sta=eta;eta=e;st=t;dt=a;sfog=efog;efog=i;}t+=a;

void getCamPath( const in float time, inout vec3 ro, inout vec3 ta, inout float fl, inout float fog ) {
    vec3 sro, sta, ero, eta;
    float st = 0., dt, t = 0., sfog, efog;
    
    SCAM(STT(12.), 0., 0.,    0., 1.5, 1.5, vec3( 0., 5., 22.5 ), vec3( 0., 5.,  18.5 ), vec3( 0., 5., 0. ), vec3( 0., 5., 0. ) ); 
    SCAM(STT(7.5), 0., 0.,    0., 1.5, 1.5, vec3( -14., 5.,  18.5 ), vec3( 18., 4., 11. ), vec3( 10., 5., -50. ), vec3( 0., 5., -50. ) ); 
    CCAM(STT(7.5), 0., 0.,  0.05, 1.5, 1.5, vec3( 18., 4., 11. ), vec3( 21.5, 4., 11.5 ),  vec3( 0., 5., -50. ), vec3( -4., 7., 0. ) ); 
    CCAM(STT(2.5), 0., 0.05, 0.1, 1.5, 1.5, vec3( 21.5, 4., 11.5 ), vec3( 21.5, 4., 11.5 ),  vec3( -4., 7., 0. ), vec3( -16., 7., 8. ) ); 
    CCAM(STT(4.), 0.,  0.1, 0.15, 1.5, 4.5, vec3( 21.5, 4., 11.5 ), vec3( 10., 4.25, 11.35 ),  vec3( -16., 7., 8. ), vec3( -16., 6., 8. ) ); 
    
    SCAM(STT(7.5),  0., 0.1,  0.3, 1.5, 1.5, vec3( -11., 5.25, 7.05 ), vec3( -13., 5., 9. ),  vec3( -19., 5.2, 7. ), vec3( -16.5, 5., 5.3 ) );     
    SCAM(STT(13.), .4, 0.1,  0.5, 1.5, 1.5, vec3( -18., 5., 4.05 ), vec3( -10., 5.25, -6. ),  vec3( -17., 5.5, 0. ), vec3( -15.5, 5.25, -7.3 ) );     
	CCAM(STT(4.), .45, 0.5,  0.65, 1.5, 1.2, vec3( -10., 5.25, -6. ), vec3( -12., 5.25, -9. ),  vec3( -15.5, 5.25, -7.3 ), vec3( -13.5, 6.25, 2.3 ) );     

    SCAM(STT(7.5), .95, 0.4,  1.9, 1.5, 1.5, vec3( 18., 4., 11. ), vec3( 25.5, 4., 11.5 ),  vec3( 0., 5., -50. ), vec3( -4., 7., 0. ) ); 

    SCAM(STT(12.2), .95, 0.8,  1.3, 1.5, 1.5, vec3( 10., 4.7, 4. ), vec3( 10., 5., -7.5 ),  vec3( 50., 5., 2. ), vec3( 40., 5., -20. ) ); 
    
    SCAM(STT(16.25), 1., 0.4,  0.8, 1.5, 1.5, vec3( -18., 4.5, 4.05 ), vec3( -26., 3.25, -6. ),  vec3( -17., 5.5, 0. ), vec3( -15.5, 6.25, -7.3 ) );     
    CCAM(STT(4.),  1., 0.8,  0.6, 1.5, 1.5, vec3( -26., 3.25, -6. ), vec3( -26., 3.25, -6. ),  vec3( -15.5, 6.25, -7.3 ), vec3( -15.5, 6.25, -7.3 ) );     

    SCAM(STT(16.), 1.1, 0.4, 0.05, 1.5, 1.5, vec3( 0., 5.,  18.5 ), vec3( 0., 5.,  18.5 ), vec3( 0., 5., 0. ), vec3( 0., 5., 0. ) ); 
  
    dt = clamp( (time-st)/dt, 0., 1. );

    if(  time > STT(65.5) && time < STT(77.75)  ) {
	    ro = mix( sro, ero, dt);
    	ta = mix( sta, eta, dt);
    } else {
	    ro = mix( sro, ero, smoothstep(0.,1., dt));
    	ta = mix( sta, eta, smoothstep(0.,1., dt));
    }
	
    fl = 1.5;    
    if( time > STT(29.5) && time < STT(33.5) ) {
        fl = mix( 1.5, 4.5, smoothstep( STT(29.5), STT(33.5), time ) );
    }
    
   	fog = mix( sfog, efog, dt);
    damageMod = .4-.4*damageMod;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
    float time = mod(iTime, 60.);

    vec2 q = fragCoord.xy/iResolution.xy;
	    
    // letterbox
    if( abs(2.*fragCoord.y-iResolution.y) > iResolution.x * 0.42 ) {
        fragColor = vec4( 0., 0., 0., 1. );
        return;
    }
    vec3 ro, ta;
    float fl, fog;
      
    getCamPath( time, ro, ta, fl, fog );
        
    initExplosions( time );
    
    mat3 ca = setCamera( ro, ta, 0.0, (1./1.5) );    
    vec2 p = (-iResolution.xy+2.*(fragCoord.xy))/iResolution.x;
    vec3 rd = normalize( ca * vec3(p,-fl) );

    vec3 col = render( ro, rd, time, fog, normalize( ta-ro ), q );
    
    col *= vec3(0.704,0.778,0.704);    
	col = col*0.8 + 0.2*col*col*(3.0-2.0*col);
	col *= vec3(1.378,1.56,1.3);
        
    // vignette
    col *= 0.15 + 0.85*pow(16.0*q.x*q.y*(1.0-q.x)*(1.0-q.y), 0.1 );

    // flicker
    col *= 1.0 + 0.015*fract( 17.1*sin( 13.1*floor(12.0*iTime) ));
    
	// fade in
    col *= clamp( time*.7, 0., 1. );
    col *= clamp( abs(time-STT(12.)), 0., 1. );
    if( time < STT(33.5) ) col *= clamp( (STT(33.5)-time-.5), 0., 1. );
    col *= clamp( abs(time-STT(98.)), 0., 1. );
    
    fragColor = vec4( col, 1.0 );
}
`,name:`Image`,description:``,type:`image`},{inputs:[{id:`Xsf3zn`,filepath:`/media/a/f735bee5b64ef98879dc618b016ecf7939a5756040c2cde21ccb15e69a6e1cfb.png`,type:`texture`,channel:0,sampler:{filter:`linear`,wrap:`repeat`,vflip:`false`,srgb:`false`,internal:`byte`},published:1}],outputs:[{id:`4dXGR8`,channel:0}],code:`// Only calculate depth of first intersection and write to Buffer A

// Created by Reinder Nijhoff 2015
// @reindernijhoff
//
// https://www.shadertoy.com/view/MtsXzf
//

float damageMod;
vec4 ep1, ep2, ep3, ep4, ep5;  

//-----------------------------------------------------
// noise functions

#define MOD2 vec2(.16632,.17369)
float hash(float p) { // by Dave Hoskins
	vec2 p2 = fract(vec2(p) * MOD2);
    p2 += dot(p2.yx, p2.xy+19.19);
	return fract(p2.x * p2.y);
}

float noise( const in vec3 x ) {
    vec3 p = floor(x);
    vec3 f = fract(x);
	f = f*f*(3.0-2.0*f);
	
	vec2 uv = (p.xy+vec2(37.0,17.0)*p.z) + f.xy;
	vec2 rg = textureLod( iChannel0, (uv+ 0.5)/256.0, 0.0 ).yx;
	return mix( rg.x, rg.y, f.z );
}

float noise( const in vec2 x ) {
    vec2 p = floor(x);
    vec2 f = fract(x);
	vec2 uv = p.xy + f.xy*f.xy*(3.0-2.0*f.xy);
	return textureLod( iChannel0, (uv+118.4)/256.0, 0.0 ).x;
}

//-----------------------------------------------------
// intersection functions

vec3 nSphere( in vec3 pos, in vec4 sph ) {
    return (pos-sph.xyz)/sph.w;
}

float iSphere( in vec3 ro, in vec3 rd, in vec4 sph ) {
	vec3 oc = ro - sph.xyz;
	float b = dot( oc, rd );
	float c = dot( oc, oc ) - sph.w*sph.w;
	float h = b*b - c;
	if( h<0.0 ) return -1.;
	return -b - sqrt( h );
}

//----------------------------------------------------------------------
// distance primitives

float sdBox( const in vec3 p, const in vec3 b ) {
    vec3 d = abs(p) - b;
    return min(max(d.x,max(d.y,d.z)),0.0) + length(max(d,0.0));
}

float sdColumn( const in vec3 p, const in vec2 b ) {
    vec2 d = abs(p.xz) - b;
    return min(max(d.x,d.y),0.0) + length(max(d,0.0));
}

//----------------------------------------------------------------------
// distance operators

float opU( float d2, float d1 ) { return min( d1,d2); }
float opS( float d2, float d1 ) { return max(-d1,d2); }
    
//--------------------------------------------
// map

float tileId( const in vec3 p, const in vec3 nor ) { 
    if( abs(nor.y) > .9 ) return 0.;
    
    float x, y;
    if( abs(nor.z) < abs(nor.x)) {
        x = p.z-6.;
    } else {
        x = abs(p.x)-16.;
    }
    if( p.y < 2.5 ) {
    	return floor( x / 3.6 ) * sign(p.x);
    }
    return floor( x / 1.8 ) * sign(p.x) * (floor( (p.y+7.5) / 5. ));
}


vec3 bumpMapNormal( const in vec3 pos, in vec3 nor ) {
    float i = tileId( pos, nor );
    if( i > 0. ) {
        nor+= 0.0125 * vec3( hash(i), hash(i+5.), hash(i+13.) );
        nor = normalize( nor );
    }
    return nor;
}

float map( const in vec3 p ) {
    float d = -sdBox( p, vec3( 28., 14., 63. ) );

    vec3 pm = vec3( abs( p.x ) - 17.8, p.y, mod( p.z, 12.6 ) - 6.);    
    vec3 pm2 = abs(p) - vec3( 14., 25.25, 0. );
    vec3 pm3 = abs(p) - vec3( 6.8, 0., 56.4 );      

    d = opU( d, sdColumn( pm, vec2( 1.8, 1.8 ) ) );        
    d = opS( d, sdBox( p,  vec3( 2.5, 9.5, 74. ) ) );    
    d = opS( d, sdBox( p,  vec3( 5., 18., 73. ) ) );
    d = opS( d, sdBox( p,  vec3( 13.8, 14.88, 63. ) ) );
    d = opS( d, sdBox( p,  vec3( 13.2, 25., 63. ) ) );
    d = opS( d, sdColumn( p,  vec2( 9.5, 63. ) ) ); 
    d = opU( d, sdColumn( pm3, vec2( 1.8, 1.8 ) ) );
    d = opU( d, sdBox( pm2, vec3( 5., .45, 200. ) ) );
    
    return d;
}

float mapDamage( vec3 p ) {
    float d = map( p );

    float n = max( max( 1.-abs(p.z*.01), 0. )*
                   max( 1.-abs(p.y*.2-1.2), 0. ) *
                   noise( p*.3 )* (noise( p*2.3 ) +.2 )-.2 - damageMod, 0.);
   
	return d + n;
}

float mapDamageHigh( vec3 p ) {
    float d = map( p );
    
    float p1 = noise( p*2.3 );
    float p2 = noise( p*5.3 );
    
    float n = max( max( 1.-abs(p.z*.01), 0. )*
                   max( 1.-abs(p.y*.2-1.2), 0. ) *
                   noise( p*.3 )* (p1 +.2 )-.2 - damageMod, 0.);
  
    float ne = 0.;
    ne += smoothstep( -0.7, 0., -distance( p, ep1.xyz ) );
    ne += smoothstep( -0.7, 0., -distance( p, ep2.xyz ) );
    ne += smoothstep( -0.7, 0., -distance( p, ep3.xyz ) );
    ne += smoothstep( -0.7, 0., -distance( p, ep4.xyz ) );
    ne += smoothstep( -0.7, 0., -distance( p, ep5.xyz ) );
    
    n += .5 * max((ne - p2 ),0.) * ne;
  
    if( p.y < .1 ) {
        n += max(.1*(1.-abs(d)+7.*noise( p*.7 )+.9*p1+.5*p2)-4.5*damageMod,0.);
    }
    
    if( abs(n) > 0.0 ) {
        n += noise( p*11.) * .05;
        n += noise( p*23.) * .03;
    }
    
	return d + n;
}


vec3 calcNormalDamage( in vec3 pos, in float eps ) {
    if( pos.y < 0.001 && (mapDamageHigh(pos)-map(pos)) < eps ) {   		
	        return vec3( 0., 1., 0. );
    }
    
    vec2 e = vec2(1.0,-1.0)*(0.5773*eps);
    vec3 n =  normalize( e.xyy*mapDamageHigh( pos + e.xyy ) + 
			     		 e.yyx*mapDamageHigh( pos + e.yyx ) + 
					  	 e.yxy*mapDamageHigh( pos + e.yxy ) + 
					  	 e.xxx*mapDamageHigh( pos + e.xxx ) );
    n = bumpMapNormal( pos, n );
    return n;    
}

//----------------------------------------------------------------------
// lighting

float calcAO( in vec3 pos, in vec3 nor ) {
	float occ = 0.0;
    for( int i=0; i<6; i++ ) {
        float h = 0.1 + 1.2*float(i);
        occ += (h-map( pos + h*nor ));
    }
    return clamp( 1.0 - occ*0.025, 0.0, 1.0 );    
}

float calcFakeAOAndShadow( in vec3 pos ) { 
    float r = (1.-abs(pos.x)/30.5);
    
    r *= max( min( .35-pos.z / 40., 1.), 0.65);
    r *= .5+.5*smoothstep( -66., -.65, pos.z);
    
    if( pos.y < 25. ) r *= 1.-smoothstep( 18., 25., .5*pos.y+abs(pos.x) ) * (.6+pos.y/25.);
    r *= 1.-smoothstep(5., 8., abs(pos.x) ) * .75 * (smoothstep( 60.,63.,abs(pos.z)));
    
    return clamp(r, 0., 1.);
}

//----------------------------------------------------------------------
// materials

float matMarble( in vec3 pos, in vec3 nor ) {
    float i = tileId( pos, nor );
    
    return .072*(hash(i)+noise(pos*7.))+.12*noise(pos*25.);
}

float matSideLamp( in vec3 pos, in vec3 nor ) {
    float l = (1.-smoothstep(0.05,0.15, abs( pos.y-13.75 ) ))
        	* (1.-smoothstep(1.5,1.7, abs( mod(pos.z, 3.6)-1.8 ) ));
    return 5. * l;
}

float matOutdoorLight( in vec3 pos, in vec3 nor ) {
    float l = ( smoothstep( 0.03, 0.1, abs( mod( pos.x, 1.8 ) / 1.8 - .5) ))
			* ( smoothstep( 0.03, 0.1, abs( mod( pos.y, 3.6 ) / 3.6 - .5) ));
    return mix( 8.,12., l);
}

vec2 shade( in vec3 pos, in vec3 nor, in float m, in float t, in bool reflection ) {
    float refl = 0.1;
    float mate = 0.;
 	float light = 0.;            
    float col = 0.;
    
    if( m < .5 ) {
   		if( pos.y < .01 ) {
	    	mate = .05 * (.25+.2*texture( iChannel1, pos.xz*.05 ).r);
            float x = abs(pos.x);
            if( (x > 12. && x < 14.8) ||  (x > 3.2 && x < 6.8) || abs(pos.z) > 68.4 ) mate *= 0.25;
        } else if( pos.y > 13.5 && pos.y < 13.99 && abs( pos.x ) > 27.99 ) {
            light = matSideLamp( pos, nor ); 
        } else if( pos.z > 62. && pos.y > 52. ) {
            light = matOutdoorLight( pos, nor );
        } else {
 			mate = matMarble( pos, nor );
            refl = 0.05;
   		}
        if( abs(mapDamageHigh(pos)-map(pos)) > 0.0001 * t ) {
            refl = 0.;
            mate = 0.21;
        }
        if( abs( pos.z ) > 73.1 ) {
            mate = 0.02;
            if( mod( abs( pos.x ), 2.25 ) < .3 ||
            	mod( abs( pos.y ), 2.25 ) < .3 ) mate = 0.0025;
            refl = 0.02;
        }
            
        if( nor.y < -0.8 && pos.y > 13.49 ) {
            col += mate * (0.4 * pow( max( (abs(pos.x*.38)-7.2),0.), 2.));
        }        
    } 
#if RENDERDEBRIS
    else if( m < 1.5 ) {
            refl = 0.;
            mate = 0.1 * noise(pos);
    }
#endif
    
    col += mate * (
        25. * ( 0.02 +
        .2 * min(1., max( -nor.x * sign(pos.x), 0.)) + 
        .5 * min(1., max( nor.y, 0. )) +
        .05 * abs( nor.z ) ) * calcFakeAOAndShadow( pos ) );
    
    col *= calcAO( pos, nor );
    col += light;
    
    return vec2( col, refl );
}

//----------------------------------------------------------------------
// intersection code

float intersect( in vec3 ro, in vec3 rd ) {
	const float precis = 0.00125;
    float h = precis*2.0;
    float t = 0.1;
        
    float d = -(ro.y)/rd.y;
    float maxdist = d>0.?d:500.;
    
	for( int i=0; i < MARCHSTEPS; i++ ) {
#if HIGHQUALITY
        h = .9*mapDamage( ro+rd*t );
#else
        h = map( ro+rd*t );
#endif
        if( h < precis ) {
            return t;
        } 
        t += h+0.00005*t;
        if( t > maxdist ) {
            return maxdist;
        }
    }
    return -1.;
}


float intersectReflection( in vec3 ro, in vec3 rd ) {
	const float precis = 0.00125;
    float h = precis*2.0;
    float t = 0.;
        
    float d = -(ro.y)/rd.y;
    float maxdist = d>0.?d:500.;
    
	for( int i=0; i < MARCHSTEPSREFLECTION; i++ ) {
        h = map( ro+rd*t );
        if( h < precis ) {
            return t;
        } 
        t += h+0.01*t;
        if( t > maxdist ) {
            return maxdist;
        }
    }
    return -1.;
}

//----------------------------------------------------------------------
// render functions

float renderExplosionDebris( const in vec3 ro, const in vec3 rd, in float maxdist, const in vec4 ep, inout vec3 nor, 
                             const in float time ) {
    float maxRadius = 30.*(time - ep.w - .025);
    float minRadius = 0.2 * maxRadius;
    if( maxRadius > 30. ) return maxdist;
    
    for( int i=0; i<DEBRISCOUNT; i++ ) {
        float id = hash(  ep.w+float(i) );
        vec3 dir = normalize( -1.+2.*vec3( id, hash(  ep.w+.5*float(i) ), hash(  ep.w+1.5*float(i) ) ) - vec3( 2.*sign(ep.x), 0., 0.) );
        vec3 pos = ep.xyz + dir*mix( minRadius, maxRadius, id ) + vec3(0.,-maxRadius*sin( maxRadius*0.005 ),0.);
        float d = iSphere( ro, rd, vec4( pos, 0.1*id+0.003 ) );
        if( d > 0. && d < maxdist ) {
            maxdist = d;
            nor = nSphere( ro+rd*d, vec4( pos, 0.1*id+0.003 ) );
        }
    }
    
    return maxdist;
}

void renderExplosionDust( const in vec3 ro, const in vec3 rd, in float dist, const in vec4 ep, inout vec2 col, 
                          const in float time, const in vec3 grd ) {
    float maxRadius = 10.*(time - ep.w + .25);
    if( maxRadius > 40. ) return ;
    
    float dens = 0.;
    float ho = hash( ep.w ); // id of explosion
    float fade = pow( 2., -maxRadius*0.11-2.);
    float zoom = 2.5/maxRadius;
    vec2 down = vec2(sin(maxRadius*0.005+.1), 0.);
                     
	// intersect planes
    vec2 d = -(ro.xz - ep.xz )/rd.xz;
    if( d.x > 0. ) {
        vec3 pos = ro+d.x*rd;
        float radius = distance( ep.yz, pos.yz );
        if( radius < maxRadius  ) {
            float l = max( 0.025*(dist-d.x) + .5, 0. ) 
                        			* fade 
                      				* abs( grd.x )
                     				* (1.-smoothstep( 0.8*maxRadius, maxRadius, radius ));            
	        float excol = mix( col.x, 1., pow( max(1.-2.*textureLod( iChannel2,ho+(pos.yz-ep.yz)*zoom + down, 0.0 ).x,0.),3.) );               
    	    col.x = mix( col.x, excol, l);
            col.y += l;
        }
    }
    
    if( d.y > 0. ) {
        vec3 pos = ro+d.y*rd;
        float radius = distance( ep.yx, pos.yx );
        if( radius < maxRadius  ) {
            float l = max( 0.025*(dist-d.y) + .5, 0. ) 
                        			* fade 
                      				* abs( grd.z )
                     				* (1.-smoothstep( 0.8*maxRadius, maxRadius, radius ));
	        float excol = mix( col.x, 1., pow( max(1.-2.*textureLod( iChannel2,ho+(pos.yx-ep.yx)*zoom + down, 0.0 ).x,0.),3.) );   
    	    col.x = mix( col.x, excol, l);
            col.y += l;
        }
    }
}

vec3 render( const in vec3 ro, const in vec3 rd, in float time, const in float fog, const in vec3 grd ) {
    const float eps = 0.01;
    vec2 col = vec2(0.);
    
    float t = intersect( ro, rd );
    if( time > STT(98.) ) {
        time = STT(95.5)+.4*(time-STT(95.5)); // slow motion
    }
    time += .03*hash( rd.x + rd.y*5341.1231 ); // motionblur
    
    if( t > 0. ) {
        vec3 nor;
        float m = 0.;

#if RENDERDEBRIS
        float d = renderExplosionDebris( ro, rd, t, ep1, nor, time );
        d = renderExplosionDebris( ro, rd, d, ep3, nor, time );
        d = renderExplosionDebris( ro, rd, d, ep5, nor, time );
#if HIGHQUALITY 
        d = renderExplosionDebris( ro, rd, d, ep2, nor, time );
        d = renderExplosionDebris( ro, rd, d, ep4, nor, time );
#endif
        if( d < t ) {
            m = 1.;
            t = d;
        } 
#endif
   
        vec3 pos = ro + t*rd;
        if( m < .5 ) {
	        nor = calcNormalDamage( pos, eps );
        }
        col = shade( pos, nor, m, t, false );

#if REFLECTIONS        
        vec3 rdReflect = reflect( rd, -nor );
        float tReflect = intersectReflection( pos + eps*rdReflect, rdReflect );

        if( tReflect >= 0. && col.y > 0. ) {
            vec3 posReflect = pos + tReflect*rdReflect;
            vec3 norReflect = calcNormalDamage( posReflect, eps );

            col += shade( posReflect, norReflect, 0., tReflect, true ) * col.y;
        }
#endif
    } else {
        t = 60.;
    }

    col.y = 0.; 
    renderExplosionDust( ro, rd, t, ep1, col, time, grd );
    renderExplosionDust( ro, rd, t, ep2, col, time, grd );
    renderExplosionDust( ro, rd, t, ep3, col, time, grd );
    renderExplosionDust( ro, rd, t, ep4, col, time, grd );
    renderExplosionDust( ro, rd, t, ep5, col, time, grd );
    
 // add fog
    vec3 dcol = vec3( max(col.x,0.) );
 	dcol = mix( vec3(.5), dcol, exp( -t*(.02*fog+.005*col.y) ) );
        
    return pow( dcol, vec3(0.45) );
}

//----------------------------------------------------------------------
// explosions

#define E1(a,b,c,d) t+=a;if( time >= t ){ep1 = vec4(b,c,d,t);}
#define E2(a,b,c,d) t+=a;if( time >= t ){ep2 = vec4(b,c,d,t);}
#define E3(a,b,c,d) t+=a;if( time >= t ){ep3 = vec4(b,c,d,t);}
#define E4(a,b,c,d) t+=a;if( time >= t ){ep4 = vec4(b,c,d,t);}
#define E5(a,b,c,d) t+=a;if( time >= t ){ep5 = vec4(b,c,d,t);}

void initExplosions( const in float time ) {
	ep1 = ep2 = ep3 = ep4 = ep5 = vec4(-1000.);
    
    float t = 0.;    
    E1(STT(21.), 16., 3.9, 8.2 );
    E2(.7, 16., 5.4, 6.1 );
    E3(.3, 16., 6.3, 7.7 );
    E4(1., 16., 4.8, 8.2 );
    E5(.7, 16., 5.7, 7.3 );
    
    t = 0.;
    E1(STT(34.), -16., 3.9, 5.2 );
    E2(.5, -16., 5.4, 5.1 );
    E3(.7, -16., 6.3, 6.7 );
    E4(.5, -16., 4.8, 7.2 );
    E5(.4, -16., 5.7, 6.3 );
        
    t = 0.;
    E1(STT(42.), -19.1, 3.9, -4.5 );
    E2(1.3, -17.4, 5.4, -4.5 );
    E3(.3, -18.2, 6.3, -4.5 );
    E4(.4, -17.7, 4.8, -4.5 );
    E5(.3, -16.7, 5.7, -4.5 );
  
    E3(.3, -18.2, 6.3, -4.5 );
    E2(.2, -17.4, 5.4, -4.5 );
    E3(.1, -18.2, 6.3, -4.5 );
    E4(.2, -17.7, 4.8, -4.5 );
    E5(.1, -16.7, 5.7, -4.5 );
    
    E1(.9, -16., 3.9, -5.2 );
    E2(.5, -16., 5.4, -5.1 );
    E3(.3, -16., 6.3, -6.7 );
    E4(.5, -16., 4.8, -7.2 );
    E5(.4, -16., 5.7, -6.3 );    
    
    t = 0.;    
    E1(STT(58.), 16., 3.9, 2.2 );
    E2(.2, 16., 5.4, 4.1 );
    E3(.3, 24., 6.3, 3.7 );
    E4(.5, 16., 4.8, 8.2 );
    E5(.7, 24., 5.7, 4.3 );
    E1(.1, 16., 1.9, 8.2 );
    E2(.2, 24., 5.4, -2.1 );
    
    t = 0.;
    E1(STT(66.), 16., 3.9, 6.5 );
    E2(.2, 16., 5.4, 6.1 );
    E5(.3, 16., 6.7, 7.3 );
    E3(.3, 16., 6.3, 5.7 );
    E4(.2, 16., 7.8, 6.2 );
        
    E5(.1, 16., 5.7, 4.7 );
    E1(.2, 16., 3.9, -6.2 );
    E2(.3, 17., 6.4, -4.5 );
    E3(.3, 16., 6.3, -5.7 );
    E4(.5, 16., 7.8, -6.2 );    
    E5(.3, 16., 5.7, -7.7 );
    E1(.2, 16., 3.9, -6.2 );
    E2(.3, 16., 6.4, -4.5 );
   
    t = 0.;
    E1(STT(78.), -17.1, 3.9, -4.5 );
    E2(.3, -17.4, 5.4, -4.5 );
    E3(.3, -18.2, 6.3, -4.5 );
    E4(.4, -17.7, 4.8, -4.5 );
    E5(.3, -16.7, 5.7, -4.5 );
  
    E3(1.3, -18.2, 6.3, -4.5 );
    E2(.2, -17.4, 5.4, -4.5 );
    E3(.1, -18.2, 6.3, -4.5 );
    E4(.2, -17.7, 4.8, -4.5 );
    E5(.1, -16.7, 5.7, -4.5 );
    
    E2(.5, -19.6, 5.4, -5.1 );
    E1(.9, -19.6, 3.9, -5.2 );
    E3(.3, -19.6, 6.3, -6.7 );
    E4(.5, -19.6, 4.8, -7.2 );
    E5(.4, -19.6, 5.7, -6.3 );
}

//----------------------------------------------------------------------
// camera

mat3 setCamera( const in vec3 ro, const in vec3 rt, const in float cr, const in float fl ) {
	vec3 cw = normalize(rt-ro);
	vec3 cp = vec3(sin(cr), cos(cr),0.0);
	vec3 cu = normalize( cross(cw,cp) );
	vec3 cv = normalize( cross(cu,cw) );
    return mat3( cu, cv, -fl*cw );
}

#define SCAM(a,j,h,i,f,g,b,c,d,e) if(time >= t ){damageMod=j;sro=b;ero=c;sta=d;eta=e;st=t;dt=a;sfog=h;efog=i;}t+=a;
#define CCAM(a,j,h,i,f,g,b,c,d,e) if(time >= t ){sro=ero;ero=c;sta=eta;eta=e;st=t;dt=a;sfog=efog;efog=i;}t+=a;

void getCamPath( const in float time, inout vec3 ro, inout vec3 ta, inout float fl, inout float fog ) {
    vec3 sro, sta, ero, eta;
    float st = 0., dt, t = 0., sfog, efog;
    
    SCAM(STT(12.), 0., 0.,    0., 1.5, 1.5, vec3( 0., 5., 22.5 ), vec3( 0., 5.,  18.5 ), vec3( 0., 5., 0. ), vec3( 0., 5., 0. ) ); 
    SCAM(STT(7.5), 0., 0.,    0., 1.5, 1.5, vec3( -14., 5.,  18.5 ), vec3( 18., 4., 11. ), vec3( 10., 5., -50. ), vec3( 0., 5., -50. ) ); 
    CCAM(STT(7.5), 0., 0.,  0.05, 1.5, 1.5, vec3( 18., 4., 11. ), vec3( 21.5, 4., 11.5 ),  vec3( 0., 5., -50. ), vec3( -4., 7., 0. ) ); 
    CCAM(STT(2.5), 0., 0.05, 0.1, 1.5, 1.5, vec3( 21.5, 4., 11.5 ), vec3( 21.5, 4., 11.5 ),  vec3( -4., 7., 0. ), vec3( -16., 7., 8. ) ); 
    CCAM(STT(4.), 0.,  0.1, 0.15, 1.5, 4.5, vec3( 21.5, 4., 11.5 ), vec3( 10., 4.25, 11.35 ),  vec3( -16., 7., 8. ), vec3( -16., 6., 8. ) ); 
    
    SCAM(STT(7.5),  0., 0.1,  0.3, 1.5, 1.5, vec3( -11., 5.25, 7.05 ), vec3( -13., 5., 9. ),  vec3( -19., 5.2, 7. ), vec3( -16.5, 5., 5.3 ) );     
    SCAM(STT(13.), .4, 0.1,  0.5, 1.5, 1.5, vec3( -18., 5., 4.05 ), vec3( -10., 5.25, -6. ),  vec3( -17., 5.5, 0. ), vec3( -15.5, 5.25, -7.3 ) );     
	CCAM(STT(4.), .45, 0.5,  0.65, 1.5, 1.2, vec3( -10., 5.25, -6. ), vec3( -12., 5.25, -9. ),  vec3( -15.5, 5.25, -7.3 ), vec3( -13.5, 6.25, 2.3 ) );     

    SCAM(STT(7.5), .95, 0.4,  1.9, 1.5, 1.5, vec3( 18., 4., 11. ), vec3( 25.5, 4., 11.5 ),  vec3( 0., 5., -50. ), vec3( -4., 7., 0. ) ); 

    SCAM(STT(12.2), .95, 0.8,  1.3, 1.5, 1.5, vec3( 10., 4.7, 4. ), vec3( 10., 5., -7.5 ),  vec3( 50., 5., 2. ), vec3( 40., 5., -20. ) ); 
    
    SCAM(STT(16.25), 1., 0.4,  0.8, 1.5, 1.5, vec3( -18., 4.5, 4.05 ), vec3( -26., 3.25, -6. ),  vec3( -17., 5.5, 0. ), vec3( -15.5, 6.25, -7.3 ) );     
    CCAM(STT(4.),  1., 0.8,  0.6, 1.5, 1.5, vec3( -26., 3.25, -6. ), vec3( -26., 3.25, -6. ),  vec3( -15.5, 6.25, -7.3 ), vec3( -15.5, 6.25, -7.3 ) );     

    SCAM(STT(16.), 1.1, 0.4, 0.05, 1.5, 1.5, vec3( 0., 5.,  18.5 ), vec3( 0., 5.,  18.5 ), vec3( 0., 5., 0. ), vec3( 0., 5., 0. ) ); 
  
    dt = clamp( (time-st)/dt, 0., 1. );

    if(  time > STT(65.5) && time < STT(77.75)  ) {
	    ro = mix( sro, ero, dt);
    	ta = mix( sta, eta, dt);
    } else {
	    ro = mix( sro, ero, smoothstep(0.,1., dt));
    	ta = mix( sta, eta, smoothstep(0.,1., dt));
    }
	
    fl = 1.5;    
    if( time > STT(29.5) && time < STT(33.5) ) {
        fl = mix( 1.5, 4.5, smoothstep( STT(29.5), STT(33.5), time ) );
    }
    
   	fog = mix( sfog, efog, dt);
    damageMod = .4-.4*damageMod;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
    float time = mod(iTime, 60.);

    vec2 q = fragCoord.xy/iResolution.xy;
	    
    // letterbox
    if( abs(2.*fragCoord.y-iResolution.y) > iResolution.x * 0.42 ) {
        fragColor = vec4( 0., 0., 0., 1. );
        return;
    }
  
    vec3 ro, ta;
    float fl, fog;
      
    getCamPath( time, ro, ta, fl, fog );
        
    initExplosions( time );
    
    mat3 ca = setCamera( ro, ta, 0.0, (1./1.5) );    
    vec2 p = (-iResolution.xy+2.*(fragCoord.xy))/iResolution.x;
    vec3 rd = normalize( ca * vec3(p,-fl) );

    float dist = intersect( ro, rd );
    vec3 col = vec3( floor(dist), fract(dist), 0. );
    
    fragColor = vec4( col, 1.0 );
}
`,name:`Buffer A`,description:``,type:`buffer`},{inputs:[{id:`Xsf3zn`,filepath:`/media/a/f735bee5b64ef98879dc618b016ecf7939a5756040c2cde21ccb15e69a6e1cfb.png`,type:`texture`,channel:0,sampler:{filter:`linear`,wrap:`repeat`,vflip:`false`,srgb:`false`,internal:`byte`},published:1}],outputs:[{id:`XsfGRr`,channel:0}],code:`// Created by Reinder Nijhoff 2015
// @reindernijhoff
//
// https://www.shadertoy.com/view/MtsXzf
//

#define N(a) if(t>b)x=b;b+=a;
#define NF(a,c,g) if(t>b){x=b;f=c;v=g;d=a;}b+=a;

//----------------------------------------------------------------------------------------

#define LOOPCOUNT		(16.)

#define PI2 6.283185307179586476925286766559

#define D 36.71
#define A 55.00	
#define B 61.74
#define C 65.41

//-----------------------------------------------------
// noise functions

#define MOD2 vec2(.16632,.17369)
float hash(const in float p) { // by Dave Hoskins
	vec2 p2 = fract(vec2(p) * MOD2);
    p2 += dot(p2.yx, p2.xy+19.19);
	return fract(p2.x * p2.y);
}

float sine(const in float x) {
    return sin(PI2 * x);
}

float loop(const in float t, const in float steps) {
    return mod(t, steps * ISTEP);
}

float distortion(const in float s, const in float d) {
	return clamp(s * d, -1.0, 1.0);
}

float quan(const in float s, const in float c) {
	return floor(s / c) * c;
}

bool inLoop( float time, float s, float e ) {
    float t = (time * (STEP / LOOPCOUNT));
    return ( t >= s && t < e );
}

//-----------------------------------------------------
// instruments by iq and And

float snare(const in float t, const in float f0) {
    float op3 = sine((t * f0) * 2.8020) * exp(-t * 1.0);
    float op2 = sine((t * f0) * 2.5000 + op3 * 1.00);
    float op1 = sine((t * f0) * 18.000 + op2 * 0.72);

    return op1 * exp(-t * 5.5);
}

float kick(float tb) {
	const float aa = 5.0;
	tb = sqrt(tb * aa) / aa;
	
	float amp = exp(max(tb - 0.015, 0.0) * -5.0);
	float v = sine(tb * 100.0) * amp;
	v += distortion(v, 4.0) * amp;
	return v;
}

float bass(const in float time, const in float freq, const in float duration) {
    float ph = 1.0;
    ph *= sin(6.2831*freq*time);
    ph *= 0.1+0.9*max(0.0,6.0-0.01*freq);
    ph *= exp(-time*freq*0.3);
    
    
    float y = 0.;
    y += 0.70*sin(1.00*PI2*freq*time+ph);//*exp(-0.07*time);
    y += 0.90*sin(2.01*PI2*freq*time+ph);//*exp(-0.11*time);

    y += 0.145*y*y*y;   

    y *= 1.-smoothstep( duration*0.9, duration, time * STEP );

    return y;
}

float bell(const in float t, const in float f0) {
    float op3 = sine((f0 * t) * 6.0000             ) * exp(-t * 5.0);
    float op2 = sine((f0 * t) * 7.2364 + op3 * 0.20);
    float op1 = sine((f0 * t) * 2.0000 + op2 * 0.13) * exp(-t * 2.0);

    return op1;
}

float lift(float time) {
    return sin(PI2*D*32.*time)*exp(-6.0*time) + bell(time, D*32.);
}

float gun(float time, float f, const in float d) {
    return distortion( textureLod( iChannel0, vec2(time*5.7864, time*6.9732)*f, 0. ).x *exp(-10.0*time)
                       * smoothstep(0.,0.1,time) * (1.-smoothstep(0.5,.6,time)), d);
}

//-----------------------------------------------------
// loops

float loopBass(const in float t, const in float m) {
    float x = 0., b = 0., f = 0., v = 0., d;
                
    NF(2.,D,0.9);NF(2.,D,1.);NF(1.,D,0.5);NF(1.,D,0.6);NF(1.,D,0.5);
    NF(2.,A,1.05);NF(1.,D,0.5);NF(2.,B,0.9);NF(1.,D,0.5); NF(3.,C,1.);
    f *= m;
    
    return v * bass( (t-x)*ISTEP, f, d );

}
    
float loopBassIntro(const in float t) {
    float x = 0., b = 0., f = 0., v = 0., d;
    NF(4.,A,.5);NF(2.,D,.8);NF(8.,D,1.);NF(2.,D,.25);
    
    return v * bass( (t-x)*ISTEP, f*.5, d );
}

float loopDrums(const in float t) {
    float x = 0., b = 0., r;
    
    // base
    N(3.);N(7.);N(1.);N(5.);
	r = kick( (t-x)*ISTEP*1.2 );
    
    // bell
    x = b = 0.;
    N(4.);N(4.);N(4.);N(2.);N(2.);
    r += .25 * bell( (t-x)*ISTEP*8., 100. );
    
    // hihat
    x = b = 0.;
    N(3.);N(3.);N(2.);N(2.);N(4.);
    r += .35 * snare( (t-x)*ISTEP*2., 200.+t );
    
    // snare
    x = b = 0.;
    N(4.);N(3.);N(2.);N(3.);N(1.);N(3.);
    r += .75 * snare( (t-x)*ISTEP*8., 10. );

    return r;
}

float loopDrumsIntro(const in float t) {
    float x = 0., b = 0.;
    
    // snare
    N(1.);N(3.);N(3.);N(2.);N(1.);N(1.);N(1.);N(1.);N(1.);N(1.);N(1.);
    return (t/24.) * snare( (t-x)*ISTEP*8., 10. ) + kick(  (t)*ISTEP*1.2 );
}

float loopGun( const in float time, const in float interval, const in float numshots, 
               const in float shotdelay, const in float minf, const in float maxf ) {
    float it = mod( time, interval );

#if HIGHQUALITY
    float m = 0.;
    for( float sh = 0.; sh<2.5; sh+=1.) {
        if( sh < numshots ) {
            float g = (0.5+0.5*hash(sh+.5))*gun( it - sh*shotdelay - .5*shotdelay*hash(sh), mix(minf, maxf, hash(sh+.25)), 1.5 );
    		m = m+g - abs(m)*g;
        }
    }
 
    return m;
#else
    float sh = floor( it/shotdelay );
    if( sh < numshots ) {
        return (0.5+0.5*hash(sh+.5))*gun( it - sh*shotdelay - .5*shotdelay*hash(sh), mix(minf, maxf, hash(sh+.25)), 1.5 );
    }
    return 0.;
#endif
}



//-----------------------------------------------------
// music

float loopMusic(const in float time) {
	float mtime = loop( time, 16. );
    float t = mtime * STEP;
    float m = 1.;
    
    float d = 0.;
    float b = 0.;
    
    if( inLoop( time, 2., 36. ) && !inLoop( time, 6., 8. ) && !inLoop( time, 15., 16. )  ) {
        d = loopDrums( t );
    }
    
    if( inLoop( time, 1., 2. ) || inLoop( time, 7., 8. ) || inLoop( time, 11., 12. ) ) {
        d += loopDrumsIntro( t );
    }
    
    if( inLoop( time, 10., 12. ) ) {
        m = B/D;
    }

    return loopBass( t, m ) + .5*d;
}

float loopIntro(const in float time) {
	float mtime = loop( time, 16. );
    float t = mtime * STEP;
    
	if( inLoop( time, .74, 5.25 ) ) {
        return loopBassIntro( t );
    }
    return 0.;
}
    
float loopBackground( const in float time ) {
    float m = 0., g = 0.;
    g = .5 * loopGun( time, 2., 3., .21, 1., 1.5 );
    m = m+g - abs(m)*g;
    
    g = .95 * loopGun( time-4.123, 3., 1., 1.5, 1., 1.5 );
    m = m+g - abs(m)*g;
    
    g = .7 * loopGun( time-3., 3.2, 2., .41, 1., 1.5 );
    m = m+g - abs(m)*g;
    
    return m;
}

void initExplosions( in float time );
float exTime1, exTime2;

//-----------------------------------------------------
// main
    
vec2 mainSound( in int samp,float time) {
    time = mod(time, 60.);
        
    initExplosions(time);
    // align with music
    exTime1 = floor( exTime1 / ISTEP * 2.)*ISTEP*.5;
    exTime2 = floor( exTime2 / ISTEP * 2.)*ISTEP*.5;
    
    float m = 0., music = 0., gun1 = 0., gun2 = 0., bg = 0.;
    
    if( time < STT(34.) ) {
        music = loopIntro( time );
    } else if( time < STT(98.) ){
        music = loopMusic( time-STT(34.) );
    }
    music *= .25;
    
    gun1 = gun( time-exTime1, mix(1.,1.5,hash(exTime1)), 3. );
    gun2 = gun( time-exTime2, mix(1.,1.5,hash(exTime2)), 3. );
    
    if( time > STT(34.) && time < STT(84.)  ) {
        bg = loopBackground(time);
    }
    
    m = m+bg - abs(m)*bg;
    m = m+music - abs(m)*music;
    
    m = m+gun1 - abs(m)*gun1;
    m = m+gun2 - abs(m)*gun2;
    
    m *= 1.5;
    
    if( time > 44.5 ) m += .0625*lift( time-44.5);
    
    return vec2( clamp(m, -1., 1.) );
}


//----------------------------------------------------------------------
// explosions

#define E1(a,b,c,d) t+=a;if( time >= t ){exTime2=exTime1;exTime1=t;}
#define E2(a,b,c,d) t+=a;if( time >= t ){exTime2=exTime1;exTime1=t;}
#define E3(a,b,c,d) t+=a;if( time >= t ){exTime2=exTime1;exTime1=t;}
#define E4(a,b,c,d) t+=a;if( time >= t ){exTime2=exTime1;exTime1=t;}
#define E5(a,b,c,d) t+=a;if( time >= t ){exTime2=exTime1;exTime1=t;}

void initExplosions( in float time ) {
	exTime1 = exTime2 = -1000.;
    
    float t = 0.;    
    E1(STT(21.), 16., 3.9, 8.2 );
    E2(.7, 16., 5.4, 6.1 );
    E3(.3, 16., 6.3, 7.7 );
    E4(1., 16., 4.8, 8.2 );
    E5(.7, 16., 5.7, 7.3 );
    
    t = 0.;
    E1(STT(34.), -16., 3.9, 5.2 );
    E2(.5, -16., 5.4, 5.1 );
    E3(.7, -16., 6.3, 6.7 );
    E4(.5, -16., 4.8, 7.2 );
    E5(.4, -16., 5.7, 6.3 );
        
    t = 0.;
    E1(STT(42.), -19.1, 3.9, -4.5 );
    E2(1.3, -17.4, 5.4, -4.5 );
    E3(.3, -18.2, 6.3, -4.5 );
    E4(.4, -17.7, 4.8, -4.5 );
    E5(.3, -16.7, 5.7, -4.5 );
  
    E3(.3, -18.2, 6.3, -4.5 );
    E2(.2, -17.4, 5.4, -4.5 );
    E3(.1, -18.2, 6.3, -4.5 );
    E4(.2, -17.7, 4.8, -4.5 );
    E5(.1, -16.7, 5.7, -4.5 );
    
    E1(.9, -16., 3.9, -5.2 );
    E2(.5, -16., 5.4, -5.1 );
    E3(.3, -16., 6.3, -6.7 );
    E4(.5, -16., 4.8, -7.2 );
    E5(.4, -16., 5.7, -6.3 );    
    
    t = 0.;    
    E1(STT(58.), 16., 3.9, 2.2 );
    E2(.2, 16., 5.4, 4.1 );
    E3(.3, 24., 6.3, 3.7 );
    E4(.5, 16., 4.8, 8.2 );
    E5(.7, 24., 5.7, 4.3 );
    E1(.1, 16., 1.9, 8.2 );
    E2(.2, 24., 5.4, -2.1 );
    
    t = 0.;
    E1(STT(66.), 16., 3.9, 6.5 );
    E2(.2, 16., 5.4, 6.1 );
    E5(.3, 16., 6.7, 7.3 );
    E3(.3, 16., 6.3, 5.7 );
    E4(.2, 16., 7.8, 6.2 );
        
    E5(.1, 16., 5.7, 4.7 );
    E1(.2, 16., 3.9, -6.2 );
    E2(.3, 17., 6.4, -4.5 );
    E3(.3, 16., 6.3, -5.7 );
    E4(.5, 16., 7.8, -6.2 );    
    E5(.3, 16., 5.7, -7.7 );
    E1(.2, 16., 3.9, -6.2 );
    E2(.3, 16., 6.4, -4.5 );
   
    t = 0.;
    E1(STT(78.), -17.1, 3.9, -4.5 );
    E2(.3, -17.4, 5.4, -4.5 );
    E3(.3, -18.2, 6.3, -4.5 );
    E4(.4, -17.7, 4.8, -4.5 );
    E5(.3, -16.7, 5.7, -4.5 );
  
    E3(1.3, -18.2, 6.3, -4.5 );
    E2(.2, -17.4, 5.4, -4.5 );
    E3(.1, -18.2, 6.3, -4.5 );
    E4(.2, -17.7, 4.8, -4.5 );
    E5(.1, -16.7, 5.7, -4.5 );
    
    E2(.5, -19.6, 5.4, -5.1 );
    E1(.9, -19.6, 3.9, -5.2 );
    E3(.3, -19.6, 6.3, -6.7 );
    E4(.5, -19.6, 4.8, -7.2 );
    E5(.4, -19.6, 5.7, -6.3 );
}

`,name:`Sound`,description:``,type:`sound`},{inputs:[],outputs:[],code:`#define HIGHQUALITY 1
#define RENDERDEBRIS 1
#define REFLECTIONS 1

#define MARCHSTEPS 90
#define MARCHSTEPSREFLECTION 30
#define DEBRISCOUNT 8

#define BPM             (140.0)
#define STEP            (4.0 * BPM / 60.0)
#define ISTEP           (1./STEP)
#define STT(t)			(t*(60.0/BPM))`,name:`Common`,description:``,type:`common`}]},{ver:`0.1`,info:{id:`4tcGRr`,date:`1467593786`,viewed:1513,name:`[SH16A] Reinder`,description:`[SH16A] Challenge. This is work in progress. For now no change to code flow / algorithm is made.`,likes:2,published:`Public API`,usePreview:0,tags:[`challenge`,`codesize`,`sh16a`]},renderpass:[{inputs:[{id:`Xsf3zn`,filepath:`/media/a/f735bee5b64ef98879dc618b016ecf7939a5756040c2cde21ccb15e69a6e1cfb.png`,type:`texture`,channel:0,sampler:{filter:`nearest`,wrap:`repeat`,vflip:`false`,srgb:`false`,internal:`byte`},published:1}],outputs:[{id:`4dfGRr`,channel:0}],code:`// Changes:
// Applying P_Malins comment (C *= T*V(1.2,1.02,.66)+(y+N).y*V(1,1.4,2)/8.;) -> 713 char
// I don't know why, but I could remove the max(0.,dot at the lighting equation -> 714 char
// Make all arguments global (inspired by P_Malin)
// Applying FabriceNeyret2's comment (identity in calculation of D)

#define V vec3
#define Q normalize
#define F for(int i=0;i<64;i++)

#define c F{n=y,T=P.y,m=-2;F l=length(q=P-V(i/5-2,s,i-2-i/5*5))-s,i<28&&l<T?T=l,m=i/2,n=Q(q):q,s+=g*=-1.;P+=T*d;}

void mainImage( out vec4 f, vec2 p ) {
	int m; float T, s=.4, g=.15, l,h=.5;
    V C, d, D, N, n, q=iResolution, y = V(0,1,0),
    P = V( .851, 2, -2.8768 );
    
    D = d = mat3( d = Q(cross(N = -Q(.2*y+P),y)),cross(d,N), N ) * Q(V(p-q.xy*h,q.y));
    
    c
    
    N=n,q=mod(ceil(P),2.),C=P*P,
	
    C = m<0?
    	smoothstep( 0.,h,max(C.x,C.z)<2.25?length(fract(P.xz+h)-h):2.)*        
       	V(q.x==q.z?.4:h*texture( iChannel0,.1*P.xz).x) : V(100-8*m,3*m,6*m)*.01;     

	d = Q(V(-6,7,-5));
    P += .01*d;
    
    c
    
    T = m<-1?dot(N,d):0.;    
	
    f=sqrt(C*(T*V(1.2,1.02,.66)+(y+N).y*V(1,1.4,2)/8.)+pow(max(0.,dot(reflect( D, N ), d)),16.)*T).xyzz;
}

/*

#define V vec3
#define Q normalize

V C, P, n, q=iResolution, y = V(0,1,0);
float t, m, T, M, s, g=.15, l;

void c( V o, V d ) {
    t=.01,s=.4;
    for( int i=0; i<64; i++ ) {
		P=o+d*t,
	    n = y,
        T = P.y, M = -2.;        
        for( int i=0;i<28;i++) {
            l=length(q = P - V( i/5-2,s, i-2-i/5*5)) - s;
            if( l < T ) 
                T = l, M = float(i/2), n = Q(q);
            s += g*=-1.;
		}
        t += T;
	    m = M;
    }
}

void mainImage( out vec4 f, vec2 p ) {
    V o = V( cos(5.),1,sin(5.) )*3.-y,
        N = -Q(.2*y+o),
        d = Q(cross(N,y)),        
		L = Q(V(-6,7,-5));
    
    c(o,d = mat3( d,cross(d,N), N ) * Q(V((p+p-q.xy)/q.y,2)));  
    
    N=n,q=ceil(P),C=abs(P),
	
    C = m>=0.?V(-8,3,6)*.01*m+y.yxx:
    	smoothstep( 0.,.5,length(fract(P.xz+.5)-.5)+step(1.5,max(C.x,C.z)))*        
       	V(mod(q.x+q.z,2.)<.5?.4:.5*texture( iChannel0,.1*P.xz).x);     
    
    c(P, L);
    
    t = max(0.,dot(N, L)) * step(m,-.5);    
	
    C *= t*V(1.2,1.02,.66)+(1.+N.y)*V(1,1.4,2)/8.;
    
    f=sqrt(C.xyzz+pow(max(0.,dot(reflect( d, N ), L)),16.)*t);
}

*/`,name:`Image`,description:``,type:`image`}]},{ver:`0.1`,info:{id:`Xlt3Dn`,date:`1468788417`,viewed:5304,name:`[SH16B] Speed tracer`,description:`Because there is no character limit anymore, a lot more spheres can be rendered.
This shader uses code of the [url=https://www.shadertoy.com/view/MdB3Dw]Analytical Motionblur 3D[/url] shader by Inigo and a grid to trace a lot of spheres.`,likes:81,published:`Public API`,usePreview:0,tags:[`ray`,`blur`,`spheres`,`motion`,`analytic`,`trace`]},renderpass:[{inputs:[],outputs:[{id:`4dfGRr`,channel:0}],code:`// [SH16B] Speed tracer. Created by Reinder Nijhoff 2016
// Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License.
// @reindernijhoff
// 
// https://www.shadertoy.com/view/Xlt3Dn
//
// This shader uses code of the Analytical Motionblur 3D shader by Inego and a grid to trace a lot of spheres.
//

#define RAYCASTSTEPS 30

#define GRIDSIZE 10.
#define GRIDSIZESMALL 7.
#define MAXHEIGHT 30.
#define SPEED 20.
#define FPS 30.
#define MAXDISTANCE 260.
#define MAXSHADOWDISTANCE 20.

#define time iTime

#define HASHSCALE1 .1031
#define HASHSCALE3 vec3(.1031, .1030, .0973)
#define HASHSCALE4 vec4(1031, .1030, .0973, .1099)

//----------------------------------------------------------------------------------------
//  1 out, 2 in...
float hash12(vec2 p)
{
	vec3 p3  = fract(vec3(p.xyx) * HASHSCALE1);
    p3 += dot(p3, p3.yzx + 19.19);
    return fract((p3.x + p3.y) * p3.z);
}


//----------------------------------------------------------------------------------------
///  2 out, 2 in...
vec2 hash22(vec2 p)
{
	vec3 p3 = fract(vec3(p.xyx) * HASHSCALE3);
    p3 += dot(p3, p3.yzx+19.19);
    return fract(vec2((p3.x + p3.y)*p3.z, (p3.x+p3.z)*p3.y));
}

//
// intersection functions
//

bool intersectPlane(const in vec3 ro, const in vec3 rd, const in float height, out float dist) {	
	if (rd.y==0.0) {
		return false;
	}
	
	float d = -(ro.y - height)/rd.y;
	d = min(100000.0, d);
	if( d > 0. ) {
		dist = d;
		return true;
	}
	return false;
}

//
// intersect a MOVING sphere
//
// see: Analytical Motionblur 3D
//      https://www.shadertoy.com/view/MdB3Dw
//
// Created by inigo quilez - iq/2014
//
vec2 iSphere( const in vec3 ro, const in vec3 rd, const in vec4 sp, const in vec3 ve, out vec3 nor )
{
    float t = -1.0;
	float s = 0.0;
	nor = vec3(0.0);
	
	vec3  rc = ro - sp.xyz;
	float A = dot(rc,rd);
	float B = dot(rc,rc) - sp.w*sp.w;
	float C = dot(ve,ve);
	float D = dot(rc,ve);
	float E = dot(rd,ve);
	float aab = A*A - B;
	float eec = E*E - C;
	float aed = A*E - D;
	float k = aed*aed - eec*aab;
		
	if( k>0.0 )
	{
		k = sqrt(k);
		float hb = (aed - k)/eec;
		float ha = (aed + k)/eec;
		
		float ta = max( 0.0, ha );
		float tb = min( 1.0, hb );
		
		if( ta < tb )
		{
            ta = 0.5*(ta+tb);			
            t = -(A-E*ta) - sqrt( (A-E*ta)*(A-E*ta) - (B+C*ta*ta-2.0*D*ta) );
            nor = normalize( (ro+rd*t) - (sp.xyz+ta*ve ) );
            s = 2.0*(tb - ta);
		}
	}

	return vec2(t,s);
}

//
// Shade
//

vec3  lig = normalize( vec3(-0.6, 0.7, -0.5) );

vec3 shade( const in float d, in vec3 col, const in float shadow, const in vec3 nor, const in vec3 ref, const in vec3 sky) {
    float amb = max(0., 0.5+0.5*nor.y);
    float dif = max(0., dot( normalize(nor), lig ) );
    float spe = pow(clamp( dot(normalize(ref), lig ), 0.0, 1.0 ),16.0);

    dif *= shadow;

    vec3 lin = 1.20*dif*vec3(1.00,0.85,0.55);
    lin += 0.50*amb*vec3(0.50,0.70,1.00);
    col = col*lin;
    col += spe*dif;
    
    // fog
    col = mix( col, sky, smoothstep( MAXDISTANCE * .8, MAXDISTANCE, d ) );
    
	return col;
}

//
// Scene
//

void getSphereOffset( const in vec2 grid, inout vec2 center ) {
	center = (hash22( grid ) - vec2(0.5) )*(GRIDSIZESMALL);
}

void getMovingSpherePosition( const in vec2 grid, const in vec2 sphereOffset, inout vec4 center, inout vec3 speed ) {
	// falling?
	float s = 0.1+hash12( grid );
    
	float t = fract(14.*s + time/s*.3);	
	float y =  s * MAXHEIGHT * abs( 4.*t*(1.-t) );
    
    speed = vec3(0, s * MAXHEIGHT * ( 8.*t - 4. ), 0 ) * (1./FPS);
    
	vec2 offset = grid + sphereOffset;
	
	center = vec4(  offset.x + 0.5*GRIDSIZE, 1. + y, offset.y + 0.5*GRIDSIZE, 1. );
}

void getSpherePosition( const in vec2 grid, const in vec2 sphereOffset, inout vec4 center ) {
	vec2 offset = grid + sphereOffset;
	center = vec4( offset.x + 0.5*GRIDSIZE, 1., offset.y + 0.5*GRIDSIZE, 1. );
}

vec3 getSphereColor( vec2 grid ) {
	float m = hash12( grid.yx ) * 12.;
    return vec3(1.-m*0.08, m*0.03, m*0.06);
}

vec3 render(const in vec3 ro, const in vec3 rd, const in vec3 cameraSpeed, const in mat3 rot ) {
    vec3 nor, ref, speed;
    
	float dist = MAXDISTANCE;
	
	vec3 sky = clamp( vec3(1,1.5,2.5)*(1.0-0.8*rd.y), vec3(0.), vec3(1.));
	vec3 colBackground, sphereSpeed, col = vec3(0.);
    
    vec4 sphereCenter;    
	vec3 pos = floor(ro/GRIDSIZE)*GRIDSIZE;
	vec2 offset;
    
	if( intersectPlane( ro,  rd, 0., dist) ) {
        vec3 interSectionPoint = ro + rd * dist;
        
        
        // HMMMMM this is totaly fake. Hopefully I have enough time to find the analytic
        // solution to get a motion blurred checkerboard
        speed = rot * (interSectionPoint.xyz - ro) + cameraSpeed;   
        
        vec2 c1 = mod(interSectionPoint.xz * .25, vec2(2.));
		
        float w = (abs( fract(c1.x*abs(rd.x)) -.5 ) + abs( fract(c1.y*abs(rd.y)) -.5 ));        

        colBackground = mix(
            mod(floor(c1.x) + floor(c1.y), 2.) < 1. ? vec3( 0.4 ) : vec3( .6 ),
            vec3(.5), clamp( (w + .8) * .007 * length(speed.xz) * FPS , 0., 1.));
            
        // calculate shadow
        float shadow = 0.;
                
        vec3 shadowStartPos = interSectionPoint - lig;
        vec2 shadowGridPos = floor((ro + rd * dist).xz/GRIDSIZE);
        
        for( float x=-1.; x<=1.; x++) {
            for( float y=-1.; y<=1.; y++) {
                vec2 gridpos = (shadowGridPos+vec2(x,y))*GRIDSIZE;
                getSphereOffset( gridpos, offset );

                getMovingSpherePosition( gridpos, -offset, sphereCenter, sphereSpeed );

                vec2 res = iSphere( shadowStartPos, lig, sphereCenter, sphereSpeed + cameraSpeed, nor );
                if( res.x>0.0 )
                {            
                    shadow = clamp( shadow+mix(res.y,0., res.x/MAXSHADOWDISTANCE), 0., 1.);
                }

                getSpherePosition( gridpos, offset, sphereCenter );

                res = iSphere( shadowStartPos, lig, sphereCenter, cameraSpeed, nor );
                if( res.x>0.0 )
                {            
                    shadow = clamp( shadow+mix(res.y,0., res.x/MAXSHADOWDISTANCE), 0., 1.);
                }
            }
        }
                
        ref = reflect( rd, vec3( 0., 1., 0. ) );
        colBackground = shade( dist, colBackground, 1.-shadow, vec3( 0., 1., 0. ), ref, sky );            
	} else {
		colBackground = sky;
	}	
		
	// trace grid
	vec3 ri = 1.0/rd;
	vec3 rs = sign(rd) * GRIDSIZE;
	vec3 dis = (pos-ro + 0.5  * GRIDSIZE + rs*0.5) * ri;
	vec3 mm = vec3(0.0);
		
    float alpha = 1.;
    
	for( int i=0; i<RAYCASTSTEPS; i++ )	{  
        if( alpha < .01 ) break;
        
		getSphereOffset( pos.xz, offset );
		
		getMovingSpherePosition( pos.xz, -offset, sphereCenter, sphereSpeed );
		        
        speed = rot * (sphereCenter.xyz - ro) + sphereSpeed + cameraSpeed;
        vec2 res = iSphere( ro, rd, sphereCenter, speed, nor );
        if( res.x>0.0 )
        {            
       		ref = reflect( rd, nor );
            vec3  lcol = shade( res.x, getSphereColor(-offset), 1., nor, ref, sky);
            col += lcol * res.y * alpha;
            alpha *= (1.-res.y);
        }        
                
		getSpherePosition( pos.xz, offset, sphereCenter );
        
        speed = rot * (sphereCenter.xyz - ro) + cameraSpeed;        
		res = iSphere( ro, rd, sphereCenter, speed, nor );
        if( res.x>0.0 )
        {            
       		ref = reflect( rd, nor );
            vec3  lcol = shade( res.x, getSphereColor(-offset), 1., nor, ref, sky);
            col += lcol * res.y * alpha;
            alpha *= (1.-res.y);
        }
        
		mm = step(dis.xyz, dis.zyx);
		dis += mm * rs * ri;
		pos += mm * rs;		
	}	
    
    col += colBackground * alpha;
    
	return col;
}

void path( in float time, out vec3 ro, out vec3 ta ) {
	ro = vec3( 16.0*cos(0.2+0.5*.4*time*1.5) * SPEED, 5.6+3.*sin(time), 16.0*sin(0.1+0.5*0.11*time*1.5) * SPEED);
    time += 1.6;
	ta = vec3( 16.0*cos(0.2+0.5*.4*time*1.5) * SPEED, -.1 + 2.*sin(time), 16.0*sin(0.1+0.5*0.11*time*1.5) * SPEED);
}

mat3 setCamera(in float time, out vec3 ro )
{
    vec3 ta;
    
    path(time, ro, ta);
	float roll = -0.15*sin(.732*time);
    
	vec3 cw = normalize(ta-ro);
	vec3 cp = vec3(sin(roll), cos(roll), 0.);
	vec3 cu = normalize( cross(cw,cp) );
	vec3 cv = normalize( cross(cu,cw) );
    return mat3( cu, cv, cw );
}

void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
	vec2 q = fragCoord.xy/iResolution.xy;
	vec2 p = -1.0+2.0*q;
	p.x *= iResolution.x/iResolution.y;
	
	// camera	
	vec3 ro0, ro1, ta;
    
    mat3 ca0 = setCamera( time - 1./FPS, ro0 );
	vec3 rd0 = ca0 * normalize( vec3(p.xy,2.0) );

    mat3 ca1 = setCamera( time, ro1 );
	vec3 rd1 = ca1 * normalize( vec3(p.xy,2.0) );
	        
    mat3 rot = ca1 * mat3( ca0[0].x, ca0[1].x, ca0[2].x,
                           ca0[0].y, ca0[1].y, ca0[2].y,
                           ca0[0].z, ca0[1].z, ca0[2].z);
    
    rot -= mat3( 1,0,0, 0,1,0, 0,0,1);
    
	// raytrace	
	vec3 col = render(ro0, rd0, ro1-ro0, rot );
	
	col = pow( col, vec3(0.5) );
	
	fragColor = vec4( col,1.0);
}`,name:`Image`,description:``,type:`image`}]},{ver:`0.1`,info:{id:`Ms2fDh`,date:`1500332532`,viewed:1280,name:`[SH17A] Metaballs`,description:`3D metaballs in 280 chars.`,likes:14,published:`Public API`,usePreview:0,tags:[`metaballs`,`2t`,`sh17a`]},renderpass:[{inputs:[{id:`XdX3zn`,filepath:`/media/a/488bd40303a2e2b9a71987e48c66ef41f5e937174bf316d3ed0e86410784b919.jpg`,type:`cubemap`,channel:0,sampler:{filter:`mipmap`,wrap:`repeat`,vflip:`false`,srgb:`false`,internal:`byte`},published:1}],outputs:[{id:`4dfGRr`,channel:0}],code:`// [SH17A] Metaballs. Created by Reinder Nijhoff 2017
// Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License.
// @reindernijhoff
//
// https://www.shadertoy.com/view/Ms2fDh
//

void mainImage( out vec4 f, vec2 g ) {
	vec3 n=iResolution,r=vec3(g,1)/n-.5,p=n-n;
	p.z -= 4.;   
	for(int i=64;i-->0;){ 
		float s=1.,j=0.,b=p.y+2.,h; 
		for(;++j<7.;) 
            h=clamp(.5+.5*(b-s),0.,1.),
            s=mix(b,s,h)-h*(1.-h),
            b=length(p-1.3*sin(j*99.*n+iTime))-.4; 
		p+=r*s;
		}   
	f=texture(iChannel0,p)*2./dot(p,p);	
}`,name:`Image`,description:``,type:`image`}]},{ver:`0.1`,info:{id:`ldjBW1`,date:`1500332665`,viewed:3814,name:`[SH17A] Matrix rain`,description:`Matrix rain. View in full screen.`,likes:56,published:`Public API`,usePreview:0,tags:[`matrixrain`,`sh17a`]},renderpass:[{inputs:[],outputs:[{id:`4dfGRr`,channel:0}],code:`// [SH17A] Matrix rain. Created by Reinder Nijhoff 2017
// Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License.
// @reindernijhoff
//
// https://www.shadertoy.com/view/ldjBW1
//

#define R fract(1e2*sin(p.x*8.+p.y))
void mainImage(out vec4 o,vec2 u) {
    vec3 v=vec3(u,1)/iResolution-.5,
        s=.5/abs(v),
        i=ceil(8e2*(s.z=min(s.y,s.x))*(s.y<s.x?v.xzz:v.zyz)),
        j=fract(i*=.1),
        p=vec3(9,int(iTime*(9.+8.*sin(i-=j).x)),0)+i;
   o-=o,o.g=R/s.z;p*=j;o*=R>.5&&j.x<.6&&j.y<.8?1.:0.;
}`,name:`Image`,description:``,type:`image`}]},{ver:`0.1`,info:{id:`Xs2Bzy`,date:`1500968542`,viewed:2912,name:`[SH17B] Legend of the Gelatinous`,description:`Legend of the Gelatinous Cube

Collect all keys and escape the dungeons filled with gelatinous cubes.

- Arrow keys: move
- Space: fight & open doors.`,likes:31,published:`Public API`,usePreview:0,tags:[`game`,`raymarch`,`voxel`,`dungeon`,`crawler`]},renderpass:[{inputs:[{id:`4dXGRn`,filepath:`/media/a/10eb4fe0ac8a7dc348a2cc282ca5df1759ab8bf680117e4047728100969e7b43.jpg`,type:`texture`,channel:2,sampler:{filter:`nearest`,wrap:`repeat`,vflip:`true`,srgb:`false`,internal:`byte`},published:1},{id:`Xsf3Rr`,filepath:`/media/a/79520a3d3a0f4d3caa440802ef4362e99d54e12b1392973e4ea321840970a88a.jpg`,type:`texture`,channel:1,sampler:{filter:`nearest`,wrap:`repeat`,vflip:`true`,srgb:`false`,internal:`byte`},published:1},{id:`4dXGR8`,filepath:`/media/previz/buffer00.png`,type:`buffer`,channel:0,sampler:{filter:`linear`,wrap:`clamp`,vflip:`true`,srgb:`false`,internal:`byte`},published:1},{id:`XsXGR8`,filepath:`/media/previz/buffer01.png`,type:`buffer`,channel:3,sampler:{filter:`linear`,wrap:`clamp`,vflip:`true`,srgb:`false`,internal:`byte`},published:1}],outputs:[{id:`4dfGRr`,channel:0}],code:`// Legend of the Gelatinous Cube. Created by Reinder Nijhoff 2017
// Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License.
// @reindernijhoff
// 
// https://www.shadertoy.com/view/Xs2Bzy
//
// I created this shader in one long night for the Shadertoy Competition 2017
// 

// RENDER THE DUNGEON AND ADD UI FROM BUFFER B

#define MAXSTEPS 8
const int MOVESTEPS = 60;
const int USERMOVESTEPS = 30;
const int USERROTATESTEPS = 30;
const int DOORMOVESTEPS = 30;
const int MAXSWORD = 30;
const int REDFLASHSTEPS = 15;

const int NONE = 0;
const int FORWARD = 1;
const int BACK = 2;
const int ROT_LEFT = 3;
const int ROT_RIGHT = 4;
const int ACTION = 5;

vec3 USERRD = vec3(0);

const ivec2 DIRECTION[] = ivec2[] (
    ivec2(0,1),
    ivec2(1,0),
    ivec2(0,-1),
    ivec2(-1,0)
);

#define HASHSCALE1 .1031
float hash12(vec2 p)
{
	vec3 p3  = fract(vec3(p.xyx) * HASHSCALE1);
    p3 += dot(p3, p3.yzx + 19.19);
    return fract((p3.x + p3.y) * p3.z);
}
float hash13(vec3 p3)
{
	p3  = fract(p3 * HASHSCALE1);
    p3 += dot(p3, p3.yzx + 19.19);
    return fract((p3.x + p3.y) * p3.z);
}

vec3 rotate(vec3 r, float v){ return vec3(r.x*cos(v)+r.z*sin(v),r.y,r.z*cos(v)-r.x*sin(v));}

vec2 boxIntersection(vec3 ro, vec3 rd, vec3 boxSize, out vec3 outNormal) {

    vec3 m = 1.0/rd;
    vec3 n = m*ro;
    vec3 k = abs(m)*boxSize;
	
    vec3 t1 = -n - k;
    vec3 t2 = -n + k;

    vec2 time = vec2( max( max( t1.x, t1.y ), t1.z ),
                 min( min( t2.x, t2.y ), t2.z ) );
	
    if( !(time.y>time.x && time.y>0.0) ) return vec2(-1);
    
    outNormal = -sign(rd)*step(t1.yzx,t1.xyz)*step(t1.zxy,t1.xyz);
    return time;
}

ivec4 m(ivec2 uv) {
    return ivec4(texelFetch(iChannel0, uv + ivec2(32,0), 0));
}

ivec4 w(ivec2 uv) {
    return ivec4( texelFetch(iChannel0, uv, 0) );
}


//----------------------------------------------------------------------
// Material helper functions

#define COL(r,g,b) vec3(r/255.,g/255.,b/255.)

float onLine( const float c, const float b ) {
	return clamp( 1.-abs(b-c), 0., 1. );
}
float onBand( const float c, const float mi, const float ma ) {
	return clamp( (ma-c+1.), 0., 1. )*clamp( (c-mi+1.), 0., 1. );
}
float onRect( const vec2 c, const vec2 lt, const vec2 rb ) {
	return onBand( c.x, lt.x, rb.x )*onBand( c.y, lt.y, rb.y );
}
vec3 addBevel( const vec2 c, const vec2 lt, const vec2 rb, const float size, const float strength, const float lil, const float lit, const vec3 col ) {
	float xl = clamp( (c.x-lt.x)/size, 0., 1. ); 
	float xr = clamp( (rb.x-c.x)/size, 0., 1. );	
	float yt = clamp( (c.y-lt.y)/size, 0., 1. ); 
	float yb = clamp( (rb.y-c.y)/size, 0., 1. );	

	return mix( col, col*clamp(1.0+strength*(lil*(xl-xr)+lit*(yb-yt)), 0., 2.), onRect( c, lt, rb ) );
}
float stepeq( float a, float b ) { 
	return step( a, b )*step( b, a );
}
//----------------------------------------------------------------------
// Generate materials!

void decorateWall(in vec2 uv, const float decorationHash, inout vec3 col ) {	
	vec3 fgcol;
	
	uv = floor( mod(uv+64., vec2(64.)) );
	vec2 uvs = uv / 64.;
	
	// basecolor
	vec3 basecol = col;	
	float br = hash12(uv);

	
// prison door	
	if( decorationHash > 0.95 ) {	
		vec4 prisoncoords = vec4(12.,14.,52.,62.);
	// shadow
		col *= 1.-0.5*onRect( uv,  vec2( 11., 13. ), vec2( 53., 63. ) );
	// hinge
		col = mix( col, COL(72.,72.,72.), stepeq(uv.x, 53.)*step( mod(uv.y+2.,25.), 5.)*step(13.,uv.y) );
		col = mix( col, COL(100.,100.,100.), stepeq(uv.x, 53.)*step( mod(uv.y+1.,25.), 3.)*step(13.,uv.y) );
		
		vec3 pcol = vec3(0.)+COL(100.,100.,100.)*step( mod(uv.x-4., 7.), 0. ); 
		pcol += COL(55.,55.,55.)*step( mod(uv.x-5., 7.), 0. ); 
		pcol = addBevel(uv, vec2(0.,17.), vec2(63.,70.), 3., 0.8, 0., -1., pcol);
		pcol = addBevel(uv, vec2(0.,45.), vec2(22.,70.), 3., 0.8, 0., -1., pcol);
		
		fgcol = COL(72.,72.,72.);
		fgcol = addBevel(uv, prisoncoords.xy, prisoncoords.zw+vec2(1.,1.), 1., 0.5, -1., 1., fgcol );
		fgcol = addBevel(uv, prisoncoords.xy+vec2(3.,3.), prisoncoords.zw-vec2(2.,1.), 1., 0.5, 1., -1., fgcol );
		fgcol = mix( fgcol, pcol, onRect( uv, prisoncoords.xy+vec2(3.,3.), prisoncoords.zw-vec2(3.,2.) ) );
		fgcol = mix( fgcol, COL(72.,72.,72.), onRect( uv, vec2(15.,32.5), vec2(21.,44.) ) );
		
		fgcol = mix( fgcol, mix( COL(0.,0.,0.), COL(43.,43.,43.), (uv.y-37.) ), stepeq(uv.x, 15.)*step(37.,uv.y)*step(uv.y,38.) );
		fgcol = mix( fgcol, mix( COL(0.,0.,0.), COL(43.,43.,43.), (uv.y-37.)/3. ), stepeq(uv.x, 17.)*step(37.,uv.y)*step(uv.y,40.) );
		fgcol = mix( fgcol, COL(43.,43.,43.), stepeq(uv.x, 18.)*step(37.,uv.y)*step(uv.y,41.) );
		fgcol = mix( fgcol, mix( COL(0.,0.,0.), COL(100.,100.,100.), (uv.y-37.)/3. ), stepeq(uv.x, 18.)*step(36.,uv.y)*step(uv.y,40.) );
		fgcol = mix( fgcol, COL(43.,43.,43.), stepeq(uv.x, 19.)*step(37.,uv.y)*step(uv.y,40.) );

		fgcol = mix( fgcol, mix( COL(84.,84.,84.), COL(108.,108.,108.), (uv.x-15.)/2. ), stepeq(uv.y, 32.)*step(15.,uv.x)*step(uv.x,17.) );
		fgcol = mix( fgcol, COL(81.,81.,81.), stepeq(uv.y, 32.)*step(20.,uv.x)*step(uv.x,21.) );

		col = mix( col, fgcol, onRect( uv, prisoncoords.xy, prisoncoords.zw ) );
	}	
// fake 8-bit color palette and dithering	
	col = floor( (col+0.5*mod(uv.x+uv.y,2.)/32.)*32.)/32.;
}

// store functions

ivec4 LoadVec4( in ivec2 vAddr ) {
    return ivec4( texelFetch( iChannel0, vAddr, 0 ) );
}

bool AtAddress( ivec2 p, ivec2 c ) { return all( equal( floor(vec2(p)), vec2(c) ) ); }

void StoreVec4( in ivec2 vAddr, in ivec4 vValue, inout vec4 fragColor, in ivec2 fragCoord ) {
    fragColor = AtAddress( fragCoord, vAddr ) ? vec4(vValue) : fragColor;
}

// map

vec4 debugMap( in vec2 fragCoord ) {
    ivec4 ud1 = LoadVec4( ivec2(0,32 ) );
   	ivec2 uv = ivec2(fragCoord.xy * .1);
    vec4 col = vec4(1);
    if( uv.x < 32 && uv.y < 32 ) {
        vec4 wall = texelFetch(iChannel0, uv, 0);
        vec4 monster = texelFetch(iChannel0, uv+ivec2(32,0),0);
        
        if( wall.x > 0. ) col.rgb = vec3(0,0,0);
        if( wall.x > 1. ) col.rgb = vec3(0,1,0);
        if( wall.x > 2. ) col.rgb = vec3(0,0,1);
        if( wall.x > 5. ) col.rgb = vec3(0,1,1);
        if( monster.x > 0. ) col.rgb = vec3( monster.y<0.?1.:.5,0,0);
    }
    if( uv.x == ud1.x && uv.y == ud1.y ) col = vec4(1,0,1,1);
    return col;
}

// draw level

vec4 drawSword( vec2 uv, int level ) {
    uv = floor(fract(uv)*64.) - 32.;
    if( abs(uv.x) < 16. && abs(uv.y) < 16. ) {
        float l = step(abs(uv.y), .5); 
        l = max(l, step(abs(uv.y), 1.5) * step(uv.x, 13.));   
        l = max(l, step(abs(uv.y), 5.5) * step(abs(uv.x+9.), 1.));
                        
	    vec3 col = mix( vec3(.8), vec3(.5,.3,.2), step(uv.x, -11.));
        vec3 scol = mix( vec3(.5,.3,.2), vec3(1.), clamp(float(level) / float(MAXSWORD/2), 0., 1.) );
        scol = mix( scol, vec3(0.,.9, 1.), clamp(float(level-MAXSWORD/2) / float(MAXSWORD/2), 0., 1.) );
        col = mix( scol, col, step(uv.x, -8.));        
        
        return vec4( 2. * l * (.5 + .5 * texture(iChannel1, uv/64.).x) * col, l );
    } else {
        return vec4(0);
    }
}

vec4 drawKey( vec2 uv, int color ) {
    uv = floor(fract(uv)*64.) - 32.;
    if( abs(uv.x) < 16. && abs(uv.y) < 16. ) {
        float l = step(abs(uv.y), 1.);
        l = max(l, step(length(uv+vec2(8,0)), 7.5));
        l -= step(length(uv+vec2(8,0)), 4.5);
        l = max(l, step(6.,uv.x)*step(uv.x, 7.)*step(0.,uv.y)*step(abs(uv.y), 5.));
        l = max(l, step(10.,uv.x)*step(uv.x, 11.)*step(0.,uv.y)*step(abs(uv.y), 7.));
        l = max(l, step(14.,uv.x)*step(0.,uv.y)*step(abs(uv.y), 6.));
        
	    vec3 col = vec3(0);
    	col[color-7] = 1.;
        return vec4( 2. * l * (.5 + .5 * texture(iChannel1, uv/64.).x) * col, l );
    } else {
        return vec4(0);
    }
}

vec4 drawLock( vec2 uv, int color ) {
    uv = floor(fract(uv)*64.) - 32.;
    if( abs(uv.x) < 6. && abs(uv.y) < 8. ) {
        float l = 1.;
        l -= smoothstep( 3., 2., length(uv+vec2(0,2.5)));
        l = min( l, 1.-step(abs(uv.x),.5)*step(abs(uv.y), 5.));
	    vec3 col = vec3(0);
    	col[color-3] = 1.;
        return vec4( l * (.5 + .5 * texture(iChannel1, uv/64.).x) * col, 1 );
    } else {
        return vec4(0);
    }
}

vec4 drawHealth( vec2 uv ) {
    uv = floor(fract(uv)*64.) - 32.;
    if( abs(uv.x) < 12. && abs(uv.y) < 12. ) {
        vec4 col = vec4( 1,1,1, smoothstep( 10., 9., length(uv)) );
        col.rgb = mix( col.rgb, vec3(1,0,0), step(abs(uv.y), 1.)*step(abs(uv.x),7.) );
        col.rgb = mix( col.rgb, vec3(1,0,0), step(abs(uv.y), 7.)*step(abs(uv.x),1.) );
        return vec4( 2.*col.rgb * (.5 + .5 * texture(iChannel1, uv/64.).x), col.a );
    } else {
        return vec4(0);
    }
}


vec3 getLight( vec3 pos, float d, vec3 nor ) {
    return vec3(0.,0.05, 0.2) * smoothstep(0., 6., d) * smoothstep(6., 5.5, d) + // fog
        (0.5 + 0.4*dot(nor, -USERRD)) 
        * (1. + .025*sin(iTime * 20. + cos(iTime*10.))) * vec3(1., .9, .6) * clamp(7./(d*d)-.1, 0., 1.);
}

void getCeilingColor( const vec3 ro, const vec3 rd, inout vec3 col ) {
	float d = -(ro.y-1.)/rd.y;
	vec3 pos = ro + rd * d;
    col = texture(iChannel1, floor(pos.xz*64.)/64.,0.).rgb * vec3(.5, .4, .3);
    col *= getLight(pos, d, vec3(0,-1,0)) * .8;
}

void getFloorColor( const vec3 ro, const vec3 rd, inout vec3 col ) {
	float d = -(ro.y)/rd.y;
	vec3 pos = ro + rd * d;
    col = texture(iChannel1, floor(pos.xz*64.)/64.,0.).rgb * vec3(.5, .4, .3) * 1.2;
    
    ivec4 map = w(ivec2(pos.xz));
    if( map.x > 8 ) {
        vec4 s = drawHealth(pos.xz);
        col = mix(col, s.rgb, s.a);
    } else if( map.x > 6 ) { // key
        vec4 s = drawKey( pos.xz, map.x );
        col = mix( col, s.rgb, s.a);
    } else if( map.x > 5 ) {
        vec4 s = drawSword( pos.xz, map.z );
        col = mix( col, s.rgb, s.a);
    }
    
    col *= getLight(pos, d, vec3(0,1,0));
}

bool getMapColorForPosition( 
    const vec3 ro, const vec3 rd, const vec3 vos, 
    const vec3 pos, const vec3 nor, const float t, in ivec4 map, inout vec3 col ) {
    
    if( map.x > 1) {
        if( map.x < 6 ) {
        // a door is hit
            float h = .95*min(float(map.w),float(DOORMOVESTEPS))/float(DOORMOVESTEPS);
            vec3 mpos = vec3( vos.x+.5, .5+h, vos.z+.5);
            vec3 nn;
            vec3 dim = map.y == 1 ? vec3(.025, .5, .5) : vec3(.5, .5, .025 );
            vec2 intersect = boxIntersection(ro - mpos, rd, dim, nn);
            vec3 p = ro + rd * intersect.x;

            if( intersect.x > 0. && p.y < 1.) {
                vec2 i = map.y == 1 ? p.yz : p.yx; 
                i.x -= h;
                vec2 uv = floor(i*64.);
                col = (.2+.5*texture(iChannel1,uv/64.,0.).rgb) * vec3(1.,.6, .4);
                col.rgb *= .5 + .5*step( 1., mod(uv.y, 8.) );
                if( map.x > 2) {
                	vec4 s = drawLock( -i.yx, map.x );
                	col = mix( col, s.rgb, s.a);
                }
                col *= getLight(p, intersect.x, nn);         
                return true;
            }
        }
        return false;
    } else {    
 		if( pos.y <= 1. && pos.y >= 0. ) {
	    // a wall is hit
        	vec2 mpos = vec2( dot(vec3(-nor.z,0.0,nor.x),pos), -pos.y );
            vec2 uv = floor(mpos*64.);
        	col = texture(iChannel2, uv/64.,0.).rgb * .7;  
            decorateWall( uv, hash12(vos.xz), col.rgb );        
        	col *= getLight(vos, t, vec3(nor.x,0,nor.z));
        	return true;
    	}
    }
    return false;
}

bool getMonsterColorForPosition( 
    const vec3 ro, const vec3 rd, const vec3 vos, 
    const vec3 pos, const vec3 nor, const float t, inout vec3 col,
	ivec4 monster ) {
    
    vec3 mpos = vec3( vos.x+.5, .5, vos.z+.5);
    if( monster.y != 0 ) {
	    mpos.xz += float(monster.y)/float(MOVESTEPS) * vec2(DIRECTION[monster.z-1]);
    }
    
    vec3 nn;
    vec3 roo = ro-mpos+ sin(rd*1e2+5.*iTime)*.0025;
    vec3 rdd = rd + sin(rd*70.+iTime)*.01;
    
    float size = .2 + .025*smoothstep( 0., 30., float(monster.w));
    
    vec2 intersect = boxIntersection(roo, rdd, vec3(size), nn);
    if( intersect.x > 0.) {
       col = mix( vec3(.5,0,0), vec3(0,1,0), float(monster.w)/30.);
       col.b = .5+.5*sin(iTime);
       vec3 i = intersect.x*rd+ro-mpos;
       vec2 texUV;
       if( abs(nn.x) > .5 ) {
           texUV = i.yz;
       } else {
           texUV = i.xy;           
       }
       texUV += vec2(sin(iTime*5.+20.*texUV.y),cos(iTime*4.+20.*texUV.x))*.01;
       col *= .5 +.5*texture(iChannel1, floor(texUV*64.)/64.,0.).x;
        float hl = hash13( floor(vec3(texUV*64.,iTime+hash12(floor(texUV*64.)))));
       col += .2 * hl * hl * hl;
       col = mix( col, normalize(i)*.5+.5, .25);
       col *= getLight(intersect.x*rd+ro, intersect.x, nn) *(.5 + smoothstep(4., 1., intersect.x) * .1/dot(i,i));
       return true;
    }
    
    return false;
}

bool castRay( const vec3 ro, const vec3 rd, inout vec3 col ) {
	vec3 pos = floor(ro);
	vec3 ri = 1.0/rd;
	vec3 rs = sign(rd);
	vec3 dis = (pos-ro + 0.5 + rs*0.5) * ri;
	
	float res = 0.0;
	vec3 mm = vec3(0.0);
	bool hit = false;
	
	for( int i=0; i<MAXSTEPS; i++ )	{
		mm = step(dis.xyz, dis.zyx);
		dis += mm * rs * ri;
        pos += mm * rs;		
        
		vec3 mini = (pos-ro + 0.5 - 0.5*vec3(rs))*ri;
		float t = max ( mini.x, mini.z );	
        
        ivec4 map = w(ivec2(pos.xz));
        
        
        vec3 h = ro + rd*t;     
        if( h.y > 1. || h.y < 0. ) {
            if( rd.y < 0. ) {
                getFloorColor(ro, rd, col);
            } else {
                getCeilingColor(ro, rd, col);
            }
            return true;
        }
        
		if( map.x > 0 ) { 		
			hit = getMapColorForPosition( ro, rd, pos, ro+rd*t, -mm*sign(rd), t, map, col );
        }
        ivec4 monster = m(ivec2(pos.xz));
        if( monster.x > 0 && !hit) { 		
			hit = getMonsterColorForPosition( ro, rd, pos, ro+rd*t, -mm*sign(rd), t, 
                                                  col, monster );
        }
        if( hit ) return true;
	}
	return hit;
}

vec4 render(in vec2 fragCoord) {
    float time = iTime;
    vec2 q = fragCoord.xy / iResolution.xy;
    vec2 p = -1.0 + 2.0*q;
    p.x *= iResolution.x/ iResolution.y;
	
	vec3 ro = vec3( mod(iTime, 31.) + 1.,.5, mod(iTime*1.1, 31.) + 1. );
    
    ivec4 ud1 = LoadVec4( ivec2(0,32 ) );
    ivec4 ud2 = LoadVec4( ivec2(1,32 ) );
    
    vec2 USERCOORD = vec2(ud1.xy);
    int USERDIR = ud1.z;
    int actionCount = ud1.w;
    int action = ud2.x;
 
    vec3 dir = vec3(DIRECTION[USERDIR].x, 0, DIRECTION[USERDIR].y);
    
    ro = vec3(USERCOORD.x + .5, .5, USERCOORD.y + .5 );
    float angle = 0.;
    
    if( action == FORWARD ) {
        float progress = float(actionCount)/float(USERMOVESTEPS);
        ro -= dir * progress;
    }
	if( action == BACK ) {
        float progress = float(actionCount)/float(USERMOVESTEPS);
        ro += dir * progress;
    }
    if( action == ROT_RIGHT ) {
        float progress = float(actionCount)/float(USERROTATESTEPS);
        angle = -progress * 1.57079632679;
    }
    if( action == ROT_LEFT ) {
        float progress = float(actionCount)/float(USERROTATESTEPS);
        angle = progress * 1.57079632679;
    }
    
    
    vec3 rd = rotate( dir, angle );
    USERRD = rd;
    rd.y -= 0.025;
    vec3 uu = normalize(cross( vec3(0.,1.,0.), rd ));
    vec3 vv = normalize(cross(rd,uu));
    rd = normalize( p.x*uu + p.y*vv + 2.25*rd );
    
	vec3 col = vec3(0.);
    castRay( ro, rd, col );
    return vec4(col,1);
}

void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
    vec4 col = debugMap( fragCoord );
    col = render( fragCoord );
   // col = mix( col, debugMap( fragCoord ), .5);
    
    int flash = ivec4( texelFetch( iChannel3, ivec2(0), 0 ) ).y;
    
    col.rgb = mix( col.rgb, vec3(1,0,0), float(flash) / 120. );
    
    vec4 ui = texture(iChannel3, fragCoord/iResolution.xy);    
    col = mix( col, ui, min(1.,ui.a) );
    
	fragColor = col;
}`,name:`Image`,description:``,type:`image`},{inputs:[{id:`Xsf3zn`,filepath:`/media/a/f735bee5b64ef98879dc618b016ecf7939a5756040c2cde21ccb15e69a6e1cfb.png`,type:`texture`,channel:1,sampler:{filter:`mipmap`,wrap:`repeat`,vflip:`true`,srgb:`false`,internal:`byte`},published:1},{id:`4dXGRr`,filepath:`/presets/tex00.jpg`,type:`keyboard`,channel:2,sampler:{filter:`linear`,wrap:`clamp`,vflip:`true`,srgb:`false`,internal:`byte`},published:1},{id:`4dXGR8`,filepath:`/media/previz/buffer00.png`,type:`buffer`,channel:0,sampler:{filter:`linear`,wrap:`clamp`,vflip:`true`,srgb:`false`,internal:`byte`},published:1}],outputs:[{id:`4dXGR8`,channel:0}],code:`// Legend of the Gelatinous Cube. Created by Reinder Nijhoff 2017
// @reindernijhoff
// 
// https://www.shadertoy.com/view/Xs2Bzy
//
// I created this shader in one long night for the Shadertoy Competition 2017
// 

// GAME LOGIC

const int MOVESTEPS = 60;
const int USERMOVESTEPS = 30;
const int USERROTATESTEPS = 30;
const int USERACTIONSTEPS = 30;
const int DOORMOVESTEPS = 30;
const int DOOROPENSTEPS = 300;
const int MAXSWORD = 30;

const ivec2 DIRECTION[] = ivec2[] (
    ivec2(0,1),
    ivec2(1,0),
    ivec2(0,-1),
    ivec2(-1,0)
);

ivec2 USERCOORD = ivec2(0);
ivec2 USERACTIONCOORD = ivec2(0);
int USERDIR = 0;
int USERACTION = 0;
int USERACTIONCOUNT = 0;
ivec4 USERINV = ivec4(0);

const int NONE = 0;
const int FORWARD = 1;
const int BACK = 2;
const int ROT_LEFT = 3;
const int ROT_RIGHT = 4;
const int ACTION = 5;


#define HASHSCALE1 .1031
float hash12(vec2 p)
{
	vec3 p3  = fract(vec3(p.xyx) * HASHSCALE1);
    p3 += dot(p3, p3.yzx + 19.19);
    return fract((p3.x + p3.y) * p3.z);
}

// store functions


ivec4 LoadVec4( in ivec2 vAddr ) {
    return ivec4( texelFetch( iChannel0, vAddr, 0 ) );
}

bool AtAddress( ivec2 p, ivec2 c ) { return all( equal( floor(vec2(p)), vec2(c) ) ); }

void StoreVec4( in ivec2 vAddr, in ivec4 vValue, inout vec4 fragColor, in ivec2 fragCoord ) {
    fragColor = AtAddress( fragCoord, vAddr ) ? vec4(vValue) : fragColor;
}

void StoreIVec4( in ivec2 vAddr, in ivec4 vValue, inout ivec4 fragColor, in ivec2 fragCoord ) {
    fragColor = AtAddress( fragCoord, vAddr ) ? ivec4(vValue) : fragColor;
}

// key functions

// Keyboard constants definition
const int KEY_SPACE = 32;
const int KEY_LEFT  = 37;
const int KEY_UP    = 38;
const int KEY_RIGHT = 39;
const int KEY_DOWN  = 40;
const int KEY_A     = 65;
const int KEY_D     = 68;
const int KEY_S     = 83;
const int KEY_W     = 87;


bool KP(int key) {
	return texelFetch( iChannel2, ivec2(key, 0), 0 ).x > 0.0;
}

bool KT(int key) {
	return texelFetch( iChannel2, ivec2(key, 2), 0 ).x > 0.0;
}


// map functions

ivec4 createStatic(int level, ivec2 coord) {
    ivec4 data = ivec4(0);
    if( coord.x < 32 ) { // static data
        // create walls
  		int wall = 1-int(step(texelFetch(iChannel1, coord, 0).x,.575));
    	if( coord.x % 31 == 0 || coord.y % 31 == 0) wall = 1;
        data = ivec4(wall,0,0,0);

        if( wall == 0 ) {
            float hash = hash12( vec2(coord*9) );
            // swords
            if( hash > .96) {
                data = ivec4( 6, 0, 1 + 
                       int( max(0., .35*( hash12( vec2(coord.yx) ) * 32. + float(coord.x) + float(coord.y)) )), 0 );
            }
            if( hash < .05 ) {
                data = ivec4(10, 0, 8 + (coord.x+coord.y)/10, 0);
            }
        }

        
        // doors
        StoreIVec4( ivec2( 2, 9), ivec4(2,2,0,0), data, coord);
        StoreIVec4( ivec2( 8,16), ivec4(2,2,0,0), data, coord);
        StoreIVec4( ivec2( 9, 8), ivec4(2,2,0,0), data, coord);
        StoreIVec4( ivec2(24, 9), ivec4(2,2,0,0), data, coord);
        StoreIVec4( ivec2(17,15), ivec4(2,2,0,0), data, coord);
        StoreIVec4( ivec2(24,13), ivec4(2,2,0,0), data, coord);
        StoreIVec4( ivec2(14, 3), ivec4(2,2,0,0), data, coord);
        
        StoreIVec4( ivec2(10, 5), ivec4(2,1,0,0), data, coord);
        StoreIVec4( ivec2( 3,13), ivec4(2,1,0,0), data, coord);        
        
        
        StoreIVec4( ivec2( 3,21), ivec4(3,2,0,0), data, coord); // red door
        StoreIVec4( ivec2(17,18), ivec4(4,2,0,0), data, coord); // blue door
        StoreIVec4( ivec2(20,24), ivec4(5,1,0,0), data, coord);
        
        // data
        
        StoreIVec4( ivec2( 2, 2), ivec4(6,0,5,0), data, coord); // sword
        
        StoreIVec4( ivec2( 6,11), ivec4(7,0,1,0), data, coord); // red key
        StoreIVec4( ivec2( 2,26), ivec4(8,0,1,0), data, coord); // blue key
        StoreIVec4( ivec2(29,16), ivec4(9,0,1,0), data, coord); // blue key 
    }
    return data;
}

ivec4 createMonsters(int level, ivec2 coord ) {
    ivec4 data = ivec4(0);
    if (coord.x < 64 ) { // monsters
        coord -= ivec2(32,0);
        
        if( createStatic( level, coord ).x < 1 &&
			hash12( vec2(coord) ) > (1. - float(coord.x) * .005 - float(coord.y) * .005) ) {
            data.x = 1;
            data.w = 5 + (coord.x+coord.y)/2;
        }
    }
    
    return data;
}

ivec4 createMap(int level, ivec2 coord) {
    if( coord.x < 32 ) {
    	return createStatic(0, coord);
    } else {
    	return createMonsters(0, coord);
    }
}

ivec4 m(ivec2 uv) {
    return ivec4(texelFetch(iChannel0, uv + ivec2(32,0), 0));
}

ivec4 w(ivec2 uv) {
    return ivec4( texelFetch(iChannel0, uv, 0) );
}

bool isMonster(ivec4 data) {
    return data.x > 0;
}

bool monsterIsMoving(ivec4 data) {
    return abs(data.y) > 0;
}

bool isEmpty(ivec2 coord) {
    // return true;
    ivec4 wall = w(coord);
    ivec4 monster = m(coord);
    
    return !isMonster(monster) &&
        (wall.x < 1 ||  // no wall or
        (wall.x > 1 && wall.z == 1) || // open door
        wall.x > 5) // swords and keys
        && !(coord.x == USERCOORD.x && coord.y == USERCOORD.y);
}

ivec4 updateMap(int level, ivec2 coord) {
    ivec4 data = w(coord);
    if (coord.y > 32 || coord.x > 64 ) return data;
    
    
    ivec4 ud1 = LoadVec4( ivec2(0,32 ) );
    ivec4 ud2 = LoadVec4( ivec2(1,32 ) );
    USERINV = LoadVec4( ivec2(2,32 ) );
        
    USERCOORD = ud1.xy;
    USERDIR = ud1.z;
	USERACTIONCOUNT = ud1.w;
    
    USERACTIONCOORD = USERCOORD + DIRECTION[USERDIR];
	USERACTION = ud2.x;
        
    int SWORD = USERINV[0];
    
    bool tryaction = USERACTIONCOUNT == USERACTIONSTEPS &&
                  USERACTION == ACTION;
    
    if (coord.x < 32 ) { // static data
        bool action = tryaction &&
                      coord.x == USERACTIONCOORD.x && coord.y == USERACTIONCOORD.y;
        
        if( data.x == 1 ) {
            // wall
        } else if( data.x > 1 && data.x < 6 ) { // door
            if( action ) {
                // try to open door
                if( data.x == 2 || USERINV[data.x-2] > 0) {                
                	data.z = 1;
               	 	data.w == 0;
                }
            }
            if( data.z > 0 ) {
                data.w ++;
                if( data.w > DOOROPENSTEPS ) {
                    // try to close the door
                    if( isEmpty(coord) ) {
                        data.z = 0;
                        data.w = DOORMOVESTEPS;
                    }
                }
            } else {
                data.w = max(data.w-1, 0);
            }
        } else if( data.x > 5 && coord.x == USERCOORD.x && coord.y == USERCOORD.y) { // item - pick up
            data = ivec4(0);
        }
    } else { // monsters
        coord -= ivec2(32,0);
        bool action = tryaction &&
                      coord.x == USERACTIONCOORD.x && coord.y == USERACTIONCOORD.y;
        
        if( isMonster(data) ) { // monster, move if possible
            if( action ) {
                data.w -= int(hash12( vec2(iTime) ) * float(SWORD) + 1.);
                if( data.w < 0 ) {
                    data = ivec4(0);
                }
            } if( monsterIsMoving(data) ) {
                if( data.y > 1 ) {
                    ivec4 check = m(coord + DIRECTION[data.z-1]);
                    if( check.z == data.z ) {
                        data.y ++;
                        if( data.y > MOVESTEPS ) {
                            data = ivec4(0);
                        }
                    } else {
                        data.y = 0;
                        data.z = 0;
                    }
                } else {
                   data.y ++;
                }
            } else if( abs(coord.x-USERCOORD.x)+abs(coord.y-USERCOORD.y) == 1 ) {
                // attack!
            } else {
                // try to move - multiple times
                float userDistance = distance( vec2(coord), vec2(USERCOORD));
                for(int i=0; i<4; i++) {
                    int d = int(hash12(vec2(coord) + iTime + float(i)) * 4.);
                    ivec2 dir = DIRECTION[d];
                    if( isEmpty( coord + dir ) ) {
                        data.z = d + 1;
                        data.y = 1;
                        
                        if( userDistance < 5. &&
                            distance( vec2(coord+dir),vec2(USERCOORD)) < userDistance ) {
                            i=100;
                        }
                    }
                }
            }
        } else { // check if a monster moves to this spot
            for(int i=0; i<4; i++) {
                ivec4 check = m( coord - DIRECTION[i] );
                if(check.z == i + 1 && check.y > 0) {
                    data.x = check.x;
                    data.y = -MOVESTEPS;
                    data.z = check.z;
                    data.w = check.w;
                }
            }
        }
    }
    
    return data;
}

// game logic

void gameSetup( int level, inout vec4 fragColor, in ivec2 coord ) {
    StoreVec4( ivec2(0,32 ), ivec4(4,1,3,0), fragColor, coord );
    StoreVec4( ivec2(1,32 ), ivec4(0,0,60,0), fragColor, coord );
    StoreVec4( ivec2(2,32 ), ivec4(0,0,0,0), fragColor, coord );
    StoreVec4( ivec2(3,32 ), ivec4(0), fragColor, coord );
}

void gameLoop( inout vec4 fragColor, in ivec2 coord ) {
    if( coord.y > 33 || coord.y < 32 ) return;
    if( coord.x > 16 ) return;
    
    ivec4 ud1 = LoadVec4( ivec2(0,32 ) );
    ivec4 ud2 = LoadVec4( ivec2(1,32 ) );
    ivec4 ud3 = LoadVec4( ivec2(2,32 ) );
    
    USERCOORD = ud1.xy;
    USERDIR = ud1.z;
    int actionCount = ud1.w;
    
    int action = ud2.x;
    int newAction = ud2.y;
    int live = ud2.z;
    
    USERINV = ud3;
    
    if( actionCount > 0 ) {
        actionCount --;
    }
    
    if( KP(KEY_UP) || KP(KEY_W) ) {
        newAction = FORWARD;
    }
    if( KP(KEY_DOWN) || KP(KEY_S) ) {
        newAction = BACK;
    }
    if( KP(KEY_LEFT) || KP(KEY_A) ) {
        newAction = ROT_LEFT;
    }
    if( KP(KEY_RIGHT) || KP(KEY_D) ) {
        newAction = ROT_RIGHT;
    }
    if( KP(KEY_SPACE) ) {
        newAction = ACTION;
    }
    
    if( actionCount > 8 ) {
        newAction = NONE;
    }
    
    if( actionCount == 0 ) {
        action = newAction;
        newAction = NONE;
        
        if( action == FORWARD ) {
            if( isEmpty( USERCOORD + DIRECTION[USERDIR] ) ) {
                USERCOORD += DIRECTION[USERDIR];
                actionCount = USERMOVESTEPS;
            }
        }
        if( action == BACK ) {
            if( isEmpty( USERCOORD - DIRECTION[USERDIR] ) ) {
                USERCOORD -= DIRECTION[USERDIR];
                actionCount = USERMOVESTEPS;
            }
        }
        if( action == ROT_RIGHT ) {
            USERDIR = (USERDIR + 1) % 4;
            actionCount = USERROTATESTEPS;
        }
        if( action == ROT_LEFT ) {
            USERDIR = (USERDIR + 3) % 4;
            actionCount = USERROTATESTEPS;
        }
        if( action == ACTION ) {
            actionCount = USERACTIONSTEPS;
        }
    }
    
    // store data
    ud1.xy = USERCOORD;
    ud1.z = USERDIR;
    ud1.w = actionCount;
    
    ud2.x = action;
    ud2.y = newAction;
    
    ivec4 map = w(USERCOORD);
    if( map.x > 9 ) {
        live += map.z;
    	StoreVec4( ivec2(3,32 ), ivec4(map.x,map.z,0,0), fragColor, coord );
    } else if( map.x > 5 ) {
        // item
        USERINV[ map.x-6 ] = max( USERINV[ map.x-6], map.z );
    	StoreVec4( ivec2(3,32 ), ivec4(map.x,map.z,0,0), fragColor, coord );
    } else {
    	StoreVec4( ivec2(3,32 ), ivec4(0), fragColor, coord );
    }        
    
    
    if( live > 120 ) {
        live = 120;
    }
    
    for(int i=0; i<4; i++) {
        ivec2 c = USERCOORD + DIRECTION[i];
        ivec4 mo = m(c);
        if( isMonster(mo) && mo.y == 0 ) {
            if( hash12( vec2(c)+iTime ) > .993 - float(mo.w)*.0007 ) {
                live -= 2+int(hash12( vec2(c)-iTime ) * (float(mo.w) + 5.));
            }
        }
    }
    
    ud2.z = live;
    if( live < 0 ) {
        ud2.w = 1;
    	StoreVec4( ivec2(3,32 ), ivec4(-1), fragColor, coord );
    }
        
    StoreVec4( ivec2(0,32 ), ud1, fragColor, coord );
    StoreVec4( ivec2(1,32 ), ud2, fragColor, coord );
    StoreVec4( ivec2(2,32 ), USERINV, fragColor, coord );
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
	ivec2 uv = ivec2(fragCoord.xy);
    ivec4 ud2 = LoadVec4( ivec2(1,32 ) );
    
	int wall = 1-int(step(texelFetch(iChannel1, ivec2(2,1), 0).x,.575));
    
    if( ud2.w > 0 || wall != w(ivec2(2,1)).x ) {
    	fragColor = vec4(createMap(0, uv));
        gameSetup(0, fragColor, ivec2(fragCoord) );
    } else {
        fragColor = vec4(updateMap(0, uv));
        gameLoop( fragColor, ivec2(fragCoord) );
    }    
}`,name:`Buffer A`,description:``,type:`buffer`},{inputs:[{id:`Xsf3Rr`,filepath:`/media/a/79520a3d3a0f4d3caa440802ef4362e99d54e12b1392973e4ea321840970a88a.jpg`,type:`texture`,channel:1,sampler:{filter:`nearest`,wrap:`repeat`,vflip:`true`,srgb:`false`,internal:`byte`},published:1},{id:`4dXGzr`,filepath:`/media/a/08b42b43ae9d3c0605da11d0eac86618ea888e62cdd9518ee8b9097488b31560.png`,type:`texture`,channel:3,sampler:{filter:`mipmap`,wrap:`repeat`,vflip:`true`,srgb:`false`,internal:`byte`},published:1},{id:`4dXGR8`,filepath:`/media/previz/buffer00.png`,type:`buffer`,channel:0,sampler:{filter:`linear`,wrap:`clamp`,vflip:`true`,srgb:`false`,internal:`byte`},published:1},{id:`XsXGR8`,filepath:`/media/previz/buffer01.png`,type:`buffer`,channel:2,sampler:{filter:`linear`,wrap:`clamp`,vflip:`true`,srgb:`false`,internal:`byte`},published:1}],outputs:[{id:`XsXGR8`,channel:0}],code:`// Legend of the Gelatinous Cube. Created by Reinder Nijhoff 2017
// @reindernijhoff
// 
// https://www.shadertoy.com/view/Xs2Bzy
//
// I created this shader in one long night for the Shadertoy Competition 2017
// 

// UI CODE

const int USERACTIONSTEPS = 30;
const int MAXSWORD = 30;
const int REDFLASHSTEPS = 60;

const int NONE = 0;
const int FORWARD = 1;
const int BACK = 2;
const int ROT_LEFT = 3;
const int ROT_RIGHT = 4;
const int ACTION = 5;

ivec4 LoadVec4( in ivec2 vAddr ) {
    return ivec4( texelFetch( iChannel0, vAddr, 0 ) );
}

bool AtAddress( ivec2 p, ivec2 c ) { return all( equal( floor(vec2(p)), vec2(c) ) ); }

void StoreVec4( in ivec2 vAddr, in ivec4 vValue, inout vec4 fragColor, in ivec2 fragCoord ) {
    fragColor = AtAddress( fragCoord, vAddr ) ? vec4(vValue) : fragColor;
}

void StoreIVec4( in ivec2 vAddr, in ivec4 vValue, inout ivec4 fragColor, in ivec2 fragCoord ) {
    fragColor = AtAddress( fragCoord, vAddr ) ? ivec4(vValue) : fragColor;
}

void StoreIVec4B( in ivec2 vAddr, in ivec4 vValue, inout vec4 fragColor, in ivec2 fragCoord ) {
    fragColor = AtAddress( fragCoord, vAddr ) ? vec4(vValue) : fragColor;
}

ivec4 LoadVec4B( in ivec2 vAddr ) {
    return ivec4( texelFetch( iChannel2, vAddr, 0 ) );
}


// FONT RENDER CODE
//
// copied from https://www.shadertoy.com/view/MtyXDV

vec2 uv = vec2(0.0);  // -1 .. 1

//== font handling ================================================

#define FONT_SPACE 0.5

vec2 tp = vec2(0.0);  // text position
const vec2 vFontSize = vec2(8.0, 15.0);  // multiples of 4x5 work best

//----- access to the image of ascii code characters ------

#define SPACE tp.x-=FONT_SPACE;
#define _     tp.x-=FONT_SPACE;

#define S(a) c+=char(a);  tp.x-=FONT_SPACE;

#define _note  S(10);   //
#define _star  S(28);   // *
#define _smily S(29);   // :-)        
#define _exc   S(33);   // !
#define _add   S(43);   // +
#define _comma S(44);   // ,
#define _sub   S(45);   // -
#define _dot   S(46);   // .
#define _slash S(47);   // /

#define _0 S(48);
#define _1 S(49);
#define _2 S(50);
#define _3 S(51);
#define _4 S(52);
#define _5 S(53);
#define _6 S(54);
#define _7 S(55);
#define _8 S(56);
#define _9 S(57);
#define _ddot S(58);   // :
#define _sc   S(59);   // ;
#define _less S(60);   // <
#define _eq   S(61);   // =
#define _gr   S(62);   // >
#define _qm   S(63);   // ?
#define _at   S(64);   // at sign

#define _A S(65);
#define _B S(66);
#define _C S(67);
#define _D S(68);
#define _E S(69);
#define _F S(70);
#define _G S(71);
#define _H S(72);
#define _I S(73);
#define _J S(74);
#define _K S(75);
#define _L S(76);
#define _M S(77);
#define _N S(78);
#define _O S(79);
#define _P S(80);
#define _Q S(81);
#define _R S(82);
#define _S S(83);
#define _T S(84);
#define _U S(85);
#define _V S(86);
#define _W S(87);
#define _X S(88);
#define _Y S(89);
#define _Z S(90);

#define _a S(97);
#define _b S(98);
#define _c S(99);
#define _d S(100);
#define _e S(101);
#define _f S(102);
#define _g S(103);
#define _h S(104);
#define _i S(105);
#define _j S(106);
#define _k S(107);
#define _l S(108);
#define _m S(109);
#define _n S(110);
#define _o S(111);
#define _p S(112);
#define _q S(113);
#define _r S(114);
#define _s S(115);
#define _t S(116);
#define _u S(117);
#define _v S(118);
#define _w S(119);
#define _x S(120);
#define _y S(121);
#define _z S(122);
   
float char(int ch) {
  vec4 f = any(lessThan(vec4(tp,1,1), vec4(0,0,tp))) 
               ? vec4(0) 
               : texture(iChannel3,0.0625*(tp + vec2(ch - ch/16*16,15 - ch/16)));  
  return f.x;
}

void SetTextPosition(float x, float y)  //
{
  tp = 10.0*uv;
  tp.x = tp.x - x;
  tp.y = tp.y - y;
}
                                                                                                        
float drawInt(int value, int minDigits)
{
  float c = 0.;
  if (value < 0) 
  { value = -value;
    if (minDigits < 1) minDigits = 1;
    else minDigits--;
    _sub                   // add minus char
  } 
  int fn = value, digits = 1; // get number of digits 
  for (int ni=0; ni<10; ni++)
  {
    fn /= 10;
    if (fn == 0) break;
    digits++;
  } 
  digits = max(minDigits, digits);
  tp.x -= FONT_SPACE * float(digits);
  for (int ni=1; ni < 11; ni++) 
  { 
    tp.x += FONT_SPACE; // space
    c += char(48 + (value-((value/=10)*10))); // add 0..9 
    if (ni >= digits) break;
  } 
  tp.x -= FONT_SPACE * float(digits);
  return c;
}

float drawInt(int value) {return drawInt(value,1);}


void updateText(  inout vec4 color, vec2 coord ) {
    uv = (2.*coord/iResolution.y-1.);
    if( abs(uv.y) < .2 ) {
        ivec4 data = LoadVec4(ivec2(3,32));
        
        if( data.x > 0 ) {
		   SetTextPosition(2.5,-0.5);   
		   float c = 0.0;
		   _Y _o _u _ _f _o _u _n _d _ 
                
           if( data.x == 6 ) {    
              _a _ _n _e _w _ _s _w _o _r _d _ _add
			    c += drawInt(data.y);  
           } else if( data.x == 10 ) {
                _f _o _o _d _ _add
			    c += drawInt(data.y);  
           } else {
               _a _
               if( data.x == 7 ) {
                   _R _e _d
               }
               else if( data.x == 8 ) {
                   _G _r _e _e _n
               }
               else if( data.x == 9 ) {
                   _B _l _u _e
               }
               _ _K _e _y
           }
		   color = vec4(1,1,1,min(2.,c * 2.));
        } else if( data.x < 0 ) {   
		   SetTextPosition(2.5,-0.5);
		   float c = 0.0;
           _Y _o _u _ _d _i _e _d
		   color = vec4(1,1,1,min(2.,c * 2.));               
        } else {
           color = texelFetch(iChannel2, ivec2(coord),0); 
           color.a = max(0., color.a - 1./60.);
        }         
    }
}


// UI ELEMENTS

vec4 drawSword( vec2 uv, int level ) {
    uv = floor(fract(uv)*32.) - 16.;
        float l = step(abs(uv.y), .5); 
        l = max(l, step(abs(uv.y), 1.5) * step(uv.x, 13.));   
        l = max(l, step(abs(uv.y), 5.5) * step(abs(uv.x+9.), 1.));
                        
	    vec3 col = mix( vec3(.8), vec3(.5,.3,.2), step(uv.x, -11.));
        vec3 scol = mix( vec3(.5,.3,.2), vec3(1.), clamp(float(level) / float(MAXSWORD/2), 0., 1.) );
        scol = mix( scol, vec3(0.,.9, 1.), clamp(float(level-MAXSWORD/2) / float(MAXSWORD/2), 0., 1.) );
        col = mix( scol, col, step(uv.x, -8.));        
        
        return vec4( l * (.75 + .25 * texture(iChannel1, uv/64.).x) * col, l );
}

vec4 drawKey( vec2 uv, int color ) {
    uv = floor(fract(uv)*32.) - 16.;
        float l = step(abs(uv.y), 1.);
        l = max(l, step(length(uv+vec2(8,0)), 7.5));
        l -= step(length(uv+vec2(8,0)), 4.5);
        l = max(l, step(6.,uv.x)*step(uv.x, 7.)*step(0.,uv.y)*step(abs(uv.y), 5.));
        l = max(l, step(10.,uv.x)*step(uv.x, 11.)*step(0.,uv.y)*step(abs(uv.y), 7.));
        l = max(l, step(14.,uv.x)*step(0.,uv.y)*step(abs(uv.y), 6.));
        
	    vec3 col = vec3(0);
    	col[color] = 1.;
        return vec4( l * (.75 + .25 * texture(iChannel1, uv/64.).x) * col, l );

}

void drawKeyIcon( vec2 lt, vec2 size, inout vec4 color, vec2 coord, int keyColor ) {
    coord = (coord-lt) / size;
    if( coord.x >= 0. && coord.x <= 1. && coord.y >= 0. && coord.y <= 1. ) {    
		vec4 col = drawKey(-coord, keyColor);
        color = mix( color, col, col.a );
    }
}


void drawSwordIcon( vec2 lt, vec2 size, inout vec4 color, vec2 coord, int level ) {
    coord = (coord-lt) / size;
    if( coord.x >= 0. && coord.x <= 1. && coord.y >= 0. && coord.y <= 1. ) {    
		vec4 col = drawSword(coord, level);
        color = mix( color, col, col.a );
    }
}


void drawSwordIconLarge( vec2 lt, vec2 size, inout vec4 color, vec2 coord, int level ) {
    coord = (coord-lt) / size;
    if( coord.x >= 0. && coord.x <= 1. && coord.y >= 0. && coord.y <= 1. ) {    
		vec4 col = drawSword(coord.yx, level);
        color = mix( color, col, col.a );
    }
}

void drawLifeBar(  vec2 lt, vec2 size, inout vec4 color, vec2 coord, int level ) {
     coord = (coord-lt) / size;
    if( coord.x >= 0. && coord.x <= 1. && coord.y >= 0. && coord.y <= 1. ) {    
		vec4 col = mix(vec4(.5,0,0,1), vec4(.5,1,0,1), float(level)/60.);  
		col = mix(col, vec4(0,1,0,1), float(level-60)/60.);
        col = mix( vec4(0,0,0,.6), col, step( 120. * coord.x,  float(level) ));
        col.rgb *= (.75 + .5 * texture(iChannel1, coord/vec2(8.,64.)).x);
        color = mix( color, col, col.a );
    }   
}

void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
    vec2 res = iResolution.xy;
    
    ivec4 ud1 = LoadVec4( ivec2(0,32 ) );
    ivec4 ud2 = LoadVec4( ivec2(1,32 ) );
    ivec4 USERINV = LoadVec4( ivec2(2,32 ) );
        
	int USERACTIONCOUNT = ud1.w;
    int USERACTION = ud2.x;
    
    fragColor = vec4(0);

    float iconSize = res.y*.1;
    
    if( USERINV[0] > 0) {
       drawSwordIcon( vec2( res.x - iconSize*1.5, .125*iconSize ), vec2(iconSize), fragColor, fragCoord, USERINV[0] );
    }
    
    for( int i=0; i<3; i++) {
        if( USERINV[i+1] > 0 ) {
            drawKeyIcon( vec2( res.x - (float(i)*1.2+2.7)*iconSize, .125*iconSize  ), vec2(iconSize), fragColor, fragCoord, i);
        }
    }
    if( USERACTION == ACTION && USERACTIONCOUNT > 0 && USERINV[0] > 0) {
       float h = smoothstep(0., 1., abs(float(USERACTIONCOUNT-USERACTIONSTEPS/2-10)/float(USERACTIONSTEPS/2))) + .4;
       float size = res.y * .5; 
        
       drawSwordIconLarge( vec2( res.x * .5 - size*.5, -h*size ), vec2(size), fragColor, fragCoord, USERINV[0] );
    }
    drawLifeBar( vec2(iconSize * .5, .375*iconSize), vec2( iconSize*6., iconSize*.25), fragColor, fragCoord, ud2.z );
    
    updateText( fragColor, fragCoord );
    
    
    ivec4 bd = LoadVec4B( ivec2(0,0) );
    if( bd.x > ud2.z ) {
        bd.y = REDFLASHSTEPS;
    }
    bd.y--;
    if( bd.y < 0 ) bd.y = 0;
    bd.x = ud2.z;
    
    StoreIVec4B( ivec2(0,0), bd, fragColor, ivec2(fragCoord) );
}`,name:`Buffer B`,description:``,type:`buffer`}]},{ver:`0.1`,info:{id:`4dSBz3`,date:`1501424191`,viewed:5057,name:`Super simple raymarching example`,description:`Please have a look at the [url=https://www.shadertoy.com/view/4dSfRc]tutorial[/url].`,likes:38,published:`Public API`,usePreview:0,tags:[`raymarching`,`example`,`simple`,`distance`,`fields`,`sh17c`]},renderpass:[{inputs:[],outputs:[{id:`4dfGRr`,channel:0}],code:`// Super simple raymarching example. Created by Reinder Nijhoff 2017
// Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License.
// @reindernijhoff
// 
// https://www.shadertoy.com/view/4dSBz3
//
// This is the shader used as example in my ray march tutorial: https://www.shadertoy.com/view/4dSfRc
//
// Created for the Shadertoy Competition 2017 
//

//
// Distance field function for the scene. It combines
// the seperate distance field functions of three spheres
// and a plane using the min-operator.
//
float map(vec3 p) {
    float d = distance(p, vec3(-1, 0, -5)) - 1.;     // sphere at (-1,0,5) with radius 1
    d = min(d, distance(p, vec3(2, 0, -3)) - 1.);    // second sphere
    d = min(d, distance(p, vec3(-2, 0, -2)) - 1.);   // and another
    d = min(d, p.y + 1.);                            // horizontal plane at y = -1
    return d;
}

//
// Calculate the normal by taking the central differences on the distance field.
//
vec3 calcNormal(in vec3 p) {
    vec2 e = vec2(1.0, -1.0) * 0.0005;
    return normalize(
        e.xyy * map(p + e.xyy) +
        e.yyx * map(p + e.yyx) +
        e.yxy * map(p + e.yxy) +
        e.xxx * map(p + e.xxx));
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    vec3 ro = vec3(0, 0, 1);                           // ray origin

    vec2 q = (fragCoord.xy - .5 * iResolution.xy ) / iResolution.y;
    vec3 rd = normalize(vec3(q, 0.) - ro);             // ray direction for fragCoord.xy

    // March the distance field until a surface is hit.
    float h, t = 1.;
    for (int i = 0; i < 256; i++) {
        h = map(ro + rd * t);
        t += h;
        if (h < 0.01) break;
    }

    if (h < 0.01) {
        vec3 p = ro + rd * t;
        vec3 normal = calcNormal(p);
        vec3 light = vec3(0, 2, 0);
        
        // Calculate diffuse lighting by taking the dot product of 
        // the light direction (light-p) and the normal.
        float dif = clamp(dot(normal, normalize(light - p)), 0., 1.);
		
        // Multiply by light intensity (5) and divide by the square
        // of the distance to the light.
        dif *= 5. / dot(light - p, light - p);
        
        
        fragColor = vec4(vec3(pow(dif, 0.4545)), 1);     // Gamma correction
    } else {
        fragColor = vec4(0, 0, 0, 1);
    }
}`,name:`Image`,description:``,type:`image`}]},{ver:`0.1`,info:{id:`4dSfRc`,date:`1501424188`,viewed:34159,name:`[SH17C] Raymarching tutorial`,description:`The shader used as example in this tutorial can be found [url=https://www.shadertoy.com/view/4dSBz3]here[/url].

You can navigate the slides using your arrow keys.`,likes:409,published:`Public API`,usePreview:1,tags:[`raymarching`,`tutorial`,`distance`,`fields`,`sh17c`]},renderpass:[{inputs:[{id:`4dXGR8`,filepath:`/media/previz/buffer00.png`,type:`buffer`,channel:0,sampler:{filter:`linear`,wrap:`clamp`,vflip:`true`,srgb:`false`,internal:`byte`},published:1},{id:`XsXGR8`,filepath:`/media/previz/buffer01.png`,type:`buffer`,channel:1,sampler:{filter:`linear`,wrap:`clamp`,vflip:`true`,srgb:`false`,internal:`byte`},published:1},{id:`4sXGR8`,filepath:`/media/previz/buffer02.png`,type:`buffer`,channel:2,sampler:{filter:`linear`,wrap:`clamp`,vflip:`true`,srgb:`false`,internal:`byte`},published:1},{id:`XdfGR8`,filepath:`/media/previz/buffer03.png`,type:`buffer`,channel:3,sampler:{filter:`linear`,wrap:`clamp`,vflip:`true`,srgb:`false`,internal:`byte`},published:1}],outputs:[{id:`4dfGRr`,channel:0}],code:`// [SH17C] Raymarching tutorial. Created by Reinder Nijhoff 2017
// Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License.
// @reindernijhoff
// 
// https://www.shadertoy.com/view/4dSfRc
//
// In this tutorial you will learn how to render a 3d-scene in Shadertoy
// using distance fields.
//
// The tutorial itself is created in Shadertoy, and is rendered
// using ray marching a distance field.
//
// The shader studied in the tutorial can be found here: 
//     https://www.shadertoy.com/view/4dSBz3
//
// Created for the Shadertoy Competition 2017 
//
// Most of the render code is taken from: 'Raymarching - Primitives' by Inigo Quilez.
//
// You can find this shader here:
//     https://www.shadertoy.com/view/Xds3zN
//

// COMPOSITE IMAGE

#define SLIDE_FADE_STEPS 60

void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
    int SLIDE_STEPS_VISIBLE = int(texelFetch( iChannel0, ivec2(0,0), 0 ).y);
    
    vec4 current = texelFetch(iChannel1, ivec2(fragCoord), 0);
    vec4 prev    = texelFetch(iChannel2, ivec2(fragCoord), 0);
    vec4 font    = texelFetch(iChannel3, ivec2(fragCoord), 0);

	fragColor = mix( prev, current, clamp( float(SLIDE_STEPS_VISIBLE)/float(SLIDE_FADE_STEPS), 0., 1.) );
    fragColor = mix( fragColor * .75, font, font.a );
}`,name:`Image`,description:``,type:`image`},{inputs:[{id:`4dXGRr`,filepath:`/presets/tex00.jpg`,type:`keyboard`,channel:1,sampler:{filter:`linear`,wrap:`clamp`,vflip:`true`,srgb:`false`,internal:`byte`},published:1},{id:`4dXGzr`,filepath:`/media/a/08b42b43ae9d3c0605da11d0eac86618ea888e62cdd9518ee8b9097488b31560.png`,type:`texture`,channel:2,sampler:{filter:`mipmap`,wrap:`repeat`,vflip:`true`,srgb:`false`,internal:`byte`},published:1},{id:`4dXGR8`,filepath:`/media/previz/buffer00.png`,type:`buffer`,channel:0,sampler:{filter:`linear`,wrap:`clamp`,vflip:`true`,srgb:`false`,internal:`byte`},published:1}],outputs:[{id:`4dXGR8`,channel:0}],code:`// [SH17C] Raymarching tutorial. Created by Reinder Nijhoff 2017
// @reindernijhoff
// 
// https://www.shadertoy.com/view/4dSfRc
//
// In this tutorial you will learn how to render a 3d-scene in Shadertoy
// using distance fields.
//
// The tutorial itself is created in Shadertoy, and is rendered
// using ray marching a distance field.
//
// The shader studied in the tutorial can be found here: 
//     https://www.shadertoy.com/view/4dSBz3
//
// Created for the Shadertoy Competition 2017 
//
// Most of the render code is taken from: 'Raymarching - Primitives' by Inigo Quilez.
//
// You can find this shader here:
//     https://www.shadertoy.com/view/Xds3zN
//

// SLIDE NAVIGATION FUNCTIONS

// Load & store functions

#define SLIDE_FADE_STEPS 45

#define TITLE_DELAY   45
#define BODY_DELAY   90
#define CODE_DELAY   135
#define FOOTER_DELAY 180

#define NUM_SLIDES 25

int SLIDE = 0;
int SLIDE_STEPS_VISIBLE = 0;

ivec4 LoadVec4( in ivec2 vAddr ) {
    return ivec4( texelFetch( iChannel0, vAddr, 0 ) );
}

bool AtAddress( ivec2 p, ivec2 c ) { return all( equal( floor(vec2(p)), vec2(c) ) ); }

void StoreVec4( in ivec2 vAddr, in ivec4 vValue, inout vec4 fragColor, in ivec2 fragCoord ) {
    fragColor = AtAddress( fragCoord, vAddr ) ? vec4(vValue) : fragColor;
}

vec4 LoadFVec4( in ivec2 vAddr ) {
    return texelFetch( iChannel0, vAddr, 0 );
}

void StoreFVec4( in ivec2 vAddr, in vec4 vValue, inout vec4 fragColor, in ivec2 fragCoord ) {
    fragColor = AtAddress( fragCoord, vAddr ) ? vValue : fragColor;
}

// key functions

// Keyboard constants definition
const int KEY_SPACE = 32;
const int KEY_LEFT  = 37;
const int KEY_UP    = 38;
const int KEY_RIGHT = 39;
const int KEY_DOWN  = 40;
const int KEY_A     = 65;
const int KEY_D     = 68;
const int KEY_S     = 83;
const int KEY_W     = 87;


bool KP(int key) {
	return texelFetch( iChannel1, ivec2(key, 0), 0 ).x > 0.0;
}

bool KT(int key) {
	return texelFetch( iChannel1, ivec2(key, 2), 0 ).x > 0.0;
}

// slide logic

struct SlideDataStruct {
    int title;
    int titleDelay;
    int body;
    int bodyDelay;
    int code;
    int codeDelay;
    vec3 ro;
    vec3 ta;
    int sceneMode;
    int codeS;
    int codeE;
    int distMode;
};

SlideDataStruct temp;
int tempCounter;

bool createSlideData( 
    const int title,
    const int titleDelay,
    const int body,
    const int bodyDelay,
    const int code,
    const int codeDelay,
    const vec3 ro,
    const vec3 ta,
    const int sceneMode,
    const int codeS,
    const int codeE,
	const int distMode ) {
        
    if(tempCounter == SLIDE) {
        temp.title = title;
  	  	temp.titleDelay = titleDelay;
   	 	temp.body = body;
   	 	temp.bodyDelay =bodyDelay;
   	 	temp.code = code;
   		temp.codeDelay =codeDelay;
   		temp.ro = ro;
   		temp.ta = ta;
   	 	temp.sceneMode = sceneMode;
  	 	temp.codeS = codeS;
  	  	temp.codeE = codeE;
		temp.distMode = distMode;
        return true;
    } else {
    	tempCounter++;
        return false;
    }
}

SlideDataStruct getSlideData() {
    tempCounter = 0;
    
    // intro
   if( createSlideData(1,TITLE_DELAY,1,BODY_DELAY,0,0, vec3(.0,0.,1.),vec3(0.,0.,-.5), 0, 0, 0, 0) ) return temp;

    // intro - show bw scene
   if( createSlideData(1,0,2,0,0,0, vec3(.0,0.,1.), vec3(0.,0.,-5.), -1, 0, 0, 0)) return temp;
    
    // create a ray - origin
   if( createSlideData(2,TITLE_DELAY,3,BODY_DELAY,0,0, vec3(2.,1.,2.),vec3(0.,0.2,-1.3), 1, 0, 0, 0)) return temp;
        
    // create a ray - origin / code    
   if( createSlideData(2,0,4,0,1,TITLE_DELAY, vec3(2.,1.,2.),vec3(0.,0.2,-1.3), 1, 1, 3, 0)) return temp;
    
    // place screen
   if( createSlideData(2,0,5,TITLE_DELAY,0,0, vec3(2.,1.,2.),vec3(0.,0.2,-1.3), 2, 0, 0, 0)) return temp;
    
    // create rd
   if( createSlideData(2,0,6,TITLE_DELAY,0,0, vec3(2.5,3.,2.5),vec3(0.,0.2,-1.3), 3, 0, 0, 0)) return temp;

	// create rd / code
   if( createSlideData(2,0,7,0,1,TITLE_DELAY, vec3(2.5,3.,2.5),vec3(0.,0.2,-1.3), 3, 3, 0, 0)) return temp;
   
    // interact with scene
   if( createSlideData(2,0,8,0,0,0, vec3(2.5,3.,2.5),vec3(0.,0.2,-1.3), 3, 3, 0, 0)) return temp;
    
    // distance fields intro
   if( createSlideData(3,TITLE_DELAY,9,BODY_DELAY,0,0, vec3(1.,6.,2.),vec3(0.,0.2,-1.3), 3, 0, 0, 0)) return temp;
    
    // distance fields def
   if( createSlideData(3,0,10,TITLE_DELAY,0,0, vec3(1.,6.,2.),vec3(0.,0.2,-1.3), 3, 0, 0, 0)) return temp;
        
    // distance fields one sphere
   if( createSlideData(3,TITLE_DELAY,11,BODY_DELAY,0,0, vec3(1.,6.,-2.),vec3(-1.,-0.5,-2.), 4, 0, 0, 0)) return temp;
    
     // distance fields one sphere
   if( createSlideData(3,0,11,0,0,0, vec3(1.,6.,-2.),vec3(-1.,-0.5,-2.), 4, 0, 0, 1)) return temp;
      
    // distance fields one sphere - code
   if( createSlideData(3,0,12,0,2,TITLE_DELAY, vec3(1.,6.,-2.),vec3(-1.,-0.5,-2.), 4, 0, 3, 1)) return temp;
    
    // distance fields one three spheres
   if( createSlideData(3,0,13,TITLE_DELAY,0,0, vec3(1.,6.,-2.),vec3(-1.,-0.5,-2.), 2, 0, 5, 2)) return temp;
    
    // distance fields one three spheres - in code
   if( createSlideData(3,0,14,0,2,TITLE_DELAY, vec3(1.,6.,-2.),vec3(-1.,-0.5,-2.), 2, 0, 5, 2)) return temp;
    
    // distance fields one three spheres - full code
   if( createSlideData(3,0,15,TITLE_DELAY,2,BODY_DELAY, vec3(1.,6.,-2.),vec3(-1.,-0.5,-2.), 2, 0, 0, 3)) return temp;
        
    // distance fields one three spheres - march
   if( createSlideData(3,0,16,TITLE_DELAY,0,0, vec3(2.5,3.,1.5),vec3(0.,0.2,-1.3), 5, 0, 0, 4)) return temp;
    
    // distance fields one three spheres - march code
   if( createSlideData(3,0,17,0,3,TITLE_DELAY, vec3(2.5,3.,1.5),vec3(0.,0.2,-1.3), 5, 0, 0, 4)) return temp;
        
    // distance fields one three spheres - interact
   if( createSlideData(3,0,8,TITLE_DELAY,0,0, vec3(.5,2.,2.5),vec3(0.,0.2,-.3), 5, 0, 0, 4)) return temp;

    // lighting - normal intro
   if( createSlideData(4,TITLE_DELAY,18,BODY_DELAY,0,0, vec3(2.5,3.,1.5),vec3(0.,0.2,-1.3), 6, 0, 0, 0)) return temp;

   // lighting - normal full
   if( createSlideData(4,0,19,TITLE_DELAY,4,BODY_DELAY, vec3(4.5,3.,-1.5),vec3(0.,0.2,-1.3), 6, 0, 0, 0)) return temp;

   // lighting - interact
   if( createSlideData(4,0,8,TITLE_DELAY,0,0, vec3(4.5,3.,-1.5),vec3(0.,0.2,-1.3), 6, 0, 0, 0)) return temp;

   // lighting - diffuse
   if( createSlideData(4,0,20,TITLE_DELAY,0,0, vec3(.0,0.,1.),vec3(0.,0.,-.5), 0, 0, 0, 0)) return temp;

   // lighting - diffuse
   if( createSlideData(4,0,21,0,5,TITLE_DELAY, vec3(.0,0.,1.),vec3(0.,0.,-.5), -1, 0, 0, 0)) return temp;
 
   // done
   if( createSlideData(1,TITLE_DELAY,22,BODY_DELAY,0,0, vec3(.0,0.,1.),vec3(0.,0.,-.5), -1, 0, 0, 0)) return temp;
 
    
    return temp;
}
    
mat3 setCamera( in vec3 ro, in vec3 ta, float cr )
{
	vec3 cw = normalize(ta-ro);
	vec3 cp = vec3(sin(cr), cos(cr),0.0);
	vec3 cu = normalize( cross(cw,cp) );
	vec3 cv = normalize( cross(cu,cw) );
    return mat3( cu, cv, cw );
}

float sphIntersect( in vec3 ro, in vec3 rd, in vec4 sph ) {
	vec3 oc = ro - sph.xyz;
	float b = dot( oc, rd );
	float c = dot( oc, oc ) - sph.w*sph.w;
	float h = b*b - c;
	if( h<0.0 ) return 10000.0;
	return -b - sqrt( h );
}

float iPlane(in vec3 ro, in vec3 rd, in float d) {
	// equation of a plane, y=0 = ro.y + t*rd.y
    return -(ro.y+d)/rd.y;
}

vec3 intersectScene( vec3 ro, vec3 ta, vec2 p,  bool intersectPlane ) {    
    mat3 ca = setCamera( ro, ta, 0.0 );
    vec3 rd = ca * normalize( vec3(p.xy,1.0) );
    
    float d = 1000.;
    // sphere intersections ..
    if( intersectPlane ) {
	    if( rd.y < 0. ) d = min(d, iPlane(ro, rd, 0.));
    } else {
    	d = min( d, sphIntersect( ro, rd, vec4(-1,0,-5,1) ));
   		d = min( d, sphIntersect( ro, rd, vec4(2,0,-3,1) ));
  	  	d = min( d, sphIntersect( ro, rd, vec4(-2,0,-2,1) ));

	    if( rd.y < 0. ) d = min(d, iPlane(ro, rd, 1.));
    }
    
    if( d < 100. ) {
        return ro + d*rd;
    } else {
        return vec3(-1,0,-4);
    }
}
    
void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
	ivec2 uv = ivec2(fragCoord.xy);
    
    // wait for font-texture to load
    if( iFrame == 0 || texelFetch(iChannel2, ivec2(0,0), 0).b < .1) {
        vec4 ro = vec4(0,0,1,0);
		vec4 ta = vec4(0);
        
		StoreFVec4( ivec2(0,0), vec4(0), fragColor, uv);
		StoreFVec4( ivec2(0,3), ro, fragColor, uv);
		StoreFVec4( ivec2(0,4), ta, fragColor, uv);
    } else if( uv.x < 2 && uv.y < 6) {
        ivec4 slideData = LoadVec4( ivec2(0,0) );
        SLIDE = slideData.x;
        SLIDE_STEPS_VISIBLE = slideData.y;
        SLIDE_STEPS_VISIBLE++;

        if( SLIDE_STEPS_VISIBLE > 16 ) {
            if( KP(KEY_SPACE) || KP(KEY_RIGHT) || KP(KEY_D) ) {
                SLIDE++;
                SLIDE_STEPS_VISIBLE=0;
            }
            if( KP(KEY_LEFT) || KP(KEY_W) ) {
                SLIDE = (SLIDE + NUM_SLIDES - 1);
                SLIDE_STEPS_VISIBLE=0;
            }
            
            SLIDE = SLIDE % NUM_SLIDES; 
        }
        
        SlideDataStruct slide = getSlideData();
        
        // screen resolution
        ivec4 res = LoadVec4( ivec2(1,0) );
        if( res.x != int(iResolution.x) || res.y != int(iResolution.y) ) {
            SLIDE_STEPS_VISIBLE = 0;
        }
        StoreVec4( ivec2(1,0), ivec4(iResolution.xy, 0,0), fragColor, uv );
        
		// slide navigation               
		StoreVec4( ivec2(0,0), ivec4(SLIDE, SLIDE_STEPS_VISIBLE, slide.sceneMode, slide.distMode), fragColor, uv);
        
        // text 
        ivec4 showText1 = ivec4(0);
        ivec4 showText2 = ivec4(0);
        
        if( SLIDE_STEPS_VISIBLE == 0) showText1.x = 1;
        
        if( slide.titleDelay == SLIDE_STEPS_VISIBLE) showText2.x = slide.title;
        if( slide.bodyDelay == SLIDE_STEPS_VISIBLE) showText2.y = slide.body;
        if( slide.codeDelay == SLIDE_STEPS_VISIBLE) showText2.z = slide.code;

        showText1.y = slide.codeS;
        showText1.z = slide.codeE;
        
		StoreVec4( ivec2(0,1), showText1, fragColor, uv);
		StoreVec4( ivec2(0,2), showText2, fragColor, uv);
        
        // camera
        
        vec4 ro = LoadFVec4( ivec2(0,3) );
        vec4 ta = LoadFVec4( ivec2(0,4) );
        
		if(SLIDE_STEPS_VISIBLE > SLIDE_FADE_STEPS) {
            ro.xyz = mix( ro.xyz, slide.ro, 0.055 );
            ta.xyz = mix( ta.xyz, slide.ta, 0.055 );
        }
        
		StoreFVec4( ivec2(0,3), ro, fragColor, uv);
		StoreFVec4( ivec2(0,4), ta, fragColor, uv);
                
        if(iMouse.z > 0.) {
            vec2 q = (iMouse.xy - .5 * iResolution.xy ) / iResolution.y;
			StoreFVec4( ivec2(0,5), vec4(intersectScene(ro.xyz, ta.xyz, q, slide.sceneMode == 5),1), fragColor, uv);
        } else {
			StoreFVec4( ivec2(0,5), vec4(intersectScene(vec3(0,0,1), vec3(1,0,0), vec2(0), slide.sceneMode == 5),1), fragColor, uv);
        }
    } else {  
	    fragColor = vec4(0);
    }
}`,name:`Buffer A`,description:``,type:`buffer`},{inputs:[{id:`4dXGR8`,filepath:`/media/previz/buffer00.png`,type:`buffer`,channel:0,sampler:{filter:`linear`,wrap:`clamp`,vflip:`true`,srgb:`false`,internal:`byte`},published:1}],outputs:[{id:`XsXGR8`,channel:0}],code:`// [SH17C] Raymarching tutorial. Created by Reinder Nijhoff 2017
// @reindernijhoff
// 
// https://www.shadertoy.com/view/4dSfRc
//
// In this tutorial you will learn how to render a 3d-scene in Shadertoy
// using distance fields.
//
// The tutorial itself is created in Shadertoy, and is rendered
// using ray marching a distance field.
//
// The shader studied in the tutorial can be found here: 
//     https://www.shadertoy.com/view/4dSBz3
//
// Created for the Shadertoy Competition 2017 
//
// Most of the render code is taken from: 'Raymarching - Primitives' by Inigo Quilez.
//
// You can find this shader here:
//     https://www.shadertoy.com/view/Xds3zN
//

// RENDER SCENE


// Load & store functions

#define SLIDE_FADE_STEPS 60

int SLIDE = 0;
int SLIDE_STEPS_VISIBLE = 0;
int SCENE_MODE = 0;
int DIST_MODE = 0;
int MAX_MARCH_STEPS;

vec3 intersections[7];
vec3 intersectionNormal;

float aspect;
vec3 USER_INTERSECT;

ivec4 LoadVec4( in ivec2 vAddr ) {
    return ivec4( texelFetch( iChannel0, vAddr, 0 ) );
}

vec4 LoadFVec4( in ivec2 vAddr ) {
    return texelFetch( iChannel0, vAddr, 0 );
}

bool AtAddress( ivec2 p, ivec2 c ) { return all( equal( floor(vec2(p)), vec2(c) ) ); }

void StoreVec4( in ivec2 vAddr, in ivec4 vValue, inout vec4 fragColor, in ivec2 fragCoord ) {
    fragColor = AtAddress( fragCoord, vAddr ) ? vec4(vValue) : fragColor;
}

void loadData() {
    ivec4 slideData = LoadVec4( ivec2(0,0) );
    SLIDE = slideData.x;
    SLIDE_STEPS_VISIBLE = slideData.y;
    SCENE_MODE = slideData.z;
	DIST_MODE = slideData.w;
}


// tutorial Scene
float tut_map(vec3 p) {
    float d = distance(p, vec3(-1, 0, -5)) - 1.;
    d = min(d, distance(p, vec3(2, 0, -3)) - 1.);
    d = min(d, distance(p, vec3(-2, 0, -2)) - 1.);
    d = min(d, p.y + 1.);
    return d;
}

vec3 tut_calcNormal(in vec3 pos) {
    vec2 e = vec2(1.0, -1.0) * 0.0005;
    return normalize(
        e.xyy * tut_map(pos + e.xyy) +
        e.yyx * tut_map(pos + e.yyx) +
        e.yxy * tut_map(pos + e.yxy) +
        e.xxx * tut_map(pos + e.xxx));
}

vec4 tut_render(in vec2 uv, const int steps) {
    vec3 ro = vec3(0, 0, 1);
    vec3 rd = normalize(vec3(uv, 0.) - ro);

    float h, t = 1.;
    for (int i = 0; i < steps; i++) {
        h = tut_map((ro + rd * t));
        t += h;
        if (h < 0.01) break;
    }

    if (h < 0.01) {
        vec3 p = ro + rd * t;
        vec3 normal = tut_calcNormal(p);
        vec3 light = vec3(0, 2, 0);

        float dif = clamp(dot(normal, normalize(light - p)), 0., 1.);
        dif *= 5. / dot(light - p, light - p);
        return vec4(pow(vec3(dif), vec3(1. / 2.2)), 1);
    } else {
        return vec4(0, 0, 0, 1);
    }
}

//
// render full scene
//
// Most of this is taken from: 'Raymarching - Primitives' by Inigo Quilez.
//
// You can find this shader here:
//     https://www.shadertoy.com/view/Xds3zN
//

//------------------------------------------------------------------

float sdPlane( vec3 p, float d ) {
	return p.y - d;
}

float sdSphere( vec3 p, float s ) {
    return length(p)-s;
}

float sdBox( vec3 p, vec3 b ) {
    vec3 d = abs(p) - b;
    return min(max(d.x,max(d.y,d.z)),0.0) + length(max(d,0.0));
}

float sdCapsule( vec3 p, vec3 a, vec3 b, float r ) {
	vec3 pa = p-a, ba = b-a;
	float h = clamp( dot(pa,ba)/dot(ba,ba), 0.0, 1.0 );
	return length( pa - ba*h ) - r;
}

//------------------------------------------------------------------

vec2 opU( vec2 d1, vec2 d2 ) {
	return (d1.x<d2.x) ? d1 : d2;
}

//------------------------------------------------------------------

vec2 map_0( in vec3 pos ) { // basic scene
    vec2 res = opU( vec2( sdPlane(     pos, -1.), 1.0 ),
	                vec2( sdSphere(    pos-vec3(-1,0,-5),1.), 50. ) );
    res = opU( res, vec2( sdSphere(    pos-vec3(2,0,-3),1.), 65. ) );
    res = opU( res, vec2( sdSphere(    pos-vec3(-2,0,-2),1.),41. ) );
        
    return res;
}

vec2 map_1( in vec3 pos ) { // scene + ro
    vec2 res = map_0(pos);
    res = opU( res, vec2( sdSphere(    pos-vec3(0,0,1),.1),2. ) );
    return res;
}

vec2 map_2( in vec3 pos ) { // scene + ro + screen
    vec2 res = map_0(pos);
            
    res = opU( res, vec2( sdSphere(    pos-vec3(0,0,1),.1),3. ) );
    res = opU( res, vec2( sdBox( pos,  vec3(.5*aspect, .5,.025)), 4.));
    return res;
}

vec2 map_3( in vec3 pos ) { // scene + ro + rd + intersection
    vec2 res = map_2(pos);
    
    res = opU( res, vec2( sdSphere(     pos-USER_INTERSECT,.1),2. ) );
    res = opU( res, vec2( sdCapsule(    pos, vec3(0,0,1.), USER_INTERSECT,.025),2. ) );
    
    return res;
}

vec2 map_4( in vec3 pos ) { // scene + ro + one sphere
    vec2 res = opU( vec2( sdPlane(     pos, -1.), 1.0 ),
	                vec2( sdSphere(    pos-vec3(-1,0,-5),1.), 50. ) );
    
    res = opU( res, vec2( sdSphere(    pos-vec3(0,0,1),.1),3. ) );
    res = opU( res, vec2( sdBox( pos,  vec3(.5*aspect, .5,.025)), 4.));
    
    return res;
}

vec2 map_5( in vec3 pos ) { // scene + ro + screen + march steps
    vec2 res = map_2(pos);
    
    res = opU( res, vec2( sdCapsule(    pos, vec3(0,0,1.), USER_INTERSECT,.025),3. ) );
    for( int i=0; i<intersections.length(); i++ ){
        if (i <= MAX_MARCH_STEPS) {
	    	res = opU( res, vec2( sdSphere( pos-intersections[i],.1), (i==MAX_MARCH_STEPS)?2.:3. ) );
        }
    }
    
    return res;
}

vec2 map_6( in vec3 pos ) { // scene + ro + rd + intersection + normal
    vec2 res = map_2(pos);
    
    res = opU( res, vec2( sdSphere(     pos-USER_INTERSECT,.1),3. ) );
    res = opU( res, vec2( sdCapsule(    pos, USER_INTERSECT + intersectionNormal, USER_INTERSECT,.025),2. ) );
    
    res = opU( res, vec2( sdCapsule(    pos, vec3(0,0,1.), USER_INTERSECT,.025),3. ) );
    return res;
}


vec2 castRay( in vec3 ro, in vec3 rd )
{
    float tmin = .5;
    float tmax = 20.0;
       
    float t = tmin;
    float m = -1.0;

    if( SCENE_MODE == 0 ) {
        for( int i=0; i<64; i++ )
        {
            float precis = 0.00005*t;
            vec2 res = map_0( ro+rd*t );
            if( res.x<precis || t>tmax ) break;
            t += res.x;
            m = res.y;
        }
    } else if( SCENE_MODE == 1 ) {
        for( int i=0; i<64; i++ )
        {
            float precis = 0.00005*t;
            vec2 res = map_1( ro+rd*t );
            if( res.x<precis || t>tmax ) break;
            t += res.x;
            m = res.y;
        }
    } else if( SCENE_MODE == 2 ) {
        for( int i=0; i<64; i++ )
        {
            float precis = 0.00005*t;
            vec2 res = map_2( ro+rd*t );
            if( res.x<precis || t>tmax ) break;
            t += res.x;
            m = res.y;
        }
    } else if( SCENE_MODE == 3 ) {
        for( int i=0; i<64; i++ )
        {
            float precis = 0.00005*t;
            vec2 res = map_3( ro+rd*t );
            if( res.x<precis || t>tmax ) break;
            t += res.x;
            m = res.y;
        }
    } else if( SCENE_MODE == 4 ) {
        for( int i=0; i<64; i++ )
        {
            float precis = 0.00005*t;
            vec2 res = map_4( ro+rd*t );
            if( res.x<precis || t>tmax ) break;
            t += res.x;
            m = res.y;
        }
    } else if( SCENE_MODE == 5 ) {
        for( int i=0; i<64; i++ )
        {
            float precis = 0.00005*t;
            vec2 res = map_5( ro+rd*t );
            if( res.x<precis || t>tmax ) break;
            t += res.x;
            m = res.y;
        }
    }  else if( SCENE_MODE == 6 ) {
        for( int i=0; i<64; i++ )
        {
            float precis = 0.00005*t;
            vec2 res = map_6( ro+rd*t );
            if( res.x<precis || t>tmax ) break;
            t += res.x;
            m = res.y;
        }
    } 

    if( t>tmax ) m=-1.0;
    return vec2( t, m );
}

float softshadow( in vec3 ro, in vec3 rd, in float mint, in float tmax )
{
	float res = 1.0;
    float t = mint, h;
    for( int i=0; i<16; i++ )
    {
        
	    if( SCENE_MODE == 0 ) {
			h = map_0( ro + rd*t ).x;
    	} else if( SCENE_MODE == 1 ) {
			h = map_1( ro + rd*t ).x;
    	} else if( SCENE_MODE == 2 ) {
			h = map_2( ro + rd*t ).x;
   		} else if( SCENE_MODE == 3 ) {
			h = map_3( ro + rd*t ).x;
   		} else if( SCENE_MODE == 4 ) {
			h = map_4( ro + rd*t ).x;
   		} else if( SCENE_MODE == 5 ) {
			h = map_5( ro + rd*t ).x;
   		} else if( SCENE_MODE == 6 ) {
			h = map_6( ro + rd*t ).x;
   		}
        
        res = min( res, 8.0*h/t );
        t += clamp( h, 0.02, 0.10 );
        if( h<0.001 || t>tmax ) break;
    }
    return clamp( res, 0.0, 1.0 );
}

vec3 calcNormal( in vec3 pos )
{
    vec2 e = vec2(1.0,-1.0)*0.5773*0.0005;
    
    if( SCENE_MODE == 0 ) {
 	   return normalize( e.xyy*map_0( pos + e.xyy ).x + 
					  e.yyx*map_0( pos + e.yyx ).x + 
					  e.yxy*map_0( pos + e.yxy ).x + 
					  e.xxx*map_0( pos + e.xxx ).x );
    } else if( SCENE_MODE == 1 ) {
            return normalize( e.xyy*map_1( pos + e.xyy ).x + 
					  e.yyx*map_1( pos + e.yyx ).x + 
					  e.yxy*map_1( pos + e.yxy ).x + 
					  e.xxx*map_1( pos + e.xxx ).x );
    } else if( SCENE_MODE == 2 ) {
            return normalize( e.xyy*map_2( pos + e.xyy ).x + 
					  e.yyx*map_2( pos + e.yyx ).x + 
					  e.yxy*map_2( pos + e.yxy ).x + 
					  e.xxx*map_2( pos + e.xxx ).x );
    } else if( SCENE_MODE == 3 ) {
            return normalize( e.xyy*map_3( pos + e.xyy ).x + 
					  e.yyx*map_3( pos + e.yyx ).x + 
					  e.yxy*map_3( pos + e.yxy ).x + 
					  e.xxx*map_3( pos + e.xxx ).x );
    } else if( SCENE_MODE == 4 ) {
            return normalize( e.xyy*map_4( pos + e.xyy ).x + 
					  e.yyx*map_4( pos + e.yyx ).x + 
					  e.yxy*map_4( pos + e.yxy ).x + 
					  e.xxx*map_4( pos + e.xxx ).x );
    } else if( SCENE_MODE == 5 ) {
            return normalize( e.xyy*map_5( pos + e.xyy ).x + 
					  e.yyx*map_5( pos + e.yyx ).x + 
					  e.yxy*map_5( pos + e.yxy ).x + 
					  e.xxx*map_5( pos + e.xxx ).x );
    } else if( SCENE_MODE == 6 ) {
            return normalize( e.xyy*map_6( pos + e.xyy ).x + 
					  e.yyx*map_6( pos + e.yyx ).x + 
					  e.yxy*map_6( pos + e.yxy ).x + 
					  e.xxx*map_6( pos + e.xxx ).x );
    }
}

float calcAO( in vec3 pos, in vec3 nor )
{
	float occ = 0.0;
    float sca = 1.0, dd;
    for( int i=0; i<5; i++ )
    {
        float hr = 0.01 + 0.12*float(i)/4.0;
        vec3 aopos =  nor * hr + pos;
	    if( SCENE_MODE == 0 ) {
			dd = map_0( aopos ).x;
    	} else if( SCENE_MODE == 1 ) {
			dd = map_1( aopos ).x;
    	} else if( SCENE_MODE == 2 ) {
			dd = map_2( aopos ).x;
   		} else if( SCENE_MODE == 3 ) {
			dd = map_3( aopos ).x;
   		} else if( SCENE_MODE == 4 ) {
			dd = map_4( aopos ).x;
   		} else if( SCENE_MODE == 5 ) {
			dd = map_5( aopos ).x;
   		} else if( SCENE_MODE == 6 ) {
			dd = map_6( aopos ).x;
   		}
        occ += -(dd-hr)*sca;
        sca *= 0.95;
    }
    return clamp( 1.0 - 3.0*occ, 0.0, 1.0 );    
}

vec3 pal( in float t, in vec3 a, in vec3 b, in vec3 c, in vec3 d )
{
    return a + b*cos( 6.28318*(c*t+d) );
}

vec3 render( in vec3 ro, in vec3 rd )
{ 
    vec3 col = vec3(0.75,0.9,1.0) + max(rd.y*.8,0.);
    vec2 res = castRay(ro,rd);
    float t = res.x;
	float m = res.y;
    if( m>-0.5 )
    {
        vec3 pos = ro + t*rd;
        vec3 nor = calcNormal( pos );
        vec3 ref = reflect( rd, nor );
        
        // material        
		col = 0.45 + 0.35*sin( vec3(0.05,0.08,0.10)*(m-1.0) );
        if( m<1.5 ) {            
            float f = mod( floor(1.0*pos.z) + floor(1.0*pos.x), 2.0);
            col = 0.35 + 0.05*f*vec3(1.0);
        } else if (m < 2.5 ) {
            col = vec3(.5 + .3*sin(iTime*6.28318530718 ),0,0);
        } else if (m < 3.5 ) {
            col = vec3(.8,0,0);
        } else if (m < 4.5 ) {
            col = tut_render(pos.xy, 64).rgb;
        }

        // lighitng        
        float occ = calcAO( pos, nor );
		vec3  lig = normalize( vec3(0.4, 0.7, 0.6) );
		float amb = clamp( 0.5+0.5*nor.y, 0.0, 1.0 );
        float dif = clamp( dot( nor, lig ), 0.0, 1.0 );
        float bac = clamp( dot( nor, normalize(vec3(-lig.x,0.0,-lig.z))), 0.0, 1.0 )*clamp( 1.0-pos.y,0.0,1.0);
        float dom = smoothstep( -0.1, 0.1, ref.y );
        float fre = pow( clamp(1.0+dot(nor,rd),0.0,1.0), 2.0 );
		float spe = pow(clamp( dot( ref, lig ), 0.0, 1.0 ),16.0);
        
        dif *= softshadow( pos, lig, 0.02, 2.5 );
        dom *= softshadow( pos, ref, 0.02, 2.5 );

		vec3 lin = vec3(0.0);
        lin += 1.30*dif*vec3(1.00,0.80,0.55);
		lin += 2.00*spe*vec3(1.00,0.90,0.70)*dif;
        lin += 0.40*amb*vec3(0.40,0.60,1.00)*occ;
        lin += 0.50*dom*vec3(0.40,0.60,1.00)*occ;
        lin += 0.50*bac*vec3(0.25,0.25,0.25)*occ;
        lin += 0.25*fre*vec3(1.00,1.00,1.00)*occ;
		col = col*lin;

        
        if( DIST_MODE > 0 ) {
            // intersect with plane;
            float d = -(ro.y)/rd.y;
            vec3 dint = ro + d*rd;
            
            float m = sdSphere(dint-vec3(-1,0,-5),1.);
            
            if( DIST_MODE > 1 ) { 
                m = min( m, sdSphere(dint-vec3(2,0,-3),1.));
                m = min( m, sdSphere(dint-vec3(-2,0,-2),1.));
            }
            if( DIST_MODE > 2 ) { 
                m = min( m, dint.y + 1.);
            }
            vec3 dcol = vec3(abs(mod(m, 0.1)/0.1 - 0.5));
            dcol = mix( dcol, pal( m*.115+.6, vec3(0.5,0.5,0.5),vec3(0.5,0.5,0.5),vec3(1.0,1.0,1.0),vec3(0.0,0.10,0.20) ), .7);
            
            if( SCENE_MODE == 5) {
                for( int i=0; i<intersections.length(); i++ ){
                    if (i<MAX_MARCH_STEPS) {
                        float dti = distance(intersections[i], dint);
                        float mai = map_0(intersections[i]).x;
                        float outer = smoothstep( mai-0.15, mai, dti);
                        dcol = mix( dcol, vec3(1,0,0), .3*smoothstep( mai+0.01, mai, dti)*(outer+1.) );
                    }
                }            
            }
            if( d < t ) {
                col = mix(col, dcol, .6);
            }
        }
        
    	col = mix( col, vec3(0.75,0.9,1.0), .05+.95* smoothstep(10.,20.,t) );
    }

	return vec3( clamp(col,0.0,1.0) );
}

vec3 calcNormal_0( in vec3 pos )
{
    vec2 e = vec2(1.0,-1.0)*0.5773*0.0005;
    
    return normalize( e.xyy*map_0( pos + e.xyy ).x + 
					  e.yyx*map_0( pos + e.yyx ).x + 
					  e.yxy*map_0( pos + e.yxy ).x + 
					  e.xxx*map_0( pos + e.xxx ).x );
}

mat3 setCamera( in vec3 ro, in vec3 ta, float cr )
{
	vec3 cw = normalize(ta-ro);
	vec3 cp = vec3(sin(cr), cos(cr),0.0);
	vec3 cu = normalize( cross(cw,cp) );
	vec3 cv = normalize( cross(cu,cw) );
    return mat3( cu, cv, cw );
}


vec3 renderScene( vec2 p, vec3 ro, vec3 ta ) {
    // camera-to-world transformation
    mat3 ca = setCamera( ro, ta, 0.0 );
    // ray direction
    vec3 rd = ca * normalize( vec3(p.xy,1.0) );
    // render	
    vec3 col = render( ro, rd );
    
    return col;
}


void initIntersecions( in vec3 ro, in vec3 rd ) {
    float t = 1.;
    
    for( int i=0; i<intersections.length(); i++ ){
        vec2 res = map_0( ro+rd*t );
        t += res.x;
        intersections[i] = ro + rd*t;
    }
}

//

void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
    vec2 q = (fragCoord.xy - .5 * iResolution.xy ) / iResolution.y;
    
    aspect = iResolution.x/iResolution.y;
    
    loadData();
    
    if(SCENE_MODE == -1) {
        fragColor = tut_render(q, 96);
    } else {
        vec3 ro = LoadFVec4( ivec2(0,3) ).xyz;
        vec3 ta = LoadFVec4( ivec2(0,4) ).xyz;
        USER_INTERSECT = LoadFVec4( ivec2(0,5) ).xyz;
        
        if( SCENE_MODE == 5 ) {
            MAX_MARCH_STEPS = min(max(int( SLIDE_STEPS_VISIBLE/40-1),0), intersections.length()-1);
            
            initIntersecions(vec3(0,0,1), normalize(USER_INTERSECT - vec3(0,0,1)) );
            for (int i=0; i<intersections.length(); i++) {
                if (i<MAX_MARCH_STEPS+1) {
            		USER_INTERSECT = intersections[i];
                }
            }
        }
        if( SCENE_MODE == 6 ) {
            intersectionNormal = calcNormal_0(USER_INTERSECT) * .5;
        }
        
        fragColor = vec4(renderScene(q, ro, ta),1);
    }
}`,name:`Buffer B`,description:``,type:`buffer`},{inputs:[{id:`4dXGR8`,filepath:`/media/previz/buffer00.png`,type:`buffer`,channel:0,sampler:{filter:`linear`,wrap:`clamp`,vflip:`true`,srgb:`false`,internal:`byte`},published:1},{id:`XsXGR8`,filepath:`/media/previz/buffer01.png`,type:`buffer`,channel:1,sampler:{filter:`linear`,wrap:`clamp`,vflip:`true`,srgb:`false`,internal:`byte`},published:1},{id:`4sXGR8`,filepath:`/media/previz/buffer02.png`,type:`buffer`,channel:2,sampler:{filter:`linear`,wrap:`clamp`,vflip:`true`,srgb:`false`,internal:`byte`},published:1}],outputs:[{id:`4sXGR8`,channel:0}],code:`// [SH17C] Raymarching tutorial. Created by Reinder Nijhoff 2017
// @reindernijhoff
// 
// https://www.shadertoy.com/view/4dSfRc
//
// In this tutorial you will learn how to render a 3d-scene in Shadertoy
// using distance fields.
//
// The tutorial itself is created in Shadertoy, and is rendered
// using ray marching a distance field.
//
// The shader studied in the tutorial can be found here: 
//     https://www.shadertoy.com/view/4dSBz3
//
// Created for the Shadertoy Competition 2017 
//
// Most of the render code is taken from: 'Raymarching - Primitives' by Inigo Quilez.
//
// You can find this shader here:
//     https://www.shadertoy.com/view/Xds3zN
//

// COPY LAST FRAME FOR FADES

#define SLIDE_FADE_STEPS 60 

void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
    int SLIDE_STEPS_VISIBLE = int(texelFetch( iChannel0, ivec2(0,0), 0 ).y);
    
    if(iFrame == 0) {
  		fragColor = vec4(0,0,0,1);
    } else if(SLIDE_STEPS_VISIBLE > SLIDE_FADE_STEPS) {
  		fragColor = texelFetch(iChannel1, ivec2(fragCoord), 0);
    } else {
    	fragColor = texelFetch(iChannel2, ivec2(fragCoord), 0);
    }
}`,name:`Buffer C`,description:``,type:`buffer`},{inputs:[{id:`4dXGzr`,filepath:`/media/a/08b42b43ae9d3c0605da11d0eac86618ea888e62cdd9518ee8b9097488b31560.png`,type:`texture`,channel:2,sampler:{filter:`mipmap`,wrap:`repeat`,vflip:`true`,srgb:`false`,internal:`byte`},published:1},{id:`4dXGR8`,filepath:`/media/previz/buffer00.png`,type:`buffer`,channel:0,sampler:{filter:`linear`,wrap:`clamp`,vflip:`true`,srgb:`false`,internal:`byte`},published:1},{id:`XdfGR8`,filepath:`/media/previz/buffer03.png`,type:`buffer`,channel:1,sampler:{filter:`linear`,wrap:`clamp`,vflip:`true`,srgb:`false`,internal:`byte`},published:1}],outputs:[{id:`XdfGR8`,channel:0}],code:`// [SH17C] Raymarching tutorial. Created by Reinder Nijhoff 2017
// @reindernijhoff
// 
// https://www.shadertoy.com/view/4dSfRc
//
// In this tutorial you will learn how to render a 3d-scene in Shadertoy
// using distance fields.
//
// The tutorial itself is created in Shadertoy, and is rendered
// using ray marching a distance field.
//
// The shader studied in the tutorial can be found here: 
//     https://www.shadertoy.com/view/4dSBz3
//
// Created for the Shadertoy Competition 2017 
//
// Most of the render code is taken from: 'Raymarching - Primitives' by Inigo Quilez.
//
// You can find this shader here:
//     https://www.shadertoy.com/view/Xds3zN
//

// FONT RENDERING

#define FONT_UV_WIDTH 160.

ivec4 LoadVec4( in ivec2 vAddr ) {
    return ivec4( texelFetch( iChannel0, vAddr, 0 ) );
}

void drawStr(const uint str, const ivec2 c, const vec2 uv, const vec2 caret, const float size, const vec3 fontCol, inout vec4 outCol) {    
    if( !(str == 0x0U || c.y < 0 || c.x < 0) ) {
        int x = c.x % 4;
        uint xy = (str >> ((3 - x) * 8)) % 256U;

        if( xy > 0x0aU ) {
            vec2 K = fract((uv - caret) / vec2(size * .45, size));
            K.x = K.x * .6 + .2;
            K.y = K.y * .95 - .05;
            float d = textureLod(iChannel2, (K + vec2( xy & 0xFU, 0xFU - (xy >> 4))) / 16.,0.).a;

            outCol.rgb = mix( fontCol, vec3(0) , smoothstep(.0,1.,smoothstep(.47,.53,d)) * .9 );
            outCol.a = smoothstep(1.,0., smoothstep(.53,.59,d));
        } 
    }
}

void mainImage( out vec4 outCol, in vec2 fragCoord ) {
    ivec4 slideData = LoadVec4( ivec2(0,0) );
    ivec4 text1 = LoadVec4(ivec2(0,1));
    ivec4 text2 = LoadVec4(ivec2(0,2));

    if( text1.x == 1 ) {
        outCol = vec4(0);
    } else {
        outCol = texelFetch(iChannel1, ivec2(fragCoord), 0);    
    }

    vec2 uv = ((fragCoord-iResolution.xy*.5)/iResolution.y) * FONT_UV_WIDTH;

    if(text2.x > 0) { // title
        int i = text2.x;
		uint f = 0x0U;
		if( i == 1 ) {
			ivec2 c = ivec2( (uv - vec2(-79, 60)) * (1./vec2(5.85, -13)) + vec2(1,2)) - 1;
			if(c.y == 0) f = c.x < 4 ? 0x5261796dU : c.x < 8 ? 0x61726368U : c.x < 12 ? 0x696e6720U : c.x < 16 ? 0x64697374U : c.x < 20 ? 0x616e6365U : c.x < 24 ? 0x20666965U : c.x < 28 ? 0x6c647320U : f;
			drawStr( f, c, uv, vec2(-79, 60), 13., vec3(255./255., 208./255., 128./255.), outCol );		}
		else if( i == 2 ) {
			ivec2 c = ivec2( (uv - vec2(-35.1, 60)) * (1./vec2(5.85, -13)) + vec2(1,2)) - 1;
			if(c.y == 0) f = c.x < 4 ? 0x43726561U : c.x < 8 ? 0x74652061U : c.x < 12 ? 0x20726179U : f;
			drawStr( f, c, uv, vec2(-35.1, 60), 13., vec3(255./255., 208./255., 128./255.), outCol );		}
		else if( i == 3 ) {
			ivec2 c = ivec2( (uv - vec2(-43.9, 60)) * (1./vec2(5.85, -13)) + vec2(1,2)) - 1;
			if(c.y == 0) f = c.x < 4 ? 0x44697374U : c.x < 8 ? 0x616e6365U : c.x < 12 ? 0x20666965U : c.x < 16 ? 0x6c647320U : f;
			drawStr( f, c, uv, vec2(-43.9, 60), 13., vec3(255./255., 208./255., 128./255.), outCol );		}
		else if( i == 4 ) {
			ivec2 c = ivec2( (uv - vec2(-23.4, 60)) * (1./vec2(5.85, -13)) + vec2(1,2)) - 1;
			if(c.y == 0) f = c.x < 4 ? 0x4c696768U : c.x < 8 ? 0x74696e67U : f;
			drawStr( f, c, uv, vec2(-23.4, 60), 13., vec3(255./255., 208./255., 128./255.), outCol );		}

    }
    if(text2.y > 0) { // body
        int i = text2.y;
		ivec2 c = ivec2( (uv - vec2(-120, 40)) * (1./vec2(3.6, -8)) + vec2(1,2)) - 1;
		uint f = 0x0U;
		if( i == 1 || i == 2 ) {
			if(c.y == 0) f = c.x < 4 ? 0x496e2074U : c.x < 8 ? 0x68697320U : c.x < 12 ? 0x7475746fU : c.x < 16 ? 0x7269616cU : c.x < 20 ? 0x20796f75U : c.x < 24 ? 0x2077696cU : c.x < 28 ? 0x6c206c65U : c.x < 32 ? 0x61726e20U : c.x < 36 ? 0x686f7720U : c.x < 40 ? 0x746f2072U : c.x < 44 ? 0x656e6465U : c.x < 48 ? 0x7220200aU : f;
			if(c.y == 1) f = c.x < 4 ? 0x61203364U : c.x < 8 ? 0x2d736365U : c.x < 12 ? 0x6e652069U : c.x < 16 ? 0x6e205368U : c.x < 20 ? 0x61646572U : c.x < 24 ? 0x746f7920U : c.x < 28 ? 0x7573696eU : c.x < 32 ? 0x67206469U : c.x < 36 ? 0x7374616eU : c.x < 40 ? 0x63652066U : c.x < 44 ? 0x69656c64U : c.x < 48 ? 0x732e2020U : f;
		}
		if( i == 2 ) {
			if(c.y == 3) f = c.x < 4 ? 0x41732061U : c.x < 8 ? 0x6e206578U : c.x < 12 ? 0x616d706cU : c.x < 16 ? 0x652c2077U : c.x < 20 ? 0x65207769U : c.x < 24 ? 0x6c6c2063U : c.x < 28 ? 0x72656174U : c.x < 32 ? 0x65207468U : c.x < 36 ? 0x69732062U : c.x < 40 ? 0x6c61636bU : c.x < 44 ? 0x20616e64U : c.x < 48 ? 0x2020200aU : f;
			if(c.y == 4) f = c.x < 4 ? 0x77686974U : c.x < 8 ? 0x65207363U : c.x < 12 ? 0x656e6520U : c.x < 16 ? 0x6f662074U : c.x < 20 ? 0x68726565U : c.x < 24 ? 0x20737068U : c.x < 28 ? 0x65726573U : c.x < 32 ? 0x206f6e20U : c.x < 36 ? 0x6120706cU : c.x < 40 ? 0x616e652eU : f;
		}
		else if( i == 3 || i == 4 ) {
			if(c.y == 0) f = c.x < 4 ? 0x46697273U : c.x < 8 ? 0x74207765U : c.x < 12 ? 0x20637265U : c.x < 16 ? 0x61746520U : c.x < 20 ? 0x61207261U : c.x < 24 ? 0x792e200aU : f;
			if(c.y == 1) f = c.x < 4 ? 0x54686520U : c.x < 8 ? 0x72617920U : c.x < 12 ? 0x6f726967U : c.x < 16 ? 0x696e2028U : c.x < 20 ? 0x726f2920U : c.x < 24 ? 0x77696c6cU : c.x < 28 ? 0x20626520U : c.x < 32 ? 0x61742028U : c.x < 36 ? 0x302c302cU : c.x < 40 ? 0x31292e20U : f;
		}
		if( i == 4 ) {
			if(c.y == 3) f = c.x < 4 ? 0x496e2063U : c.x < 8 ? 0x6f64653aU : f;
		}
		else if( i == 5 ) {
			if(c.y == 0) f = c.x < 4 ? 0x4e6f7720U : c.x < 8 ? 0x77652070U : c.x < 12 ? 0x6c616365U : c.x < 16 ? 0x20612076U : c.x < 20 ? 0x69727475U : c.x < 24 ? 0x616c2073U : c.x < 28 ? 0x63726565U : c.x < 32 ? 0x6e20696eU : c.x < 36 ? 0x20746865U : c.x < 40 ? 0x20736365U : c.x < 44 ? 0x6e652e0aU : f;
			if(c.y == 1) f = c.x < 4 ? 0x49742069U : c.x < 8 ? 0x73206c6fU : c.x < 12 ? 0x63617465U : c.x < 16 ? 0x64206174U : c.x < 20 ? 0x20746865U : c.x < 24 ? 0x206f7269U : c.x < 28 ? 0x67696e20U : c.x < 32 ? 0x616e6420U : c.x < 36 ? 0x6861730aU : f;
			if(c.y == 2) f = c.x < 4 ? 0x64696d65U : c.x < 8 ? 0x6e73696fU : c.x < 12 ? 0x6e73206fU : c.x < 16 ? 0x66206173U : c.x < 20 ? 0x70656374U : c.x < 24 ? 0x5f726174U : c.x < 28 ? 0x696f2078U : c.x < 32 ? 0x20312e20U : f;
		}
		else if( i == 6 || i == 7 ) {
			if(c.y == 0) f = c.x < 4 ? 0x57652063U : c.x < 8 ? 0x6f6d7075U : c.x < 12 ? 0x74652074U : c.x < 16 ? 0x68652072U : c.x < 20 ? 0x61792064U : c.x < 24 ? 0x69726563U : c.x < 28 ? 0x74696f6eU : c.x < 32 ? 0x20287264U : c.x < 36 ? 0x2920666fU : c.x < 40 ? 0x72206561U : c.x < 44 ? 0x6368200aU : f;
			if(c.y == 1) f = c.x < 4 ? 0x70697865U : c.x < 8 ? 0x6c202866U : c.x < 12 ? 0x72616743U : c.x < 16 ? 0x6f6f7264U : c.x < 20 ? 0x2e787929U : c.x < 24 ? 0x206f6620U : c.x < 28 ? 0x6f757220U : c.x < 32 ? 0x76697274U : c.x < 36 ? 0x75616c20U : c.x < 40 ? 0x73637265U : c.x < 44 ? 0x656e2e20U : f;
		}
		if( i == 7 ) {
			if(c.y == 3) f = c.x < 4 ? 0x496e2063U : c.x < 8 ? 0x6f64653aU : f;
		}
		else if( i == 8 ) {
			if(c.y == 0) f = c.x < 4 ? 0x55736520U : c.x < 8 ? 0x796f7572U : c.x < 12 ? 0x206d6f75U : c.x < 16 ? 0x73652074U : c.x < 20 ? 0x6f20696eU : c.x < 24 ? 0x74657261U : c.x < 28 ? 0x63742077U : c.x < 32 ? 0x69746820U : c.x < 36 ? 0x74686520U : c.x < 40 ? 0x7363656eU : c.x < 44 ? 0x652e2020U : f;
		}
		else if( i == 9 ) {
			if(c.y == 0) f = c.x < 4 ? 0x41206469U : c.x < 8 ? 0x7374616eU : c.x < 12 ? 0x63652066U : c.x < 16 ? 0x69656c64U : c.x < 20 ? 0x20697320U : c.x < 24 ? 0x75736564U : c.x < 28 ? 0x20746f20U : c.x < 32 ? 0x66696e64U : c.x < 36 ? 0x20746865U : c.x < 40 ? 0x2020200aU : f;
			if(c.y == 1) f = c.x < 4 ? 0x696e7465U : c.x < 8 ? 0x72736563U : c.x < 12 ? 0x74696f6eU : c.x < 16 ? 0x206f6620U : c.x < 20 ? 0x6f757220U : c.x < 24 ? 0x72617920U : c.x < 28 ? 0x28726f2cU : c.x < 32 ? 0x20726429U : c.x < 36 ? 0x20616e64U : c.x < 40 ? 0x20746865U : c.x < 44 ? 0x20737068U : c.x < 48 ? 0x65726573U : c.x < 52 ? 0x2020200aU : f;
			if(c.y == 2) f = c.x < 4 ? 0x616e6420U : c.x < 8 ? 0x706c616eU : c.x < 12 ? 0x65206f66U : c.x < 16 ? 0x20746865U : c.x < 20 ? 0x20736365U : c.x < 24 ? 0x6e652e20U : f;
		}
		else if( i == 10 ) {
			if(c.y == 0) f = c.x < 4 ? 0x41206469U : c.x < 8 ? 0x7374616eU : c.x < 12 ? 0x63652066U : c.x < 16 ? 0x69656c64U : c.x < 20 ? 0x20697320U : c.x < 24 ? 0x61206675U : c.x < 28 ? 0x6e637469U : c.x < 32 ? 0x6f6e2074U : c.x < 36 ? 0x68617420U : c.x < 40 ? 0x67697665U : c.x < 44 ? 0x7320616eU : c.x < 48 ? 0x2020200aU : f;
			if(c.y == 1) f = c.x < 4 ? 0x65737469U : c.x < 8 ? 0x6d617465U : c.x < 12 ? 0x20286120U : c.x < 16 ? 0x6c6f7765U : c.x < 20 ? 0x7220626fU : c.x < 24 ? 0x756e6420U : c.x < 28 ? 0x6f662920U : c.x < 32 ? 0x74686520U : c.x < 36 ? 0x64697374U : c.x < 40 ? 0x616e6365U : c.x < 44 ? 0x20746f20U : c.x < 48 ? 0x7468650aU : f;
			if(c.y == 2) f = c.x < 4 ? 0x636c6f73U : c.x < 8 ? 0x65737420U : c.x < 12 ? 0x73757266U : c.x < 16 ? 0x61636520U : c.x < 20 ? 0x61742061U : c.x < 24 ? 0x6e792070U : c.x < 28 ? 0x6f696e74U : c.x < 32 ? 0x20696e20U : c.x < 36 ? 0x73706163U : c.x < 40 ? 0x652e2020U : f;
		}
		else if( i == 11 ) {
			if(c.y == 0) f = c.x < 4 ? 0x54686520U : c.x < 8 ? 0x64697374U : c.x < 12 ? 0x616e6365U : c.x < 16 ? 0x2066756eU : c.x < 20 ? 0x6374696fU : c.x < 24 ? 0x6e20666fU : c.x < 28 ? 0x72206120U : c.x < 32 ? 0x73706865U : c.x < 36 ? 0x72652069U : c.x < 40 ? 0x73207468U : c.x < 44 ? 0x65206469U : c.x < 48 ? 0x7374616eU : c.x < 52 ? 0x63652074U : c.x < 56 ? 0x6f20200aU : f;
			if(c.y == 1) f = c.x < 4 ? 0x74686520U : c.x < 8 ? 0x63656e74U : c.x < 12 ? 0x6572206fU : c.x < 16 ? 0x66207468U : c.x < 20 ? 0x65207370U : c.x < 24 ? 0x68657265U : c.x < 28 ? 0x206d696eU : c.x < 32 ? 0x75732074U : c.x < 36 ? 0x68652072U : c.x < 40 ? 0x61646975U : c.x < 44 ? 0x73206f66U : c.x < 48 ? 0x20746865U : c.x < 52 ? 0x20737068U : c.x < 56 ? 0x6572652eU : f;
		}
		else if( i == 12 ) {
			if(c.y == 0) f = c.x < 4 ? 0x54686520U : c.x < 8 ? 0x636f6465U : c.x < 12 ? 0x20666f72U : c.x < 16 ? 0x20612073U : c.x < 20 ? 0x70686572U : c.x < 24 ? 0x65206c6fU : c.x < 28 ? 0x63617465U : c.x < 32 ? 0x64206174U : c.x < 36 ? 0x20282d31U : c.x < 40 ? 0x2c302c2dU : c.x < 44 ? 0x35293a20U : f;
		}
		else if( i == 13 || i == 14 ) {
			if(c.y == 0) f = c.x < 4 ? 0x57652063U : c.x < 8 ? 0x6f6d6269U : c.x < 12 ? 0x6e652064U : c.x < 16 ? 0x69666665U : c.x < 20 ? 0x72656e74U : c.x < 24 ? 0x20646973U : c.x < 28 ? 0x74616e63U : c.x < 32 ? 0x65206675U : c.x < 36 ? 0x6e637469U : c.x < 40 ? 0x6f6e7320U : c.x < 44 ? 0x62792074U : c.x < 48 ? 0x616b696eU : c.x < 52 ? 0x6720200aU : f;
			if(c.y == 1) f = c.x < 4 ? 0x74686520U : c.x < 8 ? 0x6d696e69U : c.x < 12 ? 0x6d756d20U : c.x < 16 ? 0x76616c75U : c.x < 20 ? 0x65206f66U : c.x < 24 ? 0x20746865U : c.x < 28 ? 0x73652066U : c.x < 32 ? 0x756e6374U : c.x < 36 ? 0x696f6e73U : c.x < 40 ? 0x2e202020U : f;
		}
		if( i == 14 ) {
			if(c.y == 3) f = c.x < 4 ? 0x496e2063U : c.x < 8 ? 0x6f64653aU : f;
		}
		else if( i == 15 ) {
			if(c.y == 0) f = c.x < 4 ? 0x54686520U : c.x < 8 ? 0x746f7461U : c.x < 12 ? 0x6c206469U : c.x < 16 ? 0x7374616eU : c.x < 20 ? 0x63652066U : c.x < 24 ? 0x756e6374U : c.x < 28 ? 0x696f6e20U : c.x < 32 ? 0x666f7220U : c.x < 36 ? 0x74686973U : c.x < 40 ? 0x20736365U : c.x < 44 ? 0x6e65200aU : f;
			if(c.y == 1) f = c.x < 4 ? 0x28696e63U : c.x < 8 ? 0x6c756469U : c.x < 12 ? 0x6e672074U : c.x < 16 ? 0x68652070U : c.x < 20 ? 0x6c616e65U : c.x < 24 ? 0x29206973U : c.x < 28 ? 0x20676976U : c.x < 32 ? 0x656e2062U : c.x < 36 ? 0x793a2020U : f;
		}
		else if( i == 16 || i == 17 ) {
			if(c.y == 0) f = c.x < 4 ? 0x4e6f7720U : c.x < 8 ? 0x77652063U : c.x < 12 ? 0x616e206dU : c.x < 16 ? 0x61726368U : c.x < 20 ? 0x20746865U : c.x < 24 ? 0x20736365U : c.x < 28 ? 0x6e652066U : c.x < 32 ? 0x726f6d20U : c.x < 36 ? 0x726f2069U : c.x < 40 ? 0x6e206469U : c.x < 44 ? 0x72656374U : c.x < 48 ? 0x696f6e20U : c.x < 52 ? 0x72642e0aU : f;
			if(c.y == 1) f = c.x < 4 ? 0x45616368U : c.x < 8 ? 0x20737465U : c.x < 12 ? 0x70207369U : c.x < 16 ? 0x7a652069U : c.x < 20 ? 0x73206769U : c.x < 24 ? 0x76656e20U : c.x < 28 ? 0x62792074U : c.x < 32 ? 0x68652064U : c.x < 36 ? 0x69737461U : c.x < 40 ? 0x6e636520U : c.x < 44 ? 0x6669656cU : c.x < 48 ? 0x642e2020U : f;
		}
		if( i == 17 ) {
			if(c.y == 3) f = c.x < 4 ? 0x57652073U : c.x < 8 ? 0x746f7020U : c.x < 12 ? 0x74686520U : c.x < 16 ? 0x6d617263U : c.x < 20 ? 0x68207768U : c.x < 24 ? 0x656e2077U : c.x < 28 ? 0x65206669U : c.x < 32 ? 0x6e642061U : c.x < 36 ? 0x6e20696eU : c.x < 40 ? 0x74657273U : c.x < 44 ? 0x65637469U : c.x < 48 ? 0x6f6e3a20U : f;
		}
		else if( i == 18 ) {
			if(c.y == 0) f = c.x < 4 ? 0x4e6f7720U : c.x < 8 ? 0x74686174U : c.x < 12 ? 0x20776520U : c.x < 16 ? 0x68617665U : c.x < 20 ? 0x20666f75U : c.x < 24 ? 0x6e642074U : c.x < 28 ? 0x68652069U : c.x < 32 ? 0x6e746572U : c.x < 36 ? 0x73656374U : c.x < 40 ? 0x696f6e20U : c.x < 44 ? 0x2870203dU : c.x < 48 ? 0x20726f20U : c.x < 52 ? 0x2b207264U : c.x < 56 ? 0x202a2074U : c.x < 60 ? 0x2920200aU : f;
			if(c.y == 1) f = c.x < 4 ? 0x666f7220U : c.x < 8 ? 0x6f757220U : c.x < 12 ? 0x7261792cU : c.x < 16 ? 0x20776520U : c.x < 20 ? 0x63616e20U : c.x < 24 ? 0x67697665U : c.x < 28 ? 0x20746865U : c.x < 32 ? 0x20736365U : c.x < 36 ? 0x6e652073U : c.x < 40 ? 0x6f6d6520U : c.x < 44 ? 0x6c696768U : c.x < 48 ? 0x74696e67U : c.x < 52 ? 0x2e20200aU : f;
			if(c.y == 2) f = c.x < 4 ? 0x2020200aU : f;
			if(c.y == 3) f = c.x < 4 ? 0x546f2061U : c.x < 8 ? 0x70706c79U : c.x < 12 ? 0x20646966U : c.x < 16 ? 0x66757365U : c.x < 20 ? 0x206c6967U : c.x < 24 ? 0x6874696eU : c.x < 28 ? 0x67207765U : c.x < 32 ? 0x20686176U : c.x < 36 ? 0x6520746fU : c.x < 40 ? 0x2063616cU : c.x < 44 ? 0x63756c61U : c.x < 48 ? 0x7465200aU : f;
			if(c.y == 4) f = c.x < 4 ? 0x74686520U : c.x < 8 ? 0x6e6f726dU : c.x < 12 ? 0x616c206fU : c.x < 16 ? 0x66207368U : c.x < 20 ? 0x6164696eU : c.x < 24 ? 0x6720706fU : c.x < 28 ? 0x696e7420U : c.x < 32 ? 0x702e2020U : f;
		}
		else if( i == 19 ) {
			if(c.y == 0) f = c.x < 4 ? 0x54686520U : c.x < 8 ? 0x6e6f726dU : c.x < 12 ? 0x616c2063U : c.x < 16 ? 0x616e2062U : c.x < 20 ? 0x65206361U : c.x < 24 ? 0x6c63756cU : c.x < 28 ? 0x61746564U : c.x < 32 ? 0x20627920U : c.x < 36 ? 0x74616b69U : c.x < 40 ? 0x6e672074U : c.x < 44 ? 0x68652063U : c.x < 48 ? 0x656e7472U : c.x < 52 ? 0x616c200aU : f;
			if(c.y == 1) f = c.x < 4 ? 0x64696666U : c.x < 8 ? 0x6572656eU : c.x < 12 ? 0x63657320U : c.x < 16 ? 0x6f6e2074U : c.x < 20 ? 0x68652064U : c.x < 24 ? 0x69737461U : c.x < 28 ? 0x6e636520U : c.x < 32 ? 0x6669656cU : c.x < 36 ? 0x643a2020U : f;
		}
		else if( i == 20 || i == 21 ) {
			if(c.y == 0) f = c.x < 4 ? 0x57652063U : c.x < 8 ? 0x616c6375U : c.x < 12 ? 0x6c617465U : c.x < 16 ? 0x20746865U : c.x < 20 ? 0x20646966U : c.x < 24 ? 0x66757365U : c.x < 28 ? 0x206c6967U : c.x < 32 ? 0x6874696eU : c.x < 36 ? 0x6720666fU : c.x < 40 ? 0x7220610aU : f;
			if(c.y == 1) f = c.x < 4 ? 0x706f696eU : c.x < 8 ? 0x74206c69U : c.x < 12 ? 0x67687420U : c.x < 16 ? 0x61742070U : c.x < 20 ? 0x6f736974U : c.x < 24 ? 0x696f6e20U : c.x < 28 ? 0x28302c32U : c.x < 32 ? 0x2c30292eU : f;
		}
		if( i == 21 ) {
			if(c.y == 3) f = c.x < 4 ? 0x496e2063U : c.x < 8 ? 0x6f64653aU : f;
		}
		else if( i == 22 ) {
			if(c.y == 0) f = c.x < 4 ? 0x416e6420U : c.x < 8 ? 0x77652061U : c.x < 12 ? 0x72652064U : c.x < 16 ? 0x6f6e6521U : c.x < 20 ? 0x2020200aU : f;
			if(c.y == 1) f = c.x < 4 ? 0x2020200aU : f;
			if(c.y == 2) f = c.x < 4 ? 0x41646469U : c.x < 8 ? 0x6e672061U : c.x < 12 ? 0x6d626965U : c.x < 16 ? 0x6e74206fU : c.x < 20 ? 0x63636c75U : c.x < 24 ? 0x73696f6eU : c.x < 28 ? 0x2c202866U : c.x < 32 ? 0x616b6529U : c.x < 36 ? 0x20726566U : c.x < 40 ? 0x6c656374U : c.x < 44 ? 0x696f6e73U : c.x < 48 ? 0x2c20200aU : f;
			if(c.y == 3) f = c.x < 4 ? 0x736f6674U : c.x < 8 ? 0x20736861U : c.x < 12 ? 0x646f7773U : c.x < 16 ? 0x2c20666fU : c.x < 20 ? 0x672c2061U : c.x < 24 ? 0x6d626965U : c.x < 28 ? 0x6e74206cU : c.x < 32 ? 0x69676874U : c.x < 36 ? 0x696e6720U : c.x < 40 ? 0x616e6420U : c.x < 44 ? 0x73706563U : c.x < 48 ? 0x756c6172U : c.x < 52 ? 0x206c6967U : c.x < 56 ? 0x6874696eU : c.x < 60 ? 0x6720200aU : f;
			if(c.y == 4) f = c.x < 4 ? 0x6973206cU : c.x < 8 ? 0x65667420U : c.x < 12 ? 0x61732061U : c.x < 16 ? 0x6e206578U : c.x < 20 ? 0x65726369U : c.x < 24 ? 0x73652066U : c.x < 28 ? 0x6f722074U : c.x < 32 ? 0x68652072U : c.x < 36 ? 0x65616465U : c.x < 40 ? 0x722e2020U : f;
		}
		drawStr( f, c, uv, vec2(-120, 40), 8., vec3(1), outCol );
    }
    if(text2.z > 0) { // code
        int i = text2.z;
		ivec2 c = ivec2( (uv - vec2(-120, 0)) * (1./vec2(3.6, -8)) + vec2(1,2)) - 1;
		uint f = 0x0U;
		if( i == 1 ) {
			if(c.y == 0) f = c.x < 4 ? 0x766f6964U : c.x < 8 ? 0x206d6169U : c.x < 12 ? 0x6e496d61U : c.x < 16 ? 0x6765286fU : c.x < 20 ? 0x75742076U : c.x < 24 ? 0x65633420U : c.x < 28 ? 0x66726167U : c.x < 32 ? 0x436f6c6fU : c.x < 36 ? 0x722c2069U : c.x < 40 ? 0x6e207665U : c.x < 44 ? 0x63322066U : c.x < 48 ? 0x72616743U : c.x < 52 ? 0x6f6f7264U : c.x < 56 ? 0x29207b0aU : f;
			if(c.y == 1) f = c.x < 4 ? 0x20202020U : c.x < 8 ? 0x76656333U : c.x < 12 ? 0x20726f20U : c.x < 16 ? 0x3d207665U : c.x < 20 ? 0x63332830U : c.x < 24 ? 0x2c20302cU : c.x < 28 ? 0x2031293bU : c.x < 32 ? 0x2020200aU : f;
			if(c.y == 2) f = c.x < 4 ? 0x2020200aU : f;
			if(c.y == 3) f = c.x < 4 ? 0x20202020U : c.x < 8 ? 0x76656332U : c.x < 12 ? 0x2071203dU : c.x < 16 ? 0x20286672U : c.x < 20 ? 0x6167436fU : c.x < 24 ? 0x6f72642eU : c.x < 28 ? 0x7879202dU : c.x < 32 ? 0x202e3520U : c.x < 36 ? 0x2a206952U : c.x < 40 ? 0x65736f6cU : c.x < 44 ? 0x7574696fU : c.x < 48 ? 0x6e2e7879U : c.x < 52 ? 0x2029202fU : c.x < 56 ? 0x20695265U : c.x < 60 ? 0x736f6c75U : c.x < 64 ? 0x74696f6eU : c.x < 68 ? 0x2e793b0aU : f;
			if(c.y == 4) f = c.x < 4 ? 0x20202020U : c.x < 8 ? 0x76656333U : c.x < 12 ? 0x20726420U : c.x < 16 ? 0x3d206e6fU : c.x < 20 ? 0x726d616cU : c.x < 24 ? 0x697a6528U : c.x < 28 ? 0x76656333U : c.x < 32 ? 0x28712c20U : c.x < 36 ? 0x302e2920U : c.x < 40 ? 0x2d20726fU : c.x < 44 ? 0x293b200aU : f;
		}
		else if( i == 2 ) {
			if(c.y == 0) f = c.x < 4 ? 0x666c6f61U : c.x < 8 ? 0x74206d61U : c.x < 12 ? 0x70287665U : c.x < 16 ? 0x63332070U : c.x < 20 ? 0x29207b0aU : f;
			if(c.y == 1) f = c.x < 4 ? 0x20202020U : c.x < 8 ? 0x666c6f61U : c.x < 12 ? 0x74206420U : c.x < 16 ? 0x3d206469U : c.x < 20 ? 0x7374616eU : c.x < 24 ? 0x63652870U : c.x < 28 ? 0x2c207665U : c.x < 32 ? 0x6333282dU : c.x < 36 ? 0x312c2030U : c.x < 40 ? 0x2c202d35U : c.x < 44 ? 0x2929202dU : c.x < 48 ? 0x20312e3bU : c.x < 52 ? 0x2020200aU : f;
			if(c.y == 2) f = c.x < 4 ? 0x20202020U : c.x < 8 ? 0x64203d20U : c.x < 12 ? 0x6d696e28U : c.x < 16 ? 0x642c2064U : c.x < 20 ? 0x69737461U : c.x < 24 ? 0x6e636528U : c.x < 28 ? 0x702c2076U : c.x < 32 ? 0x65633328U : c.x < 36 ? 0x322c2030U : c.x < 40 ? 0x2c202d33U : c.x < 44 ? 0x2929202dU : c.x < 48 ? 0x20312e29U : c.x < 52 ? 0x3b20200aU : f;
			if(c.y == 3) f = c.x < 4 ? 0x20202020U : c.x < 8 ? 0x64203d20U : c.x < 12 ? 0x6d696e28U : c.x < 16 ? 0x642c2064U : c.x < 20 ? 0x69737461U : c.x < 24 ? 0x6e636528U : c.x < 28 ? 0x702c2076U : c.x < 32 ? 0x65633328U : c.x < 36 ? 0x2d322c20U : c.x < 40 ? 0x302c202dU : c.x < 44 ? 0x32292920U : c.x < 48 ? 0x2d20312eU : c.x < 52 ? 0x293b200aU : f;
			if(c.y == 4) f = c.x < 4 ? 0x20202020U : c.x < 8 ? 0x64203d20U : c.x < 12 ? 0x6d696e28U : c.x < 16 ? 0x642c2070U : c.x < 20 ? 0x2e79202bU : c.x < 24 ? 0x20312e29U : c.x < 28 ? 0x3b20200aU : f;
			if(c.y == 5) f = c.x < 4 ? 0x20202020U : c.x < 8 ? 0x72657475U : c.x < 12 ? 0x726e2064U : c.x < 16 ? 0x3b20200aU : f;
			if(c.y == 6) f = c.x < 4 ? 0x7d202020U : f;
		}
		else if( i == 3 ) {
			if(c.y == 0) f = c.x < 4 ? 0x666c6f61U : c.x < 8 ? 0x7420682cU : c.x < 12 ? 0x2074203dU : c.x < 16 ? 0x20312e3bU : c.x < 20 ? 0x2020200aU : f;
			if(c.y == 1) f = c.x < 4 ? 0x666f7220U : c.x < 8 ? 0x28696e74U : c.x < 12 ? 0x2069203dU : c.x < 16 ? 0x20303b20U : c.x < 20 ? 0x69203c20U : c.x < 24 ? 0x3235363bU : c.x < 28 ? 0x20692b2bU : c.x < 32 ? 0x29207b0aU : f;
			if(c.y == 2) f = c.x < 4 ? 0x20202020U : c.x < 8 ? 0x68203d20U : c.x < 12 ? 0x6d617028U : c.x < 16 ? 0x726f202bU : c.x < 20 ? 0x20726420U : c.x < 24 ? 0x2a207429U : c.x < 28 ? 0x3b20200aU : f;
			if(c.y == 3) f = c.x < 4 ? 0x20202020U : c.x < 8 ? 0x74202b3dU : c.x < 12 ? 0x20683b0aU : f;
			if(c.y == 4) f = c.x < 4 ? 0x20202020U : c.x < 8 ? 0x69662028U : c.x < 12 ? 0x68203c20U : c.x < 16 ? 0x302e3031U : c.x < 20 ? 0x29206272U : c.x < 24 ? 0x65616b3bU : c.x < 28 ? 0x2020200aU : f;
			if(c.y == 5) f = c.x < 4 ? 0x7d202020U : f;
		}
		else if( i == 4 ) {
			if(c.y == 0) f = c.x < 4 ? 0x76656333U : c.x < 8 ? 0x2063616cU : c.x < 12 ? 0x634e6f72U : c.x < 16 ? 0x6d616c28U : c.x < 20 ? 0x696e2076U : c.x < 24 ? 0x65633320U : c.x < 28 ? 0x7029207bU : c.x < 32 ? 0x2020200aU : f;
			if(c.y == 1) f = c.x < 4 ? 0x20202020U : c.x < 8 ? 0x76656332U : c.x < 12 ? 0x2065203dU : c.x < 16 ? 0x20766563U : c.x < 20 ? 0x3228312eU : c.x < 24 ? 0x302c202dU : c.x < 28 ? 0x312e3029U : c.x < 32 ? 0x202a2030U : c.x < 36 ? 0x2e303030U : c.x < 40 ? 0x353b200aU : f;
			if(c.y == 2) f = c.x < 4 ? 0x20202020U : c.x < 8 ? 0x72657475U : c.x < 12 ? 0x726e206eU : c.x < 16 ? 0x6f726d61U : c.x < 20 ? 0x6c697a65U : c.x < 24 ? 0x2820200aU : f;
			if(c.y == 3) f = c.x < 4 ? 0x20202020U : c.x < 8 ? 0x20202020U : c.x < 12 ? 0x652e7879U : c.x < 16 ? 0x79202a20U : c.x < 20 ? 0x6d617028U : c.x < 24 ? 0x70202b20U : c.x < 28 ? 0x652e7879U : c.x < 32 ? 0x7929202bU : c.x < 36 ? 0x2020200aU : f;
			if(c.y == 4) f = c.x < 4 ? 0x20202020U : c.x < 8 ? 0x20202020U : c.x < 12 ? 0x652e7979U : c.x < 16 ? 0x78202a20U : c.x < 20 ? 0x6d617028U : c.x < 24 ? 0x70202b20U : c.x < 28 ? 0x652e7979U : c.x < 32 ? 0x7829202bU : c.x < 36 ? 0x2020200aU : f;
			if(c.y == 5) f = c.x < 4 ? 0x20202020U : c.x < 8 ? 0x20202020U : c.x < 12 ? 0x652e7978U : c.x < 16 ? 0x79202a20U : c.x < 20 ? 0x6d617028U : c.x < 24 ? 0x70202b20U : c.x < 28 ? 0x652e7978U : c.x < 32 ? 0x7929202bU : c.x < 36 ? 0x2020200aU : f;
			if(c.y == 6) f = c.x < 4 ? 0x20202020U : c.x < 8 ? 0x20202020U : c.x < 12 ? 0x652e7878U : c.x < 16 ? 0x78202a20U : c.x < 20 ? 0x6d617028U : c.x < 24 ? 0x70202b20U : c.x < 28 ? 0x652e7878U : c.x < 32 ? 0x7829293bU : c.x < 36 ? 0x2020200aU : f;
			if(c.y == 7) f = c.x < 4 ? 0x7d202020U : f;
		}
		else if( i == 5 ) {
			if(c.y == 0) f = c.x < 4 ? 0x69662028U : c.x < 8 ? 0x68203c20U : c.x < 12 ? 0x302e3031U : c.x < 16 ? 0x29207b0aU : f;
			if(c.y == 1) f = c.x < 4 ? 0x20202020U : c.x < 8 ? 0x76656333U : c.x < 12 ? 0x2070203dU : c.x < 16 ? 0x20726f20U : c.x < 20 ? 0x2b207264U : c.x < 24 ? 0x202a2074U : c.x < 28 ? 0x3b20200aU : f;
			if(c.y == 2) f = c.x < 4 ? 0x20202020U : c.x < 8 ? 0x76656333U : c.x < 12 ? 0x206e6f72U : c.x < 16 ? 0x6d616c20U : c.x < 20 ? 0x3d206361U : c.x < 24 ? 0x6c634e6fU : c.x < 28 ? 0x726d616cU : c.x < 32 ? 0x2870293bU : c.x < 36 ? 0x2020200aU : f;
			if(c.y == 3) f = c.x < 4 ? 0x20202020U : c.x < 8 ? 0x76656333U : c.x < 12 ? 0x206c6967U : c.x < 16 ? 0x6874203dU : c.x < 20 ? 0x20766563U : c.x < 24 ? 0x3328302cU : c.x < 28 ? 0x20322c20U : c.x < 32 ? 0x30293b0aU : f;
			if(c.y == 4) f = c.x < 4 ? 0x2020200aU : f;
			if(c.y == 5) f = c.x < 4 ? 0x20202020U : c.x < 8 ? 0x666c6f61U : c.x < 12 ? 0x74206469U : c.x < 16 ? 0x66203d20U : c.x < 20 ? 0x636c616dU : c.x < 24 ? 0x7028646fU : c.x < 28 ? 0x74286e6fU : c.x < 32 ? 0x726d616cU : c.x < 36 ? 0x2c206e6fU : c.x < 40 ? 0x726d616cU : c.x < 44 ? 0x697a6528U : c.x < 48 ? 0x6c696768U : c.x < 52 ? 0x74202d20U : c.x < 56 ? 0x7029292cU : c.x < 60 ? 0x20302e2cU : c.x < 64 ? 0x20312e29U : c.x < 68 ? 0x3b20200aU : f;
			if(c.y == 6) f = c.x < 4 ? 0x20202020U : c.x < 8 ? 0x64696620U : c.x < 12 ? 0x2a3d2035U : c.x < 16 ? 0x2e202f20U : c.x < 20 ? 0x646f7428U : c.x < 24 ? 0x6c696768U : c.x < 28 ? 0x74202d20U : c.x < 32 ? 0x702c206cU : c.x < 36 ? 0x69676874U : c.x < 40 ? 0x202d2070U : c.x < 44 ? 0x293b200aU : f;
			if(c.y == 7) f = c.x < 4 ? 0x20202020U : c.x < 8 ? 0x66726167U : c.x < 12 ? 0x436f6c6fU : c.x < 16 ? 0x72203d20U : c.x < 20 ? 0x76656334U : c.x < 24 ? 0x28766563U : c.x < 28 ? 0x3328706fU : c.x < 32 ? 0x77286469U : c.x < 36 ? 0x662c2030U : c.x < 40 ? 0x2e343534U : c.x < 44 ? 0x3529292cU : c.x < 48 ? 0x2031293bU : c.x < 52 ? 0x2020200aU : f;
			if(c.y == 8) f = c.x < 4 ? 0x7d202020U : f;
		}
		drawStr( f, c, uv, vec2(-120, 0), 8., vec3(.8,.95,1.), outCol );
        if( text1.y > 0 ) {
           if(uv.y >  - (-1.+float(text1.y))*8. && c.y >= 0 ) {
                outCol *= vec4(.5,.2,.6,.8);
            }
        }
        if( text1.z > 0 ) {
            if(uv.y <  - (-2.+float(text1.z))*8. && c.y >= 0 ) {
                outCol *= vec4(.5,.2,.6,.8);
            }
        }
    }
    if(slideData.y == 120) { // footer
        int i = 1;
		uint f = 0x0U;
		if( i == 1 ) {
			ivec2 c = ivec2( (uv - vec2(-38.8, -78)) * (1./vec2(3.38, -7.5)) + vec2(1,2)) - 1;
			if(c.y == 0) f = c.x < 4 ? 0x50726573U : c.x < 8 ? 0x73207370U : c.x < 12 ? 0x61636520U : c.x < 16 ? 0x746f2063U : c.x < 20 ? 0x6f6e7469U : c.x < 24 ? 0x6e756520U : f;
			drawStr( f, c, uv, vec2(-38.8, -78), 7.5, vec3(.9), outCol );		}

    }
}`,name:`Buffer D`,description:``,type:`buffer`}]},{ver:`0.1`,info:{id:`MtfBDN`,date:`1511863416`,viewed:1406,name:`Contrast speed illusion`,description:`Both rectangles are moving at exactly the same speed.

Based on the [url=https://scratch.mit.edu/projects/188838060/]flash implementation[/url] by Jim Cash and https://quote.ucsd.edu/anstislab/files/2012/11/2001-Footsteps-and-inchworms.pdf.`,likes:25,published:`Public API`,usePreview:0,tags:[`contrast`,`illusion`,`speed`,`perception`]},renderpass:[{inputs:[],outputs:[{id:`4dfGRr`,channel:0}],code:`// Contrast speed illusion. Created by Reinder Nijhoff 2017
// Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License.
// @reindernijhoff
// 
// https://www.shadertoy.com/view/MtfBDN
//
// Both rectangles are moving at exactly the same speed.
//
// Based on the flash implementation by Jim Cash: https://scratch.mit.edu/projects/188838060/
//
// Research paper:
//
// https://quote.ucsd.edu/anstislab/files/2012/11/2001-Footsteps-and-inchworms.pdf
//

void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
	vec2 uv = fragCoord.xy / iResolution.xy;
    float scale = iResolution.x / 300.;
    
    float fade = smoothstep(0.1,0.2,abs(fract(iTime*.05+.5)-.5));
    
    vec3 bgpattern = vec3(round(fract(uv.x*20.*scale)-.02*scale));
    // vec3 bgpattern = .6+.6*cos(6.28*uv.x*20.*scale+vec3(0,-2.1,2.1));
    // vec3 bgpattern = vec3(.5+.5*sin(6.28*uv.x*20.*scale));
    
    vec3 c = mix(vec3(.7), bgpattern, fade);
    
    float p = fract(iTime*.1/scale);
    float x = step(uv.x,p+.3/scale)*step(p,uv.x);
    
    c = mix(c, vec3(1,1,0), x*step(abs(uv.y-.3),.03));
    c = mix(c, vec3(0,0,0.7), x*step(abs(uv.y-.7),.03));
    
	fragColor = vec4(c,1.0);
}`,name:`Image`,description:``,type:`image`}]},{ver:`0.1`,info:{id:`lscBW4`,date:`1525112497`,viewed:21447,name:`Old watch (IBL)`,description:`This shader uses Image Based Lighting (IBL) to render an old watch. The materials of the objects have physically-based properties. I have used the IBL technique as explained in the article 'Real Shading in Unreal Engine 4' by Brian Karis of Epic Games.`,likes:278,published:`Public API`,usePreview:1,tags:[`lighting`,`clock`,`image`,`ibl`,`vr`,`pbr`,`watch`,`based`]},renderpass:[{inputs:[{id:`XsfGRn`,filepath:`/media/a/1f7dca9c22f324751f2a5a59c9b181dfe3b5564a04b724c657732d0bf09c99db.jpg`,type:`texture`,channel:1,sampler:{filter:`mipmap`,wrap:`repeat`,vflip:`true`,srgb:`false`,internal:`byte`},published:1},{id:`XsfGzn`,filepath:`/media/a/585f9546c092f53ded45332b343144396c0b2d70d9965f585ebc172080d8aa58.jpg`,type:`cubemap`,channel:0,sampler:{filter:`mipmap`,wrap:`repeat`,vflip:`false`,srgb:`false`,internal:`byte`},published:1},{id:`4dXGR8`,filepath:`/media/previz/buffer00.png`,type:`buffer`,channel:2,sampler:{filter:`linear`,wrap:`clamp`,vflip:`true`,srgb:`false`,internal:`byte`},published:1},{id:`XsXGR8`,filepath:`/media/previz/buffer01.png`,type:`buffer`,channel:3,sampler:{filter:`linear`,wrap:`clamp`,vflip:`true`,srgb:`false`,internal:`byte`},published:1}],outputs:[{id:`4dfGRr`,channel:0}],code:`// Old watch (IBL). Created by Reinder Nijhoff 2018
// Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License.
// @reindernijhoff
//
// https://www.shadertoy.com/view/lscBW4
//
// This shader uses Image Based Lighting (IBL) to render an old watch. The
// materials of the objects have physically-based properties.
//
// A material is defined by its albedo and roughness value and it can be a 
// metal or a non-metal.
//
// I have used the IBL technique as explained in the article 'Real Shading in
// Unreal Engine 4' by Brian Karis of Epic Games.[1] According to this article,
// the lighting of a material is the sum of two components:
// 
// 1. Diffuse: a look-up (using the normal vector) in a pre-computed environment map.
// 2. Specular: a look-up (based on the reflection vector and the roughness of the
//       material) in a pre-computed environment map, combined with a look-up in a
//       pre-calculated BRDF integration map (Buf B).  
// 
// Note that I do NOT (pre)compute the environment maps needed in this shader. Instead,
// I use (the lod levels of) a Shadertoy cubemap that I have remapped using a random 
// function to get something HDR-ish. This is not correct and not how it is described
// in the article, but I think that for this scene the result is good enough.
//
// I made a shader that renders this same scene using a simple path tracer. You can
// compare the result here:
//
// https://www.shadertoy.com/view/MlyyzW
//
// [1] http://blog.selfshadow.com/publications/s2013-shading-course/karis/s2013_pbs_epic_notes_v2.pdf
//

#define MAX_LOD 8.
#define DIFFUSE_LOD 6.75
#define AA 2
// #define P_MALIN_AO 

vec3 getSpecularLightColor( vec3 N, float roughness ) {
    // This is not correct. You need to do a look up in a correctly pre-computed HDR environment map.
    return pow(textureLod(iChannel0, N, roughness * MAX_LOD).rgb, vec3(4.5)) * 6.5;
}

vec3 getDiffuseLightColor( vec3 N ) {
    // This is not correct. You need to do a look up in a correctly pre-computed HDR environment map.
    return .25 +pow(textureLod(iChannel0, N, DIFFUSE_LOD).rgb, vec3(3.)) * 1.;
}

//
// Modified FrenelSchlick: https://seblagarde.wordpress.com/2011/08/17/hello-world/
//
vec3 FresnelSchlickRoughness(float cosTheta, vec3 F0, float roughness) {
    return F0 + (max(vec3(1.0 - roughness), F0) - F0) * pow(1.0 - cosTheta, 5.0);
}

//
// Image based lighting
//

vec3 lighting(in vec3 ro, in vec3 pos, in vec3 N, in vec3 albedo, in float ao, in float roughness, in float metallic ) {
    vec3 V = normalize(ro - pos); 
    vec3 R = reflect(-V, N);
    float NdotV = max(0.0, dot(N, V));

    vec3 F0 = vec3(0.04); 
    F0 = mix(F0, albedo, metallic);

    vec3 F = FresnelSchlickRoughness(NdotV, F0, roughness);

    vec3 kS = F;

    vec3 prefilteredColor = getSpecularLightColor(R, roughness);
    vec2 envBRDF = texture(iChannel3, vec2(NdotV, roughness)).rg;
    vec3 specular = prefilteredColor * (F * envBRDF.x + envBRDF.y);

    vec3 kD = vec3(1.0) - kS;

    kD *= 1.0 - metallic;

    vec3 irradiance = getDiffuseLightColor(N);

    vec3 diffuse  = albedo * irradiance;

#ifdef P_MALIN_AO
    vec3 color = kD * diffuse * ao + specular * calcAO(pos, R);
#else
    vec3 color = (kD * diffuse + specular) * ao;
#endif

    return color;
}

//
// main 
//

vec3 render( const in vec3 ro, const in vec3 rd ) {
    vec3 col = vec3(0); 
    vec2 res = castRay( ro, rd );

    if (res.x > 0.) {
        vec3 pos = ro + rd * res.x;
        vec3 N, albedo;
        float roughness, metallic, ao;

        getMaterialProperties(pos, res.y, N, albedo, ao, roughness, metallic, iChannel1, iChannel2, iChannel3);

        col = lighting(ro, pos, N, albedo, ao, roughness, metallic);
        col *= max(0.0, min(1.1, 10./dot(pos,pos)) - .15);
    }

    // Glass. 
    float glass = castRayGlass( ro, rd );
    if (glass > 0. && (glass < res.x || res.x < 0.)) {
        vec3 N = calcNormalGlass(ro+rd*glass);
        vec3 pos = ro + rd * glass;

        vec3 V = normalize(ro - pos); 
        vec3 R = reflect(-V, N);
        float NdotV = max(0.0, dot(N, V));

        float roughness = texture(iChannel2, pos.xz*.5 + .5).g;

        vec3 F = FresnelSchlickRoughness(NdotV, vec3(.08), roughness);
        vec3 prefilteredColor = getSpecularLightColor(R, roughness);
        vec2 envBRDF = texture(iChannel3, vec2(NdotV, roughness)).rg;
        vec3 specular = prefilteredColor * (F * envBRDF.x + envBRDF.y);

        col = col * (1.0 -  (F * envBRDF.x + envBRDF.y) ) + specular;
    } 

    // gamma correction
    col = max( vec3(0), col - 0.004);
    col = (col*(6.2*col + .5)) / (col*(6.2*col+1.7) + 0.06);
    
    return col;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
    vec2 uv = fragCoord/iResolution.xy;
    vec2 mo = iMouse.xy/iResolution.xy - .5;
    if(iMouse.z <= 0.) {
        mo = vec2(.2*sin(-iTime*.1+.3)+.045,.1-.2*sin(-iTime*.1+.3));
    }
    float a = 5.05;
    vec3 ro = vec3( .25 + 2.*cos(6.0*mo.x+a), 2. + 2. * mo.y, 2.0*sin(6.0*mo.x+a) );
    vec3 ta = vec3( .25, .5, .0 );
    mat3 ca = setCamera( ro, ta );

    vec3 colT = vec3(0);
    
    for (int x=0; x<AA; x++) {
        for(int y=0; y<AA; y++) {
		    vec2 p = (-iResolution.xy + 2.0*(fragCoord + vec2(x,y)/float(AA) - .5))/iResolution.y;
   			vec3 rd = ca * normalize( vec3(p.xy,1.6) );  
            colT += render( ro, rd);           
        }
    }
    
    colT /= float(AA*AA);
    
    fragColor = vec4(colT, 1.0);
}

void mainVR( out vec4 fragColor, in vec2 fragCoord, in vec3 ro, in vec3 rd ) {
	MAX_T = 1000.;
    fragColor = vec4(render(ro * 25. + vec3(0.5,4.,1.5), rd), 1.);
}`,name:`Image`,description:``,type:`image`},{inputs:[],outputs:[],code:`// Old watch (IBL). Created by Reinder Nijhoff 2018
// @reindernijhoff
//
// https://www.shadertoy.com/view/lscBW4
//
// I have moved all ray-march code to this tab, in order to keep the IBL-code in the 
// 'Image tab' more readable. The physically-based properties of the materials are also 
// defined here.
//
// All (signed) distance field (SDF) code is copy-paste from the excellent framework by 
// Inigo Quilez:
//
// https://www.shadertoy.com/view/Xds3zN
//
// More info here: https://iquilezles.org/articles/distfunctions
//

#define MAT_TABLE    1.
#define MAT_PENCIL_0 2.
#define MAT_PENCIL_1 3.
#define MAT_PENCIL_2 4.
#define MAT_DIAL     5.
#define MAT_HAND     6.
#define MAT_METAL_0  7.
#define MAT_METAL_1  8.

#define CLOCK_ROT_X -0.26
#define CLOCK_ROT_Y 0.2
#define CLOCK_OFFSET_Y 0.42
#define PENCIL_POS vec3(-0.31,-0.2, -.725)

float MAX_T = 10.;

//
// SDF functions (by Inigo Quilez).
//

float sdPlane( const vec3 p ) {
	return p.y;
}

float sdTorus( const vec3 p, const vec2 t ) {
  vec2 q = vec2(length(p.xz)-t.x,p.y);
  return length(q)-t.y;
}

float sdTorusYZ( const vec3 p, const vec2 t ) {
  vec2 q = vec2(length(p.yz)-t.x,p.x);
  return length(q)-t.y;
}

float sdTorusYX( const vec3 p, const vec2 t ) {
  vec2 q = vec2(length(p.yx)-t.x,p.z);
  return length(q)-t.y;
}

float sdCylinder( const vec3 p, const vec2 h ) {
  vec2 d = abs(vec2(length(p.xz),p.y)) - h;
  return min(max(d.x,d.y),0.0) + length(max(d,0.0));
}

float sdCylinderZY( const vec3 p, const vec2 h ) {
  vec2 d = abs(vec2(length(p.zy),p.x)) - h;
  return min(max(d.x,d.y),0.0) + length(max(d,0.0));
}

float sdCylinderXY( const vec3 p, const vec2 h ) {
  vec2 d = abs(vec2(length(p.xy),p.z)) - h;
  return min(max(d.x,d.y),0.0) + length(max(d,0.0));
}


float sdHexPrism( const vec3 p, const vec2 h ) {
    vec3 q = abs(p);
#if 0
    return max(q.x-h.y,max((q.z*0.866025+q.y*0.5),q.y)-h.x);
#else
    float d1 = q.x-h.y;
    float d2 = max((q.z*0.866025+q.y*0.5),q.y)-h.x;
    return length(max(vec2(d1,d2),0.0)) + min(max(d1,d2), 0.);
#endif
}

float sdEllipsoid( const vec3 p, const vec3 r ) {
    return (length( p/r ) - 1.0) * min(min(r.x,r.y),r.z);
}

float sdCapsule( const vec3 p, const vec3 a, const vec3 b, const float r ) {
	vec3 pa = p-a, ba = b-a;
	float h = clamp( dot(pa,ba)/dot(ba,ba), 0.0, 1.0 );
	return length( pa - ba*h ) - r;
}

float sdSphere( const vec3 p, const float r ) {
    return length(p) - r;
}

float sdCone( const vec3 p, const vec2 c ) {
    float q = length(p.yz);
    return dot(c,vec2(q,p.x));
}

float sdSegment2D( const vec2 p, const vec2 a, const vec2 b, const float w ) {
	vec2 pa = p-a, ba = b-a;
	float h = clamp( dot(pa,ba)/dot(ba,ba), 0.0, 1.0 );
	return length( pa - ba*h ) - w;
}

float opS( const float d1, const float d2 ) {
    return max(-d1,d2);
}

float opU( const float d1, const float d2 ) {
    return min(d1,d2);
}

vec3 rotateX( in vec3 p, const float t ) {
    float co = cos(t);
    float si = sin(t);
    p.yz = mat2(co,-si,si,co)*p.yz;
    return p;
}

vec3 rotateY( in vec3 p, const float t ) {
    float co = cos(t);
    float si = sin(t);
    p.xz = mat2(co,-si,si,co)*p.xz;
    return p;
}

vec3 rotateZ( in vec3 p, const float t ) {
    float co = cos(t);
    float si = sin(t);
    p.xy = mat2(co,-si,si,co)*p.xy;
    return p;
}

vec2 rotate( in vec2 p, const float t ) {
    float co = cos(t);
    float si = sin(t);
    p = mat2(co,-si,si,co) * p;
    return p;
}

//
// Hash without Sine by Dave Hoskins.
//

float hash11(float p) {
	vec3 p3  = fract(vec3(p) * .1031);
    p3 += dot(p3, p3.yzx + 19.19);
    return fract((p3.x + p3.y) * p3.z);
}

//
// SDF of the scene.
//

float mapHand( const vec3 pos, const float w, const float l, const float r ) {
    float d = sdSegment2D(pos.xz, vec2(0,-w*10.), vec2(0,l), w);
    d = min(d, length(pos.xz) - (.03+r));
    return max(d, abs(pos.y)-.005);
}

vec2 map( in vec3 pos, in vec3 p1, in vec3 ps, in vec3 pm, in vec3 ph, 
         const bool watchIntersect, const bool pencilIntersect ) {
    //--- table
    vec2 res = vec2(sdPlane(pos), MAT_TABLE);
    
    // chain
    if (pos.z > 1.1) {
        float h = smoothstep(3., -.4, pos.z)*.74 + .045;
        float dChain0 = length(pos.xy+vec2(.3*sin(pos.z), -h))-.1;
        if (dChain0 < 0.1) {
            dChain0 = 10.;
            float pth1z = floor(pos.z*5.);
            if (pth1z > 5.) {
	            float pth1 = hash11(floor(pos.z*5.));
    	        vec3 pt1 = vec3(pos.x + .3*sin(pos.z)- pth1 *.02 + 0.02, pos.y-h - pth1 *.03, mod(pos.z, .2) - .1);
        	    pt1 = rotateZ(pt1, .6 * smoothstep(2.,3., pos.z));
            	dChain0 = sdTorus(pt1, vec2(.071, .02)); 
            }
            
            float pth2z = floor(pos.z*5. + .5);
            float pth2 = hash11(pth2z); 
            vec3 pt2 = vec3(pos.x + .3*sin(pos.z)- pth2 *.02 + 0.02, pos.y-h - pth2 *.03, mod(pos.z + .1, .2) - .1);
            pt2 = rotateZ(pt2, 1.1 * smoothstep(2.,3., pos.z));
            dChain0 = opU(dChain0, sdTorusYZ(pt2, vec2(.071, .02)));          
        }
        if (dChain0 < res.x) res = vec2(dChain0, MAT_METAL_1);
    }
    //--- pencil
    if (pencilIntersect) {
        float dPencil0 = sdHexPrism(pos + PENCIL_POS, vec2(.2, 2.));
        dPencil0 = opS(-sdCone(pos + (PENCIL_POS + vec3(-2.05,0,0)), vec2(.95,0.3122)),dPencil0);
        dPencil0 = opS(sdSphere(pos + (PENCIL_POS + vec3(-2.4,-2.82,-1.03)), 3.), dPencil0);
        dPencil0 = opS(sdSphere(pos + (PENCIL_POS + vec3(-2.5,-0.82,2.86)), 3.), dPencil0);
        if (dPencil0 < res.x) res = vec2(dPencil0, MAT_PENCIL_0);

        float dPencil1 = sdCapsule(pos, -PENCIL_POS - vec3(2.2,0.,0.), -PENCIL_POS-vec3(2.55, 0., 0.), .21);
        if (dPencil1 < res.x) res = vec2(dPencil1, MAT_PENCIL_1);
        float ax = abs(-2.25 - pos.x - PENCIL_POS.x);
        float r = .02*abs(2.*fract(30.*pos.x)-1.)*smoothstep(.08,.09,ax)*smoothstep(.21,.2,ax);

        float dPencil2 = sdCylinderZY(pos + PENCIL_POS + vec3(2.25,-0.0125,0), vec2(.22 - r,.25));
        if (dPencil2 < res.x) res = vec2(dPencil2, MAT_PENCIL_2);
    }
    
    //--- watch
    if (watchIntersect) {
        float dDial = sdCylinder(p1, vec2(1.05,.13));
        if (dDial < res.x) res = vec2(dDial, MAT_DIAL);

        float dC = sdTorusYX(vec3(max(abs(p1.x)-.5*p1.y-0.19,0.),p1.y+0.12,p1.z-1.18), vec2(0.11,0.02));
        if (dC < res.x) res = vec2(dC, MAT_METAL_1);
        
        float dM = sdTorus(p1 + vec3(0,-.165,0), vec2(1.005,.026));   
        float bb = sdCylinderXY(p1+vec3(0,0,-1.3), vec2(0.15,0.04));
        if(bb < 0.5) {
            float a = atan(p1.y, p1.x);
            float c = abs(fract(a*3.1415)-.5);
            float d = min(abs(p1.z-1.3), .02);
            bb = sdCylinderXY(p1+vec3(0,0,-1.3), vec2(0.15 - 40.*d*d - .1*c*c,0.04));
        } 
        dM = opU(dM, bb);
         
        dM = opU(dM, sdCylinderZY(p1+vec3(0,0,-1.18), vec2(0.06,0.2)));
        float rr = min(abs(p1.z-1.26), .2);
        dM = opU(dM, sdCylinderXY(p1+vec3(0,0,-1.2), vec2(0.025 + 0.35*rr,0.1)));
       
        p1.y = abs(p1.y);
        dM = opU(dM, sdTorus(p1 + vec3(0,-.1,0), vec2(1.025,.075)));
        dM = opU(dM, sdCylinder(p1, vec2(1.1,.1)));
        dM = opS(sdTorus(p1 + vec3(0,-.1,0), vec2(1.11,.015)), dM);
        dM = opU(dM, sdCylinder(p1, vec2(0.01,0.175)));
        dM = opU(dM, sdCylinder(p1+vec3(0,0,.6), vec2(0.01,0.155)));
        if (dM < res.x) res = vec2(dM, MAT_METAL_0);

        // minutes hand
        float dMin = mapHand(pm + vec3(0,-.16,0), .02, 0.7, 0.015);
        if (dMin < res.x) res = vec2(dMin, MAT_HAND);
        // hours hand
        float dHour = mapHand(ph + vec3(0,-.15,0), .02, 0.4, 0.03);
        if (dHour < res.x) res = vec2(dHour, MAT_HAND);
        // seconds hand
        float dSeconds = mapHand(ps + vec3(0,-.14,0), .01, 0.17, 0.006);
        if (dSeconds < res.x) res = vec2(dSeconds, MAT_HAND);
    }
    
    return res;
}

vec2 map( in vec3 pos ) {
    vec3 p1 = rotateX( pos + vec3(0,-CLOCK_OFFSET_Y,0), CLOCK_ROT_X );
    p1 = rotateY( p1, CLOCK_ROT_Y );
    
	float secs = mod( floor(iDate.w),        60.0 );
	float mins = mod( floor(iDate.w/60.0),   60.0 );
	float hors = mod( floor(iDate.w/3600.0), 24.0 ) + mins/60.;
    
    vec3 ps = rotateY( p1+vec3(0,0,.6), 6.2831*secs/60.0 );
    vec3 pm = rotateY( p1, 6.2831*mins/60.0 );
    vec3 ph = rotateY( p1, 6.2831*hors/12.0 );
    
    return map( pos, p1, ps, pm, ph, true, true );
}

float mapGlass( in vec3 pos ) {
    return sdEllipsoid( pos - vec3(0,.10,0), vec3(1.,.2,1.) );
}

//
// Ray march code.
//

vec2 sphIntersect( in vec3 ro, in vec3 rd, in float r ) {
	vec3 oc = ro;
	float b = dot( oc, rd );
	float c = dot( oc, oc ) - r * r;
	float h = b*b - c;
	if( h<0.0 ) return vec2(-1.0);
    h = sqrt( h );
	return vec2(-b - h, -b + h);
}

bool boxIntserct( in vec3 ro, in vec3 rd, in vec3 rad ) {
    vec3 m = 1.0/rd;
    vec3 n = m*ro;
    vec3 k = abs(m)*rad;
	
    vec3 t1 = -n - k;
    vec3 t2 = -n + k;

	float tN = max( max( t1.x, t1.y ), t1.z );
	float tF = min( min( t2.x, t2.y ), t2.z );
	
	if( tN > tF || tF < 0.0) return false;

	return true;
}

vec3 calcNormal( in vec3 pos ) {
    const vec2 e = vec2(1.0,-1.0)*0.0075;
    return normalize( e.xyy*map( pos + e.xyy ).x + 
					  e.yyx*map( pos + e.yyx ).x + 
					  e.yxy*map( pos + e.yxy ).x + 
					  e.xxx*map( pos + e.xxx ).x );
}

vec2 castRay( in vec3 ro, in vec3 rd ) {
    float tmin = 0.5;
    float tmax = MAX_T;
    
    // bounding volume
    const float top = 0.95;
    float tp1 = (0.0-ro.y)/rd.y; if( tp1>0.0 ) tmax = min( tmax, tp1 );
    float tp2 = (top-ro.y)/rd.y; if( tp2>0.0 ) { if( ro.y>top ) tmin = max( tmin, tp2 );
                                                 else           tmax = min( tmax, tp2 ); }
    
    float t = tmin;
    float mat = -1.;
    
    vec3 p1 = rotateX( ro + vec3(0,-CLOCK_OFFSET_Y,0), CLOCK_ROT_X );
    p1 = rotateY( p1, CLOCK_ROT_Y );
    vec3 rd1 = rotateX( rd, CLOCK_ROT_X );
    rd1 = rotateY( rd1, CLOCK_ROT_Y );
    
	float secs = mod( floor(iDate.w),        60.0 );
	float mins = mod( floor(iDate.w/60.0),   60.0 );
	float hors = mod( floor(iDate.w/3600.0), 24.0 ) + mins/60.;
    
    vec3 ps = rotateY( p1+vec3(0,0,.6), 6.2831*secs/60.0 );
    vec3 rds = rotateY( rd1, 6.2831*secs/60.0 );
    
    vec3 pm = rotateY( p1, 6.2831*mins/60.0 );
    vec3 rdm = rotateY( rd1, 6.2831*mins/60.0 );
    
    vec3 ph = rotateY( p1, 6.2831*hors/12.0 );
    vec3 rdh = rotateY( rd1, 6.2831*hors/12.0 );
    
    bool watchIntersect = boxIntserct(p1, rd1, vec3(1.1,.2,1.4));
    bool pencilIntersect = boxIntserct(ro + PENCIL_POS, rd, vec3(3.,.23,.23));
    
    for( int i=0; i<48; i++ ) {
	    float precis = 0.00025*t;
	    vec2 res = map( ro+rd*t, p1+rd1*t, ps+rds*t, pm+rdm*t, ph+rdh*t, 
                       watchIntersect, pencilIntersect );
        if( res.x<precis || t>tmax ) break; //return vec2(t, mat);
        t += res.x;
        mat = res.y;
    }

    if( t>tmax ) t=-1.0;
    return vec2(t, mat);
}

vec3 calcNormalGlass( in vec3 pos ) {
    const vec2 e = vec2(1.0,-1.0)*0.005;
    return normalize( e.xyy*mapGlass( pos + e.xyy ) + 
					  e.yyx*mapGlass( pos + e.yyx ) + 
					  e.yxy*mapGlass( pos + e.yxy ) + 
					  e.xxx*mapGlass( pos + e.xxx ) );
}

float castRayGlass( in vec3 ro, in vec3 rd ) {
    vec3 p1 = rotateX( ro + vec3(0,-CLOCK_OFFSET_Y,0), CLOCK_ROT_X );
    p1 = rotateY( p1, CLOCK_ROT_Y );
    vec3 rd1 = rotateX( rd, CLOCK_ROT_X );
    rd1 = rotateY( rd1, CLOCK_ROT_Y );

    float t = -1.;
    vec2 bb = sphIntersect( p1- vec3(0,.10,0), rd1, 1.);
    if (bb.y > 0.) {
        t = max(bb.x, 0.);
        float tmax = bb.y;
        for( int i=0; i<24; i++ ) {
            float precis = 0.00025*t;
            float res = mapGlass( p1+rd1*t );
            if( res<precis || t>tmax ) break; 
            t += res;
        }

        if( t>tmax ) t=-1.0;
    }
    return t;
}


float calcAO( in vec3 ro, in vec3 rd ) {
	float occ = 0.0;
    float sca = 1.0;
    
    vec3 p1 = rotateX( ro + vec3(0,-CLOCK_OFFSET_Y,0), CLOCK_ROT_X );
    p1 = rotateY( p1, CLOCK_ROT_Y );
    vec3 rd1 = rotateX( rd, CLOCK_ROT_X );
    rd1 = rotateY( rd1, CLOCK_ROT_Y );
    
	float secs = mod( floor(iDate.w),        60.0 );
	float mins = mod( floor(iDate.w/60.0),   60.0 );
	float hors = mod( floor(iDate.w/3600.0), 24.0 ) + mins/60.;
    
    vec3 ps = rotateY( p1+vec3(0,0,.6), 6.2831*secs/60.0 );
    vec3 rds = rotateY( rd1, 6.2831*secs/60.0 );
    
    vec3 pm = rotateY( p1, 6.2831*mins/60.0 );
    vec3 rdm = rotateY( rd1, 6.2831*mins/60.0 );
    
    vec3 ph = rotateY( p1, 6.2831*hors/12.0 );
    vec3 rdh = rotateY( rd1, 6.2831*hors/12.0 );
    
    bool watchIntersect = true; //boxIntserct(p1, rd1, vec3(1.1,.2,1.4));
    bool pencilIntersect = true; //boxIntserct(ro + PENCIL_POS, rd, vec3(3.,.23,.23));
    
    
    for( int i=0; i<6; i++ ) {
        float h = 0.001 + 0.25*float(i)/5.0;
        float d = map( ro+rd*h, p1+rd1*h, ps+rds*h, pm+rdm*h, ph+rdh*h, 
                       watchIntersect, pencilIntersect ).x;
        occ += (h-d)*sca;
        sca *= 0.95;
    }
    return clamp( 1.0 - 1.5*occ, 0.0, 1.0 );    
}

//
// Material properties.
//

vec4 texNoise( sampler2D sam, in vec3 p, in vec3 n ) {
	vec4 x = texture( sam, p.yz );
	vec4 y = texture( sam, p.zx );
	vec4 z = texture( sam, p.xy );

	return x*abs(n.x) + y*abs(n.y) + z*abs(n.z);
}

void getMaterialProperties(
    in vec3 pos, in float mat,
    inout vec3 normal, inout vec3 albedo, inout float ao, inout float roughness, inout float metallic,
	sampler2D tex1, sampler2D tex2, sampler2D tex3) {
    
    vec3 pinv = rotateX( pos + vec3(0,-CLOCK_OFFSET_Y,0), CLOCK_ROT_X );
    pinv = rotateY( pinv, CLOCK_ROT_Y );
    
    normal = calcNormal( pos );
    ao = calcAO(pos, normal);
    metallic = 0.;
    
    vec4 noise = texNoise(tex1, pinv * .5, normal);
    float metalnoise = 1.- noise.r;
    metalnoise*=metalnoise;

    mat -= .5;
    if (mat < MAT_TABLE) {
        albedo = .7 * pow(texture(tex1, rotate(pos.xz * .4 + .25, -.3)).rgb, 2.2*vec3(0.45,0.5,0.5));
        roughness = 0.95 - albedo.r * .6;
    }
    else if( mat < MAT_PENCIL_0 ) {
        vec2 npos = pos.yz + PENCIL_POS.yz;
        if (length(npos) < 0.055) {
        	albedo = vec3(0.02);
        	roughness = .9;
        } else if(sdHexPrism(pos + PENCIL_POS, vec2(.195, 3.)) < 0.) {
        	albedo = .8* texture(tex1, pos.xz).rgb;
        	roughness = 0.99;
        } else {
        	albedo = .5*pow(vec3(1.,.8,.15), vec3(2.2));
        	roughness = .75 - noise.b * .4;
        }
        albedo *= noise.g * .75 + .7;
    }
    else if( mat < MAT_PENCIL_1 ) {
       	albedo = .4*pow(vec3(.85,.75,.55), vec3(2.2));
       	roughness = 1.;
    }
    else if( mat < MAT_PENCIL_2 ) {
        float ax = abs(-2.25 - pos.x - PENCIL_POS.x);
        float r = 1. - abs(2.*fract(30.*pos.x)-1.)*smoothstep(.08,.09,ax)*smoothstep(.21,.2,ax);

        r -= 4. * metalnoise;  
        ao *= .5 + .5 * r;
	    albedo = mix(vec3(0.5, 0.3, 0.2),vec3(0.560, 0.570, 0.580), ao * ao); // Iron
   		roughness = 1.-.25*r;
   		metallic = 1.; 
    }
    else if( mat < MAT_DIAL ) {
        float dial = texture(tex2, vec2(-.5 * pinv.x + .5, +.5 * pinv.z + .5)).r;
        albedo = vec3(dial);
        roughness = dial + .95;
    }
    else if( mat < MAT_HAND ) {
        albedo = vec3(0.02);
        roughness = .65;
    }
    else if( mat < MAT_METAL_0 ) {
	    albedo = vec3(1.000, 0.766, 0.336); // Gold
   		roughness = .6;
   		metallic = 1.; 
    } 
    else if( mat < MAT_METAL_1 ) {
	    albedo = vec3(0.972, 0.960, 0.915); // Silver
   		roughness = .7 + max(.15 * length(pos.xz)-.3, 0.); // prevent aliasing
   		metallic = 1.; 
    }
    
    if (mat < MAT_PENCIL_2) {
        ao = min(ao, smoothstep(.95, 1.5, length(pos.xz)));
    }
    
    if (metallic > .5) {   
        albedo *= 1.-metalnoise;
        roughness += metalnoise*4.;
    }
    
    ao = clamp(.1+.9*ao, 0., 1.);
    roughness = clamp(roughness, 0., 1.);
}

mat3 setCamera( in vec3 ro, in vec3 ta ) {
	vec3 cw = normalize(ta-ro);
	vec3 cp = vec3(0.0, 1.0,0.0);
	vec3 cu = normalize( cross(cw,cp) );
	vec3 cv = normalize( cross(cu,cw) );
    return mat3( cu, cv, cw );
}
`,name:`Common`,description:``,type:`common`},{inputs:[{id:`Xsf3Rr`,filepath:`/media/a/79520a3d3a0f4d3caa440802ef4362e99d54e12b1392973e4ea321840970a88a.jpg`,type:`texture`,channel:2,sampler:{filter:`mipmap`,wrap:`repeat`,vflip:`true`,srgb:`false`,internal:`byte`},published:1},{id:`4dXGzr`,filepath:`/media/a/08b42b43ae9d3c0605da11d0eac86618ea888e62cdd9518ee8b9097488b31560.png`,type:`texture`,channel:1,sampler:{filter:`mipmap`,wrap:`repeat`,vflip:`true`,srgb:`false`,internal:`byte`},published:1},{id:`4dXGR8`,filepath:`/media/previz/buffer00.png`,type:`buffer`,channel:0,sampler:{filter:`linear`,wrap:`clamp`,vflip:`true`,srgb:`false`,internal:`byte`},published:1}],outputs:[{id:`4dXGR8`,channel:0}],code:`// Old watch (IBL). Created by Reinder Nijhoff 2018
// @reindernijhoff
//
// https://www.shadertoy.com/view/lscBW4
//
// In this buffer the albedo of the dial (red channel) and the roughness
// of the glass (green channel) is pre-calculated.
//

bool resolutionChanged() {
    return floor(texelFetch(iChannel0, ivec2(0), 0).r) != floor(iResolution.x);
}

float printChar(vec2 uv, uint char) {
    float d = textureLod(iChannel1, (uv + vec2( char & 0xFU, 0xFU - (char >> 4))) / 16.,0.).a;
	return smoothstep(1.,0., smoothstep(.5,.51,d));
}

float dialSub( in vec2 uv, float wr ) {
    float r = length( uv );
    float a = atan( uv.y, uv.x )+3.1415926;

    float f = abs(2.0*fract(0.5+a*60.0/6.2831)-1.0);
    float g = 1.0-smoothstep( 0.0, 0.1, abs(2.0*fract(0.5+a*12.0/6.2831)-1.0) );
    float w = fwidth(f);
    f = 1.0 - smoothstep( 0.2*g+0.05-w, 0.2*g+0.05+w, f );
    float s = abs(fwidth(r));
    f *= smoothstep( 0.9 - wr -s, 0.9 - wr, r ) - smoothstep( 0.9, 0.9+s, r );
    float hwr = wr * .5;
    f -= 1.-smoothstep(hwr+s,hwr,abs(r-0.9+hwr)) - smoothstep(hwr-s,hwr,abs(r-0.9+hwr));

    return .1 + .8 * clamp(1.-f,0.,1.);
}

float dial(vec2 uv) {
    float d = dialSub(uv, 0.05);

    vec2 uvs = uv;
    
    uvs.y += 0.6;
    uvs *= 1./(0.85-0.6);

    d = min(d, dialSub(uvs, 0.1));
    
    vec2 center = vec2(0.5);
    vec2 radius = vec2(3.65, 0.);
    
    for (int i=0; i<9; i++) {
        if(i!=5) {
	        float a = 6.28318530718 * float(i+4)/12.;
    	    vec2 uvt = clamp(uv * 5. + center + rotate(radius, a), vec2(0), vec2(1));
        	d = mix(d, 0.3, printChar(uvt, uint(49+i)));
        }
    }
    for (int i=0; i<3; i++) {
	    float a = 6.28318530718 * float(i+13)/12.;
    	vec2 uvt1 = clamp(uv * 5. + center + rotate(radius, a) + vec2(.25,0.), vec2(0), vec2(1));
        d = mix(d, 0.3, printChar(uvt1, uint(49)));
    	vec2 uvt = clamp(uv * 5. + center + rotate(radius, a)+ vec2(-.15,0.), vec2(0), vec2(1));
        d = mix(d, 0.3, printChar(uvt, uint(48+i)));
    }
    
    d *= .9 + .25*texture(iChannel2, uv*.5+.5).r;
    
    return pow(clamp(d, 0., 1.), 2.2);
}

float roughnessGlass(vec2 uv) {
    uv = uv * .5 + .5;
    return smoothstep(0.2, 0.8, texture(iChannel2, uv * .3).r) * .4 + .2;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord ) {   
    if(resolutionChanged() && iChannelResolution[1].x > 0.  && iChannelResolution[2].x > 0.) {
        if (fragCoord.x < 1.5 && fragCoord.y < 1.5) {
            fragColor = floor(iResolution.xyxy);
        } else {
            vec2 uv = (2.0*fragCoord.xy-iResolution.xy)/iResolution.xy;

            fragColor = vec4( dial(uv), roughnessGlass(uv), 0., 1.0 );      
        }
    } else {
        fragColor = texelFetch(iChannel0, ivec2(fragCoord), 0);
    }
}`,name:`Buffer A`,description:``,type:`buffer`},{inputs:[{id:`XsXGR8`,filepath:`/media/previz/buffer01.png`,type:`buffer`,channel:0,sampler:{filter:`linear`,wrap:`clamp`,vflip:`true`,srgb:`false`,internal:`byte`},published:1}],outputs:[{id:`XsXGR8`,channel:0}],code:`// Old watch (IBL). Created by Reinder Nijhoff 2018
// @reindernijhoff
//
// https://www.shadertoy.com/view/lscBW4
//
// In this buffer I pre-calculate the BRDF integration map, as described in:
// http://blog.selfshadow.com/publications/s2013-shading-course/karis/s2013_pbs_epic_notes_v2.pdf
//

const float PI = 3.14159265359;

// see: http://blog.selfshadow.com/publications/s2013-shading-course/karis/s2013_pbs_epic_notes_v2.pdf
float PartialGeometryGGX(float NdotV, float a) {
    float k = a / 2.0;

    float nominator   = NdotV;
    float denominator = NdotV * (1.0 - k) + k;

    return nominator / denominator;
}

float GeometryGGX_Smith(float NdotV, float NdotL, float roughness) {
    float a = roughness*roughness;
    float G1 = PartialGeometryGGX(NdotV, a);
    float G2 = PartialGeometryGGX(NdotL, a);
    return G1 * G2;
}

float RadicalInverse_VdC(uint bits) {
    bits = (bits << 16u) | (bits >> 16u);
    bits = ((bits & 0x55555555u) << 1u) | ((bits & 0xAAAAAAAAu) >> 1u);
    bits = ((bits & 0x33333333u) << 2u) | ((bits & 0xCCCCCCCCu) >> 2u);
    bits = ((bits & 0x0F0F0F0Fu) << 4u) | ((bits & 0xF0F0F0F0u) >> 4u);
    bits = ((bits & 0x00FF00FFu) << 8u) | ((bits & 0xFF00FF00u) >> 8u);
    return float(bits) * 2.3283064365386963e-10; // / 0x100000000
}

vec2 Hammersley(int i, int N) {
    return vec2(float(i)/float(N), RadicalInverse_VdC(uint(i)));
} 

vec3 ImportanceSampleGGX(vec2 Xi, float roughness) {
    float a = roughness*roughness;
    float phi      = 2.0 * PI * Xi.x;
    float cosTheta = sqrt((1.0 - Xi.y) / (1.0 + (a*a - 1.0) * Xi.y));
    float sinTheta = sqrt(1.0 - cosTheta*cosTheta);

    vec3 HTangent;
    HTangent.x = sinTheta*cos(phi);
    HTangent.y = sinTheta*sin(phi);
    HTangent.z = cosTheta;

    return HTangent;
}

vec2 IntegrateBRDF(float roughness, float NdotV) {
    vec3 V;
    V.x = sqrt(1.0 - NdotV*NdotV);
    V.y = 0.0;
    V.z = NdotV;

    float A = 0.0;
    float B = 0.0;

    const int SAMPLE_COUNT = 128;

    vec3 N = vec3(0.0, 0.0, 1.0);
    vec3 UpVector = abs(N.z) < 0.999 ? vec3(0.0, 0.0, 1.0) : vec3(1.0, 0.0, 0.0);
    vec3 TangentX = normalize(cross(UpVector, N));
    vec3 TangentY = cross(N, TangentX);

    for(int i = 0; i < SAMPLE_COUNT; ++i)  {
        vec2 Xi = Hammersley(i, SAMPLE_COUNT);
        vec3 HTangent = ImportanceSampleGGX(Xi, roughness);
        
        vec3 H = normalize(HTangent.x * TangentX + HTangent.y * TangentY + HTangent.z * N);
        vec3 L = normalize(2.0 * dot(V, H) * H - V);

        float NdotL = max(L.z, 0.0);
        float NdotH = max(H.z, 0.0);
        float VdotH = max(dot(V, H), 0.0);

        if(NdotL > 0.0) {
            float G = GeometryGGX_Smith(NdotV, NdotL, roughness);
            float G_Vis = (G * VdotH) / (NdotH * NdotV);
            float Fc = pow(1.0 - VdotH, 5.0);

            A += (1.0 - Fc) * G_Vis;
            B += Fc * G_Vis;
        }
    }
    A /= float(SAMPLE_COUNT);
    B /= float(SAMPLE_COUNT);
    return vec2(A, B);
}

bool resolutionChanged() {
    return floor(texelFetch(iChannel0, ivec2(0), 0).r) != floor(iResolution.x);
}

void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
    if(resolutionChanged()) {
        if (fragCoord.x < 1.5 && fragCoord.y < 1.5) {
            fragColor = floor(iResolution.xyxy);
        } else {
	   		vec2 uv = fragCoord / iResolution.xy;
    		vec2 integratedBRDF = IntegrateBRDF(uv.y, uv.x);
   	 		fragColor = vec4(integratedBRDF, 0.0,1.0);
        }
    } else {
        fragColor = texelFetch(iChannel0, ivec2(fragCoord), 0);
    }
}`,name:`Buffer B`,description:``,type:`buffer`}]},{ver:`0.1`,info:{id:`MdGfzh`,date:`1527594357`,viewed:40254,name:`Himalayas`,description:`This is my first attempt to render volumetric clouds in a fragment shader. I started this shader by trying to model the clouds of Horizon Zero Dawn and render them using the integration method of volumetric media as described by Sébastien Hillaire (SebH).`,likes:438,published:`Public API`,usePreview:0,tags:[`volume`,`clouds`,`light`,`sky`,`volumetric`,`scattering`,`realtime`,`atmospheric`,`cloudscape`,`himalayas`]},renderpass:[{inputs:[{id:`4sXGR8`,filepath:`/media/previz/buffer02.png`,type:`buffer`,channel:0,sampler:{filter:`linear`,wrap:`clamp`,vflip:`true`,srgb:`false`,internal:`byte`},published:1},{id:`XdfGR8`,filepath:`/media/previz/buffer03.png`,type:`buffer`,channel:1,sampler:{filter:`linear`,wrap:`clamp`,vflip:`true`,srgb:`false`,internal:`byte`},published:1}],outputs:[{id:`4dfGRr`,channel:0}],code:`// Himalayas. Created by Reinder Nijhoff 2018
// Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License.
// @reindernijhoff
//
// https://www.shadertoy.com/view/MdGfzh
//
// This is my first attempt to render volumetric clouds in a fragment shader.
//
// I started this shader by trying to implement the clouds of Horizon Zero Dawn, as
// described in "The real-time volumetric cloudscapes of Horizon Zero Dawn" by 
// Andrew Schneider and Nathan Vos.[1] To model the shape of the clouds, two look-up
// textures are created with different frequencies of (Perlin -) Worley noise:
//
// Buffer A: The main look-up texture for the cloud shapes. 
// Buffer B: A 3D (32x32x32) look-up texture with Worley Noise used to add small details 
//           to the shapes of the clouds. I have packed this 3D texture into a 2D buffer.
//           
// Because it is not possible (yet) to create buffers with fixed size, or 3D buffers, the
// look-up texture in Buffer A is 2D, and a slice of the volume that is described in the 
// article. Therefore, and because I didn't have any slots left (in Buffer C) to use a 
// cloud type/cloud coverage texture, the modelling of the cloud shapes in this shader is 
// in the end mostly based on trial and error, and is probably far from the code used in 
// Horizon Zero Dawn.
//
// Buffer D: Rendering of the clouds.
//
// I render the clouds using the improved integration method of volumetric media, as described 
// in "Physically Based Sky, Atmosphere and Cloud Rendering in Frostbite" by 
// Sébastien Hillaire.[2]
//
// You can find the (excellent) example shaders of Sébastien Hillaire (SebH) here:
//
// https://www.shadertoy.com/view/XlBSRz
// https://www.shadertoy.com/view/MdlyDs
//
// Buffer C: Landscape
//
// To create an interesting scene and to add some scale to the clouds, I render a 
// terrain using a simple heightmap, based on the work by Íñigo Quílez on value noise and its 
// analytical derivatives.[3]
//
// In fact, the heightmap of this shader is almost exactly the same as the heightmap that 
// is used in Íñigo Quílez' shader Elevated:
//
// https://www.shadertoy.com/view/MdX3Rr
//
// To reduce noise I use temporal reprojection (both for clouds (Buffer D) and the terrain 
// (Buffer C)) separatly. The temporal reprojection code is based on code from the shader
// "Rain Forest" (again by Íñigo Quílez):
//
// https://www.shadertoy.com/view/4ttSWf
// 
// Finally, in the Image tab, clouds and terrain are combined, a small humanoid is added
// (by Hazel Quantock) and post processing is done.
//
// [1] https://www.guerrilla-games.com/read/the-real-time-volumetric-cloudscapes-of-horizon-zero-dawn
// [2] https://media.contentapi.ea.com/content/dam/eacom/frostbite/files/s2016-pbs-frostbite-sky-clouds-new.pdf
// [3] https://iquilezles.org/articles/morenoise
//

#define AA 3

//
// Cheap 2D Humanoid SDF for dropping into scenes to add a sense of scale.
// Hazel Quantock 2018
//
// Based on: https://www.shadertoy.com/view/4scBWN
//
float RoundMax( float a, float b, float r ) {
    a += r; b += r;    
    float f = ( a > 0. && b > 0. ) ? sqrt(a*a+b*b) : max(a,b);    
    return f - r;
}

float RoundMin( float a, float b, float r ) {
    return -RoundMax(-a,-b,r);
}

float Humanoid( in vec2 uv, in float phase ) {
    float n3 = sin((uv.y-uv.x*.7)*11.+phase)*.014; // "pose"
    float n0 = sin((uv.y+uv.x*1.1)*23.+phase*2.)*.007;
    float n1 = sin((uv.y-uv.x*.8)*37.+phase*4.)*.004;
    float n2 = sin((uv.y+uv.x*.9)*71.+phase*8.)*.002;

    
    float head = length((uv-vec2(0,1.65))/vec2(1,1.2))-.15/1.2;
    float neck = length(uv-vec2(0,1.5))-.05;
    float torso = abs(uv.x)-.25 - uv.x*.3;

    torso = RoundMax( torso, uv.y-1.5, .2 );
    torso = RoundMax( torso, -(uv.y-.6), .0 );

    float f = RoundMin(head,neck,.04);
    f = RoundMin(f,torso,.02);
    
    float leg = abs(abs(uv.x+(uv.y-.9)*.1*cos(phase*3.))-.15+.075*uv.y)-.07-.07*uv.y; 
    leg = max( leg, uv.y-1. );
    
    f = RoundMin(f,leg,.1);

    float stick = max(abs(uv.x+.4-uv.y*.04)-0.025, uv.y-1.15);
    float arm = max(max(abs(uv.y-1.-uv.x*.3) - .06, uv.x), -uv.x-.4);
    
    f = RoundMin(f, stick, 0.0);
    f = RoundMin(f, arm, 0.05);
    
    f += (-n0+n1+n2+n3)*(.1+.9*uv.y/1.6);
    
    return max( f, -uv.y );
}

//
// Lens flare, original based on:
// musk's lens flare by mu6k  
//
// https://www.shadertoy.com/view/4sX3Rs
//
float lensflare(vec2 fragCoord) {
    vec3 ro, ta;
    mat3 cam = getCamera( iTime, iMouse/iResolution.xyxy, ro, ta );
    vec3 cpos = SUN_DIR*cam; 
    vec2 pos = CAMERA_FL * cpos.xy / cpos.z;
    vec2 uv = (-iResolution.xy + 2.0*fragCoord)/iResolution.y;
    
	vec2 uvd = uv*(length(uv));
	float f = 0.1/(length(uv-pos)*16.0+1.0);
	f += max(1.0/(1.0+32.0*pow(length(uvd+0.8*pos),2.0)),.0)*0.25;
	vec2 uvx = mix(uv,uvd,-0.5);
	f += max(0.01-pow(length(uvx+0.4*pos),2.4),.0)*6.0;
	f += max(0.01-pow(length(uvx-0.3*pos),1.6),.0)*6.0;
	uvx = mix(uv,uvd,-0.4);
	f += max(0.01-pow(length(uvx+0.2*pos),5.5),.0)*2.0;
    
	return f;
}

bool intersectSphere ( in vec3 ro, in vec3 rd, in vec4 sph ) {
    vec3  ds = ro - sph.xyz;
    float bs = dot(rd, ds);
    float cs = dot(ds, ds) - sph.w*sph.w;
    float ts = bs*bs - cs;
	
    if( ts > 0.0 ) {
        ts = -bs - sqrt( ts );
		if( ts>0. ) {
			return true;
		}
    }
    return false;
}

bool intersectPlane (in vec3 ro, in vec3 rd, in vec3 n, in vec3 p0, inout float dist) {   
    dist = dot(p0 - ro, n)/dot(rd,n);
    return dist > 0.;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord ) {  
    if( letterBox(fragCoord, iResolution.xy, 2.35) ) {
        fragColor = vec4( 0., 0., 0., 1. );
    } else {
        vec4 col = texelFetch(iChannel0, ivec2(fragCoord), 0);
        vec4 clouds = texelFetch(iChannel1, ivec2(fragCoord), 0);
    	
        col.rgb = clouds.rgb + col.rgb * clouds.a;
       
        vec3 ro, rd, ta;
		mat3 cam = getCamera( iTime, iMouse/iResolution.xyxy, ro, ta );
        float dist;
        vec4 tcol = vec4(0.);
        vec2 p = (-iResolution.xy + 2.0*(fragCoord))/iResolution.y;
        rd = cam * normalize(vec3(p,CAMERA_FL)); 
        
        if (intersectSphere(ro,rd,vec4(FLAG_POSITION,HUMANOID_SCALE*INV_SCENE_SCALE*2.))) {
            for(int x=0; x<AA; x++) {
                for(int y=0; y<AA; y++) {
                    vec2 p = (-iResolution.xy + 2.0*(fragCoord + vec2(x,y)/float(AA) - .5))/iResolution.y;
                    rd = cam * normalize(vec3(p,CAMERA_FL)); 

                    if (intersectPlane(ro, rd, vec3(0,0,1), FLAG_POSITION, dist) && dist < col.w) {
                        vec3 pos = ro + rd * dist;
                        vec2 uv = (pos.xy - FLAG_POSITION.xy)*(SCENE_SCALE/HUMANOID_SCALE);
                        uv.x = -uv.x + uv.y*0.05;
                        float sdf = Humanoid( uv, 3. );
                        float a = smoothstep(.4,.6,.5-.5*sdf/(abs(sdf)+.002));
                        float sdf2 = Humanoid( uv+vec2(.025,0.05), 3. );
                        float a2 = smoothstep(.4,.6,.5-.5*sdf2/(abs(sdf2)+.002));
                        float c = (a-a2)*2.;
                        c = clamp(c+uv.x*.2+.6,0.,1.); c*=c; c*=c;
                        tcol += vec4(mix(vec3(.04,0.05,0.06),SUN_COLOR,c),a);
                    }
                }
            }
            tcol /= float(AA*AA);
        }
        
        col.rgb = mix(col.rgb, tcol.rgb, tcol.w);    
            
        // lens flare
        col.rgb += SUN_COLOR*lensflare(fragCoord)*smoothstep(-.3,.5,dot(rd,SUN_DIR));       
        col.rgb = clamp(col.rgb, vec3(0), vec3(1));
        
        // gamma and contrast
        col.rgb = mix(col.rgb, pow(col.rgb, vec3(1./2.2)), .85);
        col.rgb = mix( col.rgb, col.bbb, 0.2 ); 
     
        // vignette
        vec2 uv = fragCoord / iResolution.xy;
        col.rgb = mix(col.rgb*col.rgb, col.rgb, pow( 16.0*uv.x*uv.y*(1.0-uv.x)*(1.0-uv.y), 0.1 ));
        
        // noise
        col.rgb -= hash12(fragCoord)*.025;
        
        fragColor = vec4( col.rgb, 1. );
    }
}`,name:`Image`,description:``,type:`image`},{inputs:[],outputs:[],code:`// Himalayas. Created by Reinder Nijhoff 2018
// @reindernijhoff
//
// https://www.shadertoy.com/view/MdGfzh
//
// This is my first attempt to render volumetric clouds in a fragment shader.
//
// 1 unit correspondents to SCENE_SCALE meter.

#define SCENE_SCALE (10.)
#define INV_SCENE_SCALE (.1)

#define MOUNTAIN_HEIGHT (5000.)
#define MOUNTAIN_HW_RATIO (0.00016)

#define SUN_DIR normalize(vec3(-.7,.5,.75))
#define SUN_COLOR (vec3(1.,.9,.85)*1.4)

#define FLAG_POSITION (vec3(3900.5,720.,-2516.)*INV_SCENE_SCALE)
#define HUMANOID_SCALE (2.)

#define CAMERA_RO (vec3(3980.,730.,-2650.)*INV_SCENE_SCALE)
#define CAMERA_FL 2.

#define HEIGHT_BASED_FOG_B 0.02
#define HEIGHT_BASED_FOG_C 0.05


mat3 getCamera( in float time, in vec4 mouse, inout vec3 ro, inout vec3 ta ) {
    ro = CAMERA_RO;
    vec3 cw;
    if (mouse.z > 0.) {
        vec2 m = (mouse.xy - .5) * 2.3;
        float my = -sin(m.y);
        cw = normalize(vec3(-sin(-m.x), my+.15, cos(-m.x)));
    } else {
    	ro.x += -cos(time*.13)*5.*INV_SCENE_SCALE;
    	ro.z += (-cos(time*.1)*100.+20.)*INV_SCENE_SCALE;
    	cw = normalize(vec3(-.1,.18,1.));
    }   
    ta = ro + cw*(200.*INV_SCENE_SCALE);
	vec3 cp = vec3(0.0,1.0, 0.0);
	vec3 cu = normalize( cross(cw,cp) );
	vec3 cv = normalize( cross(cu,cw) );
    return mat3( cu, cv, cw );
}

void getRay( in float time, in vec2 fragCoord, in vec2 resolution, in vec4 mouse, inout vec3 ro, inout vec3 rd) {
	vec3 ta;
	mat3 cam = getCamera( time, mouse, ro, ta );
    vec2 p = (-resolution.xy + 2.0*(fragCoord))/resolution.y;
    rd = cam * normalize(vec3(p,CAMERA_FL));     
}

//
// To reduce noise I use temporal reprojection (both for clouds (Buffer D) and the terrain 
// (Buffer C) seperatly. The temporal repojection code is based on code from the shader
// "Rain Forest" (again by Íñigo Quílez):
//
// https://www.shadertoy.com/view/4ttSWf
// 
vec4 saveCamera( in float time, in vec2 fragCoord, in vec4 mouse ) {   
    vec3 ro, ta;
    mat3 cam = getCamera( time, mouse, ro, ta );
    vec4 fragColor;
    
    if( abs(fragCoord.x-4.5)<0.5 ) fragColor = vec4( cam[2], -dot(cam[2],ro) );
    if( abs(fragCoord.x-3.5)<0.5 ) fragColor = vec4( cam[1], -dot(cam[1],ro) );
    if( abs(fragCoord.x-2.5)<0.5 ) fragColor = vec4( cam[0], -dot(cam[0],ro) );
    
    return fragColor;
}

vec2 reprojectPos( in vec3 pos, in vec2 resolution, in sampler2D storage ) {
    mat4 oldCam = mat4( texelFetch(storage,ivec2(2,0),0),
                        texelFetch(storage,ivec2(3,0),0),
                        texelFetch(storage,ivec2(4,0),0),
                        0.0, 0.0, 0.0, 1.0 );

    vec4 wpos = vec4(pos,1.0);
    vec3 cpos = (wpos*oldCam).xyz; 
    vec2 npos = CAMERA_FL * cpos.xy / cpos.z;
    return 0.5 + 0.5*npos*vec2(resolution.y/resolution.x,1.0);
}

//
// Fast skycolor function by Íñigo Quílez
// https://www.shadertoy.com/view/MdX3Rr
//
vec3 getSkyColor(vec3 rd) {
    float sundot = clamp(dot(rd,SUN_DIR),0.0,1.0);
	vec3 col = vec3(0.2,0.5,0.85)*1.1 - max(rd.y,0.01)*max(rd.y,0.01)*0.5;
    col = mix( col, 0.85*vec3(0.7,0.75,0.85), pow(1.0-max(rd.y,0.0), 6.0) );

    col += 0.25*vec3(1.0,0.7,0.4)*pow( sundot,5.0 );
    col += 0.25*vec3(1.0,0.8,0.6)*pow( sundot,64.0 );
    col += 0.20*vec3(1.0,0.8,0.6)*pow( sundot,512.0 );
    
    col += clamp((0.1-rd.y)*10., 0., 1.) * vec3(.0,.1,.2);
    col += 0.2*vec3(1.0,0.8,0.6)*pow( sundot, 8.0 );
    return col;
}

bool letterBox(vec2 fragCoord, const vec2 resolution, const float aspect) { 
    if( fragCoord.x < 0. || fragCoord.x > resolution.x ||
        abs(2.*fragCoord.y-resolution.y) > resolution.x * (1./aspect) ) {
        return true;
    } else {
        return false;
    }
}

//
// Noise functions
//
// Hash without Sine by DaveHoskins 
//
// https://www.shadertoy.com/view/4djSRW
//
float hash12( vec2 p ) {
    p  = 50.0*fract( p*0.3183099 );
    return fract( p.x*p.y*(p.x+p.y) );
}

float hash13(vec3 p3) {
    p3  = fract(p3 * 1031.1031);
    p3 += dot(p3, p3.yzx + 19.19);
    return fract((p3.x + p3.y) * p3.z);
}

vec3 hash33(vec3 p3) {
	p3 = fract(p3 * vec3(.1031, .1030, .0973));
    p3 += dot(p3, p3.yxz+19.19);
    return fract((p3.xxy + p3.yxx)*p3.zyx);
}

float valueHash(vec3 p3) {
    p3  = fract(p3 * 0.1031);
    p3 += dot(p3, p3.yzx + 19.19);
    return fract((p3.x + p3.y) * p3.z);
}

//
// Noise functions used for cloud shapes
//
float valueNoise( in vec3 x, float tile ) {
    vec3 p = floor(x);
    vec3 f = fract(x);
    f = f*f*(3.0-2.0*f);
	
    return mix(mix(mix( valueHash(mod(p+vec3(0,0,0),tile)), 
                        valueHash(mod(p+vec3(1,0,0),tile)),f.x),
                   mix( valueHash(mod(p+vec3(0,1,0),tile)), 
                        valueHash(mod(p+vec3(1,1,0),tile)),f.x),f.y),
               mix(mix( valueHash(mod(p+vec3(0,0,1),tile)), 
                        valueHash(mod(p+vec3(1,0,1),tile)),f.x),
                   mix( valueHash(mod(p+vec3(0,1,1),tile)), 
                        valueHash(mod(p+vec3(1,1,1),tile)),f.x),f.y),f.z);
}

float voronoi( vec3 x, float tile ) {
    vec3 p = floor(x);
    vec3 f = fract(x);

    float res = 100.;
    for(int k=-1; k<=1; k++){
        for(int j=-1; j<=1; j++) {
            for(int i=-1; i<=1; i++) {
                vec3 b = vec3(i, j, k);
                vec3 c = p + b;

                if( tile > 0. ) {
                    c = mod( c, vec3(tile) );
                }

                vec3 r = vec3(b) - f + hash13( c );
                float d = dot(r, r);

                if(d < res) {
                    res = d;
                }
            }
        }
    }

    return 1.-res;
}

float tilableVoronoi( vec3 p, const int octaves, float tile ) {
    float f = 1.;
    float a = 1.;
    float c = 0.;
    float w = 0.;

    if( tile > 0. ) f = tile;

    for( int i=0; i<octaves; i++ ) {
        c += a*voronoi( p * f, f );
        f *= 2.0;
        w += a;
        a *= 0.5;
    }

    return c / w;
}

float tilableFbm( vec3 p, const int octaves, float tile ) {
    float f = 1.;
    float a = 1.;
    float c = 0.;
    float w = 0.;

    if( tile > 0. ) f = tile;

    for( int i=0; i<octaves; i++ ) {
        c += a*valueNoise( p * f, f );
        f *= 2.0;
        w += a;
        a *= 0.5;
    }

    return c / w;
}

`,name:`Common`,description:``,type:`common`},{inputs:[{id:`4dXGR8`,filepath:`/media/previz/buffer00.png`,type:`buffer`,channel:0,sampler:{filter:`linear`,wrap:`repeat`,vflip:`true`,srgb:`false`,internal:`byte`},published:1},{id:`XdfGR8`,filepath:`/media/previz/buffer03.png`,type:`buffer`,channel:1,sampler:{filter:`linear`,wrap:`clamp`,vflip:`true`,srgb:`false`,internal:`byte`},published:1}],outputs:[{id:`4dXGR8`,channel:0}],code:`// Himalayas. Created by Reinder Nijhoff 2018
// @reindernijhoff
//
// https://www.shadertoy.com/view/MdGfzh
//
// This is my first attempt to render volumetric clouds in a fragment shader.
//
// Buffer A: The main look-up texture for the cloud shapes. 
// Buffer B: A 3D (32x32x32) look-up texture with Worley Noise used to add small details 
//           to the shapes of the clouds. I have packed this 3D texture into a 2D buffer.
// 
bool resolutionChanged() {
    return floor(texelFetch(iChannel1, ivec2(0), 0).r) != floor(iResolution.x);
}

void mainImage( out vec4 fragColor, in vec2 fragCoord ) { 
    if (resolutionChanged()) {
        vec2 vUV = fragCoord / iResolution.xy;
        vec3 coord = fract(vec3(vUV + vec2(.2,0.62), .5));
        
        vec4 col = vec4(1);
        
        float mfbm = 0.9;
        float mvor = 0.7;
        
        col.r = mix(1., tilableFbm( coord, 7, 4. ), mfbm) * 
            	mix(1., tilableVoronoi( coord, 8, 9. ), mvor);
        col.g = 0.625 * tilableVoronoi( coord + 0., 3, 15. ) +
        		0.250 * tilableVoronoi(  coord + 0., 3, 19. ) +
        		0.125 * tilableVoronoi( coord + 0., 3, 23. ) 
            	-1.;
        col.b = 1. - tilableVoronoi( coord + 0.5, 6, 9. );
        
	    fragColor = col;
    } else {
        fragColor = texelFetch(iChannel0, ivec2(fragCoord), 0);
    }
}`,name:`Buffer A`,description:``,type:`buffer`},{inputs:[{id:`XsXGR8`,filepath:`/media/previz/buffer01.png`,type:`buffer`,channel:0,sampler:{filter:`linear`,wrap:`repeat`,vflip:`true`,srgb:`false`,internal:`byte`},published:1},{id:`XdfGR8`,filepath:`/media/previz/buffer03.png`,type:`buffer`,channel:1,sampler:{filter:`linear`,wrap:`clamp`,vflip:`true`,srgb:`false`,internal:`byte`},published:1}],outputs:[{id:`XsXGR8`,channel:0}],code:`// Himalayas. Created by Reinder Nijhoff 2018
// @reindernijhoff
//
// https://www.shadertoy.com/view/MdGfzh
//
// This is my first attempt to render volumetric clouds in a fragment shader.
//
// Buffer A: The main look-up texture for the cloud shapes. 
// Buffer B: A 3D (32x32x32) look-up texture with Worley Noise used to add small details 
//           to the shapes of the clouds. I have packed this 3D texture into a 2D buffer.
// 
bool resolutionChanged() {
    return floor(texelFetch(iChannel1, ivec2(0), 0).r) != floor(iResolution.x);
}

void mainImage( out vec4 fragColor, in vec2 fragCoord ) { 
    if (resolutionChanged()) {
        // pack 32x32x32 3d texture in 2d texture (with padding)
        float z = floor(fragCoord.x/34.) + 8.*floor(fragCoord.y/34.);
        vec2 uv = mod(fragCoord.xy, 34.) - 1.;
        vec3 coord = vec3(uv, z) / 32.;

        float r = tilableVoronoi( coord, 16,  3. );
        float g = tilableVoronoi( coord,  4,  8. );
        float b = tilableVoronoi( coord,  4, 16. );

        float c = max(0., 1.-(r + g * .5 + b * .25) / 1.75);

        fragColor = vec4(c,c,c,c);
    } else {
        fragColor = texelFetch(iChannel0, ivec2(fragCoord), 0);
    }
}`,name:`Buffer B`,description:``,type:`buffer`},{inputs:[{id:`4sXGR8`,filepath:`/media/previz/buffer02.png`,type:`buffer`,channel:0,sampler:{filter:`linear`,wrap:`clamp`,vflip:`true`,srgb:`false`,internal:`byte`},published:1},{id:`XdfGR8`,filepath:`/media/previz/buffer03.png`,type:`buffer`,channel:1,sampler:{filter:`linear`,wrap:`clamp`,vflip:`true`,srgb:`false`,internal:`byte`},published:1}],outputs:[{id:`4sXGR8`,channel:0}],code:`// Himalayas. Created by Reinder Nijhoff 2018
// @reindernijhoff
//
// https://www.shadertoy.com/view/MdGfzh
//
// This is my first attempt to render volumetric clouds in a fragment shader.
//
//
// To create an interesting scene and to add some scale to the clouds, I render a 
// terrain using a simple heightmap, based on the work by Íñigo Quílez on value noise and its 
// analytical derivatives.[3]
//
// In fact, the heightmap of this shader is almost exactly the same as the heightmap that 
// is used in Íñigo Quílez' shader Elevated:
//
// https://www.shadertoy.com/view/MdX3Rr
//
// To reduce noise I use temporal reprojection (both for clouds (Buffer D) and the terrain 
// (Buffer C)) separatly. The temporal reprojection code is based on code from the shader
// "Rain Forest" (again by Íñigo Quílez):
//
// https://www.shadertoy.com/view/4ttSWf
// 
vec3 noised( in vec2 x ) {
    vec2 f = fract(x);
    vec2 u = f*f*(3.0-2.0*f);
    
    vec2 p = vec2(floor(x));
    float a = hash12( (p+vec2(0,0)) );
	float b = hash12( (p+vec2(1,0)) );
	float c = hash12( (p+vec2(0,1)) );
	float d = hash12( (p+vec2(1,1)) );
    
	return vec3(a+(b-a)*u.x+(c-a)*u.y+(a-b-c+d)*u.x*u.y,
				6.0*f*(1.0-f)*(vec2(b-a,c-a)+(a-b-c+d)*u.yx));
}

const mat2 m2 = mat2(1.6,-1.2,1.2,1.6);

float terrainMap( in vec2 x, const int OCTAVES ) {
	vec2 p = x*(MOUNTAIN_HW_RATIO*SCENE_SCALE);
    float s = mix(1., smoothstep(.0,.4, abs(p.y)), .75);
    
    float a = 0.;
    float b = 1.;
	vec2  d = vec2(0.0);
    for( int i=0; i<OCTAVES; i++ ) {
        vec3 n = noised(p);
        d += n.yz;
        a += b*n.x/(1.0+dot(d,d));
		b *= 0.5;
        p = m2*p;
    }
	return s*a*(MOUNTAIN_HEIGHT*INV_SCENE_SCALE*.5);
}

float terrainMapB( in vec2 x, const int OCTAVES ) {
	vec2 p = x*(MOUNTAIN_HW_RATIO*SCENE_SCALE);
    float s = mix(1., smoothstep(.0,.4, abs(p.y)), .75);
    
    float a = 0.;
    float b = 1.;
	vec2  d = vec2(0.0);
    for( int i=0; i<OCTAVES; i++ ) {
        vec3 n = noised(p);
        d += n.yz;
        a += b*n.x/(1.0+dot(d,d));
		b *= 0.5;
        p = m2*p;
    }
	return s*a*(MOUNTAIN_HEIGHT*INV_SCENE_SCALE*.5);
}
vec3 calcNormal(in vec3 pos, float t, const int OCTAVES) {
    vec2  eps = vec2( (0.0015)*t, 0.0 );
    return normalize( vec3( terrainMap(pos.xz-eps.xy, OCTAVES) - terrainMap(pos.xz+eps.xy, OCTAVES),
                            2.0*eps.x,
                            terrainMap(pos.xz-eps.yx, OCTAVES) - terrainMap(pos.xz+eps.yx, OCTAVES) ) );
}

vec4 render( in vec3 ro, in vec3 rd ) {
	vec3 col, bgcol;
    
    float tmax = 10000.;
    // bouding top plane
    float topd = ((MOUNTAIN_HEIGHT*INV_SCENE_SCALE)-ro.y)/rd.y;
    if( rd.y > 0.0 && topd > 0.0 ) {
        tmax = min(tmax, topd);
    }
    
    // intersect with heightmap
    float t = 1.;
	for( int i=0; i<128; i++ ) {
        vec3 pos = ro + t*rd;
		float h = pos.y - terrainMap( pos.xz, 7 );
        if(abs(h)<(0.003*t) || t>tmax ) break; // use abs(h) to bounce back if under terrain
	    t += .9 * h;
	}
   	
    bgcol = col = getSkyColor(rd);
	if( t<tmax) {
		vec3 pos = ro + t*rd;
        vec3 nor = calcNormal( pos, t, 15);
           
        // terrain color - just back and white
        float s = smoothstep(0.5,0.9,dot(nor, vec3(.3,1.,0.05)));
        col = mix( vec3(.01), vec3(0.5,0.52,0.6), smoothstep(.1,.7,s ));
		
        // lighting	
        // shadow is calculated based on the slope of a low frequency version of the heightmap
        float shadow = .5 + clamp( -8.+ 16.*dot(SUN_DIR, calcNormal(pos, t, 5)), 0.0, .5 );
        shadow *= smoothstep(20.,80.,pos.y);
        
        float ao = terrainMap(pos.xz, 10)-terrainMap(pos.xz,7);
        ao = clamp(.25 + ao / (MOUNTAIN_HEIGHT*INV_SCENE_SCALE) * 200., 0., 1.);

        float ambient  = max(0.5+0.5*nor.y,0.0);
		float diffuse  = max(dot(SUN_DIR, nor), 0.0);
		float backlight = max(0.5 + 0.5*dot( normalize( vec3(-SUN_DIR.x, 0., SUN_DIR.z)), nor), 0.0);
	 	
        //
        // use a 3-light setup as described by Íñigo Quílez
        // https://iquilezles.org/articles/outdoorslighting
        //
		vec3 lin = (diffuse*shadow*3.) * SUN_COLOR;
		lin += (ao*ambient)*vec3(0.40,0.60,1.00);
        lin += (backlight)*vec3(0.40,0.50,0.60);
		col *= lin;
        col *= (.6+.4*smoothstep(400.,100.,abs(pos.z))); // dark in the distance
    
        // height based fog, see https://iquilezles.org/articles/fog
        float fogAmount = HEIGHT_BASED_FOG_C * (1.-exp( -t*rd.y*HEIGHT_BASED_FOG_B))/rd.y;
        col = mix( col, bgcol, fogAmount);
    } else {
        t = 10000.;
    }

	return vec4( col, t );
}


bool resolutionChanged() {
    return floor(texelFetch(iChannel1, ivec2(0), 0).r) != floor(iResolution.x);
}

bool mouseChanged() {
    return iMouse.z * texelFetch(iChannel1, ivec2(1,0), 1).w < 0.;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
    if( letterBox(fragCoord, iResolution.xy, 2.25) ) {
        fragColor = vec4( 0., 0., 0., 1. );
        return;
    } else {
        vec3 ro, rd;
        vec3 o = hash33( vec3(fragCoord,iFrame) ) - 0.5; // dither
        getRay( iTime, (fragCoord+o.xy), iResolution.xy, iMouse/iResolution.xyxy, ro, rd);

        vec4 res = render( ro + rd*o.z, rd );

        vec2 spos = reprojectPos(ro+rd*res.w, iResolution.xy, iChannel1);
        spos -= o.xy/iResolution.xy; // undo dither
        
        vec2 rpos = spos * iResolution.xy;
        
        if( !letterBox(rpos.xy, iResolution.xy, 2.3) 
            && !resolutionChanged() && !mouseChanged()) {
            vec4 ocol = texture( iChannel0, spos, 0.0 );
            res.rgb = mix(max(ocol.rgb,vec3(0)), res.rgb, .125);
        }

        fragColor = res;
    }
}`,name:`Buffer C`,description:``,type:`buffer`},{inputs:[{id:`4dXGR8`,filepath:`/media/previz/buffer00.png`,type:`buffer`,channel:0,sampler:{filter:`linear`,wrap:`repeat`,vflip:`true`,srgb:`false`,internal:`byte`},published:1},{id:`XsXGR8`,filepath:`/media/previz/buffer01.png`,type:`buffer`,channel:3,sampler:{filter:`linear`,wrap:`repeat`,vflip:`true`,srgb:`false`,internal:`byte`},published:1},{id:`4sXGR8`,filepath:`/media/previz/buffer02.png`,type:`buffer`,channel:2,sampler:{filter:`linear`,wrap:`clamp`,vflip:`true`,srgb:`false`,internal:`byte`},published:1},{id:`XdfGR8`,filepath:`/media/previz/buffer03.png`,type:`buffer`,channel:1,sampler:{filter:`linear`,wrap:`clamp`,vflip:`true`,srgb:`false`,internal:`byte`},published:1}],outputs:[{id:`XdfGR8`,channel:0}],code:`// Himalayas. Created by Reinder Nijhoff 2018
// @reindernijhoff
//
// https://www.shadertoy.com/view/MdGfzh
//
// This is my first attempt to render volumetric clouds in a fragment shader.
//
// I started this shader by trying to implement the clouds of Horizon Zero Dawn, as
// described in "The real-time volumetric cloudscapes of Horizon Zero Dawn" by 
// Andrew Schneider and Nathan Vos.[1] To model the shape of the clouds, two look-up
// textures are created with different frequencies of (Perlin -) Worley noise:
//
// Buffer A: The main look-up texture for the cloud shapes. 
// Buffer B: A 3D (32x32x32) look-up texture with Worley Noise used to add small details 
//           to the shapes of the clouds. I have packed this 3D texture into a 2D buffer.
//           
// Because it is not possible (yet) to create buffers with fixed size, or 3D buffers, the
// look-up texture in Buffer A is 2D, and a slice of the volume that is described in the 
// article. Therefore, and because I didn't have any slots left (in Buffer C) to use a 
// cloud type/cloud coverage texture, the modelling of the cloud shapes in this shader is 
// in the end mostly based on trial and error, and is probably far from the code used in 
// Horizon Zero Dawn.
//
// Buffer D: Rendering of the clouds.
//
// I render the clouds using the improved integration method of volumetric media, as described 
// in "Physically Based Sky, Atmosphere and Cloud Rendering in Frostbite" by 
// Sébastien Hillaire.[2]
//
// You can find the (excellent) example shaders of Sébastien Hillaire (SebH) here:
//
// https://www.shadertoy.com/view/XlBSRz
// https://www.shadertoy.com/view/MdlyDs
//
#define CLOUD_MARCH_STEPS 12
#define CLOUD_SELF_SHADOW_STEPS 6

#define EARTH_RADIUS    (1500000.) // (6371000.)
#define CLOUDS_BOTTOM   (1350.)
#define CLOUDS_TOP      (2350.)

#define CLOUDS_LAYER_BOTTOM   (-150.)
#define CLOUDS_LAYER_TOP      (-70.)

#define CLOUDS_COVERAGE (.52)
#define CLOUDS_LAYER_COVERAGE (.41)

#define CLOUDS_DETAIL_STRENGTH (.225)
#define CLOUDS_BASE_EDGE_SOFTNESS (.1)
#define CLOUDS_BOTTOM_SOFTNESS (.25)
#define CLOUDS_DENSITY (.03)
#define CLOUDS_SHADOW_MARGE_STEP_SIZE (10.)
#define CLOUDS_LAYER_SHADOW_MARGE_STEP_SIZE (4.)
#define CLOUDS_SHADOW_MARGE_STEP_MULTIPLY (1.3)
#define CLOUDS_FORWARD_SCATTERING_G (.8)
#define CLOUDS_BACKWARD_SCATTERING_G (-.2)
#define CLOUDS_SCATTERING_LERP (.5)

#define CLOUDS_AMBIENT_COLOR_TOP (vec3(149., 167., 200.)*(1.5/255.))
#define CLOUDS_AMBIENT_COLOR_BOTTOM (vec3(39., 67., 87.)*(1.5/255.))
#define CLOUDS_MIN_TRANSMITTANCE .1

#define CLOUDS_BASE_SCALE 1.51
#define CLOUDS_DETAIL_SCALE 20.

//
// Cloud shape modelling and rendering 
//
float HenyeyGreenstein( float sundotrd, float g) {
	float gg = g * g;
	return (1. - gg) / pow( 1. + gg - 2. * g * sundotrd, 1.5);
}

float interectCloudSphere( vec3 rd, float r ) {
    float b = EARTH_RADIUS * rd.y;
    float d = b * b + r * r + 2. * EARTH_RADIUS * r;
    return -b + sqrt( d );
}

float linearstep( const float s, const float e, float v ) {
    return clamp( (v-s)*(1./(e-s)), 0., 1. );
}

float linearstep0( const float e, float v ) {
    return min( v*(1./e), 1. );
}

float remap(float v, float s, float e) {
	return (v - s) / (e - s);
}

float cloudMapBase(vec3 p, float norY) {
	vec3 uv = p * (0.00005 * CLOUDS_BASE_SCALE);
    vec3 cloud = texture(iChannel0, uv.xz).rgb;
   
    float n = norY*norY;
    n *= cloud.b ;
        n+= pow(1.-norY, 16.); 
	return remap( cloud.r - n, cloud.g, 1.);
}

float cloudMapDetail(vec3 p) { 
    // 3d lookup in 2d texture :(
    p = abs(p) * (0.0016 * CLOUDS_BASE_SCALE * CLOUDS_DETAIL_SCALE);
  
    float yi = mod(p.y,32.);
    ivec2 offset = ivec2(mod(yi,8.), mod(floor(yi/8.),4.))*34 + 1;
    float a = texture(iChannel3, (mod(p.xz,32.)+vec2(offset.xy)+1.)/iResolution.xy).r;
    
    yi = mod(p.y+1.,32.);
    offset = ivec2(mod(yi,8.), mod(floor(yi/8.),4.))*34 + 1;
    float b = texture(iChannel3, (mod(p.xz,32.)+vec2(offset.xy)+1.)/iResolution.xy).r;
    
    return mix(a,b,fract(p.y));
}

float cloudGradient( float norY ) {
    return linearstep( 0., .05, norY ) - linearstep( .8, 1.2, norY);
}

float cloudMap(vec3 pos, vec3 rd, float norY) {
    vec3 ps = pos;
    
    float m = cloudMapBase(ps, norY);
	m *= cloudGradient( norY );

	float dstrength = smoothstep(1., 0.5, m);
    
    // erode with detail
    if(dstrength > 0.) {
		m -= cloudMapDetail( ps ) * dstrength * CLOUDS_DETAIL_STRENGTH;
    }

	m = smoothstep( 0., CLOUDS_BASE_EDGE_SOFTNESS, m+(CLOUDS_COVERAGE-1.) );
    m *= linearstep0(CLOUDS_BOTTOM_SOFTNESS, norY);

    return clamp(m * CLOUDS_DENSITY * (1.+max((ps.x-7000.)*0.005,0.)), 0., 1.);
}

float volumetricShadow(in vec3 from, in float sundotrd ) {
    float dd = CLOUDS_SHADOW_MARGE_STEP_SIZE;
    vec3 rd = SUN_DIR;
    float d = dd * .5;
    float shadow = 1.0;

    for(int s=0; s<CLOUD_SELF_SHADOW_STEPS; s++) {
        vec3 pos = from + rd * d;
        float norY = (length(pos) - (EARTH_RADIUS + CLOUDS_BOTTOM)) * (1./(CLOUDS_TOP - CLOUDS_BOTTOM));

        if(norY > 1.) return shadow;

        float muE = cloudMap( pos, rd, norY );
        shadow *= exp(-muE * dd);

        dd *= CLOUDS_SHADOW_MARGE_STEP_MULTIPLY;
        d += dd;
    }
    return shadow;
}

vec4 renderClouds( vec3 ro, vec3 rd, inout float dist ) {
    if( rd.y < 0. ) {
        return vec4(0,0,0,10);
    }

    ro.xz *= SCENE_SCALE;
    ro.y = sqrt(EARTH_RADIUS*EARTH_RADIUS-dot(ro.xz,ro.xz));

    float start = interectCloudSphere( rd, CLOUDS_BOTTOM );
    float end  = interectCloudSphere( rd, CLOUDS_TOP );
    
    if (start > dist) {
        return vec4(0,0,0,10);
    }
    
    end = min(end, dist);
    
    float sundotrd = dot( rd, -SUN_DIR);

    // raymarch
    float d = start;
    float dD = (end-start) / float(CLOUD_MARCH_STEPS);

    float h = hash13(rd + fract(iTime) );
    d -= dD * h;

    float scattering =  mix( HenyeyGreenstein(sundotrd, CLOUDS_FORWARD_SCATTERING_G),
        HenyeyGreenstein(sundotrd, CLOUDS_BACKWARD_SCATTERING_G), CLOUDS_SCATTERING_LERP );

    float transmittance = 1.0;
    vec3 scatteredLight = vec3(0.0, 0.0, 0.0);

    dist = EARTH_RADIUS;

    for(int s=0; s<CLOUD_MARCH_STEPS; s++) {
        vec3 p = ro + d * rd;

        float norY = clamp( (length(p) - (EARTH_RADIUS + CLOUDS_BOTTOM)) * (1./(CLOUDS_TOP - CLOUDS_BOTTOM)), 0., 1.);

        float alpha = cloudMap( p, rd, norY );

        if( alpha > 0. ) {
            dist = min( dist, d);
            vec3 ambientLight = mix( CLOUDS_AMBIENT_COLOR_BOTTOM, CLOUDS_AMBIENT_COLOR_TOP, norY );

            vec3 S = (ambientLight + SUN_COLOR * (scattering * volumetricShadow(p, sundotrd))) * alpha;
            float dTrans = exp(-alpha * dD);
            vec3 Sint = (S - S * dTrans) * (1. / alpha);
            scatteredLight += transmittance * Sint; 
            transmittance *= dTrans;
        }

        if( transmittance <= CLOUDS_MIN_TRANSMITTANCE ) break;

        d += dD;
    }

    return vec4(scatteredLight, transmittance);
}

//
//
// !Because I wanted a second cloud layer (below the horizon), I copy-pasted 
// almost all of the code above:
//

float cloudMapLayer(vec3 pos, vec3 rd, float norY) {
    vec3 ps = pos;

    float m = cloudMapBase(ps, norY);
	// m *= cloudGradient( norY );
	float dstrength = smoothstep(1., 0.5, m);
    
    // erode with detail
    if (dstrength > 0.) {
		m -= cloudMapDetail( ps ) * dstrength * CLOUDS_DETAIL_STRENGTH;
    }

	m = smoothstep( 0., CLOUDS_BASE_EDGE_SOFTNESS, m+(CLOUDS_LAYER_COVERAGE-1.) );

    return clamp(m * CLOUDS_DENSITY, 0., 1.);
}

float volumetricShadowLayer(in vec3 from, in float sundotrd ) {
    float dd = CLOUDS_LAYER_SHADOW_MARGE_STEP_SIZE;
    vec3 rd = SUN_DIR;
    float d = dd * .5;
    float shadow = 1.0;

    for(int s=0; s<CLOUD_SELF_SHADOW_STEPS; s++) {
        vec3 pos = from + rd * d;
        float norY = clamp( (pos.y - CLOUDS_LAYER_BOTTOM ) * (1./(CLOUDS_LAYER_TOP - CLOUDS_LAYER_BOTTOM)), 0., 1.);

        if(norY > 1.) return shadow;

        float muE = cloudMapLayer( pos, rd, norY );
        shadow *= exp(-muE * dd);

        dd *= CLOUDS_SHADOW_MARGE_STEP_MULTIPLY;
        d += dd;
    }
    return shadow;
}

vec4 renderCloudLayer( vec3 ro, vec3 rd, inout float dist ) {
    if( rd.y > 0. ) {
        return vec4(0,0,0,10);
    }

    ro.xz *= SCENE_SCALE;
    ro.y = 0.;

    float start = CLOUDS_LAYER_TOP/rd.y;
    float end  = CLOUDS_LAYER_BOTTOM/rd.y;
    
    if (start > dist) {
        return vec4(0,0,0,10);
    }
    
    end = min(end, dist);
    
    float sundotrd = dot( rd, -SUN_DIR);

    // raymarch
    float d = start;
    float dD = (end-start) / float(CLOUD_MARCH_STEPS);

    float h = hash13(rd + fract(iTime) );
    d -= dD * h;

    float scattering =  mix( HenyeyGreenstein(sundotrd, CLOUDS_FORWARD_SCATTERING_G),
        HenyeyGreenstein(sundotrd, CLOUDS_BACKWARD_SCATTERING_G), CLOUDS_SCATTERING_LERP );

    float transmittance = 1.0;
    vec3 scatteredLight = vec3(0.0, 0.0, 0.0);

    dist = EARTH_RADIUS;

    for(int s=0; s<CLOUD_MARCH_STEPS; s++) {
        vec3 p = ro + d * rd;

        float norY = clamp( (p.y - CLOUDS_LAYER_BOTTOM ) * (1./(CLOUDS_LAYER_TOP - CLOUDS_LAYER_BOTTOM)), 0., 1.);

        float alpha = cloudMapLayer( p, rd, norY );

        if( alpha > 0. ) {
            dist = min( dist, d);
            vec3 ambientLight = mix( CLOUDS_AMBIENT_COLOR_BOTTOM, CLOUDS_AMBIENT_COLOR_TOP, norY );

            vec3 S = .7 * (ambientLight +  SUN_COLOR * (scattering * volumetricShadowLayer(p, sundotrd))) * alpha;
            float dTrans = exp(-alpha * dD);
            vec3 Sint = (S - S * dTrans) * (1. / alpha);
            scatteredLight += transmittance * Sint; 
            transmittance *= dTrans;
        }

        if( transmittance <= CLOUDS_MIN_TRANSMITTANCE ) break;

        d += dD;
    }

    return vec4(scatteredLight, transmittance);
}

//
// Main function
//
bool resolutionChanged() {
    return floor(texelFetch(iChannel1, ivec2(0), 0).r) != floor(iResolution.x);
}

bool mouseChanged() {
    return iMouse.z * texelFetch(iChannel1, ivec2(1,0), 1).w < 0.;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord ) {            
    if (fragCoord.y < 1.5) {
        fragColor = saveCamera(iTime, fragCoord, iMouse/iResolution.xyxy);
        if( abs(fragCoord.x-1.5)<0.5 ) fragColor = vec4(iMouse);
        if( abs(fragCoord.x-0.5)<0.5 ) fragColor = mouseChanged() ? vec4(0) : vec4(iResolution.xy,0,0);
    } else {
        if( letterBox(fragCoord, iResolution.xy, 2.25) ) {
        	fragColor = vec4( 0., 0., 0., 1. );
       		return;
        } else {
            float dist = texelFetch(iChannel2, ivec2(fragCoord),0).w * SCENE_SCALE;
            vec4 col = vec4(0,0,0,1);
            
            vec3 ro, rd;
    		getRay( iTime, fragCoord, iResolution.xy, iMouse/iResolution.xyxy, ro, rd);

            if( rd.y > 0. ) {
                // clouds
                col = renderClouds(ro, rd, dist);
                float fogAmount = 1.-(.1 + exp(-dist*0.0001));
                col.rgb = mix(col.rgb, getSkyColor(rd)*(1.-col.a), fogAmount);
            } else {
                // cloud layer below horizon
                col = renderCloudLayer(ro, rd, dist);
                // height based fog, see https://iquilezles.org/articles/fog
                float fogAmount = HEIGHT_BASED_FOG_C * 
                    (1.-exp( -dist*rd.y*(INV_SCENE_SCALE*HEIGHT_BASED_FOG_B)))/rd.y;
                col.rgb = mix(col.rgb, getSkyColor(rd)*(1.-col.a), clamp(fogAmount,0.,1.));
            }

            if( col.w > 1. ) {
                fragColor = vec4(0,0,0,1);
            } else {
                vec2 spos = reprojectPos(ro+rd*dist, iResolution.xy, iChannel1);
                vec2 rpos = spos * iResolution.xy;

        		if( !letterBox(rpos.xy, iResolution.xy, 2.3) 
                    && !resolutionChanged() && !mouseChanged()) {
                    vec4 ocol = texture( iChannel1, spos, 0.0 ).xyzw;
                    col = mix(ocol, col, 0.05);
                }
                fragColor = col;
            }
        }
    }
}`,name:`Buffer D`,description:``,type:`buffer`}]},{ver:`0.1`,info:{id:`XsyfD3`,date:`1530720675`,viewed:3389,name:`Paratrooper (game)`,description:`The numeric  key pad  controls  your gun and the firing of your bullets. Two keys start the gun moving:
     < and 4    counterclockwise
     > or 6      clockwise
Using the ^ or 8 key stops  the movement of your gun and fires your bullets.`,likes:45,published:`Public API`,usePreview:0,tags:[`2d`,`game`,`retro`,`pixel`,`paratrooper`,`arcade`,`dos`]},renderpass:[{inputs:[{id:`XsXGR8`,filepath:`/media/previz/buffer01.png`,type:`buffer`,channel:0,sampler:{filter:`nearest`,wrap:`clamp`,vflip:`true`,srgb:`false`,internal:`byte`},published:1}],outputs:[{id:`4dfGRr`,channel:0}],code:`// Paratrooper. Created by Reinder Nijhoff 2018
// Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License.
// @reindernijhoff
//
// https://www.shadertoy.com/view/XsyfD3
//
// I made this shader because I wanted to try to create a simple 
// but complete game on Shadertoy.
//
// Buffer A: Game logic. As usual this code started nice, but in the
//           end I added a lot of if-statements and it became a mess.
// Buffer B: Rendering of the screen (320x200).
// Buffer C: Encoding and decoding of bitmaps used.
//
// So here it is: Paratrooper ("The worst IBM program of 1983").
//
//
//             *Your Mission*
//
// Do not allow enemy  paratroopers to land
// on either side of your gun base. If four
// paratroopers  land on one  side of  your
// base,  they will overpower your defenses
// and blow  up your  gun.  After  you have
// survived the first round of helicopters,
// watch out for the jet bombers. Every jet
// pilot has a deadly aim!
// The numeric  key pad  controls  your gun
// and the firing of your bullets. Two keys
// start the gun moving:
//     < and 4    counterclockwise
//     > or 6     clockwise
// Using the ^ or 8 key stops  the movement
// of your gun and fires your bullets.
//
//                 *Scoring*
//     HELICOPTER or JET  .  .  10 points
//     ENEMY PARATROOPER  .  .   5 points
//     BOMB.  .  .  .  .  .  .  30 points
//
// Each bullet you fire costs you one point
//
//    PRESS space bar FOR KEYBOARD PLAY
//

void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
    vec2 scale = RES / (iResolution.xy - vec2(0,20));
    float s = max(scale.x, scale.y);
    vec2 uv = (fragCoord.xy * s - .5 * (iResolution.xy * s - RES));
    if( inBox(ivec2(uv), ivec2(0), ivec2(RES)) ) {    
	    if (iResolution.x < 320.) uv *= .5;
	    fragColor = vec4(texture(iChannel0, (uv + .5) / iResolution.xy).rgb, 1.0);
    } else {
        fragColor = vec4(0,0,0,1);
    }
}`,name:`Image`,description:``,type:`image`},{inputs:[],outputs:[],code:`// Paratrooper. Created by Reinder Nijhoff 2018
// @reindernijhoff
//
// https://www.shadertoy.com/view/XsyfD3
//
// I made this shader because I wanted to try  to create a simple 
// but complete game in Shadertoy.
//

#define FIXED_TIME_STEP
#define FORCE_NO_UNROLL +min(0,int(iFrame))

#define RES vec2(320,200)
#define CANON_CENTER ivec2(160,157)

#define COL_WHITE vec3(1)
#define COL_BLACK vec3(0)
#define COL_MAGENTA (vec3(253,93,252)/255.)
#define COL_CYAN (vec3(95,255,254)/255.)

#define INF 1e10

// game defines

#define GAME_OVER 0.
#define GAME_HELICOPTER 1.
#define GAME_JET 2.

#define EXPLOSION_DURATION 1.
#define GAME_OVER_DURATION 3.

#define ROUND_HELICOPTER_TIME 20.
#define ROUND_JET_TIME 5.
#define ROUND_COOL_DOWN_TIME 1.

#define CANON_ROT_SPEED 2.3
#define CANON_MAX_ANGLE 1.4

#define MAX_BULLETS 8
#define BULLET_SPEED 125.
#define SHOT_COOLDOWN .21


#define MAX_AIRCRAFTS 6
#define MIN_AIRCRAFT_DT .75
#define MAX_AIRCRAFT_DT 5.5
#define AIRCRAFT_SPEED 70.

#define MAX_PARATROOPERS 5
#define MIN_PARATROOP_DT 1.25
#define MAX_PARATROOP_DT 6.

#define PARATROOPER_SPEED_0 92.
#define PARATROOPER_SPEED_1 47.5
#define MIN_PARATROOP_OPEN_DT .2
#define MAX_PARATROOP_OPEN_DT .8

#define BOMB_DT 0.5
#define BOMBS_DT 2.
#define BOMB_SPEED 105.

#define DEAD_PARATROOPER_DT 1.

#define BULLET_DATA_OFFSET 10
#define AIRCRAFT_DATA_OFFSET 20
#define PARATROOPER_DATA_OFFSET 30

// global game variables

float gDT;
float gCanonMovement;
float gCanonAngle;
float gMode;

float gScore;
float gHighScore;
float gEndRoundTime;
float gEndRoundTimeCoolDown;
float gGameOverTime;

float gLastShot;
vec3 gBulletData[MAX_BULLETS];
    
float gLastAircraft;
vec2 gAircraftData[MAX_AIRCRAFTS];

float gLastParatrooper;
vec4 gParatrooperData[MAX_PARATROOPERS];

vec4 gDeadParatroopers;
vec4 gParatroopersLeft;
vec4 gParatroopersRight;

vec4 gExplosion1;
vec4 gExplosion2;

void saveGameState(ivec2 uv, float time, inout vec4 f) {
    if(uv.x == 0) f = vec4(time, gCanonMovement, gCanonAngle, gMode);
    if(uv.x == 1) f = vec4(gLastShot, gLastAircraft, gScore, gHighScore);
    if(uv.x == 2) f = vec4(gLastParatrooper,gEndRoundTime,gEndRoundTimeCoolDown,gGameOverTime);
    if(uv.x == 3) f = gDeadParatroopers;
    if(uv.x == 4) f = gParatroopersLeft;
    if(uv.x == 5) f = gParatroopersRight;
    if(uv.x == 6) f = gExplosion1;
    if(uv.x == 7) f = gExplosion2;
    
    for (int i=0; i<MAX_BULLETS; i++) {
        if(uv.x == i+BULLET_DATA_OFFSET) f = vec4(gBulletData[i],0);
    }
    for (int i=0; i<MAX_AIRCRAFTS/2; i++) {
        if(uv.x == i+AIRCRAFT_DATA_OFFSET) f = vec4(gAircraftData[i*2+0], gAircraftData[i*2+1]);
    }
    for (int i=0; i<MAX_PARATROOPERS; i++) {
        if(uv.x == i+PARATROOPER_DATA_OFFSET) f = gParatrooperData[i];
    }
}

void loadGameStateMinimal(float time, sampler2D storage) {
    vec4 f;

    f = texelFetch(storage, ivec2(0,0), 0);
#ifdef FIXED_TIME_STEP
    gDT = (1./60.);
#else
    gDT = time - f.x;
#endif
    gCanonMovement = f.y;
    gCanonAngle = f.z;
    gMode = f.w;
    
    f = texelFetch(storage, ivec2(1,0), 0);
    gLastShot = f.x;
    gLastAircraft = f.y;
    gScore = f.z;
    gHighScore = f.w;
    
    f = texelFetch(storage, ivec2(2,0), 0);
    gLastParatrooper = f.x;
    gEndRoundTime = f.y;
    gEndRoundTimeCoolDown = f.z;
    gGameOverTime = f.w;
    
    gDeadParatroopers = texelFetch(storage, ivec2(3,0), 0);
    gParatroopersLeft = texelFetch(storage, ivec2(4,0), 0);
    gParatroopersRight = texelFetch(storage, ivec2(5,0), 0);
    
    gExplosion1 = texelFetch(storage, ivec2(6,0), 0);
    gExplosion2 = texelFetch(storage, ivec2(7,0), 0);
}

void loadGameStateFull(float time, sampler2D storage) {
    loadGameStateMinimal(time, storage);
        
    for (int i=0; i<MAX_BULLETS; i++) {
    	gBulletData[i] = texelFetch(storage, ivec2(i+BULLET_DATA_OFFSET,0), 0).xyz;
    }
    
    for (int i=0; i<MAX_AIRCRAFTS/2; i++) {
        vec4 f = texelFetch(storage, ivec2(i+AIRCRAFT_DATA_OFFSET,0), 0);
        gAircraftData[i*2+0] = f.xy;
        gAircraftData[i*2+1] = f.zw;
    } 
    
    for (int i=0; i<MAX_PARATROOPERS; i++) {
    	gParatrooperData[i] = texelFetch(storage, ivec2(i+PARATROOPER_DATA_OFFSET,0), 0);
    }
}

//
// Hash functions
//
// Hash without Sine by Dave_Hoskins
//
// https://www.shadertoy.com/view/4djSRW
//

#define HASHSCALE1 .1031
#define HASHSCALE3 vec3(.1031, .1030, .0973)
#define HASHSCALE4 vec4(.1031, .1030, .0973, .1099)

float hash11(float p) {
	vec3 p3  = fract(vec3(p) * HASHSCALE1);
    p3 += dot(p3, p3.yzx + 19.19);
    return fract((p3.x + p3.y) * p3.z);
}

float hash12(vec2 p) {
	vec3 p3  = fract(vec3(p.xyx) * HASHSCALE1);
    p3 += dot(p3, p3.yzx + 19.19);
    return fract((p3.x + p3.y) * p3.z);
}

vec2 hash22(vec2 p) {
	vec3 p3 = fract(vec3(p.xyx) * HASHSCALE3);
    p3 += dot(p3, p3.yzx+19.19);
    return fract((p3.xx+p3.yz)*p3.zy);

}

// game functions
ivec2 getAircraftPos(vec2 data, float time) {
    float t = (time-abs(data.x));
    if (t > 0.) {
        int p = int(t * AIRCRAFT_SPEED) - 10;
        bool ltr = data.x > 0.;
    	return ivec2(ltr ? p : int(RES.x) - p, ltr ? 18 : 6);
    } else {
        return ivec2(-1);
    }
}

// draw functions

bool inBox(const ivec2 uv, const ivec2 lt, const ivec2 rb) {
    return (uv.y >= lt.y && uv.y < rb.y && uv.x >= lt.x && uv.x < rb.x);
}

void drawBox(const ivec2 uv, const ivec2 lt, const ivec2 rb, const vec3 color, inout vec3 f) {
	if (inBox(uv, lt, rb)) f = color;    
}

void drawSprite(const ivec2 uv, const ivec2 lt, const ivec2 rb, const ivec2 offset, const in sampler2D d, const bool flip, inout vec3 f) {
    if (inBox(uv, lt, rb)) {
        ivec2 c = uv - lt;
    	c.x = flip ? (rb.x-lt.x)-c.x-1 : c.x;
    
        vec3 col = texelFetch(d, offset + c, 0).rgb;    
        f = col.r > 0. ? col : f;
    }
}`,name:`Common`,description:``,type:`common`},{inputs:[{id:`4dXGRr`,filepath:`/presets/tex00.jpg`,type:`keyboard`,channel:0,sampler:{filter:`linear`,wrap:`clamp`,vflip:`true`,srgb:`false`,internal:`byte`},published:1},{id:`4dXGR8`,filepath:`/media/previz/buffer00.png`,type:`buffer`,channel:1,sampler:{filter:`nearest`,wrap:`clamp`,vflip:`true`,srgb:`false`,internal:`byte`},published:1}],outputs:[{id:`4dXGR8`,channel:0}],code:`// Paratrooper. Created by Reinder Nijhoff 2018
// @reindernijhoff
//
// https://www.shadertoy.com/view/XsyfD3
//
// I made this shader because I wanted to try  to create a simple 
// but complete game in Shadertoy.
//
// Buffer A: Game logic. As usual this code started nice, but in the
//           end I added a lot of if-statements and it became a mess.
//

const int KEY_SPACE = 32;
const int KEY_LEFT  = 37;
const int KEY_UP    = 38;
const int KEY_RIGHT = 39;
const int KEY_DOWN  = 40;
const int KEY_A     = 65;
const int KEY_D     = 68;
const int KEY_S     = 83;
const int KEY_W     = 87;

bool KP(int key) {
	return texelFetch( iChannel0, ivec2(key, 0), 0 ).x > 0.0;
}

bool KT(int key) {
	return texelFetch( iChannel0, ivec2(key, 2), 0 ).x > 0.0;
}

float sBox( in vec2 ro, in vec2 rd, in vec2 rad ) {
    if(rd.x == 0.) rd.x = 0.001;
    vec2 m = 1./rd;
    vec2 n = m*ro;
    vec2 k = abs(m)*rad;
	
    vec2 t1 = -n - k;
    vec2 t2 = -n + k;

	float tN = max( t1.x, t1.y );
	float tF = min( t2.x, t2.y );
    if( tN > tF || tF < 0.0) {
        return -1.0;
    } else {
		return tN;
    }
}

bool shoot(float time) {
    if (gLastShot + SHOT_COOLDOWN < time) {
        gLastShot = time;
        return true;
    }
    return false;
}

void paratrooperLand(float x, inout vec4 data) {
    if(data.x <= 0.) data.x = x;
    else if(data.y <= 0.) data.y = x;
    else if(data.z <= 0.) data.z = x;
    else if(data.w <= 0.) data.w = x;
}

void killParatrooperAtPos(float x, inout vec4 data) {
    if(data.x == x) data.x = 0.;
    if(data.y == x) data.y = 0.;
    if(data.z == x) data.z = 0.;
    if(data.w == x) data.w = 0.;
}

void deadParatrooper(float x, float time) {
    float visibleUntil = time + DEAD_PARATROOPER_DT;
    if (gDeadParatroopers.y < visibleUntil) {
        gDeadParatroopers.x = x;
        gDeadParatroopers.y = visibleUntil;
    } else {
        gDeadParatroopers.z = x;
        gDeadParatroopers.w = visibleUntil;
    }
    if (x < 160.) {
        killParatrooperAtPos(x, gParatroopersLeft);
    } else {
        killParatrooperAtPos(x, gParatroopersRight);
    }
}

void initExplosion(vec2 pos, float time, float type) {
    if (gExplosion1.z < time - EXPLOSION_DURATION) {
        gExplosion1 = vec4(pos, time, type);
    } else {
        gExplosion2 = vec4(pos, time, type);
    }
}

void initNewBullet(int index) {
    float a = gCanonAngle;
    gBulletData[index].z = a;
    gBulletData[index].xy = vec2(CANON_CENTER) + vec2(sin(a),-cos(a)) * 20.;
}

void initAircraft(int index, float time, bool direct) {
    float h = direct ? 0. : hash11(float(index)+time);
    gLastAircraft += mix(MIN_AIRCRAFT_DT, MAX_AIRCRAFT_DT, h*h*h*h);
    if (gLastAircraft < gEndRoundTime) {
        float d = hash11(float(index)+time+.5)-.4 > 0. ? 1. : -1.;
        float ph = hash11(float(index)+time+.75);
        float p = gMode > GAME_HELICOPTER + .5 ?  
           (ph > .25 ? gLastAircraft + BOMB_DT : INF) : MAX_PARATROOP_DT * ph + gLastAircraft;
        gAircraftData[index] = vec2(gLastAircraft * d, p);
    } else {
        gAircraftData[index] = vec2(-20);
    }
}

void initAircrafts(float time) {
    gLastAircraft = time;
    for (int i=0; i<MAX_AIRCRAFTS; i++) {
        initAircraft(i, time, i == 0);
    }
}

bool fourParatroopersLanded(vec4 d) {
    return d.x > 0. && d.y > 0. && d.z > 0. && d.w > 0.;
}

void initNewRound(float mode, float time) {
    gMode = mode;
    gEndRoundTime = time + 
        ((gMode < GAME_HELICOPTER + .5) ? ROUND_HELICOPTER_TIME : ROUND_JET_TIME);
    
    initAircrafts(time);
}

void initNewGame(float time) {
    gParatroopersLeft = vec4(0);
    gParatroopersRight = vec4(0);
    gScore = 0.;
    gLastShot = time;
    gGameOverTime = 0.;
    
    for (int i=0; i<MAX_BULLETS; i++) {
    	gBulletData[i].z = -20.;
    }
    for (int i=0; i<MAX_PARATROOPERS; i++) {
    	gParatrooperData[i].x = -20.;
    }
    
    initNewRound(GAME_HELICOPTER, time);
}

void recycleBullet(inout vec3 bullet, float score) {
    bullet.z = -20.;
    gScore += score;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
    ivec2 uv = ivec2(fragCoord);
    
    // gameloop
    if( uv.y == 0 && uv.x < 100) {
        loadGameStateFull(iTime, iChannel1);
		bool gameOver = false;
     	
        if (gMode < GAME_OVER + .5) {      
            if( KP(KEY_SPACE) ) {
                initNewGame(iTime);       
            }
        } else {
            // user input
            bool wantShot = false;
            if (gGameOverTime < .5) {
                if( KP(KEY_LEFT) || KP(KEY_A) ) {
                    gCanonMovement = -1.;
                }
                if( KP(KEY_RIGHT) || KP(KEY_D) ) {
                    gCanonMovement = 1.;
                }
                if( KP(KEY_UP) || KP(KEY_W) || KP(KEY_SPACE) ) {
                    gCanonMovement = 0.;
                    wantShot = shoot(iTime);
                    if (wantShot) {
                        gScore = max(0., gScore - 1.);
                    }
                }
                gCanonAngle += gCanonMovement * gDT * CANON_ROT_SPEED;
                gCanonAngle = sign(gCanonAngle) * min(abs(gCanonAngle), CANON_MAX_ANGLE);
            }
            
            // save old y-coordinate for collision detection with bullets
            for (int i=0; i<MAX_PARATROOPERS; i++) {
            	gParatrooperData[i].w = gParatrooperData[i].y;
            }
            
            if (gMode < GAME_HELICOPTER + .5) {
                // helicopter mode
                
                // aircrafts
                float wantParatrooper = -20.;
                for (int i=0; i<MAX_AIRCRAFTS FORCE_NO_UNROLL; i++) {
                    ivec2 p = getAircraftPos(gAircraftData[i], iTime);
                    if (p.x < -20 || p.x > int(RES.x) + 20) {
                        initAircraft(i, iTime, false);
                    }
                    if (gAircraftData[i].y < iTime && iTime > gLastParatrooper + MIN_PARATROOP_DT) {
                        // drop paratrooper
                        wantParatrooper = floor(float(p.x)/6.)*6.;
                        gAircraftData[i].y = iTime + MAX_PARATROOP_DT * hash11(float(i)+iTime+.75);
                    }
                }

                // paratroopers
                float paratrooperFrameDist_0 = (gDT * PARATROOPER_SPEED_0);
                float paratrooperFrameDist_1 = (gDT * PARATROOPER_SPEED_1);

                for (int i=0; i<MAX_PARATROOPERS FORCE_NO_UNROLL; i++) {
                    vec4 p = gParatrooperData[i];
                    if (p.x > 0.) {
                        gParatrooperData[i].y += p.z > 0. && p.z < iTime 
                            ? paratrooperFrameDist_1 : paratrooperFrameDist_0;
                        if (p.y > 190.) {
                            float x = p.x;
                            if (p.z < 0.) {
                                deadParatrooper(x, iTime);
                            } else {
                                if (x<160.) {
                                    paratrooperLand(x, gParatroopersLeft );
                                } else {
                                    paratrooperLand(x, gParatroopersRight );
                                }
                            }
                            gParatrooperData[i].x = -20.;
                        }
                    } else if(wantParatrooper > 0.) {
                        float x = abs(wantParatrooper-RES.x*.5);
                        if (x > 30. && x < RES.x*.5 - 5.) {
                            gParatrooperData[i].xyw = vec3(wantParatrooper, 30.,30.);
                            gParatrooperData[i].z = iTime +mix(MIN_PARATROOP_OPEN_DT, MAX_PARATROOP_OPEN_DT, hash11(float(i)+iTime+.25));;
                        }
                        wantParatrooper = -20.;
                        gLastParatrooper = iTime;
                    }
                }
            } else {
                // jet mode
                
                // aircrafts
                float wantBomb = -20.;
                for (int i=0; i<MAX_AIRCRAFTS FORCE_NO_UNROLL; i++) {
                    ivec2 p = getAircraftPos(gAircraftData[i], iTime);
                    if (gAircraftData[i].y < iTime) {
                        // drop bomb
                        if(iTime > gLastParatrooper + BOMBS_DT) {
                        	wantBomb = float(p.x);
                        }
                        gAircraftData[i].y = INF;
                    }
                }
                
                // use paratrooperdata for bombs
                for (int i=0; i<MAX_PARATROOPERS FORCE_NO_UNROLL; i++) {
                    vec4 p = gParatrooperData[i];
                    if (p.x > 0.) {
                        gParatrooperData[i].xy -= normalize(p.xy - vec2(160,175)) * (gDT * BOMB_SPEED);
                        if (p.y > 170.) {
                            gParatrooperData[i].x = -20.;
                            gameOver = true;
                        }
                    } else if(wantBomb > 0.) {
                        gParatrooperData[i].xyw = vec3(wantBomb, 20., 20.);
                        wantBomb = -20.;
                        gLastParatrooper = iTime;
                    }
                }
            }

            // bullets
            float bulletFrameDist = (gDT * BULLET_SPEED);

            for (int i=0; i<MAX_BULLETS FORCE_NO_UNROLL; i++) {
                if (gBulletData[i].z > -10.) {
                    float a = gBulletData[i].z;
                    vec2 ro = gBulletData[i].xy;

                    vec2 newPos = ro + vec2(sin(a),-cos(a)) * bulletFrameDist;
                    if (newPos.x < 0. || newPos.x > RES.x || newPos.y < 0.) {
                        gBulletData[i].z = -20.;
                    }
                    vec2 rd = normalize(newPos - ro);

          			if (gGameOverTime < .5) {
                        if (gBulletData[i].z > -10.) {
                            for (int j=0; j<MAX_AIRCRAFTS FORCE_NO_UNROLL; j++) {
                                ivec2 p = getAircraftPos(gAircraftData[j], iTime);
                                float d = sBox(ro - vec2(p), rd, vec2(12,5));
                                if (d > 0. && d < bulletFrameDist) {
                                    initAircraft(j, iTime, false);
                                    initExplosion(vec2(p), iTime, 4.);
                                    recycleBullet(gBulletData[i], 10.);
                                    break;
                                }
                            }
                        }

                        if (gBulletData[i].z > -10.) {            
                            if (gMode < GAME_HELICOPTER + .5) {
                                for (int j=0; j<MAX_PARATROOPERS FORCE_NO_UNROLL; j++) {
                                    vec2 p = gParatrooperData[j].xy;
                                    float dy = (gParatrooperData[j].y - gParatrooperData[j].w)*.5;
                                    float d = sBox(ro - p + vec2(0,4.-dy), rd, vec2(2,4.+dy));
                                    if (d > 0. && d < bulletFrameDist) {
                                        gParatrooperData[j].x = -20.;
                                        initExplosion(p, iTime, 1.);
                                        recycleBullet(gBulletData[i], 5.);
                                        break;
                                    } else if(gParatrooperData[j].z > 0. && iTime > gParatrooperData[j].z) {
                                        float d = sBox(ro - p + vec2(0,15.-dy), rd, vec2(6,7.+dy));
                                        if (d > 0. && d < bulletFrameDist) {
                                            gParatrooperData[j].z = -20.;
                                            initExplosion(p, iTime, 1.);
                                            recycleBullet(gBulletData[i], 5.);
                                            break;
                                        }
                                    }
                                }
                            } else {
                                // bombs
                                for (int j=0; j<MAX_PARATROOPERS FORCE_NO_UNROLL; j++) {
                                    vec2 p = gParatrooperData[j].xy;
                                    float dy = (gParatrooperData[j].y - gParatrooperData[j].w)*.5;
                                    float d = sBox(ro - p + vec2(0,-dy), rd, vec2(4,2.+dy));
                                    if (d > 0. && d < bulletFrameDist) {
                                        gParatrooperData[j].x = -20.;
                                        initExplosion(p, iTime, 2.);
                                        recycleBullet(gBulletData[i], 30.);
                                        break;
                                    }
                                }
                            }
                        }       
                    }

                    gBulletData[i].xy = newPos;
                } else if(wantShot) {
                    initNewBullet(i);
                    wantShot = false;
                }
               
                for (int i=0; i<MAX_PARATROOPERS FORCE_NO_UNROLL; i++) {
                    if (gParatrooperData[i].x > 0.) {
                        gEndRoundTimeCoolDown = iTime + ROUND_COOL_DOWN_TIME; 
                    }
                }
                float endTime = max(gEndRoundTimeCoolDown, gEndRoundTime + (RES.x/AIRCRAFT_SPEED) + ROUND_COOL_DOWN_TIME);

                if (iTime > endTime) {
                    if (gMode < GAME_HELICOPTER + .5) {
						initNewRound(GAME_JET, iTime);
               		} else {
                    	initNewRound(GAME_HELICOPTER, iTime);
                    }
                }
            }
        }
        
        if (gameOver || 
            fourParatroopersLanded(gParatroopersLeft) || 
            fourParatroopersLanded(gParatroopersRight)) {
            
            if (gGameOverTime < .5) {
                gGameOverTime = iTime + GAME_OVER_DURATION;
                gHighScore = max(gHighScore, gScore);
                initExplosion(vec2(CANON_CENTER), iTime, 3.);
            }
        }

        if (gGameOverTime > .5 && iTime > gGameOverTime) {
            initNewGame(iTime);
            gMode = GAME_OVER;
        }
        
        // save state
        saveGameState(uv, iTime, fragColor);
    }
    
    if (iFrame == 0) {
        fragColor = vec4(0);
    }
}`,name:`Buffer A`,description:``,type:`buffer`},{inputs:[{id:`4dXGR8`,filepath:`/media/previz/buffer00.png`,type:`buffer`,channel:0,sampler:{filter:`nearest`,wrap:`clamp`,vflip:`true`,srgb:`false`,internal:`byte`},published:1},{id:`4sXGR8`,filepath:`/media/previz/buffer02.png`,type:`buffer`,channel:1,sampler:{filter:`nearest`,wrap:`clamp`,vflip:`true`,srgb:`false`,internal:`byte`},published:1}],outputs:[{id:`XsXGR8`,channel:0}],code:`// Paratrooper. Created by Reinder Nijhoff 2018
// @reindernijhoff
//
// https://www.shadertoy.com/view/XsyfD3
//
// I made this shader because I wanted to try  to create a simple 
// but complete game in Shadertoy.
//
// Buffer B: Rendering of the screen (320x200).
//

mat2 rotMatrix(float a) {
    float c = cos(a);
    float s = sin(a);
    return mat2(c, -s, s, c);
}

void drawHLine(ivec2 uv, const int y, const int height, vec3 color, inout vec3 f) {
	if (uv.y >= y && uv.y < y + height) f = color;
}

void drawTitle(ivec2 uv, const in sampler2D d, inout vec3 f) {
    if (inBox(uv, ivec2(51,40), ivec2(51+218,64))) {
	    int i = (uv.x-51)/20;
        if (i * 16 < iFrame) {
            int o = int[](0,1,2,1,3,2,4,4,0,5,2)[i] * 20;                    
            drawSprite(uv, ivec2(51+i*20,40), ivec2(51+i*20+20,64), ivec2(o,0), iChannel1, false, f);
        }
    }
}

vec3 spriteCanon(ivec2 uv) {
    vec3 col = COL_BLACK;
    
    ivec2 uvRot = ivec2(rotMatrix(gCanonAngle) * vec2(uv));
    
    drawBox(uvRot, ivec2(-1,-12), ivec2(1,0), COL_CYAN, col);
    drawBox(uvRot, ivec2(-2,-11), ivec2(2,0), COL_CYAN, col);
    
    drawBox(uv, ivec2(-2,-4), ivec2(2,-3), COL_MAGENTA, col);
    drawBox(uv, ivec2(-4,-3), ivec2(4,-1), COL_MAGENTA, col);
    drawBox(uv, ivec2(-5,-1), ivec2(5,9), COL_MAGENTA, col);
    drawBox(uv, ivec2(-1,-1), ivec2(1,1), COL_CYAN, col);
    return col;
}

void drawCanon(ivec2 uv, inout vec3 f) {
    vec3 col = spriteCanon(uv - CANON_CENTER);
    if (col.x > 0.) f = col;
}

void drawHelicopter(ivec2 uv, ivec2 heliPos, int si, const in sampler2D d, inout vec3 f) {
    if (heliPos.y > 0) {
        drawSprite(uv, heliPos - ivec2(12,5), heliPos + ivec2(12,5), ivec2(24 * si, 24), d, heliPos.y < 8, f);
    }
}

void drawJet(ivec2 uv, ivec2 jetPos, int si, const in sampler2D d, inout vec3 f) {
    if (jetPos.y > 0) {
        drawSprite(uv, jetPos - ivec2(12,5), jetPos + ivec2(12,5), ivec2(24 * si, 63), d, jetPos.y < 8, f);
    }
}

void drawBomb(ivec2 uv, vec3 paratrooperData, float time, const in sampler2D d, inout vec3 f) {
    if (paratrooperData.x > 0. ) {
        ivec2 pos = ivec2(paratrooperData.xy);
    	drawBox(uv - pos, ivec2(-1,-2), ivec2(1,2), COL_WHITE, f);
    	drawBox(uv - pos, ivec2(-2,-1), ivec2(2,1), COL_WHITE, f);
    }
}

void drawParatrooper(ivec2 uv, vec3 paratrooperData, float time, const in sampler2D d, inout vec3 f) {
    if (paratrooperData.x > 0. ) {
        ivec2 pos = ivec2(paratrooperData.xy);
        drawSprite(uv, pos - ivec2(2,8), pos + ivec2(2,0), ivec2(12,39), d, false, f);
        if (paratrooperData.z > 0. && paratrooperData.z < time) {
        	drawSprite(uv, pos - ivec2(6,22), pos + ivec2(6,-8), ivec2(0,34), d, false, f);            
        }
    }
}

void drawExplosion(ivec2 uv, vec4 d, float time, const sampler2D tex, inout vec3 f) {
    if (time < d.z + EXPLOSION_DURATION && uv.y < 190) {
    	float t = (d.z - time) * (1. / EXPLOSION_DURATION);
        vec2 p = vec2(uv)-d.xy;
        float h = hash12(p*.3);
        if (h*h*h > t) {
            vec2 r = normalize(2. * hash22(p) - 1.) * hash12(p);
            vec2 delta = r * vec2(-t, 1.-t) + vec2(0., t*6.);

            float speed = .5 * (d.x-160.);
            if (d.w > 3.5) {
                speed = d.y > 8. ? AIRCRAFT_SPEED : -AIRCRAFT_SPEED;
                speed *= (1. / EXPLOSION_DURATION);
            } else if (d.w > 2.5) {
                speed = 0.;
                delta *= 10.;
                p.y -= t * 500.;
            }
            p.x += speed * t;
            p -= 20.*delta*t;
            
            uv = ivec2(d.xy + p);

            if (d.w < 1.5) {
                drawSprite(uv, ivec2(d.xy) - ivec2(6,22), ivec2(d.xy) + ivec2(6,-8), ivec2(0,34), tex, false, f); 
            } else if (d.w < 2.5) {
                drawBomb(uv, vec3(d.xyz), time, tex, f);
            } else if (d.w < 3.5) {
            	drawCanon(uv, f);
            } else if (d.w < 4.5) { 
                if (gMode > GAME_HELICOPTER + .5) {
                    drawJet(uv, ivec2(d.xy), 0, tex, f);
                } else {
                    drawHelicopter(uv, ivec2(d.xy), 0, tex, f);
                }
            }
        }
    }
}

void drawScore( ivec2 uv, ivec2 rt, float score, inout vec3 col ) {
    for (int i=0; i<6; i++) {
        if (score > 0. || i == 0) {
            float s = mod(score, 10.);
            drawSprite(uv, rt, rt+ivec2(8,7), ivec2(72,73) + ivec2(s*8.,0), iChannel1, false, col);
            rt.x -= 8;
            score = floor(score * .1);
        }
    }
}

void drawDeadParatrooper( ivec2 uv, vec2 d, float time, inout vec3 col ) {
    if (d.y > time) {
        drawSprite(uv, ivec2(d.x-6.,170), ivec2(d.x+6.,185), ivec2(0,48), iChannel1, false, col);
    }
}

void drawLandedParatrooper( ivec2 uv, float x, float y, inout vec3 col ) {
    if (x > 0.) {
        drawSprite(uv, ivec2(x-2.,182.-y), ivec2(x+2.,190.-y), ivec2(12,39), iChannel1, false, col);
    }
}

void drawLandedParatroopers( ivec2 uv, vec4 d, inout vec3 col ) {
	drawLandedParatrooper(uv, d.x, 0., col);
	drawLandedParatrooper(uv, d.y, d.y==d.x?8.:0., col);
	drawLandedParatrooper(uv, d.z, (d.z==d.x?8.:0.) + (d.z==d.y?8.:0.), col);
	drawLandedParatrooper(uv, d.w, (d.w==d.x?8.:0.) + (d.w==d.y?8.:0.) + (d.w==d.z?8.:0.), col);
}

void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
    ivec2 uv = ivec2(fragCoord);
    
    if (iResolution.x < 320.) uv *= 2;
    
    if (fragCoord.x < RES.x && fragCoord.y < RES.y ) {
		uv.y = int(RES.y) - uv.y;
        
        loadGameStateMinimal(iTime, iChannel0);

        vec3 col = COL_BLACK;

        // canon
        if (gGameOverTime < .5) {
	        drawCanon(uv, col);
        }
        
        if (gMode > GAME_OVER + .5) {
            // bullets
            for (int i=0; i<MAX_BULLETS FORCE_NO_UNROLL; i++) {
                vec3 b = texelFetch(iChannel0, ivec2(i+BULLET_DATA_OFFSET,0), 0).xyz;
                if (b.z > -10.) {
                    if(uv.x == int(b.x) && uv.y == int(b.y)) {
                        col = COL_WHITE;
                    }
                }
            }

            // aircrafts
            for (int i=0; i<MAX_AIRCRAFTS/2 FORCE_NO_UNROLL; i++) {
                vec4 b = texelFetch(iChannel0, ivec2(i+AIRCRAFT_DATA_OFFSET,0), 0);
                ivec2 p1 = getAircraftPos(b.xy, iTime);
                ivec2 p2 = getAircraftPos(b.zw, iTime);
                if (gMode > GAME_HELICOPTER + .5) {
	                drawJet(uv, p1, (i + int(iTime * 8.)) & 1, iChannel1, col);
    	            drawJet(uv, p2, (i + int(iTime * 8.)) & 1, iChannel1, col);
                } else {
	                drawHelicopter(uv, p1, (i + int(iTime * 16.)) & 3, iChannel1, col);
    	            drawHelicopter(uv, p2, (i + int(iTime * 16.)) & 3, iChannel1, col);
                }
            }

            // paratroopers
            for (int i=0; i<MAX_PARATROOPERS FORCE_NO_UNROLL; i++) {
                vec3 b = texelFetch(iChannel0, ivec2(i+PARATROOPER_DATA_OFFSET,0), 0).xyz;
                if (gMode < GAME_HELICOPTER + .5) {
                	drawParatrooper(uv, b, iTime, iChannel1, col);
                } else {
	                drawBomb(uv, b, iTime, iChannel1, col);
                }
            }
            
            // landed paratroopers
            drawLandedParatroopers(uv, gParatroopersLeft, col);
            drawLandedParatroopers(uv, gParatroopersRight, col);
            
            // deadParatroopers
            drawDeadParatrooper(uv, gDeadParatroopers.xy, iTime, col);
            drawDeadParatrooper(uv, gDeadParatroopers.zw, iTime, col);
        } else {
            drawTitle(uv, iChannel1, col);
            if (iResolution.x > 320.) {
            	drawSprite(uv, ivec2(28,80), ivec2(291,87), ivec2(0,80), iChannel1, false, col);
            }
        }
        
        drawExplosion(uv, gExplosion1, iTime, iChannel1, col);
        drawExplosion(uv, gExplosion2, iTime, iChannel1, col);
        
        drawHLine(uv, 190, 1, COL_CYAN, col);
        drawBox(uv, ivec2(145,166), ivec2(176,190), COL_WHITE, col);

        // score
        if (uv.y > 190) {
            drawSprite(uv, ivec2(0,192), ivec2(46,199), ivec2(24,73), iChannel1, false, col); 
            drawScore(uv, ivec2(100,192), gScore, col);
            drawSprite(uv, ivec2(200,192), ivec2(269,199), ivec2(0,73), iChannel1, false, col); 
            drawScore(uv, ivec2(308,192), gHighScore, col);
        }
            
        fragColor = vec4(col, 1.0);
    } else {
        fragColor = vec4(0,0,0,1);
    }
}`,name:`Buffer B`,description:``,type:`buffer`},{inputs:[{id:`4sXGR8`,filepath:`/media/previz/buffer02.png`,type:`buffer`,channel:0,sampler:{filter:`nearest`,wrap:`clamp`,vflip:`true`,srgb:`false`,internal:`byte`},published:1}],outputs:[{id:`4sXGR8`,channel:0}],code:`// Paratrooper. Created by Reinder Nijhoff 2018
// @reindernijhoff
//
// https://www.shadertoy.com/view/XsyfD3
//
// I made this shader because I wanted to try  to create a simple 
// but complete game in Shadertoy.
//
// Buffer C: Encoding and decoding of bitmaps used.
//
//
// Knarkowicz created a lot of nice shaders that uses encoded bitmaps. 
// See for example: 
//
// https://www.shadertoy.com/view/Xs2fWD [SH17B] Pixel Shader Dungeon	
// https://www.shadertoy.com/view/XtlSD7 [SIG15] Mario World 1-1
// https://www.shadertoy.com/view/ll2BWz Sprite Rendering 
//

//unpack sprites
vec3 unpackCol(uint x, uint d) {
	uint v = (d >> ((x & 0xfU) << 1)) & 0x3U;
    
    return v == 0x0U ? vec3(0) : 
    	   v == 0x2U ? COL_CYAN : 
    	   v == 0x3U ? COL_MAGENTA : COL_WHITE;
}

vec3 unpackBW(uint x, uint d) {
    return vec3((d >> (x & 0x1fU)) & 0x1U);
}

bool resolutionChanged() {
    return floor(texelFetch(iChannel0, ivec2(iResolution.xy-1.), 0).r) != floor(iResolution.x);
}

void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
	vec3 col = vec3(iResolution.xy,0);
    
    if (resolutionChanged()) {
        ivec2 c = ivec2(fragCoord);   	    
        uint d = 0x0U;
        const int ycol = 73;

        if(c.y < ycol) {
            d = (c.y==0) ? c.x < 16 ? 0x1555555U : c.x < 32 ? 0x5540000U : c.x < 48 ? 0x55550000U : c.x < 64 ? 0x55000155U : c.x < 80 ? 0x155555U : c.x < 96 ? 0x55400U : c.x < 112 ? 0x55555500U : c.x < 128 ? 0x15U : d : d;
			d = (c.y==1) ? c.x < 16 ? 0x6aaaaa5U : c.x < 32 ? 0x1a990000U : c.x < 48 ? 0xaaa50000U : c.x < 64 ? 0xa50006aaU : c.x < 80 ? 0x6aaaaaU : c.x < 96 ? 0x1a9900U : c.x < 112 ? 0xaaaaa500U : c.x < 128 ? 0x6aU : d : d;
            d = (c.y==2) ? c.x < 16 ? 0x1aaaaa99U : c.x < 32 ? 0x6a6a4000U : c.x < 48 ? 0xaa990000U : c.x < 64 ? 0x99001aaaU : c.x < 80 ? 0x1aaaaaaU : c.x < 96 ? 0x6a6a40U : c.x < 112 ? 0xaaaa9900U : c.x < 128 ? 0x1aaU : d : d;
            d = (c.y==3) ? c.x < 16 ? 0xffffffe9U : c.x < 32 ? 0xffaa9000U : c.x < 48 ? 0xffe90003U : c.x < 64 ? 0xe400ffffU : c.x < 80 ? 0xfffffffU : c.x < 96 ? 0x3ffaa90U : c.x < 112 ? 0xffffe900U : c.x < 128 ? 0xfffU : d : d;
            d = (c.y==4) ? c.x < 16 ? 0xffffffe9U : c.x < 32 ? 0xffeaa403U : c.x < 48 ? 0xffe9000fU : c.x < 64 ? 0xd003ffffU : c.x < 80 ? 0xfffffffU : c.x < 96 ? 0xfffeaa4U : c.x < 112 ? 0xffffe900U : c.x < 128 ? 0xfffU : d : d;
            d = (c.y==5) ? c.x < 16 ? 0xffffffe9U : c.x < 32 ? 0xfffaa90fU : c.x < 48 ? 0xffe9003fU : c.x < 64 ? 0xc00fffffU : c.x < 80 ? 0xfffffffU : c.x < 96 ? 0x3ffffaa9U : c.x < 112 ? 0xffffe900U : c.x < 128 ? 0xfffU : d : d;
            d = (c.y==6) ? c.x < 16 ? 0xe9000fe9U : c.x < 32 ? 0x3fea50fU : c.x < 48 ? 0xfe900ffU : c.x < 64 ? 0xfe900U : c.x < 80 ? 0xfe90U : c.x < 96 ? 0xff03fea5U : c.x < 112 ? 0xfe900U : c.x < 128 ? 0x0U : d : d;
            d = (c.y==7) ? c.x < 16 ? 0xe9000fe9U : c.x < 32 ? 0xff990fU : c.x < 48 ? 0xfe903fdU : c.x < 64 ? 0xfe900U : c.x < 80 ? 0xfe90U : c.x < 96 ? 0xfd00ff99U : c.x < 112 ? 0xfe903U : c.x < 128 ? 0x0U : d : d;
            d = (c.y==8) ? c.x < 16 ? 0xe9000fe9U : c.x < 32 ? 0x3fe90fU : c.x < 48 ? 0xfe90ff9U : c.x < 64 ? 0xfe900U : c.x < 80 ? 0xfe90U : c.x < 96 ? 0xf9003fe9U : c.x < 112 ? 0xfe90fU : c.x < 128 ? 0x0U : d : d;
            d = (c.y==9) ? c.x < 16 ? 0xe9555fe9U : c.x < 32 ? 0x555fe90fU : c.x < 48 ? 0x5fe90fe9U : c.x < 64 ? 0xfe955U : c.x < 80 ? 0xfe90U : c.x < 96 ? 0xe9000fe9U : c.x < 112 ? 0x555fe90fU : c.x < 128 ? 0x0U : d : d;
            d = (c.y==10) ? c.x < 16 ? 0xe6aaafe9U : c.x < 32 ? 0xaaafe90fU : c.x < 48 ? 0xafe90fe6U : c.x < 64 ? 0xfe6aaU : c.x < 80 ? 0xfe90U : c.x < 96 ? 0xe9000fe9U : c.x < 112 ? 0xaaafe90fU : c.x < 128 ? 0x1U : d : d;
            d = (c.y==11) ? c.x < 16 ? 0xdaaaafe9U : c.x < 32 ? 0xaaafe90fU : c.x < 48 ? 0xafe90fdaU : c.x < 64 ? 0xfdaaaU : c.x < 80 ? 0xfe90U : c.x < 96 ? 0xe9000fe9U : c.x < 112 ? 0xaaafe90fU : c.x < 128 ? 0x6U : d : d;
            d = (c.y==12) ? c.x < 16 ? 0xffffffe9U : c.x < 32 ? 0xffffe90fU : c.x < 48 ? 0xffe90fffU : c.x < 64 ? 0xfffffU : c.x < 80 ? 0xfe90U : c.x < 96 ? 0xe9000fe9U : c.x < 112 ? 0xffffe90fU : c.x < 128 ? 0x3fU : d : d;
            d = (c.y==13) ? c.x < 16 ? 0xffffffe9U : c.x < 32 ? 0xffffe903U : c.x < 48 ? 0xffe90fffU : c.x < 64 ? 0x3ffffU : c.x < 80 ? 0xfe90U : c.x < 96 ? 0xe9000fe9U : c.x < 112 ? 0xffffe90fU : c.x < 128 ? 0x3fU : d : d;
            d = (c.y==14) ? c.x < 16 ? 0xffffffe9U : c.x < 32 ? 0xffffe900U : c.x < 48 ? 0xffe90fffU : c.x < 64 ? 0xffffU : c.x < 80 ? 0xfe90U : c.x < 96 ? 0xe9000fe9U : c.x < 112 ? 0xffffe90fU : c.x < 128 ? 0x3fU : d : d;
            d = (c.y==15) ? c.x < 16 ? 0xfe9U : c.x < 32 ? 0xfe900U : c.x < 48 ? 0xfe90fe9U : c.x < 64 ? 0x3fcU : c.x < 80 ? 0xfe90U : c.x < 96 ? 0xe9000fe9U : c.x < 112 ? 0xfe90fU : c.x < 128 ? 0x0U : d : d;
            d = (c.y==16) ? c.x < 16 ? 0xfe9U : c.x < 32 ? 0xfe900U : c.x < 48 ? 0xfe90fe9U : c.x < 64 ? 0xff0U : c.x < 80 ? 0xfe90U : c.x < 96 ? 0xe6400fe4U : c.x < 112 ? 0xfe90fU : c.x < 128 ? 0x0U : d : d;
            d = (c.y==17) ? c.x < 16 ? 0xfe9U : c.x < 32 ? 0xfe900U : c.x < 48 ? 0xfe90fe9U : c.x < 64 ? 0x3fc0U : c.x < 80 ? 0xfe90U : c.x < 96 ? 0xda900fd0U : c.x < 112 ? 0xfe90fU : c.x < 128 ? 0x0U : d : d;
            d = (c.y==18) ? c.x < 16 ? 0xfe9U : c.x < 32 ? 0xfe900U : c.x < 48 ? 0xfe90fe9U : c.x < 64 ? 0xff00U : c.x < 80 ? 0xfe90U : c.x < 96 ? 0xfaa57fc0U : c.x < 112 ? 0x555fe90fU : c.x < 128 ? 0x15U : d : d;
            d = (c.y==19) ? c.x < 16 ? 0xfe9U : c.x < 32 ? 0xfe900U : c.x < 48 ? 0xfe90fe9U : c.x < 64 ? 0x3fd00U : c.x < 80 ? 0xfe90U : c.x < 96 ? 0xfe9aff00U : c.x < 112 ? 0xaaafe903U : c.x < 128 ? 0x6aU : d : d;
            d = (c.y==20) ? c.x < 16 ? 0xfe9U : c.x < 32 ? 0xfe900U : c.x < 48 ? 0xfe90fe9U : c.x < 64 ? 0xff900U : c.x < 80 ? 0xfe90U : c.x < 96 ? 0xff6bfc00U : c.x < 112 ? 0xaaafe900U : c.x < 128 ? 0x1aaU : d : d;
            d = (c.y==21) ? c.x < 16 ? 0xfe4U : c.x < 32 ? 0xfe400U : c.x < 48 ? 0xfe40fe4U : c.x < 64 ? 0xfe400U : c.x < 80 ? 0xfe40U : c.x < 96 ? 0x3ffff000U : c.x < 112 ? 0xffffe400U : c.x < 128 ? 0xfffU : d : d;
            d = (c.y==22) ? c.x < 16 ? 0xfd0U : c.x < 32 ? 0xfd000U : c.x < 48 ? 0xfd00fd0U : c.x < 64 ? 0xfd000U : c.x < 80 ? 0xfd00U : c.x < 96 ? 0xfffc000U : c.x < 112 ? 0xffffd000U : c.x < 128 ? 0xfffU : d : d;
            d = (c.y==23) ? c.x < 16 ? 0xfc0U : c.x < 32 ? 0xfc000U : c.x < 48 ? 0xfc00fc0U : c.x < 64 ? 0xfc000U : c.x < 80 ? 0xfc00U : c.x < 96 ? 0x3ff0000U : c.x < 112 ? 0xffffc000U : c.x < 128 ? 0xfffU : d : d;
            c.y -= 24;	

            d = (c.y==0) ? c.x < 16 ? 0xfff00000U : c.x < 32 ? 0xfffU : c.x < 48 ? 0xffffffffU : c.x < 64 ? 0xfff00000U : c.x < 80 ? 0xfffU : c.x < 96 ? 0x3c000U : d : d;
            d = (c.y==1) ? c.x < 16 ? 0x40000000U : c.x < 32 ? 0x1U : c.x < 48 ? 0x14000U : c.x < 64 ? 0x40000000U : c.x < 80 ? 0x1U : c.x < 96 ? 0x14000U : d : d;
            d = (c.y==2) ? c.x < 16 ? 0x55000000U : c.x < 32 ? 0x30055U : c.x < 48 ? 0x555500U : c.x < 64 ? 0x5500000cU : c.x < 80 ? 0x300055U : c.x < 96 ? 0x555500U : d : d;
            d = (c.y==3) ? c.x < 16 ? 0x55557fU : c.x < 32 ? 0x555c0155U : c.x < 48 ? 0x1550055U : c.x < 64 ? 0x55555cU : c.x < 80 ? 0x555c0155U : c.x < 96 ? 0x1550055U : d : d;
            d = (c.y==4) ? c.x < 16 ? 0x55400U : c.x < 32 ? 0x54300554U : c.x < 48 ? 0x5540005U : c.x < 64 ? 0x5540cU : c.x < 80 ? 0x54030554U : c.x < 96 ? 0x5540005U : d : d;
            d = (c.y==5) ? c.x < 16 ? 0x100000U : c.x < 32 ? 0x400U : c.x < 48 ? 0x4000010U : c.x < 64 ? 0x100000U : c.x < 80 ? 0x400U : c.x < 96 ? 0x4000010U : d : d;
            d = (c.y==6) ? c.x < 16 ? 0x400000U : c.x < 32 ? 0x100U : c.x < 48 ? 0x1000040U : c.x < 64 ? 0x400000U : c.x < 80 ? 0x100U : c.x < 96 ? 0x1000040U : d : d;
            d = (c.y==7) ? c.x < 16 ? 0x55000000U : c.x < 32 ? 0x55U : c.x < 48 ? 0x555500U : c.x < 64 ? 0x55000000U : c.x < 80 ? 0x55U : c.x < 96 ? 0x555500U : d : d;
            d = (c.y==8) ? c.x < 16 ? 0x8000000U : c.x < 32 ? 0x8020U : c.x < 48 ? 0x80200800U : c.x < 64 ? 0x8000000U : c.x < 80 ? 0x8020U : c.x < 96 ? 0x80200800U : d : d;
            d = (c.y==9) ? c.x < 16 ? 0xaaaa0000U : c.x < 32 ? 0x2aaaU : c.x < 48 ? 0x2aaaaaaaU : c.x < 64 ? 0xaaaa0000U : c.x < 80 ? 0x2aaaU : c.x < 96 ? 0x2aaaaaaaU : d : d;
            c.y -= 10;

            d = (c.y==0) ? c.x < 16 ? 0xaa00U : d : d;
            d = (c.y==1) ? c.x < 16 ? 0xaaaa0U : d : d;
            d = (c.y==2) ? c.x < 16 ? 0x2aaaa8U : d : d;
            d = (c.y==3) ? c.x < 16 ? 0xaaaaaaU : d : d;
            d = (c.y==4) ? c.x < 16 ? 0xaaaaaaU : d : d;
            d = (c.y==5) ? c.x < 16 ? 0x14aaaaaaU : d : d;
            d = (c.y==6) ? c.x < 16 ? 0x14c00003U : d : d;
            d = (c.y==7) ? c.x < 16 ? 0xaa30000cU : d : d;
            d = (c.y==8) ? c.x < 16 ? 0x2830000cU : d : d;
            d = (c.y==9) ? c.x < 16 ? 0x280c0030U : d : d;
            d = (c.y==10) ? c.x < 16 ? 0x820c0030U : d : d;
            d = (c.y==11) ? c.x < 16 ? 0x820300c0U : d : d;
            d = (c.y==12) ? c.x < 16 ? 0x820300c0U : d : d;
            d = (c.y==13) ? c.x < 16 ? 0x8200c300U : d : d;
            c.y -= 14;

            d = (c.y==0) ? c.x < 16 ? 0x5500U : d : d;
            d = (c.y==1) ? c.x < 16 ? 0x15540U : d : d;
            d = (c.y==2) ? c.x < 16 ? 0x55550U : d : d;
            d = (c.y==3) ? c.x < 16 ? 0x7d7d0U : d : d;
            d = (c.y==4) ? c.x < 16 ? 0x55550U : d : d;
            d = (c.y==5) ? c.x < 16 ? 0x115544U : d : d;
            d = (c.y==6) ? c.x < 16 ? 0x505505U : d : d;
            d = (c.y==7) ? c.x < 16 ? 0x46910U : d : d;
            d = (c.y==8) ? c.x < 16 ? 0x11440U : d : d;
            d = (c.y==9) ? c.x < 16 ? 0x4100U : d : d;
            d = (c.y==10) ? c.x < 16 ? 0x1400U : d : d;
            d = (c.y==11) ? c.x < 16 ? 0x1400U : d : d;
            d = (c.y==12) ? c.x < 16 ? 0x4100U : d : d;
            d = (c.y==13) ? c.x < 16 ? 0x50050U : d : d;
            d = (c.y==14) ? c.x < 16 ? 0x10040U : d : d;
            c.y -= 15;

            d = (c.y==0) ? c.x < 16 ? 0x2aU : c.x < 32 ? 0x2a0000U : c.x < 48 ? 0x0U : d : d;
            d = (c.y==1) ? c.x < 16 ? 0x82U : c.x < 32 ? 0x820000U : c.x < 48 ? 0x0U : d : d;
            d = (c.y==2) ? c.x < 16 ? 0x202U : c.x < 32 ? 0x2020000U : c.x < 48 ? 0x0U : d : d;
            d = (c.y==3) ? c.x < 16 ? 0x808U : c.x < 32 ? 0x8080000U : c.x < 48 ? 0x0U : d : d;
            d = (c.y==4) ? c.x < 16 ? 0xaaaaa008U : c.x < 32 ? 0xa0080156U : c.x < 48 ? 0x156aaaaU : d : d;
            d = (c.y==5) ? c.x < 16 ? 0x20U : c.x < 32 ? 0x200558U : c.x < 48 ? 0x5580000U : d : d;
            d = (c.y==6) ? c.x < 16 ? 0x20U : c.x < 32 ? 0x201560U : c.x < 48 ? 0x15600000U : d : d;
            d = (c.y==7) ? c.x < 16 ? 0xffff008cU : c.x < 32 ? 0xb0aa80U : c.x < 48 ? 0xaa80ffffU : d : d;
            d = (c.y==8) ? c.x < 16 ? 0x80U : c.x < 32 ? 0x832000U : c.x < 48 ? 0x20000000U : d : d;
            d = (c.y==9) ? c.x < 16 ? 0xaaaaaa33U : c.x < 32 ? 0xaa300aaaU : c.x < 48 ? 0xaaaaaaaU : d : d;
            col = unpackCol(uint(c.x), d);
        } else {
            c.y -= ycol;
            if(c.y==0) d =c.x < 32 ? 0x1e001e33U : c.x < 64 ? 0x7f3f1c3cU : c.x < 96 ? 0x3c183e00U : c.x < 128 ? 0x387e383cU : c.x < 160 ? 0x3c3e3fU : d;
            if(c.y==1) d =c.x < 32 ? 0x33000c33U : c.x < 64 ? 0x46663666U : c.x < 96 ? 0x661c631cU : c.x < 128 ? 0xc063c66U : c.x < 160 ? 0x666333U : d;
            if(c.y==2) d =c.x < 32 ? 0x7000c33U : c.x < 64 ? 0x16666303U : c.x < 96 ? 0x6018731cU : c.x < 128 ? 0x63e3660U : c.x < 160 ? 0x666330U : d;
            if(c.y==3) d =c.x < 32 ? 0xe3f0c3fU : c.x < 64 ? 0x1e3e6303U : c.x < 96 ? 0x38187b00U : c.x < 128 ? 0x3e603338U : c.x < 160 ? 0x7c3e18U : d;
            if(c.y==4) d =c.x < 32 ? 0x38000c33U : c.x < 64 ? 0x16366303U : c.x < 96 ? 0xc186f00U : c.x < 128 ? 0x66607f60U : c.x < 160 ? 0x60630cU : d;
            if(c.y==5) d =c.x < 32 ? 0x33000c33U : c.x < 64 ? 0x46663666U : c.x < 96 ? 0x6618671cU : c.x < 128 ? 0x66663066U : c.x < 160 ? 0x30630cU : d;
            if(c.y==6) d =c.x < 32 ? 0x1e001e33U : c.x < 64 ? 0x7f671c3cU : c.x < 96 ? 0x7e7e3e1cU : c.x < 128 ? 0x3c3c783cU : c.x < 160 ? 0x1c3e0cU : d;
            c.y -= 7;

            if(c.y==0) d =c.x < 32 ? 0x3c7f3f3fU : c.x < 64 ? 0x3cU : c.x < 96 ? 0x0U : c.x < 128 ? 0x7U : c.x < 160 ? 0x3f3e7fU : c.x < 192 ? 0x3f667f67U : c.x < 224 ? 0x1f3f1c3eU : c.x < 256 ? 0x1c0f3f00U : c.x < 288 ? 0x66U : d;
            if(c.y==1) d =c.x < 32 ? 0x66466666U : c.x < 64 ? 0x66U : c.x < 96 ? 0x0U : c.x < 128 ? 0x6U : c.x < 160 ? 0x666346U : c.x < 192 ? 0x66664666U : c.x < 224 ? 0x36663663U : c.x < 256 ? 0x36066600U : c.x < 288 ? 0x66U : d;
            if(c.y==2) d =c.x < 32 ? 0xc166666U : c.x < 64 ? 0x3b7e000cU : c.x < 96 ? 0x3e3e1eU : c.x < 128 ? 0x3b1e3eU : c.x < 160 ? 0x666316U : c.x < 192 ? 0x66661636U : c.x < 224 ? 0x66666363U : c.x < 256 ? 0x63066600U : c.x < 288 ? 0x66U : d;
            if(c.y==3) d =c.x < 32 ? 0x181e3e3eU : c.x < 64 ? 0x66030018U : c.x < 96 ? 0x636330U : c.x < 128 ? 0x6e3066U : c.x < 160 ? 0x3e631eU : c.x < 192 ? 0x3e3c1e1eU : c.x < 224 ? 0x663e7f63U : c.x < 256 ? 0x7f063e00U : c.x < 288 ? 0x3cU : d;
            if(c.y==4) d =c.x < 32 ? 0x30163606U : c.x < 64 ? 0x3e3e0030U : c.x < 96 ? 0x7f033eU : c.x < 128 ? 0x63e66U : c.x < 160 ? 0x366316U : c.x < 192 ? 0x66181636U : c.x < 224 ? 0x66366363U : c.x < 256 ? 0x63460600U : c.x < 288 ? 0x18U : d;
            if(c.y==5) d =c.x < 32 ? 0x66466606U : c.x < 64 ? 0x6600066U : c.x < 96 ? 0x36333U : c.x < 128 ? 0x63366U : c.x < 160 ? 0x666306U : c.x < 192 ? 0x66184666U : c.x < 224 ? 0x36666363U : c.x < 256 ? 0x63660600U : c.x < 288 ? 0x18U : d;
            if(c.y==6) d =c.x < 32 ? 0x3c7f670fU : c.x < 64 ? 0xf3f003cU : c.x < 96 ? 0x3e3e6eU : c.x < 128 ? 0xf6e3bU : c.x < 160 ? 0x673e0fU : c.x < 192 ? 0x3f3c7f67U : c.x < 224 ? 0x1f67633eU : c.x < 256 ? 0x637f0f00U : c.x < 288 ? 0x3cU : d;
            col = unpackBW(uint(c.x), d);
        }
    }
    
    fragColor = vec4(col,1.0);
}`,name:`Buffer C`,description:``,type:`buffer`}]},{ver:`0.1`,info:{id:`lldcR8`,date:`1538844872`,viewed:10628,name:`Portal - iOS AR`,description:`This is an experiment to create an "AR shader" by implementing the mainVR-function and using the WebCam texture as background. Use the [url=https://itunes.apple.com/us/app/shadertoy/id717961814]Shadertoy iOS app[/url] to view this shader.`,likes:57,published:`Public API`,usePreview:0,tags:[`ar`,`portal`,`ios`]},renderpass:[{inputs:[{id:`4dfGRn`,filepath:`/media/a/8de3a3924cb95bd0e95a443fff0326c869f9d4979cd1d5b6e94e2a01f5be53e9.jpg`,type:`texture`,channel:3,sampler:{filter:`mipmap`,wrap:`repeat`,vflip:`true`,srgb:`false`,internal:`byte`},published:1},{id:`4sf3zn`,filepath:`/presets/webcam.png`,type:`webcam`,channel:0,sampler:{filter:`mipmap`,wrap:`clamp`,vflip:`true`,srgb:`false`,internal:`byte`},published:1},{id:`Xsf3Rr`,filepath:`/media/a/79520a3d3a0f4d3caa440802ef4362e99d54e12b1392973e4ea321840970a88a.jpg`,type:`texture`,channel:2,sampler:{filter:`mipmap`,wrap:`repeat`,vflip:`true`,srgb:`false`,internal:`byte`},published:1},{id:`4dXGR8`,filepath:`/media/previz/buffer00.png`,type:`buffer`,channel:1,sampler:{filter:`nearest`,wrap:`clamp`,vflip:`true`,srgb:`false`,internal:`byte`},published:1}],outputs:[{id:`4dfGRr`,channel:0}],code:`// Portal - iOS AR. Created by Reinder Nijhoff 2018
// Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License.
// @reindernijhoff
//
// https://www.shadertoy.com/view/lldcR8
//
// This is an experiment to create an "AR shader" by implementing the mainVR-function and 
// using the WebCam texture as background. If you view this shader with the Shadertoy iOS 
// app[1], you can walk around and enter the portal.
//
// If you don't have an iOS device (or if you don't have the app installed) you can find a
// screen capture of the shader in action here: https://youtu.be/IzeeoD0e6Ow.
//
//
// Common tab: The VR-scene is shaded using analytical area lighting. I have used code of
//             dys129 shader "Analytic Area Light" to implement this technique:
//             https://www.shadertoy.com/view/4tXSR4
//
// Buffer A:   Buffer A keeps track of the camera-position and calculates if the user has
//             entered the portal.
//
// Image tab:  A raymarcher is used to render the VR scene.
//
// [1] https://itunes.apple.com/us/app/shadertoy/id717961814
//

float hash12( vec2 p ) {
    p  = 50.0*fract( p*0.3183099 );
    return fract( p.x*p.y*(p.x+p.y) );
}

float noise( in vec2 x ) {
    vec2 f = fract(x);
    vec2 u = f*f*(3.0-2.0*f);
    
    vec2 p = vec2(floor(x));
    float a = hash12( (p+vec2(0,0)) );
	float b = hash12( (p+vec2(1,0)) );
	float c = hash12( (p+vec2(0,1)) );
	float d = hash12( (p+vec2(1,1)) );
    
	return a+(b-a)*u.x+(c-a)*u.y+(a-b-c+d)*u.x*u.y;
}

const mat2 m2 = mat2(1.6,-1.2,1.2,1.6);

float fbm( in vec2 p, const int OCTAVES ) {
    float a = 0.;
    float b = .5;
    for( int i=0; i<OCTAVES; i++ ) {
        a += noise(p) * b;
		b *= 0.5;
        p = m2*p;
    }
	return a;
}

float iPlane( in vec3 ro, in vec3 rd, in vec4 pla ) {
    return (-pla.w - dot(pla.xyz,ro)) / dot( pla.xyz, rd );
}

float map( in vec3 p ) {
    p.xz += PILLAR_SPACING *.5;
    float d = p.y;
    
    vec2 pm = mod( p.xz + vec2(PILLAR_SPACING*.5), 
                  		  vec2(PILLAR_SPACING) ) - vec2(PILLAR_SPACING*.5);
    d = min(d, max(abs(pm.x) - PILLAR_WIDTH_HALF, abs(pm.y) - PILLAR_WIDTH_HALF));
    
    vec2 cm = mod( p.xz,  vec2(PILLAR_SPACING) ) - vec2(PILLAR_SPACING*.5);
    
    d = min( d, CEILING_HEIGHT - p.y );
    d = max( d, -PILLAR_WIDTH_HALF+PILLAR_SPACING*.5-
            length( vec2(p.y-CEILING_HEIGHT, min(abs(cm.x),abs(cm.y)))));
    return d;
}

vec4 tex3D( sampler2D sam, in vec3 p, in vec3 n ) {
    p.xz = mat2(0.8,-0.6,0.6,0.8) * p.xz + .5;
    
	vec4 x = texture( sam, p.yz );
	vec4 y = texture( sam, p.zx );
	vec4 z = texture( sam, p.xy );

	return x*abs(n.x) + y*abs(n.y) + z*abs(n.z);
}

vec3 calcNormal( in vec3 pos ) {
    vec2 e = vec2(1.0,-1.0)*0.0001;
    return normalize( e.xyy*map( pos + e.xyy ) + 
					  e.yyx*map( pos + e.yyx ) + 
					  e.yxy*map( pos + e.yxy ) + 
					  e.xxx*map( pos + e.xxx ) );
}

float calcSoftshadow( in vec3 ro, in vec3 rd, in float mint, in float tmax ) {
	float res = 1.0;
    float t = mint;
    float ph = 1e10; 
    for( int i=0; i<24; i++ ) {
		float h = map( ro + rd*t );
       	float y = h*h/(2.0*ph);
        float d = sqrt(max(0.,h*h-y*y));
        res = min( res, 8.0*d/max(0.01,t-y) );
        ph = h;
        t += min(h, .2);// clamp( h, 0.02, 0.10 );
        if( res<0.001 || t>tmax ) break;
    }
    return clamp( res, 0.0, 1.0 );
}

float calcAO( in vec3 pos, in vec3 nor ) {
	float occ = 0.0;
    float sca = 1.0;
    for( int i=0; i<5; i++ )
    {
        float hr = 0.01 + 0.3*float(i)/4.0;
        vec3 aopos =  nor * hr + pos;
        float dd = map( aopos );
        occ += -(dd-hr)*sca;
        sca *= 0.75;
    }
    return clamp( 1.0 - 3.0*occ, 0.0, 1.0 );    
}

vec3 render( in vec3 ro, in vec3 rd, in vec2 uv, in sampler2D sam, bool inside ) {
    float portalAlpha = 0.;
    vec3 fogColor = vec3(0.1,0.3,.5) + rd * .1;
    float tmin = 0.01;
    const float tmax = 21.;
    
    vec3 portalColor = texture(sam, uv).rgb * 1.25;
    // Use mipmap level 9 to get an average environment color from the webcam texture
    // used for lighting.
    vec3 lightColor = pow(.25 + .75 * texelFetch(sam, ivec2(0), 9).rgb, vec3(2.2)) * 3.;
      
    // portal intersection
    float portalDist = iPlane( ro, rd, vec4(0,0,1,-dot(PORTAL_POS,vec3(0,0,1))));
    if (portalDist < 0.) {
        portalDist = 5e5;
    } else {
        vec3 p = ro + rd * portalDist;
        float time = iTime * .15;
        float scale = 6.;
        vec2 offset = vec2(fbm(p.xy * scale + time, 4), fbm(p.yx * scale - time, 4)) -.5;
        p.xy += (fbm(offset * scale + time, 4) - .5) * .2;
        if(all(lessThan(abs(p.xy-PORTAL_POS.xy),PORTAL_SIZE.xy))) {
            vec2 bd = abs(p.xy-PORTAL_POS.xy) - (PORTAL_SIZE.xy -PORTAL_BORDER.xy);
            bd = max(bd, vec2(0))/PORTAL_BORDER.xy;
                
	        portalAlpha = 1.-smoothstep(0.5, 1., length(bd));
         }
        if(inside) {
        	tmin = portalDist;
        }
    }
    
    float t = tmin;
    for( int i=0; i<48; i++ ) {
	    float precis = 0.001*t;
	    float res = map( ro+rd*t );
        if( res<precis || t>tmax ) break;
        t += res;
    }
    
    portalAlpha = inside ? 1. - portalAlpha : portalAlpha;

    vec3 col = vec3(0);
    
    // background scene
    if (t < tmax && portalAlpha < 1.) {
        vec3 p = ro + t * rd;
        vec3 N = calcNormal(p);
        vec3 R = reflect(rd, N);
        vec3 tex = tex3D(iChannel2, p, N).rgb;

        col = vec3( tex ) * clamp(p.y+.6, 0., 1.);

        float diff = shd_polygonal(p, N, false);
        float spc = clamp(shd_polygonal(p, R, true), 0., 1.);
        float l = (diff * 6. + spc * dot(tex,tex));

        vec3 ld = p-PORTAL_POS;
        
        l *= calcSoftshadow(p, -normalize(ld), .02, length(ld)-.5);
		l *= (.5+.5*calcAO(p, N));
        col *= l * lightColor;
    }
    
    if (!inside && t < portalDist) {
        portalAlpha = 0.;
    }
    
    // height based fog, see https://iquilezles.org/articles/fog
    const float C = .075;
    const float B = 1.1;
    float fogAmount = clamp(C * exp(-ro.y*B) * (1.-exp( -t*rd.y*B))/rd.y, 0., 4.);
    col = mix( col, fogColor, fogAmount);

    // gamma
    col = mix(col, sqrt(clamp(col,vec3(0),vec3(1))), .95);
    
	col = mix( col, portalColor, portalAlpha);
    
    return clamp(col,vec3(0),vec3(1));
}

mat3 setCamera( in vec3 ro, in vec3 ta, float cr ) {
	vec3 cw = normalize(ta-ro);
	vec3 cp = vec3(sin(cr), cos(cr),0.0);
	vec3 cu = normalize( cross(cw,cp) );
	vec3 cv = normalize( cross(cu,cw) );
    return mat3( cu, cv, cw );
}

void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
    vec2 p = (-iResolution.xy + 2.0*fragCoord)/iResolution.y;
   
    float a = .3 * iTime;
    vec3 ro = vec3( 3.9*sin(a), 0.7, 3.2*cos(a) + .5 );
    vec3 ta = vec3( 0.25, 0.6, 0.5 );
    
    mat3 ca = setCamera( ro, ta, 0.0 );
    vec3 rd = ca * normalize( vec3(p.xy,2.0) );

    vec3 col = render( ro, rd, fragCoord.xy/iResolution.xy, iChannel3, false);
    fragColor = vec4(col,1.0);
}

void mainVR( out vec4 fragColor, in vec2 fragCoord, in vec3 ro, in vec3 rd ) {
    ro += PORTAL_POS + START_OFFSET;
    
    vec3 col = render( ro, rd, fragCoord.xy/iResolution.xy, iChannel0, 
                      texelFetch(iChannel1, ivec2(0), 0).w > .5);
    fragColor = vec4(col,1.0);
}`,name:`Image`,description:``,type:`image`},{inputs:[],outputs:[],code:`// Portal - iOS AR. Created by Reinder Nijhoff 2018
// @reindernijhoff
//
// https://www.shadertoy.com/view/lldcR8
//
// This is an experiment to create an "AR shader" by implementing the mainVR-function and 
// using the WebCam texture as background. If you view this shader with the Shadertoy iOS 
// app[1], you can walk around and enter the portal.
//
// If you don't have an iOS device (or if you don't have the app installed) you can have a 
// look at this screen capture to see the shader in action: https://youtu.be/IzeeoD0e6Ow.
//

#define PI 3.14159265359
#define PORTAL_POS vec3(0.05,0.9, 0.02)
#define PORTAL_SIZE vec3(0.45,0.75, 0.)
#define START_OFFSET vec3(0.,0.4,1.2)
#define PORTAL_BORDER vec3(0.15,0.15, 0.)
#define PILLAR_WIDTH_HALF .15
#define PILLAR_SPACING 2.1
#define CEILING_HEIGHT 2.5

const int N = 30;

#define NUM_VERTS 4
const vec3[] verts = vec3[] (
        vec3(PORTAL_SIZE.x, -PORTAL_SIZE.y, 0) + PORTAL_POS,
        vec3(-PORTAL_SIZE.x, -PORTAL_SIZE.y, 0) + PORTAL_POS,
        vec3(-PORTAL_SIZE.x, PORTAL_SIZE.y, 0) + PORTAL_POS,
        vec3(PORTAL_SIZE.x, PORTAL_SIZE.y, 0) + PORTAL_POS);

float cosine_sine_power_integral_sum(float theta, float cos_theta, float sin_theta,
	int n, float a, float b) {
	float f = a*a + b*b;
	float g = a*cos_theta + b*sin_theta;
	float gsq = g*g;
	float asq = a*a;
	float h = a*sin_theta - b*cos_theta;
	float T = theta, Tsum;
	float l = g*h, l2 = b*a;
	int start = 0;

	Tsum = T;
	for (int i = 2; i <= N - 1; i += 2) {
		T = (l + l2 + f*(float(i) - 1.)*T) * (1. / float(i));
		l *= gsq;
		l2 *= asq;
		Tsum += T;
	}
	return Tsum;
}

float P(float theta, float a) {
	return 1.0 / (1.0 + a * theta * theta);
}

float I_org(float theta, float c, float n) {
	float cCos = c * cos(theta);
	return (pow(cCos, n + 2.) - 1.0) / (cCos * cCos - 1.);
}

float evaluateXW(float c, float n) {
	return PI / 4. * pow(1. - pow(c - c / (n - 1.), 2.5), 0.45);
}

float shd_edge_contribution(vec3 v0, vec3 v1, vec3 n, int e) {
	float f;
	float cos_theta, sin_theta;
	vec3 q = cross(v0, v1); //ni
	sin_theta = length(q);
	q = normalize(q);
	cos_theta = dot(v0, v1);

	if (e == 1) {
		f = acos(cos_theta);
	} else {
		vec3 w;
		float theta;
		theta = acos(cos_theta);
		w = cross(q, v0);
		f = cosine_sine_power_integral_sum(theta, cos_theta, sin_theta, e - 1, dot(v0, n), dot(w, n));
	}
	return f * dot(q, n);
}


void seg_plane_intersection(vec3 v0, vec3 v1, vec3 n, out vec3 q) {
	vec3 vd;
	float t;
	vd = v1 - v0;
	t = -dot(v0, n) / (dot(vd, n));
	q = v0 + t * vd;
}

float shd_polygonal(vec3 p, vec3 n, bool spc) {
	int i, i1;
	int J = 0;
	float sum = 0.;
	vec3 ui0, ui1;
	vec3 vi0, vi1;
	int belowi0 = 1, belowi1 = 1;
    
	for (int j = 0; j < NUM_VERTS; j++) {
		vec3 u;
		u = verts[j] - p;
		if (dot(u, n) >= 0.0) {
			ui0 = u;
			vi0 = u;
			vi0 = normalize(vi0);
			belowi0 = 0;
			J = j;
			break;
		}
	}

    if (J >= NUM_VERTS) {
        return 0.;
    } else {
        i1 = J;
        for (int i = 0; i < NUM_VERTS; i++) {
            i1++;
            if (i1 >= NUM_VERTS) i1 = 0;

            ui1 = verts[i1] - p;
            belowi1 = int(dot(ui1, n) < 0.);

            if (belowi1 == 0) {
                vi1 = ui1;
                vi1 = normalize(vi1);
            }

            if (belowi0 != 0 && belowi1 == 0) {
                vec3 vinter;
                seg_plane_intersection(ui0, ui1, n, vinter);
                vinter = normalize(vinter + 0.01);
                sum += shd_edge_contribution(vi0, vinter, n, 1);
                vi0 = vinter;
            }
            else if (belowi0 == 0 && belowi1 != 0) {
                seg_plane_intersection(ui0, ui1, n, vi1);
                vi1 = normalize(vi1);
            }
            int K = spc ? N : 1;

            if (belowi0 == 0 || belowi1 == 0) sum += shd_edge_contribution(vi0, vi1, n, K);


            ui0 = ui1;
            vi0 = vi1;
            belowi0 = belowi1;
        }
	}
	return abs(sum) / (2. * PI);
}
`,name:`Common`,description:``,type:`common`},{inputs:[{id:`4dXGR8`,filepath:`/media/previz/buffer00.png`,type:`buffer`,channel:0,sampler:{filter:`nearest`,wrap:`clamp`,vflip:`true`,srgb:`false`,internal:`byte`},published:1}],outputs:[{id:`4dXGR8`,channel:0}],code:`// Portal - iOS AR. Created by Reinder Nijhoff 2018
// @reindernijhoff
//
// https://www.shadertoy.com/view/lldcR8
//
// This is an experiment to create an "AR shader" by implementing the mainVR-function and 
// using the WebCam texture as background. If you view this shader with the Shadertoy iOS 
// app[1], you can walk around and enter the portal.
//
// If you don't have an iOS device (or if you don't have the app installed) you can have a 
// look at this screen capture to see the shader in action: https://youtu.be/IzeeoD0e6Ow.
//

float iPlane( in vec3 ro, in vec3 rd, in vec4 pla ) {
    return (-pla.w - dot(pla.xyz,ro)) / dot( pla.xyz, rd );
}

void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
    fragColor = vec4(1);
}

void mainVR( out vec4 fragColor, in vec2 fragCoord, in vec3 ro, in vec3 rd ) {
    ro += PORTAL_POS + START_OFFSET;
    
    bool inside = false;
    vec3 oldRo = ro;
    
    if (iFrame > 0) {
    	vec4 t = texelFetch(iChannel0, ivec2(0), 0);
        oldRo = t.xyz;
        inside = t.w > .5;
        
        vec3 rd = normalize( ro - oldRo );
        float portalDist = iPlane( oldRo, rd, vec4(0,0,1,-dot(PORTAL_POS,vec3(0,0,1))));
	    if (portalDist > 0. && portalDist <= length( ro - oldRo) ) {
    	    vec3 p = oldRo + rd * portalDist;
        	if(all(lessThan(abs(p.xy-PORTAL_POS.xy),PORTAL_SIZE.xy))) {
                inside = !inside;
            }
        }
    }
    
    fragColor = vec4(ro, inside ? 1. : 0.);
}`,name:`Buffer A`,description:``,type:`buffer`}]},{ver:`0.1`,info:{id:`XtcyW4`,date:`1532538696`,viewed:40432,name:`[SH18] Human Document`,description:`This shader uses motion capture data to animate a humanoid. Image Based Lighting (IBL) is used to render the scene. Have a look at my shader [url=https://www.shadertoy.com/view/lscBW4]Old watch (IBL)[/url] for a clean implementation of IBL.
(mouseable)`,likes:267,published:`Public API`,usePreview:1,tags:[`ibl`,`mocap`,`sh18`]},renderpass:[{inputs:[{id:`XsfGRn`,filepath:`/media/a/1f7dca9c22f324751f2a5a59c9b181dfe3b5564a04b724c657732d0bf09c99db.jpg`,type:`texture`,channel:1,sampler:{filter:`mipmap`,wrap:`repeat`,vflip:`true`,srgb:`false`,internal:`byte`},published:1},{id:`XsfGzn`,filepath:`/media/a/585f9546c092f53ded45332b343144396c0b2d70d9965f585ebc172080d8aa58.jpg`,type:`cubemap`,channel:0,sampler:{filter:`mipmap`,wrap:`clamp`,vflip:`false`,srgb:`false`,internal:`byte`},published:1},{id:`XsXGR8`,filepath:`/media/previz/buffer01.png`,type:`buffer`,channel:3,sampler:{filter:`linear`,wrap:`clamp`,vflip:`true`,srgb:`false`,internal:`byte`},published:1},{id:`4sXGR8`,filepath:`/media/previz/buffer02.png`,type:`buffer`,channel:2,sampler:{filter:`linear`,wrap:`clamp`,vflip:`true`,srgb:`false`,internal:`byte`},published:1}],outputs:[{id:`4dfGRr`,channel:0}],code:`// [SH18] Human Document. Created by Reinder Nijhoff 2018
// Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License.
// @reindernijhoff
//
// https://www.shadertoy.com/view/XtcyW4
//
//   *Created for the Shadertoy Competition 2018*
//
// 07/29/2018 I have made some optimizations and bugfixes, so I could enable AA. 
// 
//            !! Please change AA (line 47) to 1 if your framerate is below 60 
//               (or if you're running the shader fullscreen).
//
// This shader uses motion capture data to animate a humanoid. The animation data is
// compressed by storing only a fraction of the coeffecients of the Fourier transform
// of the positions of the bones (Buffer A). An inverse Fourier transform is used to 
// reconstruct the data needed.
// 
// Image Based Lighting (IBL) is used to render the scene. Have a look at my shader 
// "Old watch (IBL)" (https://www.shadertoy.com/view/lscBW4) for a clean implementation
// of IBL.
// 
// Buffer A: I have preprocessed a (motion captured) animation by taking the Fourier 
//           transform of the position of all bones (14 bones, 760 frames). Only a fraction 
//           of all calculated coefficients are stored in this shader: the first 
//           coefficients with 16 bit precision, later coefficients with 8 bit. The positions
//           of the bones are reconstructed each frame by taking the inverse Fourier
//           transform of this data.
//
//           I have used (part of) an animation from the Carnegie Mellon University Motion 
//           Capture Database. The animations of this database are free to use:
//
//           - http://mocap.cs.cmu.edu/
// 
//           Íñigo Quílez has created some excellent shaders that show the properties of 
//           Fourier transforms, for example: 
//
//           - https://www.shadertoy.com/view/4lGSDw
//           - https://www.shadertoy.com/view/ltKSWD
//
// Buffer B: The BRDF integration map used for the IBL and the drawing of the humanoid 
//           are precalculated.
//
// Buffer C: Additional custom animation of the bones is calculated for the start
//           and end of the loop.
//

#define MAX_LOD 8.
#define DIFFUSE_LOD 6.75
#define AA 2              // Please change to 1 if your framerate is below 60
#define MARCH_STEPS 40

vec3 getSpherePosition(int i) {
    return texelFetch(iChannel2, ivec2(0,i), 0 ).xyz;
}

float mapBody( in vec3 pos ) {
    float r = .1;
    float s = 80.;

    vec3 p1 = getSpherePosition(LEFT_LEG_1);
    vec3 p2 = getSpherePosition(LEFT_LEG_2);
    float d = sdCapsule(pos, p1, p2, r, r*.5);
    vec2 res = vec2(d, MAT_PAPER);

    p1 = getSpherePosition(LEFT_LEG_3);
    d = sdCapsule(pos, p1, p2, r, r*.5);
    res.x = smin(res.x, d, s);

    p1 = getSpherePosition(RIGHT_LEG_1);
    p2 = getSpherePosition(RIGHT_LEG_2);
    d = sdCapsule(pos, p1, p2, r, r*.5);
    res.x = smin(res.x, d, s);

    p1 = getSpherePosition(RIGHT_LEG_3);
    d = sdCapsule(pos, p1, p2, r, r*.5);
    res.x = smin(res.x, d, s);

    p1 = getSpherePosition(RIGHT_LEG_3);
    p2 = getSpherePosition(SPINE);
    d = sdCapsule(pos, p1, p2, r, r);
    res.x = smin(res.x, d, s);

    p1 = getSpherePosition(LEFT_LEG_3);
    d = sdCapsule(pos, p1, p2, r, r);
    res.x = smin(res.x, d, s);

    p1 = getSpherePosition(RIGHT_ARM_1);
    p2 = getSpherePosition(RIGHT_ARM_2);
    d = sdCapsule(pos, p1, p2, r*.5, r*.25);
    res.x = smin(res.x, d, s);

    p1 = getSpherePosition(RIGHT_ARM_3);
    d = sdCapsule(pos, p1, p2, r*.5, r*.25);
    res.x = smin(res.x, d, s);

    p1 = getSpherePosition(LEFT_ARM_1);
    p2 = getSpherePosition(LEFT_ARM_2);
    d = sdCapsule(pos, p1, p2, r*.5, r*.25);
    res.x = smin(res.x, d, s); 

    p1 = getSpherePosition(LEFT_ARM_3);
    d = sdCapsule(pos, p1, p2, r*.5, r*.25);
    res.x = smin(res.x, d, s);    

    return res.x;
}

vec2 map( in vec3 pos, bool spInt, bool pencilIntersect ) {
	// table
    vec2 res = vec2(pos.y + 0.01, MAT_TABLE);
    
    //--- paper
    float dP = pos.y;    
    if( spInt ) {   	 
        // smin with paper
        dP = smin(dP, mapBody(pos), 12.);
    }
    dP = opS(-sdBox(pos, vec3(PAPER_SIZE.x,10.,PAPER_SIZE.y)),dP);
    if (dP<res.x) { res = vec2(dP, MAT_PAPER); }
    
    // head
    float d = sdSphere(pos, vec4(getSpherePosition(HEAD),.1));
    if (d<res.x) { res = vec2(d, MAT_METAL_0); }
    
    //--- pencil
    if (pencilIntersect) {
        vec3 pen = pos;
        pen.xz = mat2(0.581683089463883,-0.813415504789374,
                      0.813415504789374, 0.581683089463883)*pen.xz;
        pen += PENCIL_POS;
        float dPencil0 = sdHexPrism(pen, vec2(.2, 2.));
        dPencil0 = opS(-sdCone(pen + (vec3(-2.05,0,0)), vec2(.95,0.3122)),dPencil0);
        dPencil0 = opS(sdSphere(pen + (vec3(-2.5,-0.82,2.86)), 3.), dPencil0);
        if (dPencil0 < res.x) res = vec2(dPencil0, MAT_PENCIL_0);

        float dPencil1 = sdCapsule(pen, - vec3(2.2,0.,0.), -vec3(2.55, 0., 0.), .21);
        if (dPencil1 < res.x) res = vec2(dPencil1, MAT_PENCIL_1);
        float ax = abs(-2.25 - pen.x );
        float r = .02*abs(2.*fract(30.*pen.x)-1.)*smoothstep(.08,.09,ax)*smoothstep(.21,.2,ax);

        float dPencil2 = sdCylinderZY(pen + vec3(2.25,-0.0125,0), vec2(.22 - r,.25));
        if (dPencil2 < res.x) res = vec2(dPencil2, MAT_PENCIL_2);
    }
 	return res;   
}

vec3 calcNormal( in vec3 pos ) {
    bool sphInt = distance(pos,getSpherePosition(LEFT_LEG_3)) <  1.25 ? true : false;
    vec3 ropen = pos;
    ropen.xz = rotate(ropen.xz, PENCIL_ROT);
    ropen += PENCIL_POS;
    bool pencilIntersect = sdBox(ropen, vec3(3.,.4,.4)) < 0.;
    
    const vec2 e = vec2(1.0,-1.0)*0.01;
    return normalize( e.xyy*map( pos + e.xyy, sphInt, pencilIntersect ).x + 
					  e.yyx*map( pos + e.yyx, sphInt, pencilIntersect ).x + 
					  e.yxy*map( pos + e.yxy, sphInt, pencilIntersect ).x + 
					  e.xxx*map( pos + e.xxx, sphInt, pencilIntersect ).x );
}

vec2 castRay( in vec3 ro, in vec3 rd ) {
    float tmax = 20.;
    
    vec3 rdpen = rd, ropen = ro;
    rdpen.xz = rotate(rdpen.xz, PENCIL_ROT);
    ropen.xz = rotate(ropen.xz, PENCIL_ROT);
    ropen += PENCIL_POS;
    
    vec2 sphDist = sphIntersect(ro-getSpherePosition(LEFT_LEG_3), rd, 1.25);
    vec2 pencilDist = boxIntersect(ropen, rdpen, vec3(3.,.24,.24));
    vec2 headDist = sphIntersect(ro-getSpherePosition(HEAD), rd, .11);
    
    bool pencilIntersect = pencilDist.x > 0.;
    bool sphInt = sphDist.y > 0.;
        
    float tmin = planeIntersect(ro,rd,.01);
    if (sphInt) {
        tmin = min(tmin, max(sphDist.x, 0.1));
    }
    if (pencilIntersect) {
        tmin = min(tmin, max(pencilDist.x, 0.11));
    }
    if (headDist.x > 0.) {
        tmin = min(tmin, headDist.x);
    }
    
    float t = tmin;
    float mat = -1.;
    
    for( int i=0; i<MARCH_STEPS; i++ ) {
	    float precis = 0.00025*t;
	    vec2 res = map( ro+rd*t, sphInt, pencilIntersect );
        if( res.x<precis || t>tmax ) break;
        t += res.x;
        mat = res.y;
    }

    if( t>tmax ) t=-1.0;
    return vec2(t, mat);
}

float calcAO( in vec3 ro, in vec3 rd ) {
	float occ = 0.0;
    float sca = 1.0;
    
    bool sphInt = sphIntersect(ro-getSpherePosition(LEFT_LEG_3), rd, 1.25).y > 0. ? true : false;
    vec3 ropen = ro;
    ropen.xz = rotate(ropen.xz, PENCIL_ROT);
    ropen += PENCIL_POS;
    bool pencilIntersect = sdBox(ropen, vec3(3.,.45,.45)) < 0.;
    
    for( int i=0; i<5; i++ ) {
        float h = 0.001 + 0.25*float(i)/4.0;
        float d = map( ro+rd*h, sphInt, pencilIntersect ).x;
        occ += (h-d)*sca;
        sca *= 0.95;
    }
    return clamp( 1.0 - 1.5*occ, 0.0, 1.0 );    
}

void getMaterialProperties(
    in vec3 pos, in float mat,
    inout vec3 normal, inout vec3 albedo, inout float ao, inout float roughness, inout float metallic) {
    
    normal = calcNormal( pos );
    ao = calcAO(pos, normal);
    metallic = 0.;
    
    vec4 noise = texNoise(iChannel1, pos * .5, normal);
    float metalnoise = 1.- noise.r;
    metalnoise*=metalnoise;

    mat -= .5;
    
    vec3 penpos = pos;
    penpos.xz = rotate(penpos.xz, PENCIL_ROT);
    penpos += PENCIL_POS;
    
    if (mat < MAT_TABLE) {
        albedo = 0.8*pow(texture(iChannel1, rotate(pos.xz * .4 + .25, -.3)).rgb, 2.2*vec3(0.45,0.5,0.5));
        roughness = 0.95 - albedo.r * .6;
    }
    else if( mat < MAT_PENCIL_0 ) {
        if (length(penpos.yz) < 0.055) {
        	albedo = vec3(0.02);
        	roughness = .9;
        } else if(sdHexPrism(penpos, vec2(.195, 3.)) < 0.) {
        	albedo = .8* texture(iChannel1, penpos.xz).rgb;
        	roughness = 0.99;
        } else {
        	albedo = .5*pow(vec3(1.,.8,.15), vec3(2.2));
        	roughness = .75 - noise.b * .4;
        }
        albedo *= noise.g * .75 + .7;
    }
    else if( mat < MAT_PENCIL_1 ) {
       	albedo = .4*pow(vec3(.85,.75,.55), vec3(2.2));
       	roughness = 1.;
    }
    else if( mat < MAT_PENCIL_2 ) {
        float ax = abs(-2.25 - penpos.x);
        float r = 1. - abs(2.*fract(30.*penpos.x)-1.)*smoothstep(.08,.09,ax)*smoothstep(.21,.2,ax);

        r -= 4. * metalnoise;  
        ao *= .5 + .5 * r;
	    albedo = mix(vec3(0.5, 0.3, 0.2),vec3(0.560, 0.570, 0.580), ao * ao); // Iron
   		roughness = 1.-.25*r;
   		metallic = 1.; 
    }
    else if( mat < MAT_PAPER ) {
        vec2 paperUV = (pos.xz-PAPER_SIZE)/(PAPER_SIZE*2.)+1.;
        vec2 tex = texture(iChannel3, paperUV.yx).zw;
    	float line = abs(paperUV.x-.5) > .45 ? 0. : smoothstep(0.1, 0.025, abs(sin(paperUV.y*75.)));

        albedo = mix(vec3(.955 - .05*tex.x), vec3(.55,.65,.9), line);    	
        float figure = 1.-tex.y;
        float time = mod(offsetTime(iTime), DURATION_TOTAL);
        float start = 1.-smoothstep(DURATION_START-DURATION_MORPH_STILL, DURATION_START+DURATION_MORPH_ANIM, time);
        float end = smoothstep(DURATION_TOTAL-DURATION_MORPH, DURATION_TOTAL, time);
        figure *= max(start, end);
        
        albedo *= 1.-figure*.8;
        
       	roughness = .65 + .3 *tex.x;
        metallic = 0.;
    }
    else if( mat < MAT_METAL_0 ) {
	    albedo = vec3(1.000, 0.766, 0.336); // Gold
   		roughness = .6;
   		metallic = 1.; 
    }   
    if (metallic > .5) {   
        albedo *= 1.-metalnoise;
        roughness += metalnoise*4.;
    }
    
    ao = clamp(.2+.8*ao, 0., 1.);
    roughness = clamp(roughness, 0., 1.);
}

//
// Image based lighting
// See: Old watch (IBL)
// https://www.shadertoy.com/view/lscBW4
//
vec3 getSpecularLightColor( vec3 N, float roughness ) {
    return pow(textureLod(iChannel0, N, roughness * MAX_LOD).rgb, vec3(4.5)) * 6.5;
}
vec3 getDiffuseLightColor( vec3 N ) {
    return .25 +pow(textureLod(iChannel0, N, DIFFUSE_LOD).rgb, vec3(3.)) * 1.;
}
vec3 FresnelSchlickRoughness(float cosTheta, vec3 F0, float roughness) {
    return F0 + (max(vec3(1.0 - roughness), F0) - F0) * pow(1.0 - cosTheta, 5.0);
}
vec3 lighting(in vec3 ro, in vec3 pos, in vec3 N, in vec3 albedo, in float ao, in float roughness, in float metallic ) {
    vec3 V = normalize(ro - pos); 
    vec3 R = reflect(-V, N);
    float NdotV = max(0.0, dot(N, V));

    vec3 F0 = vec3(0.04); 
    F0 = mix(F0, albedo, metallic);

    vec3 F = FresnelSchlickRoughness(NdotV, F0, roughness);

    vec3 kS = F;

    vec3 prefilteredColor = getSpecularLightColor(R, roughness);
    vec2 envBRDF = texture(iChannel3, vec2(NdotV, roughness)).rg;
    vec3 specular = prefilteredColor * (F * envBRDF.x + envBRDF.y);

    vec3 kD = vec3(1.0) - kS;

    kD *= 1.0 - metallic;

    vec3 irradiance = getDiffuseLightColor(N);

    vec3 diffuse  = albedo * irradiance;
    vec3 color = (kD * diffuse + specular) * ao;

    return color;
}

//
// main 
//
vec3 render( const in vec3 ro, const in vec3 rd ) {
    vec3 col = vec3(0); 
    vec2 res = castRay( ro, rd );
    
    if (res.x > 0.) {
        vec3 pos = ro + rd * res.x;
        vec3 N, albedo;
        float roughness, metallic, ao;

        getMaterialProperties(pos, res.y, N, albedo, ao, roughness, metallic);

        col = lighting(ro, pos, N, albedo, ao, roughness, metallic);
        col *= max(0.0, min(1.1, 20./dot(pos,pos)) - .1);
    }
    col = max( vec3(0), col - 0.004);
    col = (col*(6.2*col + .5)) / (col*(6.2*col+1.7) + 0.06);
    
    return col;
}

mat3 setCamera( in vec3 ro, in vec3 ta ) {
	vec3 cw = normalize(ta-ro);
	vec3 cp = vec3(0.0, 1.0,0.0);
	vec3 cu = normalize( cross(cw,cp) );
	vec3 cv = normalize( cross(cu,cw) );
    return mat3( cu, cv, cw );
}

void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
    vec2 uv = fragCoord/iResolution.xy;
    vec2 mo = iMouse.xy/iResolution.xy - .5;
    if(iMouse.z <= 0.) {
        mo = vec2( 0.06+.1*sin(iTime*.035), 0. );
    }
    vec3 ro = vec3( 4.*sin(6.0*mo.x), 3. * mo.y + 3.5, -5.5*cos(6.0*mo.x) );
    vec3 ta = vec3( 0.0, 0.5, 0.0 );
    mat3 ca = setCamera( ro, ta );

    vec3 colT = vec3(0);
    for (int x=0; x<AA; x++) {
        for(int y=0; y<AA; y++) {
		    vec2 p = (-iResolution.xy + 2.0*(fragCoord + vec2(x,y)/float(AA) - .5))/iResolution.y;
   			vec3 rd = ca * normalize(vec3(p.xy,2.3));  
            colT += render( ro, rd);           
        }
    }
    colT /= float(AA*AA);
    
    colT *= smoothstep(.5, 1.5, iTime);
    fragColor = vec4(colT, 1.0);
}`,name:`Image`,description:``,type:`image`},{inputs:[],outputs:[],code:`// [SH18] Human Document. Created by Reinder Nijhoff 2018
// @reindernijhoff
//
// https://www.shadertoy.com/view/XtcyW4
//
//   * Created for the Shadertoy Competition 2018 *
//

// animation

#define FRAMES (760.)
#define DURATION_ANIM (FRAMES/60.)
#define DURATION_START (4.)
#define DURATION_END (4.)
#define DURATION_MORPH_ANIM (.5)
#define DURATION_MORPH_STILL (.5)
#define DURATION_MORPH (DURATION_MORPH_ANIM+DURATION_MORPH_STILL)
#define DURATION_TOTAL (DURATION_START+DURATION_ANIM+DURATION_END)

float frame;

float offsetTime(float time) {
    return max(0., time-2.);
}

void initAnimation(float time) {
    float t = mod(offsetTime(time), DURATION_TOTAL);
    frame = floor(clamp((t-DURATION_START)*60., 10., FRAMES-10.));
}

// bone functions

const float planeY = -9.5;

#define NUM_BONES 14

#define LEFT_LEG_1 3
#define LEFT_LEG_2 4
#define LEFT_LEG_3 5
#define RIGHT_LEG_1 0
#define RIGHT_LEG_2 1
#define RIGHT_LEG_3 2
#define LEFT_ARM_1 10
#define LEFT_ARM_2 11
#define LEFT_ARM_3 12
#define RIGHT_ARM_1 7
#define RIGHT_ARM_2 6
#define RIGHT_ARM_3 8
#define SPINE 13
#define HEAD 9

// render functions

#define MAT_TABLE    1.
#define MAT_PENCIL_0 2.
#define MAT_PENCIL_1 3.
#define MAT_PENCIL_2 4.
#define MAT_PAPER    5.
#define MAT_METAL_0  6.

#define PENCIL_POS vec3(-0.8,-0.2, -2.3)
#define PENCIL_ROT .95
#define PAPER_SIZE (vec2(1.95, 2.75)*1.1)

// http://www.johndcook.com/blog/2010/01/20/how-to-compute-the-soft-maximum/
float smin(in float a, in float b, const in float k) { return a - log(1.0+exp(k*(a-b))) * (1. / k); }

float opS( const float d1, const float d2 ) {
    return max(-d1,d2);
}

vec2 rotate( in vec2 p, const float t ) {
    float co = cos(t);
    float si = sin(t);
    return mat2(co,-si,si,co) * p;
}

float sdSphere( const vec3 p, const vec4 s ) {
    return distance(p,s.xyz)-s.w;
}

float sdBox( vec3 p, vec3 b ) {
    vec3 d = abs(p) - b;
    return min(max(d.x,max(d.y,d.z)),0.0) + length(max(d,0.0));
}

float sdCapsule(vec3 p,vec3 o,vec3 e,const float r0,const float r1) {
    vec3 d = e-o;
    float h = length(d);
    d *= (1./h);
    float t=clamp(dot(p-o,d),0.,h);
	vec3 np=o+t*d;
	return distance(np,p)-mix(r0,r1,t);
}

float sdCylinderZY( const vec3 p, const vec2 h ) {
  vec2 d = abs(vec2(length(p.zy),p.x)) - h;
  return min(max(d.x,d.y),0.0) + length(max(d,0.0));
}

float sdHexPrism( const vec3 p, const vec2 h ) {
    vec3 q = abs(p);
#if 0
    return max(q.x-h.y,max((q.z*0.866025+q.y*0.5),q.y)-h.x);
#else
    float d1 = q.x-h.y;
    float d2 = max((q.z*0.866025+q.y*0.5),q.y)-h.x;
    return length(max(vec2(d1,d2),0.0)) + min(max(d1,d2), 0.);
#endif
}

float sdCapsule( const vec3 p, const vec3 a, const vec3 b, const float r ) {
	vec3 pa = p-a, ba = b-a;
	float h = clamp( dot(pa,ba)/dot(ba,ba), 0.0, 1.0 );
	return length( pa - ba*h ) - r;
}

float sdSphere( const vec3 p, const float r ) {
    return length(p) - r;
}

float sdCone( const vec3 p, const vec2 c ) {
    float q = length(p.yz);
    return dot(c,vec2(q,p.x));
}

vec2 sphIntersect( in vec3 ro, in vec3 rd, in float r ) {
	vec3 oc = ro;
	float b = dot( oc, rd );
	float c = dot( oc, oc ) - r * r;
	float h = b*b - c;
	if( h<0.0 ) return vec2(-1.0);
    h = sqrt( h );
	return vec2(-b - h, -b + h);
}

vec2 boxIntersect( in vec3 ro, in vec3 rd, in vec3 rad ) {
    vec3 m = 1.0/rd;
    vec3 n = m*ro;
    vec3 k = abs(m)*rad;
	
    vec3 t1 = -n - k;
    vec3 t2 = -n + k;

	float tN = max( max( t1.x, t1.y ), t1.z );
	float tF = min( min( t2.x, t2.y ), t2.z );
	
	if( tN > tF || tF < 0.0) return vec2(-1);

	return vec2(tN, tF);
}

float planeIntersect( const vec3 ro, const vec3 rd, const float height) {	
	if (rd.y==0.0) return 500.;	
	float d = -(ro.y - height)/rd.y;
	if( d > 0. ) {
		return d;
	}
	return 500.;
}

//
// Material properties.
//

vec4 texNoise( sampler2D sam, in vec3 p, in vec3 n ) {
	vec4 x = texture( sam, p.yz );
	vec4 y = texture( sam, p.zx );
	vec4 z = texture( sam, p.xy );

	return x*abs(n.x) + y*abs(n.y) + z*abs(n.z);
}




`,name:`Common`,description:``,type:`common`},{inputs:[{id:`4dXGR8`,filepath:`/media/previz/buffer00.png`,type:`buffer`,channel:0,sampler:{filter:`linear`,wrap:`clamp`,vflip:`true`,srgb:`false`,internal:`byte`},published:1}],outputs:[{id:`4dXGR8`,channel:0}],code:`// [SH18] Human Document. Created by Reinder Nijhoff 2018
// @reindernijhoff
//
// https://www.shadertoy.com/view/XtcyW4
//
//   * Created for the Shadertoy Competition 2018 *
// 
// Buffer A: I have preprocessed a (motion captured) animation by taking the Fourier 
//           transform of the position of all bones (14 bones, 760 frames). Only a fraction 
//           of all calculated coefficients are stored in this shader: the first 
//           coefficients with 16 bit precision, later coefficients with 8 bit. The positions
//           of the bones are reconstructed each frame by taking the inverse Fourier
//           transform of this data.
//
//           I have used (part of) an animation from the Carnegie Mellon University Motion 
//           Capture Database. The animations of this database are free to use:
//
//           - http://mocap.cs.cmu.edu/
// 
//           Íñigo Quílez has created some excellent shaders that show the properties of 
//           Fourier transforms, for example: 
//
//           - https://www.shadertoy.com/view/4lGSDw
//           - https://www.shadertoy.com/view/ltKSWD
//


#define HQ 10
#define LQ 13

vec2 cmul(vec2 a, vec2 b) { return vec2(a.x*b.x - a.y*b.y, a.x*b.y + a.y*b.x); }
#define S(q,s,c) (float((q >> s) & 0xFFU)*c.x-c.y)
#define SH(q,s,c) (float((q >> s) & 0xFFFFU)*c.x-c.y)

void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
    if(int(fragCoord.x) > 0 || int(fragCoord.y) > NUM_BONES) {      
        return;
    }
    
    initAnimation(iTime);
    
	int y = int(fragCoord.y);  
    float s1 = (6.28318530718/FRAMES)*frame;
    vec2 pos = vec2(0);
    vec2 posy = vec2(0);
    
    uint[HQ] hqd;
    uint[LQ] lqd;

    uint[HQ] hqyd;
    uint[LQ] lqyd;
    
    uint[HQ] hqdB;
    uint[LQ] lqdB;
    
    uint[HQ] hqydB;
    uint[LQ] lqydB;

    // scale 
    const vec3 scale = vec3(0.012353025376796722, 0.011576368473470211, 0.025544768199324608); 

    // scale, offset - first coeffs 
    const vec2 ch = vec2(0.014635691419243813, 636.2047119140625); 
    const vec2 cl = vec2(0.39385828375816345, 42.45376205444336); 

    // scale, offset - last coeffs 
    const vec2 chb = vec2(0.003957926761358976, 118.40463256835938);
    const vec2 clb = vec2(0.520740270614624, 58.412567138671875);


    if (y==0) { hqd = uint[10] (0x7f2d8b92U,0xc4f2beaeU,0xbbeaad0eU,0xd070a2e9U,0xb266a557U,0xb19fa162U,0xad6ca7edU,0xb0f7ac1fU,0xb104ac21U,0xb2439bbfU); lqd = uint[13] (0x928a893cU,0x537c793cU,0x6792965bU,0x6466c17aU,0x7748a244U,0x9f628b6bU,0x995b7167U,0x825a6c62U,0x727c6767U,0x84687269U,0x7d709262U,0x74638d50U,0x7b697e68U);}
    if (y==0 || y==1) { hqyd = uint[10] (0x45960000U,0xb649b0efU,0xb91aa98aU,0xafbaa34dU,0xa830a08fU,0xac65a40cU,0xaa63a1d7U,0xa37ca7edU,0xac25a239U,0xaf63ad31U); lqyd = uint[13] (0x1505b2cU,0xac01194U,0xbaae51f4U,0xbe3a7385U,0x953f9568U,0x58757b42U,0x807b6578U,0x26549d61U,0x4e5b634dU,0x646d4f74U,0x7f86567aU,0x9670756fU,0x6770546dU);}
    if (y==1) { hqd = uint[10] (0x6f4585cbU,0xc4a3bce4U,0xb9f2b155U,0xcbc89e17U,0xacdba615U,0xabb69dd9U,0xb168ab59U,0xac9ea649U,0xb314a969U,0xafe2a327U); lqd = uint[13] (0x9e7c8c46U,0x7d645c57U,0x6f636f51U,0x765d9b5cU,0x8e566451U,0x78638e62U,0x705e7169U,0x76697177U,0x7a637c68U,0x7f607767U,0x78607353U,0x736b6f71U,0x7d637f69U);}
    if (y==2) { hqd = uint[10] (0x813a9626U,0xc801c2d1U,0xbf42abe8U,0xcd90a65fU,0xb0e1a15eU,0xaeba9cecU,0xab0fa953U,0xb28fa809U,0xafd4a45bU,0xb0b8a7dbU); lqd = uint[13] (0x90588c2bU,0x6b696944U,0x7c6e7a51U,0x675d995dU,0x7e667b54U,0x6c5e8266U,0x78587967U,0x74607b6fU,0x845c7f68U,0x7d5b7964U,0x775e685cU,0x77676d67U,0x7764706aU);}
    if (y==2 || y==3) { hqyd = uint[10] (0x4838601U,0xaf02a4f0U,0xaba0a4e7U,0xa16a9a56U,0xa0379c04U,0xa68ba99aU,0xa63aab86U,0xa4aca392U,0xa689ab22U,0xa152ac96U); lqyd = uint[13] (0x2150385cU,0x73ff21e2U,0xdaa1b4a2U,0x9e28de0cU,0x37763c06U,0x4e452891U,0x698a7850U,0x2ca4724dU,0x7f9c507cU,0xa15d8184U,0x73599e63U,0x565b504aU,0x5d68695cU);}
    if (y==3) { hqd = uint[10] (0x819db6f2U,0xc5abcc7eU,0xc384a773U,0xc844aa35U,0xb0709d74U,0xa6009fbbU,0xaf9aa9b4U,0xa9f3a8b2U,0xb3a09bf7U,0xafc3ae57U); lqd = uint[13] (0x65464a2bU,0x645c6a55U,0x6e5a8865U,0x5f5db08bU,0x75618131U,0x894c4847U,0x7c577b73U,0x5876615fU,0x6e614d46U,0x92916657U,0x8c6e5a79U,0x785f5d5aU,0x61657e4cU);}
    if (y==4) { hqd = uint[10] (0x7057b74bU,0xc6e5c8f3U,0xc22aab06U,0xc861a366U,0xb0759fd9U,0xa4229de0U,0xb5c7aa1cU,0xa44ba815U,0xb622a03cU,0xad9da952U); lqd = uint[13] (0x7d51642dU,0x77575d78U,0x844c8977U,0x71468a6aU,0x73566a49U,0x7c6c6c59U,0x69767452U,0x6967665eU,0x64526d67U,0x6767846aU,0x636d786aU,0x74677e65U,0x74617163U);}
    if (y==4 || y==5) { hqyd = uint[10] (0x88cd4a5aU,0xb2b7b0e6U,0xb9dbb24eU,0xad0fa4fbU,0xa6ffa074U,0xaca2a79aU,0xa64ea955U,0xa11aac9cU,0xa83dacd4U,0xb306a50dU); lqyd = uint[13] (0xa5a374cU,0x45dc1c98U,0xafb77cb9U,0x8c57db72U,0x81576b48U,0x616a7758U,0x75666467U,0x584e7b6fU,0x69526b59U,0x5a7b4e75U,0x74806075U,0x6f676d7eU,0x66677b6cU);}
    if (y==5) { hqd = uint[10] (0x7fe7b48aU,0xc7f3c61dU,0xc09ba88dU,0xca11a71dU,0xb12fa099U,0xab6da034U,0xad91a571U,0xae72ac1cU,0xb16fa17fU,0xad92a90bU); lqd = uint[13] (0x8454932aU,0x625d7559U,0x7b5b8d64U,0x644e9769U,0x735e765fU,0x6e5a7f6eU,0x775b7465U,0x7263776cU,0x7f637f69U,0x78607e63U,0x70616e57U,0x726a6f66U,0x7566706aU);}
    if (y==6) { hqd = uint[10] (0x797e765dU,0xc9f7c05aU,0xbe9db1b6U,0xd26fa3bcU,0xaad3a0dcU,0xb02297ceU,0xaaa6b166U,0xae69a0b9U,0xaec4a95fU,0xb373a6efU); lqd = uint[13] (0x9a3f535fU,0x82676760U,0x6d7d6f40U,0x6b846236U,0x726b9d59U,0x6252786aU,0x716d7f75U,0x7c797d63U,0x7a667b66U,0x6f647c51U,0x76677467U,0x6f687461U,0x746a735fU);}
    if (y==6 || y==7) { hqyd = uint[10] (0x9ddebb01U,0x9494a957U,0xa223bdd6U,0x9412bad1U,0xa162aebcU,0xc209b52bU,0xb339a79dU,0x9acfa754U,0xa47aaeceU,0xbccab927U); lqyd = uint[13] (0xd876bb65U,0x670ec504U,0x2b333400U,0x2a756964U,0x849f2a9aU,0x6241be66U,0x5583345cU,0x63326785U,0x5d78555eU,0x7aa84298U,0x886ba57dU,0x635b7a4eU,0x6871646eU);}
    if (y==7) { hqd = uint[10] (0x707c816cU,0xc8a2bd56U,0xb894b447U,0xd02e9e32U,0xabe4a20bU,0xad239781U,0xb11aaef1U,0xa637a0c8U,0xb385a979U,0xb4a8a648U); lqd = uint[13] (0x812a6680U,0x9888687aU,0x7263a24fU,0x63886354U,0x7971aa4aU,0x76387a75U,0x76688f7aU,0x6b8d7264U,0x7c638455U,0x8c74784dU,0x88746f6cU,0x7a69785bU,0x7a706b54U);}
    if (y==8) { hqd = uint[10] (0x786185abU,0xccd4c4f2U,0xc299b1a7U,0xd1bda151U,0xacdf9d39U,0xaf0b9a6eU,0xad3caec2U,0xadf1a0ccU,0xb039a7c0U,0xb536a45cU); lqd = uint[13] (0x8f47594aU,0x80576b5cU,0x76696550U,0x85636754U,0x795f8161U,0x71687458U,0x6a72745fU,0x75617e59U,0x76647e67U,0x64627f5bU,0x6c647a61U,0x6e65735fU,0x6b627863U);}
    if (y==8 || y==9) { hqyd = uint[10] (0xffffe30eU,0x8aa3afebU,0x9ac1c8c4U,0x99f2c288U,0xab85b26dU,0xba8eb5d5U,0xadcbae25U,0x9a80a928U,0xa56ab508U,0xbc84b8dcU); lqyd = uint[13] (0xae54b088U,0x752dc82aU,0x27564815U,0x4c7c5e81U,0x85895a8dU,0x5d588573U,0x70755469U,0x595b6a79U,0x7f6a7481U,0x6f6d7173U,0x67687862U,0x666c5f6bU,0x62697471U);}
    if (y==9) { hqd = uint[10] (0x6de79f16U,0xcf64c883U,0xc5c3b1fcU,0xcd459d56U,0xab069cd0U,0xaa239e3eU,0xb50cac41U,0xa4f5a0bcU,0xb25ea61fU,0xb427a28eU); lqd = uint[13] (0x7651566aU,0x8c557a75U,0x855a685fU,0x8f555769U,0x7d587361U,0x84686b50U,0x6c7d6c61U,0x7367745aU,0x70688060U,0x6d6e7d55U,0x706a785fU,0x6b64735eU,0x6d677b61U);}
    if (y==10) { hqd = uint[10] (0x6d23bfd6U,0xd03ec43eU,0xcdc8ad1eU,0xc2ef9dffU,0xaac8a3f1U,0xa63fa2a7U,0xb9e0a3daU,0x9dd2a9d2U,0xb0f1a249U,0xab98a746U); lqd = uint[13] (0x2c5aa46bU,0x768b8969U,0xcd66826fU,0x73586b52U,0x80a36844U,0x775b7f52U,0x6f618e72U,0x9f5e8172U,0x86545463U,0x7f5e6858U,0x846d5d78U,0x85637471U,0x805e6c5cU);}
    if (y==10 || y==11) { hqyd = uint[10] (0xc58eb64bU,0x8e4ca00aU,0x9b52b3b3U,0x9b6fb009U,0xac4bb06bU,0xb4f1b9abU,0xae25aa6dU,0x9eb5a6e5U,0xa7f2b1a6U,0xa99cbbe2U); lqyd = uint[13] (0xc75fc2d3U,0xa51bdd72U,0x6a209613U,0x21596f19U,0x55ac2689U,0xa34aa596U,0x66522a5eU,0xa52b4393U,0x5b499654U,0x299c2b50U,0x788a6991U,0x775b8582U,0x64716960U);}
    if (y==11) { hqd = uint[10] (0x77dcd005U,0xcc81c841U,0xcb2da829U,0xc4b6a5b9U,0xaf569dcaU,0xaa0aa4ceU,0xb38fa1edU,0xa494af97U,0xb1a5a091U,0xadb6a755U); lqd = uint[13] (0x3c74a346U,0x8a729868U,0xab5f956bU,0x7f498158U,0x747f745fU,0x8058715eU,0x72568062U,0x936a836bU,0x82616961U,0x7b546d58U,0x7c606b6aU,0x8263716cU,0x79606958U);}
    if (y==12) { hqd = uint[10] (0x786cc344U,0xcd32cb3fU,0xc7edab4cU,0xca48a2fcU,0xaec49c6cU,0xaad2a2daU,0xb1d2a555U,0xa6fdab44U,0xb231a20fU,0xb0aca64aU); lqd = uint[13] (0x635c7d45U,0x805a8a68U,0x89508165U,0x804e786aU,0x6f5c6f6dU,0x805e6964U,0x776c6d5fU,0x7e687860U,0x7b6d7f67U,0x78627558U,0x73636f60U,0x71656f64U,0x7165755fU);}
    if (y==12 || y==13) { hqyd = uint[10] (0xda14e8ccU,0x92d8a694U,0x9c9cbe57U,0x9be6b744U,0xa953af96U,0xb301b328U,0xabf7ab5fU,0x9bb4a744U,0xa507b50aU,0xb300b446U); lqyd = uint[13] (0x934d939aU,0x85578f73U,0x695a6241U,0x4c647e64U,0x7f8f3e7bU,0x6b627d7aU,0x6e71515fU,0x6d5e6c7bU,0x885c7d7aU,0x58656a61U,0x5d766363U,0x70715e7bU,0x60657d6fU);}
    if (y==13) { hqd = uint[10] (0x7a6fa42aU,0xcbc2c779U,0xc430ad87U,0xcd35a2ebU,0xae879dadU,0xad4b9f22U,0xaee0a953U,0xabdca6b5U,0xb0f2a473U,0xb243a62aU); lqd = uint[13] (0x7f527640U,0x7b577b5bU,0x7e5b7358U,0x7d58745fU,0x735f7767U,0x75617362U,0x736b7060U,0x7a607c61U,0x79668068U,0x715f7b5cU,0x7061725fU,0x70667062U,0x70627664U);}


    if (y==0) { hqdB = uint[10] (0xe21c2f6cU, 0xcb15b85bU, 0x82ac80dbU, 0x84cdc8ffU, 0x4e019d8dU, 0x5248950eU, 0x5fe371bcU, 0x54dd8336U, 0x76639b92U, 0x73ec992eU); lqdB = uint[13] (0x4e9360b6U, 0x428c5087U, 0x64494d75U, 0x4f7d6c6dU, 0x62907478U, 0x7d855a7fU, 0x76845c70U, 0x72847583U, 0x5d8d6986U, 0x5180527dU, 0x5c6c6074U, 0x61767378U, 0x697a647cU);}
    if (y==0 || y==1) { hqydB = uint[10] (0x6546a12eU, 0x54dd93fcU, 0x466e7ab9U, 0x55946828U, 0x67a35c96U, 0x6a6c5743U, 0x6d876a60U, 0x5a9e61f3U, 0x6857718cU, 0x5c81503dU); lqydB = uint[13] (0xb93d7f38U, 0xc1b8dd63U, 0x80b58db8U, 0x407f2a84U, 0x5d534354U, 0x62706571U, 0x4a696289U, 0x6d537247U, 0x87649163U, 0x777f7c6cU, 0x5b696277U, 0x88695c6fU, 0x756e696aU);}
    if (y==1) { hqdB = uint[10] (0xdcf8220dU, 0xecc6cbddU, 0x82ac7569U, 0x8dbdd346U, 0x66a98e0bU, 0x4c3f8cc0U, 0x63777618U, 0x5e0e6fd8U, 0x78309a7dU, 0x6c3f8e24U); lqdB = uint[13] (0x647c41acU, 0x57765776U, 0x8f7b7a6cU, 0x5d846c79U, 0x637b6a76U, 0x6a87697cU, 0x707d647dU, 0x6e7b728fU, 0x6e7e6c7cU, 0x627b6577U, 0x6d7a5f78U, 0x63796b78U, 0x6b7c677bU);}
    if (y==2) { hqdB = uint[10] (0xd64634daU, 0xbc8ebdacU, 0x77979c0cU, 0x7e3fc25dU, 0x5a7a817fU, 0x5de396eaU, 0x5b2b8102U, 0x609b758eU, 0x6f3e8e74U, 0x6fc68268U); lqdB = uint[13] (0x60865b97U, 0x5a804f85U, 0x607a637dU, 0x5e7a6979U, 0x6b7f647aU, 0x617e6774U, 0x65745f74U, 0x6f716d67U, 0x787f7375U, 0x69816d80U, 0x637a617aU, 0x6e736672U, 0x6d766a75U);}
    if (y==2 || y==3) { hqydB = uint[10] (0x98968b51U, 0x980fc32cU, 0x5e4a9a87U, 0x444e89d2U, 0x623f8d16U, 0x721464daU, 0x8076588eU, 0x889173a0U, 0x4daf9a2aU, 0x59886316U); lqydB = uint[13] (0x8613432cU, 0xc260cc23U, 0x94ffc189U, 0x57937a90U, 0x3d72528aU, 0x85745777U, 0x7c98616bU, 0x44773638U, 0x79444851U, 0x9b58a256U, 0x7987967bU, 0x678c6a88U, 0x70616869U);}
    if (y==3) { hqdB = uint[10] (0xdcc13d0dU, 0xcacd9445U, 0x71aab82fU, 0x8208ca49U, 0x62037a7cU, 0x51ada2d7U, 0x5e548418U, 0x619f638eU, 0x77919dd4U, 0x79407ee0U); lqdB = uint[13] (0x487236b7U, 0x515d254eU, 0x4c846f3bU, 0x9658a077U, 0x7775678aU, 0x54904955U, 0x77868677U, 0x6f75796bU, 0x606e4f76U, 0x6f70586dU, 0x716a7761U, 0x73687d6fU, 0x6e757178U);}
    if (y==4) { hqdB = uint[10] (0xce06441eU, 0xec54ad8fU, 0x63909693U, 0x87a2be3bU, 0x6b877b00U, 0x3f1a984bU, 0x69387c8cU, 0x59756896U, 0x80189390U, 0x70cc7fb0U); lqdB = uint[13] (0x54793798U, 0x5a5f494dU, 0x7c7c864dU, 0x737b8a7dU, 0x6f80787dU, 0x60705b6fU, 0x77777a94U, 0x6d7a707cU, 0x69746c6dU, 0x62776e73U, 0x6d72727bU, 0x74716d74U, 0x6e7c6e73U);}
    if (y==4 || y==5) { hqydB = uint[10] (0x5b8386e7U, 0x76897e06U, 0x50de6100U, 0x5ae0634aU, 0x79736ee5U, 0x775566d9U, 0x5e1d6035U, 0x7fdb6206U, 0x7cb3671dU, 0x74826a90U); lqydB = uint[13] (0xb7336153U, 0x9490b86fU, 0x60b983b9U, 0x3e483d7bU, 0x7f5e775dU, 0x64686971U, 0x72687b75U, 0x80787658U, 0x6f817c8fU, 0x56755b78U, 0x6f61655eU, 0x7676765fU, 0x6c696f6aU);}
    if (y==5) { hqdB = uint[10] (0xd9254951U, 0xc9bdab08U, 0x71b8a56fU, 0x7edfbc56U, 0x5d2383acU, 0x531c9957U, 0x622d8062U, 0x5b8b7440U, 0x6ec2925bU, 0x6c9c81abU); lqdB = uint[13] (0x51825b97U, 0x577d526eU, 0x68766a6cU, 0x5f7f6f79U, 0x68836776U, 0x637a6d72U, 0x66716476U, 0x6b706f6aU, 0x757a7375U, 0x687e7081U, 0x6578657dU, 0x6c736771U, 0x6c756a74U);}
    if (y==6) { hqdB = uint[10] (0xca6b28fdU, 0xb3f3e380U, 0x5e268261U, 0x7d6ac7fbU, 0x5b256665U, 0x647084b1U, 0x5aca7efbU, 0x566b6f80U, 0x79807681U, 0x6bef74a6U); lqdB = uint[13] (0x968c7777U, 0x819a6e97U, 0x3d7b659dU, 0x67685c91U, 0x7182615eU, 0x5287796eU, 0x5d7a7385U, 0x657b6882U, 0x616c627cU, 0x666d6472U, 0x6d756f6cU, 0x6b727079U, 0x6c756475U);}
    if (y==6 || y==7) { hqydB = uint[10] (0x78e823f5U, 0xcb574bf4U, 0x9df829c2U, 0x7ea36d07U, 0xb9cabeb4U, 0x8c5ba051U, 0x61ca36beU, 0x95b3623fU, 0xa5ffb714U, 0x8dc78f7aU); lqydB = uint[13] (0x3eba8198U, 0x674fa5U, 0x63824f68U, 0x7f435f34U, 0x86a09b7fU, 0x5c4d567eU, 0x916f5a5aU, 0x5f874278U, 0x704a6559U, 0x907d9a55U, 0x65877f82U, 0x686f6b70U, 0x78747163U);}
    if (y==7) { hqdB = uint[10] (0xd0f0389cU, 0xc476ffffU, 0x503a811dU, 0x8635c0a0U, 0x515f5d9dU, 0x4b9d7a68U, 0x65e99171U, 0x41a670f6U, 0x6f0f6693U, 0x6f227946U); lqdB = uint[13] (0x9a937586U, 0x789f6b98U, 0x45a06e8eU, 0x68554e97U, 0x72975158U, 0x46947668U, 0x64797b84U, 0x5f7e7b8eU, 0x5172537bU, 0x636e4a76U, 0x736d7069U, 0x6874747eU, 0x6d715e77U);}
    if (y==8) { hqdB = uint[10] (0xcdab3b0fU, 0xb0e9e0cbU, 0x5d967edeU, 0x7b2fbe56U, 0x5af771e0U, 0x5db1872aU, 0x63157226U, 0x59d0764fU, 0x6aae7b15U, 0x70a07044U); lqdB = uint[13] (0x8e848362U, 0x74a27aa0U, 0x458458a0U, 0x646e547aU, 0x6e756a6fU, 0x6078717bU, 0x6076697eU, 0x6a75607aU, 0x696c6f71U, 0x6c787571U, 0x6b756b79U, 0x68726a7aU, 0x71767170U);}
    if (y==8 || y==9) { hqydB = uint[10] (0x6f010000U, 0xced82a4cU, 0xbe5a2044U, 0x99176edaU, 0xa2b9a673U, 0x80ef7e7cU, 0x689b382fU, 0x9b015de0U, 0xa7e8ae68U, 0x8462822fU); lqydB = uint[13] (0x58aa6d94U, 0x2e5c5091U, 0x6c6c524fU, 0x8e4f7b4cU, 0x6e818888U, 0x705a6465U, 0x7c797672U, 0x76745e68U, 0x756b697aU, 0x7075746cU, 0x6d686f71U, 0x73766e70U, 0x6f6b6968U);}
    if (y==9) { hqdB = uint[10] (0xd13b5941U, 0xc2a8eb07U, 0x54027d5bU, 0x7d97ba2fU, 0x5b9c76b6U, 0x445e82dbU, 0x72af634dU, 0x576f75f2U, 0x5eed7cf5U, 0x722e734eU); lqdB = uint[13] (0x86778f56U, 0x7ea68b95U, 0x5791559eU, 0x61684d74U, 0x716e6a6eU, 0x6d7f6a7dU, 0x6b786c7eU, 0x68756582U, 0x616c6a72U, 0x6f776b72U, 0x6f706b79U, 0x67747077U, 0x70747273U);}
    if (y==10) { hqdB = uint[10] (0xc1698c0bU, 0xcee6dcf5U, 0x404796ddU, 0x7729a2e4U, 0x6dcb8a98U, 0x37c18ed1U, 0x722c611fU, 0x5a5a7130U, 0x5f637d59U, 0x74488186U); lqdB = uint[13] (0x73639361U, 0x9d8a9590U, 0x5b9c62abU, 0x61625384U, 0x766d648aU, 0x7893617dU, 0x6b8b6f76U, 0x72895d64U, 0x5b846d88U, 0x676a5186U, 0x72756564U, 0x6b737179U, 0x72766077U);}
    if (y==10 || y==11) { hqydB = uint[10] (0x67661516U, 0xbe6c2d80U, 0x912c3a36U, 0x805b74e8U, 0xa63a9d88U, 0x6ffe8b06U, 0x52834533U, 0x9d7666f6U, 0xacfd8459U, 0xa25ca36dU); lqydB = uint[13] (0x689a31ccU, 0x10582c87U, 0x42515167U, 0x893f772cU, 0x7e9ab670U, 0x7547458aU, 0x9775764dU, 0x626c3a81U, 0x7d506d5aU, 0x83809f62U, 0x6782857eU, 0x70716970U, 0x7374766cU);}
    if (y==11) { hqdB = uint[10] (0xdc8676d5U, 0xc979b6c9U, 0x59229fb7U, 0x66a2a433U, 0x604083bcU, 0x48138e95U, 0x663c6e72U, 0x5be26d01U, 0x5fb18baaU, 0x67bb72a2U); lqdB = uint[13] (0x666f9861U, 0x828c8680U, 0x67875ba2U, 0x5c6a4e85U, 0x75696d8cU, 0x7f855e83U, 0x65826971U, 0x65765966U, 0x6a7a6985U, 0x6e6f6586U, 0x6a74686aU, 0x74726971U, 0x6e736777U);}
    if (y==12) { hqdB = uint[10] (0xdb39683aU, 0xc027c3c0U, 0x572d921aU, 0x7407ae55U, 0x5af47e28U, 0x4c4c8c83U, 0x69c56ebdU, 0x59cb72f2U, 0x60a78b90U, 0x6fc76f04U); lqdB = uint[13] (0x6d768a5fU, 0x75987f81U, 0x61815991U, 0x5e75557cU, 0x6e757078U, 0x79796b81U, 0x66746377U, 0x65735f77U, 0x6d726b77U, 0x72796d7bU, 0x6b726777U, 0x6a746b73U, 0x6f747074U);}
    if (y==12 || y==13) { hqydB = uint[10] (0x7be41564U, 0xcdff469dU, 0xaa7d4594U, 0x840175e5U, 0x994c9f4cU, 0x76d57938U, 0x6e8e404eU, 0x98496b63U, 0xa8e69a38U, 0x7c728fceU); lqydB = uint[13] (0x6897478bU, 0x485b536eU, 0x7476635dU, 0x7f53725aU, 0x7b7f8a82U, 0x6d585e6fU, 0x7d6f7a72U, 0x7b7f6164U, 0x6a706c8aU, 0x656f6c6bU, 0x74657367U, 0x7379736dU, 0x6b6b6e6aU);}
    if (y==13) { hqdB = uint[10] (0xd6a64e47U, 0xba4cce43U, 0x61188e48U, 0x790fb85bU, 0x5a347c04U, 0x56098e06U, 0x65667411U, 0x5b6d760fU, 0x65e28647U, 0x6f6c72c9U); lqdB = uint[13] (0x747c7c6bU, 0x7297748bU, 0x57825c93U, 0x5f75567bU, 0x6c796c74U, 0x6a786e7dU, 0x61736379U, 0x69726073U, 0x70727172U, 0x6f7d7379U, 0x6974667aU, 0x6a736975U, 0x70757171U);}

    // first coeffs
    float w1 = 0.;
    
    for( int i=0; i<HQ; i++) {
        uint q = hqd[i];
    	pos+=cmul(vec2(SH(q,0,ch),SH(q,16,ch)),vec2(cos(w1),sin(w1)));w1+=s1; 
    }
    for( int i=0; i<LQ; i++) {
        uint q = lqd[i];
    	pos+=cmul(vec2(S(q,0,cl),S(q,8,cl)),vec2(cos(w1),sin(w1)));w1+=s1; 
        pos+=cmul(vec2(S(q,16,cl),S(q,24,cl)),vec2(cos(w1),sin(w1)));w1+=s1; 
    }  
    
    // and y
    w1 = 0.;
    for( int i=0; i<HQ; i++) {
        uint q = hqyd[i];
        posy+=cmul(vec2(SH(q,0,ch),SH(q,16,ch)),vec2(cos(w1),sin(w1)));w1+=s1; 
    }
    for( int i=0; i<LQ; i++) {
        uint q = lqyd[i];
        posy+=cmul(vec2(S(q,0,cl),S(q,8,cl)),vec2(cos(w1),sin(w1)));w1+=s1; 
        posy+=cmul(vec2(S(q,16,cl),S(q,24,cl)),vec2(cos(w1),sin(w1)));w1+=s1; 
    }  
    
    // last coeffs
    float w2 = (FRAMES-1.)*s1;
    
    for( int i=0; i<HQ; i++) {
        uint q = hqdB[i];
        pos+=cmul(vec2(SH(q,0,chb),SH(q,16,chb)),vec2(cos(w2),sin(w2)));w2-=s1; 
    }
    for( int i=0; i<LQ; i++) {
        uint q = lqdB[i];
        pos+=cmul(vec2(S(q,0,clb),S(q,8,clb)),vec2(cos(w2),sin(w2)));w2-=s1; 
        pos+=cmul(vec2(S(q,16,clb),S(q,24,clb)),vec2(cos(w2),sin(w2)));w2-=s1; 
    }  
    
    // and y
    w2 = (FRAMES-1.)*s1;
    for( int i=0; i<HQ; i++) {
        uint q = hqydB[i];
        posy+=cmul(vec2(SH(q,0,chb),SH(q,16,chb)),vec2(cos(w2),sin(w2)));w2-=s1; 
    }
    for( int i=0; i<LQ; i++) {
        uint q = lqydB[i];
        posy+=cmul(vec2(S(q,0,clb),S(q,8,clb)),vec2(cos(w2),sin(w2)));w2-=s1; 
        posy+=cmul(vec2(S(q,16,clb),S(q,24,clb)),vec2(cos(w2),sin(w2)));w2-=s1; 
    }  
    
    float py = (int(fragCoord.y) & 0x1) == 0 ?  posy.x : posy.y;
    vec3 p = vec3(pos.x, py, pos.y);
    
    if(iFrame == 0) {
        fragColor = vec4(p * scale,1.0);
    } else {	    
    	fragColor = mix(vec4(p * scale,1.0), texelFetch(iChannel0, ivec2(fragCoord),0),.75);
    }
}`,name:`Buffer A`,description:``,type:`buffer`},{inputs:[{id:`XsX3Rn`,filepath:`/media/a/92d7758c402f0927011ca8d0a7e40251439fba3a1dac26f5b8b62026323501aa.jpg`,type:`texture`,channel:1,sampler:{filter:`mipmap`,wrap:`repeat`,vflip:`true`,srgb:`false`,internal:`byte`},published:1},{id:`XsXGR8`,filepath:`/media/previz/buffer01.png`,type:`buffer`,channel:0,sampler:{filter:`linear`,wrap:`clamp`,vflip:`true`,srgb:`false`,internal:`byte`},published:1}],outputs:[{id:`XsXGR8`,channel:0}],code:`// [SH18] Human Document. Created by Reinder Nijhoff 2018
// @reindernijhoff
//
// https://www.shadertoy.com/view/XtcyW4
//
//   * Created for the Shadertoy Competition 2018 *
//
// Buffer B: The BRDF integration map used for the IBL and the drawing of the humanoid 
//           are precalculated.
//

const float PI = 3.14159265359;

// see: http://blog.selfshadow.com/publications/s2013-shading-course/karis/s2013_pbs_epic_notes_v2.pdf
float PartialGeometryGGX(float NdotV, float a) {
    float k = a / 2.0;

    float nominator   = NdotV;
    float denominator = NdotV * (1.0 - k) + k;

    return nominator / denominator;
}

float GeometryGGX_Smith(float NdotV, float NdotL, float roughness) {
    float a = roughness*roughness;
    float G1 = PartialGeometryGGX(NdotV, a);
    float G2 = PartialGeometryGGX(NdotL, a);
    return G1 * G2;
}

float RadicalInverse_VdC(uint bits) {
    bits = (bits << 16u) | (bits >> 16u);
    bits = ((bits & 0x55555555u) << 1u) | ((bits & 0xAAAAAAAAu) >> 1u);
    bits = ((bits & 0x33333333u) << 2u) | ((bits & 0xCCCCCCCCu) >> 2u);
    bits = ((bits & 0x0F0F0F0Fu) << 4u) | ((bits & 0xF0F0F0F0u) >> 4u);
    bits = ((bits & 0x00FF00FFu) << 8u) | ((bits & 0xFF00FF00u) >> 8u);
    return float(bits) * 2.3283064365386963e-10; // / 0x100000000
}

vec2 Hammersley(int i, int N) {
    return vec2(float(i)/float(N), RadicalInverse_VdC(uint(i)));
} 

vec3 ImportanceSampleGGX(vec2 Xi, float roughness) {
    float a = roughness*roughness;
    float phi      = 2.0 * PI * Xi.x;
    float cosTheta = sqrt((1.0 - Xi.y) / (1.0 + (a*a - 1.0) * Xi.y));
    float sinTheta = sqrt(1.0 - cosTheta*cosTheta);

    vec3 HTangent;
    HTangent.x = sinTheta*cos(phi);
    HTangent.y = sinTheta*sin(phi);
    HTangent.z = cosTheta;

    return HTangent;
}

vec2 IntegrateBRDF(float roughness, float NdotV) {
    vec3 V;
    V.x = sqrt(1.0 - NdotV*NdotV);
    V.y = 0.0;
    V.z = NdotV;

    float A = 0.0;
    float B = 0.0;

    const int SAMPLE_COUNT = 128;

    vec3 N = vec3(0.0, 0.0, 1.0);
    vec3 UpVector = abs(N.z) < 0.999 ? vec3(0.0, 0.0, 1.0) : vec3(1.0, 0.0, 0.0);
    vec3 TangentX = normalize(cross(UpVector, N));
    vec3 TangentY = cross(N, TangentX);

    for(int i = 0; i < SAMPLE_COUNT; ++i)  {
        vec2 Xi = Hammersley(i, SAMPLE_COUNT);
        vec3 HTangent = ImportanceSampleGGX(Xi, roughness);
        
        vec3 H = normalize(HTangent.x * TangentX + HTangent.y * TangentY + HTangent.z * N);
        vec3 L = normalize(2.0 * dot(V, H) * H - V);

        float NdotL = max(L.z, 0.0);
        float NdotH = max(H.z, 0.0);
        float VdotH = max(dot(V, H), 0.0);

        if(NdotL > 0.0) {
            float G = GeometryGGX_Smith(NdotV, NdotL, roughness);
            float G_Vis = (G * VdotH) / (NdotH * NdotV);
            float Fc = pow(1.0 - VdotH, 5.0);

            A += (1.0 - Fc) * G_Vis;
            B += Fc * G_Vis;
        }
    }
    A /= float(SAMPLE_COUNT);
    B /= float(SAMPLE_COUNT);
    return vec2(A, B);
}

//
// draw paper
//


vec3 getSpherePosition(int i) {
    if (i==LEFT_LEG_1) return vec3(-.15, 0, -1.6);
    if (i==RIGHT_LEG_1) return vec3(.5, 0, -1.6);
    
    if (i==LEFT_LEG_2) return vec3(-.3, 0, -.75);
    if (i==RIGHT_LEG_2) return vec3(.3, 0, -.75);
    
    if (i==LEFT_LEG_3) return vec3(-.12, 0, .15);
    if (i==RIGHT_LEG_3) return vec3(.1, 0, .15);
        
    if (i==HEAD) return vec3(0., 0, 1.65);
    if (i==SPINE) return vec3(0., 0, 1.1);
    
    if (i==LEFT_ARM_3) return vec3(-.3, 0, 1.15);
    if (i==RIGHT_ARM_3) return vec3(.3, 0, 1.15);
    
    if (i==LEFT_ARM_2) return vec3(-.55, 0, .7);
    if (i==RIGHT_ARM_2) return vec3(.55, 0, .7);
    
    if (i==LEFT_ARM_1) return vec3(-.75, 0, 0.2);
    if (i==RIGHT_ARM_1) return vec3(.95,0,  0.4);
    
    return vec3(0);
}

float mapBody( in vec3 pos ) {
    float r = .15;
    float s = 80.1;

    vec3 p1 = getSpherePosition(LEFT_LEG_1);
    vec3 p2 = getSpherePosition(LEFT_LEG_2);
    float d = sdCapsule(pos, p1, p2, r, r*.5);
    vec2 res = vec2(d, MAT_PAPER);

    p1 = getSpherePosition(LEFT_LEG_3);
    d = sdCapsule(pos, p1, p2, r, r*.5);
    res.x = smin(res.x, d, s);

    p1 = getSpherePosition(RIGHT_LEG_1);
    p2 = getSpherePosition(RIGHT_LEG_2);
    d = sdCapsule(pos, p1, p2, r, r*.5);
    res.x = smin(res.x, d, s);

    p1 = getSpherePosition(RIGHT_LEG_3);
    d = sdCapsule(pos, p1, p2, r, r*.5);
    res.x = smin(res.x, d, s);

    p1 = getSpherePosition(RIGHT_LEG_3);
    p2 = getSpherePosition(SPINE);
    d = sdCapsule(pos, p1, p2, r, r);
    res.x = smin(res.x, d, s);

    p1 = getSpherePosition(LEFT_LEG_3);
    d = sdCapsule(pos, p1, p2, r, r);
    res.x = smin(res.x, d, s);

    p1 = getSpherePosition(RIGHT_ARM_1);
    p2 = getSpherePosition(RIGHT_ARM_2);
    d = sdCapsule(pos, p1, p2, r*.5, r*.25);
    res.x = smin(res.x, d, s);

    p1 = getSpherePosition(RIGHT_ARM_3);
    d = sdCapsule(pos, p1, p2, r*.5, r*.25);
    res.x = smin(res.x, d, s);

    p1 = getSpherePosition(LEFT_ARM_1);
    p2 = getSpherePosition(LEFT_ARM_2);
    d = sdCapsule(pos, p1, p2, r*.5, r*.25);
    res.x = smin(res.x, d, s); 

    p1 = getSpherePosition(LEFT_ARM_3);
    d = sdCapsule(pos, p1, p2, r*.5, r*.25);
    res.x = smin(res.x, d, s);    

    return res.x;
}

vec2 drawPaper(vec2 uv) {
    float structure = 1.-texture(iChannel1, uv.yx).x;
    vec3 muv = vec3(uv.y-.5, 0., uv.x-.5)*4.;
    muv.x *= PAPER_SIZE.x / PAPER_SIZE.y;
    muv *= 2.75;
    muv.xz += vec2(.5,2.6) + .05*(texture(iChannel1, uv.yx*2.).xz-.5);
    muv.y = 0.;
    float drawing = smoothstep(.04,.03,abs(mapBody(muv))) * (.25+.75*structure);
    
    return vec2(structure, 1.-drawing);
}

bool resolutionChanged() {
    return iFrame == 0 
        || floor(texelFetch(iChannel0, ivec2(0), 0).r) != floor(iResolution.x);
}

void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
    if(resolutionChanged() && iChannelResolution[1].x > 0.) {
        vec2 uv = fragCoord / iResolution.xy;
        vec2 integratedBRDF = IntegrateBRDF(uv.y, uv.x);
        vec2 paper = drawPaper(uv);
        fragColor = vec4(integratedBRDF, paper);
        
        if (fragCoord.x < 1.5 && fragCoord.y < 1.5) {
            fragColor.xy = floor(iResolution.xy);
        }
    } else {
        fragColor = texelFetch(iChannel0, ivec2(fragCoord), 0);
    }
}`,name:`Buffer B`,description:``,type:`buffer`},{inputs:[{id:`4dXGR8`,filepath:`/media/previz/buffer00.png`,type:`buffer`,channel:0,sampler:{filter:`linear`,wrap:`clamp`,vflip:`true`,srgb:`false`,internal:`byte`},published:1}],outputs:[{id:`4sXGR8`,channel:0}],code:`// [SH18] Human Document. Created by Reinder Nijhoff 2018
// @reindernijhoff
//
// https://www.shadertoy.com/view/XtcyW4
//
//   * Created for the Shadertoy Competition 2018 *
//
// Buffer C: Additional custom animation of the bones is calculated for the start
//           and end of the loop.
//

void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
    ivec2 f = ivec2(fragCoord);
    
    if (f.x > 0 || f.y > NUM_BONES) return;
    
    initAnimation(iTime);
    
    vec3 animPos = texelFetch(iChannel0, f, 0).xyz;
    animPos.y = max(animPos.y - planeY, 1.);
    
    vec3 startPos = vec3(animPos.x,-9,animPos.z);
    
    float t = mod(offsetTime(iTime), DURATION_TOTAL);
    vec3 pos = animPos;
	
    if (t < DURATION_START + DURATION_MORPH_ANIM) {
        float tm = t-(DURATION_START-DURATION_MORPH_STILL);
        if ( tm > 0.) {
            pos = mix(startPos, animPos, smoothstep(0.,1., tm / DURATION_MORPH));
        } else {
            pos = startPos;
        }
        
        if (f.y == HEAD) {
            pos.y = max(pos.y, 1.); 
            
            float tf = max(0., (t-DURATION_START*.5))*2.;
            float atm = clamp(1.-max(0.,tf/(DURATION_START+DURATION_MORPH_ANIM)), 0., 1.);
            float maxf = 50.f * atm*atm*atm*atm;
            float freq = min(10.,1.75/(.2+atm*atm));
            float h = maxf * abs(cos(freq*tf)); 
            pos.y += h;
        }
    } else if (t > DURATION_START + DURATION_ANIM - DURATION_MORPH_ANIM) {
        float tm = t-(DURATION_START + DURATION_ANIM - DURATION_MORPH_ANIM);
        if ( tm > 0.) {
            pos = mix(startPos, animPos, smoothstep(1.,0., tm / DURATION_MORPH));
        } else {
            pos = startPos;
        }
        
        if (f.y == HEAD) {
            pos.y = max(pos.y, 1.); 
            pos.xz += max(0.,tm) * vec2(3.5,30.);
        }
    } 
    
    
    pos = pos*.11;
    pos.z -= .5;
    
    fragColor = vec4(pos, 1.);
}`,name:`Buffer C`,description:``,type:`buffer`}]},{ver:`0.1`,info:{id:`4tdcWS`,date:`1533861026`,viewed:12772,name:`[SH18] Woman`,description:`I wanted to create an organic-looking SDF scene in a single, fully procedural, fragment shader.`,likes:208,published:`Public API`,usePreview:1,tags:[`sdf`,`sh18`,`woman`]},renderpass:[{inputs:[],outputs:[{id:`4dfGRr`,channel:0}],code:`// [SH18] Woman. Created by Reinder Nijhoff 2018
// Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License.
// @reindernijhoff
//
// https://www.shadertoy.com/view/4tdcWS
//
// I wanted to create an organic-looking SDF scene in a single, fully procedural,
// fragment shader. The scene is modelled for this specific camera viewpoint and 
// lighting setup.
//
// Please change AA (line 13) to 1 if this shader is running slow.
//

#define AA 1
#define FLOOR 0.
#define BODY 1.
#define HAIR 2.

//
// Hash functions by Dave Hoskins:
//
// https://www.shadertoy.com/view/4djSRW
//

float hash12(vec2 p) {
    vec3 p3  = fract(vec3(p.xyx) * 443.8975);
    p3 += dot(p3, p3.yzx + 19.19);
    return fract((p3.x + p3.y) * p3.z);
}

vec3 hash33(vec3 p3) {
    p3 = fract(p3 * vec3(443.897, 441.423, 437.195));
    p3 += dot(p3, p3.yxz + 19.19);
    return fract((p3.xxy + p3.yxx)*p3.zyx);
}

float noise(in vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f*f*(3. -2.*f);
    
    return mix(mix(hash12(i + vec2(0, 0)), 
                   hash12(i + vec2(1, 0)), u.x), 
               mix(hash12(i + vec2(0, 1)), 
                   hash12(i + vec2(1, 1)), u.x), u.y);
}

//
// SDF framework by Inigo Quilez:
//
// https://www.shadertoy.com/view/Xds3zN
//

vec2 boxIntersect(in vec3 ro, in vec3 rd, in vec3 rad) {
    vec3 m = 1./rd;
    vec3 n = m*ro;
    vec3 k = abs(m)*rad;
    
    vec3 t1 = -n - k;
    vec3 t2 = -n + k;
    
    float tN = max(max(t1.x, t1.y), t1.z);
    float tF = min(min(t2.x, t2.y), t2.z);
    
    if(tN > tF || tF < .0) return vec2(-1);
    
    return vec2(tN, tF);
}

float smin(float a, float b, float k) {
    float h = clamp(.5 + .5*(b - a)/k, .0, 1.);
    return mix(b, a, h) - k * h * (1. - h);
}

float udRoundBox(vec3 p, vec3 b, float r) {
    return length(max(abs(p)-b, .0)) -r;
}

float sdCapsuleF(vec3 p, vec3 a, vec3 b, const float r0, const float r1, const float f) {
    vec3 d = b -a;
    float h = length(d);
    d = normalize(d);
    float t=dot(p-a, d);
    float th = t/h;
    return distance(a+clamp(t,0.,h)*d, p)-mix(r0, r1, th) * 
           max(0., 1.+f-f*4.*abs(th-.5)*abs(th -.5));
}

float sdCapsule(vec3 p, vec3 a, vec3 b, const float r0, const float r1) {
    vec3 d = b -a;
    float h = length(d);
    d = normalize(d);
    float t=clamp(dot(p-a, d), 0., h);
    return distance(a+t*d, p) -mix(r0, r1, t/h);
}

float mapHand(in vec3 p) {
    float sph = length(p) - .1;
    if (sph > .1) return sph; //  bounding sphere
    
    const float s = 1.175;
    float d = udRoundBox(p, vec3(.0175/s + p.y * (.25/s), .035/s + p.x * (.2/s), 0.), .01);
    d = smin(d, min(sdCapsule(p, vec3(.025, .0475, 0)/s, vec3(.028, .08, .02)/s, .01/s, .0075/s), 
                    sdCapsule(p, vec3(.028, .08, .02)/s, vec3(.03, 0.1, .06)/s, .0075/s, .007/s)), .0057);
    d = smin(d, min(sdCapsule(p, vec3(.01, .0425, 0)/s, vec3(.008, .07, .025)/s, .009/s, .0075/s), 
                    sdCapsule(p, vec3(.008, .07, .025)/s, vec3(.008, .085, .065)/s, .0075/s, .007/s)), .0057);
    d = smin(d, min(sdCapsule(p, vec3(-.01, .04, 0)/s, vec3(-.012, .065, .028)/s, .009/s, .0075/s), 
                    sdCapsule(p, vec3(-.012, .065, .028)/s, vec3(-.012, .07, .055)/s, .0075/s, .007/s)), .0057);
    d = smin(d, min(sdCapsule(p, vec3(-.025, .035, 0)/s, vec3(-.027, .058, .03)/s, .009/s, .0075/s), 
                    sdCapsule(p, vec3(-.027, .058, .03)/s, vec3(-.028, .06, .05)/s, .0075/s, .007/s)), .0057);
    return d;
}

vec2 map(in vec3 pos) {
    const float f0 = .075;
    const float f1 = .2;
    const float f2 = .275;
    
    vec3 ph = pos;
    
    if (pos.x < 0.) {
        ph += vec3(.11, -.135, .2);
        ph = mat3(-0.8674127459526062, -0.49060970544815063, 0.08304927498102188, 0.22917310893535614, -0.5420454144477844, -0.8084964156150818, 0.4416726529598236, -0.6822674870491028, 0.5826116800308228) * ph;
    } else {
        ph.x = -ph.x;
        ph += vec3(.075, -.09, .125);
        ph = mat3(-0.6703562140464783, -0.7417424321174622, 0.020991835743188858, 0.36215442419052124, -0.3517296612262726, -0.8632093667984009, 0.6476624608039856, -0.5710554718971252, 0.5044094920158386) * ph;
    }
    
    float dh = mapHand(ph);
    
    //  right arm
    float d = sdCapsuleF(pos, vec3(0.13, 0.535, -.036), vec3(.09, 0.292, -0.1), .035, .025, f1);
    d = smin(d, sdCapsuleF(pos, vec3(.08, 0.29, -0.1), vec3(-.09, 0.15, -0.17), .03, .02, f0), .0051);
    if (pos.x < 0.) d = smin(d, dh, .015);
    
    //  left arm
    float d1 = sdCapsuleF(pos, vec3(-0.12, 0.56, .02), vec3(-0.11, 0.325, -.045), .035, .025, f1);
    d1 = smin(d1, sdCapsuleF(pos, vec3(-0.11, 0.315, -.05), vec3(.07, .08, -0.11), .024, .022, f2), .005);
    if (pos.x > 0.) d1 = smin(d1, dh, .015);
    d = min(d1, d);
    
    //  body
    vec3 bp1 = pos;
    bp1 += vec3(0, -.44, -.027);
    bp1 = mat3(0.9761762022972107, 0.033977385610342026, 0.2143024057149887, -0.07553963363170624, 0.9790945649147034, 0.18885889649391174, -0.20340539515018463, -0.20054790377616882, 0.9583353996276855) * bp1;
    float db = udRoundBox(bp1, vec3(.07 + bp1.y*.3, 0.135 -abs(bp1.x)*0.2, 0.), .04);
    
    vec3 bp2 = pos;
    bp2 += vec3(-.032, -.235, -.06);
    bp2 = mat3(0.8958174586296082, -0.37155669927597046, 0.24383758008480072, 0.3379548490047455, 0.9258314967155457, 0.16918234527111053, -0.28861331939697266, -0.0691504031419754, 0.9549453258514404) * bp2;
    db = smin(db, udRoundBox(bp2, vec3(.065 - bp2.y*.25, 0.1, .02 -bp2.y*.13), .04), .03);
    
    db = smin(db, sdCapsule(pos, vec3(0.11, 0.5, -.032), vec3(.05, 0.52, -.015), .04, .035), .01);
    db = smin(db, sdCapsule(pos, vec3(.01, 0.4, -.01), vec3(.01, 0.7, .0), .045, .04), .02);
    
    vec3 bp3 = pos;
    bp3 += vec3(-.005, -.48, .018);
    bp3 = mat3(0.9800665974617004, 0.05107402056455612, 0.19199204444885254, 0, 0.9663899540901184, -0.2570805549621582, -0.19866932928562164, 0.2519560754299164, 0.9471265077590942) * bp3;
    db = smin(db, udRoundBox(bp3, vec3(.056 + bp3.y*.23 , .06, 0.), .04), .01);
    
    d = smin(d, db, .01);
    
    //  right leg
    float d2 = sdCapsuleF(pos, vec3(0.152, 0.15, .05), vec3(-.03, 0.43, -.08), .071, .055, f2);
    d2 = smin(d2, sdCapsuleF(pos, vec3(0.14, .08, .05), vec3(-.01, 0.23, -.02), .05, .02, f1), .075);
    d = min(d, d2);
    float d3 = sdCapsuleF(pos, vec3(-.03, 0.43, -.084), vec3(.055, .04, -.04), .053, .02, f0);
    d3 = smin(d3, sdCapsuleF(pos, vec3(-.0, 0.35, -.05), vec3(.025, 0.2, -.03), .04, .02, f2), .05);
    d = min(d, d3);
    
    //  left leg
    d = min(d, sdCapsuleF(pos, vec3(-.02, 0.12, 0.1), vec3(-0.145, .08, -0.17), .07, .055, f2));
    float d4 = sdCapsuleF(pos, vec3(-0.145, .08, -0.17), vec3(0.205, .02, -0.09), .05, .0185, f0);
    d4 = smin(d4, sdCapsuleF(pos, vec3(-.05, .085, -0.145), vec3(.05, .03, -.09), .035, .03, f2), .0075);
    
    //  right feet
    float d6 = distance(pos, vec3(.0, .0, -0.1)) -.1; //  bounding sphere
    if(d6 < 0.1) {
        d = min(d, sdCapsule(pos, vec3(.03, .03, -.08), vec3(.031, .01, -0.146), .015, .005));
        d = min(d, sdCapsule(pos, vec3(.02, .03, -.08), vec3(.018, .01, -0.1505), .015, .006));
        d = min(d, sdCapsule(pos, vec3(.00, .03, -.08), vec3(.005, .01, -0.1525), .015, .007));
        d = min(d, sdCapsule(pos, vec3(-.01, .03, -.08), vec3(-.014, .01, -0.1575), .015, .01));
    } else {
        d = min(d6, d);
    }
    
    //  left feet
    float d5 = distance(pos, vec3(0.25, .025, -0.1)) -.12; //  bounding sphere
    if(d5 < 0.1) {
        d5 = sdCapsule(pos, vec3(0.2, .035, -.075), vec3(0.3, .01, -.09), .035, .02);
        d5 = smin(d5, sdCapsule(pos, vec3(0.31, .035, -.0975), vec3(0.1, .01, -0.10), .015, .02), .02);
        d5 = smin(d5, sdCapsule(pos, vec3(0.31, .035, -.0975), vec3(0.355, .034, -0.10), .015, .01), .005);
        d5 = min(d5, sdCapsule(pos, vec3(0.31, .022, -.0875), vec3(0.335, .022, -.09), .02, .01));
    }
    d4 = smin(d4, d5, .025);
    d = min(d, d4);
    
    //  hair
    vec3 hp = pos;
    hp.x += smoothstep(.55, .45, pos.y)*.035;
    hp.z *= 1.9 - .8 * pos.y;
    hp.yz -= 2.*pos.x*pos.x;
    float h = sdCapsule(hp, vec3(.0, 0.725, -.02), vec3(-.02, 0.415, .0), .094, .085);
    h = smin(h, sdCapsule(hp, vec3(.0, 0.725, -.02), vec3(.06, 0.705, -.05), .085, .095), .02);
    h = max(-(pos.y - abs(fract(pos.x*90.) -.5)*0.1 -.14 - smoothstep(-0.2, 0.1, pos.x)*.5), h);
    
    return (h < d) ? vec2(h, HAIR) : vec2(d, BODY);
}


float calcSoftshadow(in vec3 ro, in vec3 rd, in float mint, in float tmax) {
    float res = 1.;
    float t = mint;
    for(int i=0; i<14; i++) {
        float h = map(ro + rd*t).x;
        res = min(res, 8.*h/t);
        t += max(h, .02);
        if(res<.005 || t>tmax) break;
    }
    return clamp(res,0.,1.);
}

vec3 calcNormal(in vec3 pos) {
    vec2 e = vec2(1,-1)*.00005;
    return normalize(e.xyy*map(pos + e.xyy).x +
                     e.yyx*map(pos + e.yyx).x +
                     e.yxy*map(pos + e.yxy).x +
                     e.xxx*map(pos + e.xxx).x);
}

float calcAO(in vec3 pos, in vec3 nor) {
    float occ = 0.;
    float sca = 1.;
    for(int i=0; i<5; i++) {
        float hr = .005 + .12*float(i)/4.;
        vec3 aopos =  nor * hr + pos;
        float dd = min(aopos.y, map(aopos).x);
        occ += -(dd -hr)*sca;
        sca *= .95;
    }
    return clamp(1. - 3.*occ, 0., 1.);
}

float render(in vec3 ro, in vec3 rd, in vec2 uv) {
    //  cast ray
    float planeIntersect = abs(-ro.y/rd.y);
    vec2 box = boxIntersect(ro, rd, vec3(.37, 1, .3));
    float t = box.x;
    float tmax = min(box.y, planeIntersect);
    
    float m = FLOOR;
    if (t > 0.) {
        for(int i=0; i<40; i++) {
            float precis = .0004*t;
            vec2 res = map(ro+rd*t);
            m = res.y;
            if(abs(res.x) < precis || t > tmax) break;
            t += res.x;
        }
    }
    if(t>=tmax || t<0.) {
        t = rd.y < 0. ? planeIntersect : 1000.;
        m = FLOOR;
    }
    
    //  shade scene
    float col = 0.;
    if(t < 10.) {
        vec3 pos = ro + t*rd;
        vec3 nor = vec3(0, 1, 0);
        
        if (m < FLOOR + .5) {
            col = .03;
        } else {
            col = .5;
            nor = calcNormal(pos);
        }
        if (m > BODY + .5) {
            col = 0.;
        }
        nor = normalize(nor + (hash33(pos) -.5) * .1);
        vec3 ligp = vec3(5., 5., -.5);
        vec3 lig = -normalize(pos - ligp);
        float dif = clamp(dot(nor, lig), 0., 1.);
        float bac = clamp(dot(nor, normalize(vec3(-.2, .5, -.02))), .0, 1.0)
                    *clamp(1.-pos.y,0.,1.);  
        if(m > FLOOR) bac *= clamp(-10.*pos.z+.4,0.,1.);
        
        float occ, sha;
        if (pos.x > .4 || pos.z > 1.) {
            occ = sha = 1.;
        } else {
            occ = calcAO(pos, nor);
            sha = calcSoftshadow(pos, lig, .01, 1.5);
        }
        
        col *= 1.30*dif*sha*(.25+.75*occ) + .5*bac*occ;
        
        if (m > BODY + .5) {
            // totally fake hair lighting
            vec3 ref = reflect(rd, nor);
            vec3 hal = normalize(normalize(vec3(-.1, .5, .35)) -rd);
            vec2 hv = mix(vec2(pos.x*60. -pos.z*35., 0.), 
                          vec2(-pos.x*50. -pos.z*50., 0.), 
                          smoothstep(.0, .01, -dot(pos, normalize(vec3(-1., .15, .45)))));
            float n = noise(hv*20. + vec2(2. + 10.*sin(pos.y*20.+.4), 2.5));
            n = smoothstep(.4, 1., n);
            float nd = noise(hv*40.+ vec2(2. + 10.*sin(pos.y*20.+.4), .5));
            n *= nd * nd;
            col += n * pow(max(0., dot(ref, hal)), 8.);
            col += .03 * n * max(0., dot(ref, hal)) * smoothstep(.75, .5, pos.y);
        }
        
        col *= smoothstep(.985, 1., dot(normalize(vec3(0.7, 0.58, -.05)), lig));
    }
    
    return clamp(col, 0., 1.);
}

mat3 setCamera(in vec3 ro, in vec3 ta) {
    vec3 cw = normalize(ta -ro);
    vec3 cu = normalize(cross(cw, vec3(0,1,0)));
    vec3 cv = normalize(cross(cu, cw));
    return mat3(cu, cv, cw);
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    float angle = -.18+ .18*sin(iTime*0.5);
    float tot = 0.;
    
    for(int m=0; m<AA + min(0,iFrame); m++)
        for(int n=0; n<AA + min(0,iFrame); n++) {
            vec2 o = vec2(float(m), float(n))/float(AA) - .5;
            vec2 p = (-iResolution.xy + 2.*(fragCoord+o))/iResolution.y;
            
            p.x -= .8;
            
            vec3 ro = vec3(2.9*sin(angle) , .65, -2.9*cos(angle));
            vec3 ta = vec3(0., 0.45, 0.);
            mat3 ca = setCamera(ro, ta);
            vec3 rd = ca * normalize(vec3(p.xy, 5));
            
            float col = render(ro, rd, p);
            tot += pow(col, .4545);
        }
    tot /= float(AA*AA);
    
    tot += .075 * hash12(fragCoord/iResolution.xy);
    tot *= 1.35;
    
    fragColor = vec4(min(tot*vec3(1, .97, .92), 1.), 1.);
}

void mainVR( out vec4 fragColor, in vec2 fragCoord, in vec3 ro, in vec3 rd ) {
    vec2 p = (-iResolution.xy + 2.*fragCoord)/iResolution.y;
    float c = pow(render(ro + vec3(0,.65,-1), rd, p), .4545);
    fragColor = vec4(c,c,c,1.);
}`,name:`Image`,description:``,type:`image`}]},{ver:`0.1`,info:{id:`llcyD2`,date:`1534089156`,viewed:25034,name:`A quine`,description:`This is [url=https://www.shadertoy.com/view/Ml3SWj]done[/url] [url=https://www.shadertoy.com/view/Mlj3zR]before[/url] and my code is not the most [url=https://www.shadertoy.com/view/MlGcRz]optimised[/url], but it is nice to write your own quine!`,likes:162,published:`Public API`,usePreview:0,tags:[`text`,`font`,`quine`]},renderpass:[{inputs:[],outputs:[{id:`4dfGRr`,channel:0}],code:`int y;ivec2 d;uint[] c = uint[ 151](0x007a995eu,0x0083f840u,0x009a9c40u,0x006e5840u,0x0043f4dcu,    
0x006659c0u,0x0066595eu,0x000c5661u,0x006a595au,0x007a9a66u,0x00f14938u,0x0062493fu,0x00924918u,    
0x00fe4918u,0x00a2cb18u,0x00145f84u,0x3813813cu,0x0003d100u,0x0087f840u,0x0066bb5au,0x0085e000u,    
0x00330604u,0x00010800u,0x00020000u,0x00624918u,0x00f2081cu,0x00024784u,0x0001e840u,0x0085e100u,    
0x000047a1u,0x00014800u,0x00894200u,0x00214880u,0x0023e208u,0x00008208u,0x00f2081cu,0x00024784u,    
0x0087f000u,0x0003f840u,0x00918624u,0x000ccc00u,0x00916724u,0x00a3b9d8u,0x00514514u,0x00310a24u,    
0x00e0423cu,0x001a9080u,0x00024000u,0x00c766e3u,0x00c8d17fu,0x0052ca00u,0x0083f040u,0x0003f000u,    
0x0000413cu,0x00000000u,0x00000000u,0x2cd9ab51u,0x0c39545eu,0x1978dd82u,0x2695ab51u,0x36af6336u,    
0x256ad459u,0x26045076u,0xfefbefd4u,0x2d45979bu,0x1950ed9au,0x0bd9ab51u,0x1a3b571bu,0x0cdadd59u,    
0x208262e5u,0x299d7354u,0x2c5cd846u,0x019c0a9bu,0x1165d799u,0x145766adu,0x0ad9ab51u,0x366ad456u,    
0x1ab5158bu,0x1171b3f6u,0x2b4766adu,0x3678a8acu,0x3565a3b5u,0x007d1dadu,0x0b811d34u,0x1902702eu,    
0x253143afu,0x0f845a11u,0x30460826u,0x00a86a45u,0x1b64f0e7u,0x2d45975eu,0x1b52dd9au,0x366ad45cu,    
0x038acad1u,0x11ad8586u,0x35782070u,0x2dd5968eu,0x3401f476u,0x01811db4u,0x00b80048u,0x18bd9027u,    
0x0eb80aebu,0x19027014u,0x2bad8bdbu,0x0050eb81u,0x1b6470a7u,0x01aeb62fu,0x0050eb80u,0x1b6430a7u,    
0x01aeb62fu,0x0050eb81u,0x1b646067u,0x253143afu,0x26081a11u,0x14da0836u,0x1b622254u,0x2ad9b129u,    
0x1b64f9c0u,0x1161575eu,0x11290d8du,0x132904adu,0x1a65850eu,0x0430e576u,0x0e5562b6u,0x1b2f608cu,    
0x2bb172dcu,0x18c8ec51u,0x1845a673u,0x0b8ac5edu,0x2b35eb17u,0x0230e551u,0x2c79b2d4u,0x289d736bu,    
0x17354845u,0x296c8a2cu,0x3035e189u,0x0c39546bu,0x08585502u,0x15aca79bu,0x0d50430eu,0x34160b17u,    
0x209d72f4u,0x2e5c0204u,0x2f6409c0u,0x03580515u,0x1b185585u,0x216d4b61u,0x04201515u,0x010c4587u,    
0x1b6c4196u,0xfefbf75eu);uint e(uint b){return c[b]>>(d.x*6+d.y)&0x1u;}uint v(int a,int b,int f)
{int i=y-a; return i<0||i>b?0x0u:e(c[i/5+f]>>i%5*6&0x3fu);}uint n(){int i=y-36,o=i%12;return i<0
|| i>1810?0x0u:o==0?e(0x0u):o==1?e(0x27u):o==10?e(0x23u):o==11?e(0x16u):e(c[i/12] >> ((9-o)*4) &
0xfu);}void mainImage(out vec4 a,vec2 b){b.y=iResolution.y-b.y;d=ivec2(b);y=d.x/5+(d.y/8)*96;d%=
ivec2(5,8);a=vec4(d.y>5||b.x>480.?0x0u:v(0,35,56)+n()+v(1847,431,64));}`,name:`Image`,description:``,type:`image`}]},{ver:`0.1`,info:{id:`MlGcRz`,date:`1534834871`,viewed:4199,name:`A smaller quine`,description:`Same strategy as [url=https://www.shadertoy.com/view/llcyD2]"A quine"[/url], but I have focused more on code size.`,likes:49,published:`Public API`,usePreview:0,tags:[`text`,`font`,`quine`]},renderpass:[{inputs:[],outputs:[{id:`4dfGRr`,channel:0}],code:`int y, i;ivec2 d;int[]c=int[116](0x007a995e,0x0083f840,0x009a9c40,0x006e5840,
0x0043f4dc,0x006659c0,0x0066595e,0x000c5661,0x006a595a,0x007a9a66,0x00f14938,
0x0062493f,0x00924918,0x00fe4918,0x00a2cb18,0x00145f84,0x3813813c,0x0003d100,
0x0087f840,0x0066bb5a,0x0085e000,0x00330604,0x00010800,0x00020000,0x00624918,
0x00f2081c,0x00024784,0x0001e840,0x0085e100,0x000047a1,0x00014800,0x00894200,
0x00214880,0x0023e208,0x00008208,0x00f2081c,0x00024784,0x0087f000,0x0003f840,
0x00918624,0x000ccc00,0x00916724,0x00a3b9d8,0x00514514,0x00310a24,0x00e0423c,
0x001a9080,0x00024000,0x00c766e3,0x00c8d17f,0x0052ca00,0x0083f040,0x0003f000,
0x0000413c,0x00000000,0x2cd9ab51,0x11791d96,0x3608c395,0x1ab5178d,0x11acc9a5,
0x010656ad,0xfefd4986,0x1161579b,0x11290d8d,0x132904ad,0x1a65850e,0x0430e576,
0x0e5562b6,0x1b2f608c,0x1546b35c,0x0b50230e,0x314569d7,0x19cd8c8e,0x17b5845a,
0x2c5cb8ac,0x0daec79b,0x211689d7,0x08a2c5cd,0x0d5871e9,0x0e551af0,0x1615408c,
0x2b29e6c8,0x1410c395,0x0582c5cd,0x275cbd34,0x171480e0,0x0182cd34,0x00b841c5,
0x1fb2532f,0x2532e0c3,0x05845a2c,0x2c820985,0x2a1a9170,0x20b2f0c6,0x2e1c00c1,
0x2b45494c,0x000c18ac,0x211686c8,0x20826086,0x06a45c11,0x14bc31aa,0x2b454aec,
0x1b0c38ac,0x2b6c1070,0x2f02e02b,0x2e06baec,0x2bb2f243,0x02b8006b,0x1194cbc2,
0x20981068,0x2c8860e0,0x0506a129,0x17360826,0x0d846a67,0x1b06ab17,0xfefbf75e)
;void mainImage(out vec4 a,vec2 b){d=ivec2(b.x,iResolution.y-b.y);y=d.x/5+d.y
/8*77,d%=ivec2(5,8);a=vec4(d.y>5||b.x>385.||y>1574?0:c[y<33?c[y/5+55]>>y%5*6&
63:y>1307?c[(i=y-1308)/5+62]>>i%5*6&63:(y=(i=y-33)%11)==0?0:y==1?39:y==10?22:
c[i/11]>>36-y*4&15]>>d.x*6+d.y&1);}`,name:`Image`,description:``,type:`image`}]},{ver:`0.1`,info:{id:`MlyyzW`,date:`1535275805`,viewed:6586,name:`Old watch (RT)`,description:`A simple path tracer is used to render the watch from my image based lighting shader "Old watch (IBL)". [url=https://www.shadertoy.com/view/lscBW4]Click here to compare[/url].

! Use your mouse to change the camera viewpoint.`,likes:53,published:`Public API`,usePreview:0,tags:[`ray`,`tracer`,`path`,`pbr`]},renderpass:[{inputs:[{id:`XsXGR8`,filepath:`/media/previz/buffer01.png`,type:`buffer`,channel:0,sampler:{filter:`linear`,wrap:`clamp`,vflip:`true`,srgb:`false`,internal:`byte`},published:1}],outputs:[{id:`4dfGRr`,channel:0}],code:`// Old watch (RT). Created by Reinder Nijhoff 2018
// Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License.
// @reindernijhoff
//
// https://www.shadertoy.com/view/MlyyzW
//
// A simple path tracer is used to render an old watch. The old watch scene is
// (almost) the same scene as rendered using image based lighting in my shader "Old
// watch (IBL)":
// 
// https://www.shadertoy.com/view/lscBW4
//
// You can find the path tracer in Buffer B. I'm no expert in ray or path tracing so
// there are probably a lot of errors in this code.
//
// Use your mouse to change the camera viewpoint.
//

void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
    vec4 data = texelFetch(iChannel0, ivec2(fragCoord), 0);
    vec3 col = data.rgb / data.w;
    
    // gamma correction
    col = max( vec3(0), col - 0.004);
    col = (col*(6.2*col + .5)) / (col*(6.2*col+1.7) + 0.06);
    
    // Output to screen
    fragColor = vec4(col,1.0);
}`,name:`Image`,description:``,type:`image`},{inputs:[],outputs:[],code:`// Old watch (RT). Created by Reinder Nijhoff 2018
// @reindernijhoff
//
// https://www.shadertoy.com/view/MlyyzW
//
// I have moved all ray-march code to this tab, in order to keep the RT-code in Buffer B 
// more readable. The physically-based properties of the materials are also defined here.
//
// The hash functions are copy-paste from "Quality hashes collection WebGL2" by Nimitz:
// https://www.shadertoy.com/view/Xt3cDn
//
// All (signed) distance field (SDF) code is copy-paste from the excellent framework by 
// Inigo Quilez:
//
// https://www.shadertoy.com/view/Xds3zN
//
// More info here: https://iquilezles.org/articles/distfunctions
//

#define MAT_TABLE    1.
#define MAT_PENCIL_0 2.
#define MAT_PENCIL_1 3.
#define MAT_PENCIL_2 4.
#define MAT_DIAL     5.
#define MAT_HAND     6.
#define MAT_METAL_0  7.
#define MAT_METAL_1  8.

#define CLOCK_ROT_X -0.26
#define CLOCK_ROT_Y 0.2
#define CLOCK_OFFSET_Y 0.42
#define PENCIL_POS vec3(-0.31,-0.2, -.725)

float TIME = 11344.;
#define MAX_T 10.

//
// Hash functions by Nimitz:
// https://www.shadertoy.com/view/Xt3cDn
//

uint baseHash(uvec2 p) {
    p = 1103515245U*((p >> 1U)^(p.yx));
    uint h32 = 1103515245U*((p.x)^(p.y>>3U));
    return h32^(h32 >> 16);
}

float hash1(inout float seed) {
    uint n = baseHash(floatBitsToUint(vec2(seed+=.1,seed+=.1)));
    return float(n)/float(0xffffffffU);
}

vec2 hash2(inout float seed) {
    uint n = baseHash(floatBitsToUint(vec2(seed+=.1,seed+=.1)));
    uvec2 rz = uvec2(n, n*48271U);
    return vec2(rz.xy & uvec2(0x7fffffffU))/float(0x7fffffff);
}

vec3 hash3(inout float seed) {
    uint n = baseHash(floatBitsToUint(vec2(seed+=.1,seed+=.1)));
    uvec3 rz = uvec3(n, n*16807U, n*48271U);
    return vec3(rz & uvec3(0x7fffffffU))/float(0x7fffffff);
}

//
// SDF functions (by Inigo Quilez).
//

float sdPlane( const vec3 p ) {
	return p.y;
}

float sdTorus( const vec3 p, const vec2 t ) {
  vec2 q = vec2(length(p.xz)-t.x,p.y);
  return length(q)-t.y;
}

float sdTorusYZ( const vec3 p, const vec2 t ) {
  vec2 q = vec2(length(p.yz)-t.x,p.x);
  return length(q)-t.y;
}

float sdTorusYX( const vec3 p, const vec2 t ) {
  vec2 q = vec2(length(p.yx)-t.x,p.z);
  return length(q)-t.y;
}

float sdCylinder( const vec3 p, const vec2 h ) {
  vec2 d = abs(vec2(length(p.xz),p.y)) - h;
  return min(max(d.x,d.y),0.0) + length(max(d,0.0));
}

float sdCylinderZY( const vec3 p, const vec2 h ) {
  vec2 d = abs(vec2(length(p.zy),p.x)) - h;
  return min(max(d.x,d.y),0.0) + length(max(d,0.0));
}

float sdCylinderXY( const vec3 p, const vec2 h ) {
  vec2 d = abs(vec2(length(p.xy),p.z)) - h;
  return min(max(d.x,d.y),0.0) + length(max(d,0.0));
}


float sdHexPrism( const vec3 p, const vec2 h ) {
    vec3 q = abs(p);
#if 0
    return max(q.x-h.y,max((q.z*0.866025+q.y*0.5),q.y)-h.x);
#else
    float d1 = q.x-h.y;
    float d2 = max((q.z*0.866025+q.y*0.5),q.y)-h.x;
    return length(max(vec2(d1,d2),0.0)) + min(max(d1,d2), 0.);
#endif
}

float sdEllipsoid( const vec3 p, const vec3 r ) {
    return (length( p/r ) - 1.0) * min(min(r.x,r.y),r.z);
}

float sdCapsule( const vec3 p, const vec3 a, const vec3 b, const float r ) {
	vec3 pa = p-a, ba = b-a;
	float h = clamp( dot(pa,ba)/dot(ba,ba), 0.0, 1.0 );
	return length( pa - ba*h ) - r;
}

float sdSphere( const vec3 p, const float r ) {
    return length(p) - r;
}

float sdCone( const vec3 p, const vec2 c ) {
    float q = length(p.yz);
    return dot(c,vec2(q,p.x));
}

float sdSegment2D( const vec2 p, const vec2 a, const vec2 b, const float w ) {
	vec2 pa = p-a, ba = b-a;
	float h = clamp( dot(pa,ba)/dot(ba,ba), 0.0, 1.0 );
	return length( pa - ba*h ) - w;
}

float opS( const float d1, const float d2 ) {
    return max(-d1,d2);
}

float opU( const float d1, const float d2 ) {
    return min(d1,d2);
}

vec3 rotateX( in vec3 p, const float t ) {
    float co = cos(t);
    float si = sin(t);
    p.yz = mat2(co,-si,si,co)*p.yz;
    return p;
}

vec3 rotateY( in vec3 p, const float t ) {
    float co = cos(t);
    float si = sin(t);
    p.xz = mat2(co,-si,si,co)*p.xz;
    return p;
}

vec3 rotateZ( in vec3 p, const float t ) {
    float co = cos(t);
    float si = sin(t);
    p.xy = mat2(co,-si,si,co)*p.xy;
    return p;
}

vec2 rotate( in vec2 p, const float t ) {
    float co = cos(t);
    float si = sin(t);
    p = mat2(co,-si,si,co) * p;
    return p;
}

//
// SDF of the scene.
//

float mapHand( const vec3 pos, const float w, const float l, const float r ) {
    float d = sdSegment2D(pos.xz, vec2(0,-w*10.), vec2(0,l), w);
    d = min(d, length(pos.xz) - (.03+r));
    return max(d, abs(pos.y)-.005);
}

vec2 map( in vec3 pos, in vec3 p1, in vec3 ps, in vec3 pm, in vec3 ph, 
         const bool watchIntersect, const bool pencilIntersect ) {
    //--- table
    vec2 res = vec2(sdPlane(pos), MAT_TABLE);
    
    // chain
    if (pos.z > 1.1) {
        float h = smoothstep(3., -.4, pos.z)*.74 + .045;
        float dChain0 = length(pos.xy+vec2(.3*sin(pos.z), -h))-.1;
        if (dChain0 < 0.1) {
            dChain0 = 10.;
            float pth1z = floor(pos.z*5.);
            if (pth1z > 5.) {
            	float pth21 = floor(pos.z*5.);
	            float pth1 = hash1(pth21);
    	        vec3 pt1 = vec3(pos.x + .3*sin(pos.z)- pth1 *.02 + 0.02, pos.y-h - pth1 *.03, mod(pos.z, .2) - .1);
        	    pt1 = rotateZ(pt1, .6 * smoothstep(2.,3., pos.z));
            	dChain0 = sdTorus(pt1, vec2(.071, .02)); 
            }
            
            float pth2z = floor(pos.z*5. + .5);
            float pth2 = hash1(pth2z); 
            vec3 pt2 = vec3(pos.x + .3*sin(pos.z)- pth2 *.02 + 0.02, pos.y-h - pth2 *.03, mod(pos.z + .1, .2) - .1);
            pt2 = rotateZ(pt2, 1.1 * smoothstep(2.,3., pos.z));
            dChain0 = opU(dChain0, sdTorusYZ(pt2, vec2(.071, .02)));          
        }
        if (dChain0 < res.x) res = vec2(dChain0, MAT_METAL_1);
    }
    //--- pencil
    if (pencilIntersect) {
        float dPencil0 = sdHexPrism(pos + PENCIL_POS, vec2(.2, 2.));
        dPencil0 = opS(-sdCone(pos + (PENCIL_POS + vec3(-2.05,0,0)), vec2(.95,0.3122)),dPencil0);
        dPencil0 = opS(sdSphere(pos + (PENCIL_POS + vec3(-2.4,-2.82,-1.03)), 3.), dPencil0);
        dPencil0 = opS(sdSphere(pos + (PENCIL_POS + vec3(-2.5,-0.82,2.86)), 3.), dPencil0);
        if (dPencil0 < res.x) res = vec2(dPencil0, MAT_PENCIL_0);

        float dPencil1 = sdCapsule(pos, -PENCIL_POS - vec3(2.2,0.,0.), -PENCIL_POS-vec3(2.55, 0., 0.), .21);
        if (dPencil1 < res.x) res = vec2(dPencil1, MAT_PENCIL_1);
        float ax = abs(-2.25 - pos.x - PENCIL_POS.x);
        float r = .02*abs(2.*fract(30.*pos.x)-1.)*smoothstep(.08,.09,ax)*smoothstep(.21,.2,ax);

        float dPencil2 = sdCylinderZY(pos + PENCIL_POS + vec3(2.25,-0.0125,0), vec2(.22 - r,.25));
        if (dPencil2 < res.x) res = vec2(dPencil2, MAT_PENCIL_2);
    }
    
    //--- watch
    if (watchIntersect) {
        float dDial = sdCylinder(p1, vec2(1.05,.13));
        if (dDial < res.x) res = vec2(dDial, MAT_DIAL);

        float dC = sdTorusYX(vec3(max(abs(p1.x)-.5*p1.y-0.19,0.),p1.y+0.12,p1.z-1.18), vec2(0.11,0.02));
        if (dC < res.x) res = vec2(dC, MAT_METAL_1);
        
        float dM = sdTorus(p1 + vec3(0,-.165,0), vec2(1.005,.026));   
        float bb = sdCylinderXY(p1+vec3(0,0,-1.3), vec2(0.15,0.04));
        if(bb < 0.5) {
            float a = atan(p1.y, p1.x);
            float c = abs(fract(a*3.1415)-.5);
            float d = min(abs(p1.z-1.3), .02);
            bb = sdCylinderXY(p1+vec3(0,0,-1.3), vec2(0.15 - 40.*d*d - .1*c*c,0.04));
        } 
        dM = opU(dM, bb);
         
        dM = opU(dM, sdCylinderZY(p1+vec3(0,0,-1.18), vec2(0.06,0.2)));
        float rr = min(abs(p1.z-1.26), .2);
        dM = opU(dM, sdCylinderXY(p1+vec3(0,0,-1.2), vec2(0.025 + 0.35*rr,0.1)));
       
        p1.y = abs(p1.y);
        dM = opU(dM, sdTorus(p1 + vec3(0,-.1,0), vec2(1.025,.075)));
        dM = opU(dM, sdCylinder(p1, vec2(1.1,.1)));
        dM = opS(sdTorus(p1 + vec3(0,-.1,0), vec2(1.11,.015)), dM);
        dM = opU(dM, sdCylinder(p1, vec2(0.01,0.175)));
        dM = opU(dM, sdCylinder(p1+vec3(0,0,.6), vec2(0.01,0.155)));
        if (dM < res.x) res = vec2(dM, MAT_METAL_0);

        // minutes hand
        float dMin = mapHand(pm + vec3(0,-.16,0), .02, 0.7, 0.015);
        if (dMin < res.x) res = vec2(dMin, MAT_HAND);
        // hours hand
        float dHour = mapHand(ph + vec3(0,-.15,0), .02, 0.4, 0.03);
        if (dHour < res.x) res = vec2(dHour, MAT_HAND);
        // seconds hand
        float dSeconds = mapHand(ps + vec3(0,-.14,0), .01, 0.17, 0.006);
        if (dSeconds < res.x) res = vec2(dSeconds, MAT_HAND);
    }
    
    return res;
}

vec2 map( in vec3 pos ) {
    vec3 p1 = rotateX( pos + vec3(0,-CLOCK_OFFSET_Y,0), CLOCK_ROT_X );
    p1 = rotateY( p1, CLOCK_ROT_Y );
    
	float secs = mod( floor(TIME),        60.0 );
	float mins = mod( floor(TIME/60.0),   60.0 );
	float hors = mod( floor(TIME/3600.0), 24.0 ) + mins/60.;
    
    vec3 ps = rotateY( p1+vec3(0,0,.6), 6.2831*secs/60.0 );
    vec3 pm = rotateY( p1, 6.2831*mins/60.0 );
    vec3 ph = rotateY( p1, 6.2831*hors/12.0 );
    
    return map( pos, p1, ps, pm, ph, true, true );
}

float mapGlass( in vec3 pos ) {
    return sdEllipsoid( pos - vec3(0,.10,0), vec3(1.,.2,1.) );
}

//
// Ray march code.
//

vec2 sphIntersect( in vec3 ro, in vec3 rd, in float r ) {
	vec3 oc = ro;
	float b = dot( oc, rd );
	float c = dot( oc, oc ) - r * r;
	float h = b*b - c;
	if( h<0.0 ) return vec2(-1.0);
    h = sqrt( h );
	return vec2(-b - h, -b + h);
}

bool boxIntserct( in vec3 ro, in vec3 rd, in vec3 rad ) {
    vec3 m = 1.0/rd;
    vec3 n = m*ro;
    vec3 k = abs(m)*rad;
	
    vec3 t1 = -n - k;
    vec3 t2 = -n + k;

	float tN = max( max( t1.x, t1.y ), t1.z );
	float tF = min( min( t2.x, t2.y ), t2.z );
	
	if( tN > tF || tF < 0.0) return false;

	return true;
}

vec3 calcNormal( in vec3 pos ) {
    const vec2 e = vec2(1.0,-1.0)*0.0075;
    return normalize( e.xyy*map( pos + e.xyy ).x + 
					  e.yyx*map( pos + e.yyx ).x + 
					  e.yxy*map( pos + e.yxy ).x + 
					  e.xxx*map( pos + e.xxx ).x );
}

vec2 castRay( in vec3 ro, in vec3 rd ) {
    float tmin = 0.001;
    float tmax = MAX_T;
    
    // bounding volume
    const float top = 0.95;
    float tp1 = (0.0-ro.y)/rd.y; if( tp1>0.0 ) tmax = min( tmax, tp1 );
    float tp2 = (top-ro.y)/rd.y; if( tp2>0.0 ) { if( ro.y>top ) tmin = max( tmin, tp2 );
                                                 else           tmax = min( tmax, tp2 ); }
    
    float t = tmin;
    float mat = -1.;
    
    vec3 p1 = rotateX( ro + vec3(0,-CLOCK_OFFSET_Y,0), CLOCK_ROT_X );
    p1 = rotateY( p1, CLOCK_ROT_Y );
    vec3 rd1 = rotateX( rd, CLOCK_ROT_X );
    rd1 = rotateY( rd1, CLOCK_ROT_Y );
    
	float secs = mod( floor(TIME),        60.0 );
	float mins = mod( floor(TIME/60.0),   60.0 );
	float hors = mod( floor(TIME/3600.0), 24.0 ) + mins/60.;
    
    vec3 ps = rotateY( p1+vec3(0,0,.6), 6.2831*secs/60.0 );
    vec3 rds = rotateY( rd1, 6.2831*secs/60.0 );
    
    vec3 pm = rotateY( p1, 6.2831*mins/60.0 );
    vec3 rdm = rotateY( rd1, 6.2831*mins/60.0 );
    
    vec3 ph = rotateY( p1, 6.2831*hors/12.0 );
    vec3 rdh = rotateY( rd1, 6.2831*hors/12.0 );
    
    bool watchIntersect = boxIntserct(p1, rd1, vec3(1.1,.2,1.4));
    bool pencilIntersect = boxIntserct(ro + PENCIL_POS, rd, vec3(3.,.23,.23));
    
    for( int i=0; i<64; i++ ) {
	    float precis = 0.00001;
	    vec2 res = map( ro+rd*t, p1+rd1*t, ps+rds*t, pm+rdm*t, ph+rdh*t, 
                       watchIntersect, pencilIntersect );
        if( abs(res.x)<precis || t>tmax ) break; //return vec2(t, mat);
        t += res.x;
        mat = res.y;
    }

    if( t>tmax ) t=-1.0;
    return vec2(t, mat);
}

vec3 calcNormalGlass( in vec3 pos ) {
    const vec2 e = vec2(1.0,-1.0)*0.005;
    return normalize( e.xyy*mapGlass( pos + e.xyy ) + 
					  e.yyx*mapGlass( pos + e.yyx ) + 
					  e.yxy*mapGlass( pos + e.yxy ) + 
					  e.xxx*mapGlass( pos + e.xxx ) );
}

float castRayGlass( in vec3 ro, in vec3 rd ) {
    vec3 p1 = rotateX( ro + vec3(0,-CLOCK_OFFSET_Y,0), CLOCK_ROT_X );
    p1 = rotateY( p1, CLOCK_ROT_Y );
    vec3 rd1 = rotateX( rd, CLOCK_ROT_X );
    rd1 = rotateY( rd1, CLOCK_ROT_Y );

    float t = -1.;
    vec2 bb = sphIntersect( p1- vec3(0,.10,0), rd1, 1.);
    if (bb.y > 0.) {
        t = max(bb.x, 0.);
        float tmax = bb.y;
        for( int i=0; i<32; i++ ) {
            float precis = 0.0001;
            float res = mapGlass( p1+rd1*t );
            if( abs(res)<precis || t>tmax ) break; 
            t += res;
        }

        if( t>tmax ) t=-1.0;
    }
    return t;
}


//
// Material properties.
//

vec4 texNoise( sampler2D sam, in vec3 p, in vec3 n ) {
	vec4 x = texture( sam, p.yz );
	vec4 y = texture( sam, p.zx );
	vec4 z = texture( sam, p.xy );

	return x*abs(n.x) + y*abs(n.y) + z*abs(n.z);
}

void getMaterialProperties(
    in vec3 pos, in float mat,
    inout vec3 normal, inout vec3 albedo, inout float roughness, inout float metallic,
	sampler2D tex1, sampler2D tex2, sampler2D tex3) {
    
    vec3 pinv = rotateX( pos + vec3(0,-CLOCK_OFFSET_Y,0), CLOCK_ROT_X );
    pinv = rotateY( pinv, CLOCK_ROT_Y );
    
    normal = calcNormal( pos );
    metallic = 0.;
    
    vec4 noise = texNoise(tex1, pinv * .5, normal);
    float metalnoise = 1.- noise.r;
    metalnoise*=metalnoise;

    mat -= .5;
    if (mat < MAT_TABLE) {
        albedo = .7 * pow(texture(tex1, rotate(pos.xz * .4 + .25, -.3)).rgb, 2.2*vec3(0.45,0.5,0.5));
        roughness = 0.9 - albedo.r * .6;
        normal = vec3(0,1,0);
    }
    else if( mat < MAT_PENCIL_0 ) {
        vec2 npos = pos.yz + PENCIL_POS.yz;
        if (length(npos) < 0.055) {
        	albedo = vec3(0.02);
        	roughness = .9;
        } else if(sdHexPrism(pos + PENCIL_POS, vec2(.195, 3.)) < 0.) {
        	albedo = .8* texture(tex1, pos.xz).rgb;
        	roughness = 0.99;
        } else {
        	albedo = .5*pow(vec3(1.,.8,.15), vec3(2.2));
        	roughness = .85 - noise.b * .4;
        }
        albedo *= noise.g * .75 + .7;
    }
    else if( mat < MAT_PENCIL_1 ) {
       	albedo = .4*pow(vec3(.85,.75,.55), vec3(2.2));
       	roughness = 1.;
    }
    else if( mat < MAT_PENCIL_2 ) {
        float ax = abs(-2.25 - pos.x - PENCIL_POS.x);
        float r = 1. - abs(2.*fract(30.*pos.x)-1.)*smoothstep(.08,.09,ax)*smoothstep(.21,.2,ax);

        r -= 4. * metalnoise;  
	    albedo = mix(.5*vec3(0.5, 0.3, 0.2),vec3(0.560, 0.570, 0.580), (.5 + .5 * r) * (.5 + .5 * r)); // Iron
   		roughness = .8-.5*r;
   		metallic = 1.; 
    }
    else if( mat < MAT_DIAL ) {
        float dial = texture(tex2, vec2(-.5 * pinv.x + .5, +.5 * pinv.z + .5)).r;
        albedo = vec3(dial);
        roughness = dial + .95;
    }
    else if( mat < MAT_HAND ) {
        albedo = vec3(0.02);
        roughness = .8;
    }
    else if( mat < MAT_METAL_0 ) {
	    albedo = vec3(1.000, 0.766, 0.336); // Gold
   		roughness = .5;
   		metallic = 1.; 
    } 
    else if( mat < MAT_METAL_1 ) {
	    albedo = vec3(0.972, 0.960, 0.915); // Silver
   		roughness = .5 + max(.15 * length(pos.xz)-.3, 0.); // prevent aliasing
   		metallic = 1.; 
    }
    
    if (metallic > .5) {   
        roughness += metalnoise*4.;
        albedo *= max(.2, 1.-roughness * .6);
    }
    
    roughness = clamp(roughness, 0.01, 1.);
    albedo = clamp(albedo, vec3(0.01), vec3(1.));
}

mat3 setCamera( in vec3 ro, in vec3 ta ) {
	vec3 cw = normalize(ta-ro);
	vec3 cp = vec3(0.0, 1.0,0.0);
	vec3 cu = normalize( cross(cw,cp) );
	vec3 cv = normalize( cross(cu,cw) );
    return mat3( cu, cv, cw );
}
`,name:`Common`,description:``,type:`common`},{inputs:[{id:`Xsf3Rr`,filepath:`/media/a/79520a3d3a0f4d3caa440802ef4362e99d54e12b1392973e4ea321840970a88a.jpg`,type:`texture`,channel:2,sampler:{filter:`mipmap`,wrap:`repeat`,vflip:`true`,srgb:`false`,internal:`byte`},published:1},{id:`4dXGzr`,filepath:`/media/a/08b42b43ae9d3c0605da11d0eac86618ea888e62cdd9518ee8b9097488b31560.png`,type:`texture`,channel:1,sampler:{filter:`mipmap`,wrap:`repeat`,vflip:`true`,srgb:`false`,internal:`byte`},published:1},{id:`4dXGR8`,filepath:`/media/previz/buffer00.png`,type:`buffer`,channel:0,sampler:{filter:`linear`,wrap:`clamp`,vflip:`true`,srgb:`false`,internal:`byte`},published:1}],outputs:[{id:`4dXGR8`,channel:0}],code:`// Old watch (RT). Created by Reinder Nijhoff 2018
// @reindernijhoff
//
// https://www.shadertoy.com/view/MlyyzW
//
// In this buffer the albedo of the dial (red channel) and the roughness
// of the glass (green channel) is pre-calculated.
//

bool resolutionChanged() {
    return floor(texelFetch(iChannel0, ivec2(0), 0).r) != floor(iResolution.x);
}

float printChar(vec2 uv, uint char) {
    float d = textureLod(iChannel1, (uv + vec2( char & 0xFU, 0xFU - (char >> 4))) / 16.,0.).a;
	return smoothstep(1.,0., smoothstep(.5,.51,d));
}

float dialSub( in vec2 uv, float wr ) {
    float r = length( uv );
    float a = atan( uv.y, uv.x )+3.1415926;

    float f = abs(2.0*fract(0.5+a*60.0/6.2831)-1.0);
    float g = 1.0-smoothstep( 0.0, 0.1, abs(2.0*fract(0.5+a*12.0/6.2831)-1.0) );
    float w = fwidth(f);
    f = 1.0 - smoothstep( 0.2*g+0.05-w, 0.2*g+0.05+w, f );
    float s = abs(fwidth(r));
    f *= smoothstep( 0.9 - wr -s, 0.9 - wr, r ) - smoothstep( 0.9, 0.9+s, r );
    float hwr = wr * .5;
    f -= 1.-smoothstep(hwr+s,hwr,abs(r-0.9+hwr)) - smoothstep(hwr-s,hwr,abs(r-0.9+hwr));

    return .1 + .8 * clamp(1.-f,0.,1.);
}

float dial(vec2 uv) {
    float d = dialSub(uv, 0.05);

    vec2 uvs = uv;
    
    uvs.y += 0.6;
    uvs *= 1./(0.85-0.6);

    d = min(d, dialSub(uvs, 0.1));
    
    vec2 center = vec2(0.5);
    vec2 radius = vec2(3.65, 0.);
    
    for (int i=0; i<9; i++) {
        if(i!=5) {
	        float a = 6.28318530718 * float(i+4)/12.;
    	    vec2 uvt = clamp(uv * 5. + center + rotate(radius, a), vec2(0), vec2(1));
        	d = mix(d, 0.3, printChar(uvt, uint(49+i)));
        }
    }
    for (int i=0; i<3; i++) {
	    float a = 6.28318530718 * float(i+13)/12.;
    	vec2 uvt1 = clamp(uv * 5. + center + rotate(radius, a) + vec2(.25,0.), vec2(0), vec2(1));
        d = mix(d, 0.3, printChar(uvt1, uint(49)));
    	vec2 uvt = clamp(uv * 5. + center + rotate(radius, a)+ vec2(-.15,0.), vec2(0), vec2(1));
        d = mix(d, 0.3, printChar(uvt, uint(48+i)));
    }
    
    d *= .9 + .25*texture(iChannel2, uv*.5+.5).r;
    
    return pow(clamp(d, 0., 1.), 2.2);
}

float roughnessGlass(vec2 uv) {
    uv = uv * .5 + .5;
    return smoothstep(0.2, 0.8, texture(iChannel2, uv * .3).r) * .4 + .2;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord ) {   
    if(resolutionChanged() && iChannelResolution[1].x > 0.  && iChannelResolution[2].x > 0.) {
        if (fragCoord.x < 1.5 && fragCoord.y < 1.5) {
            fragColor = vec4(floor(iResolution.xyx), mod(iDate.w, 12.*60.*60.));
        } else {
            vec2 uv = (2.0*fragCoord.xy-iResolution.xy)/iResolution.xy;

            fragColor = vec4( dial(uv), roughnessGlass(uv), 0., 1.0 );      
        }
    } else {
        fragColor = texelFetch(iChannel0, ivec2(fragCoord), 0);
    }
}`,name:`Buffer A`,description:``,type:`buffer`},{inputs:[{id:`XsfGRn`,filepath:`/media/a/1f7dca9c22f324751f2a5a59c9b181dfe3b5564a04b724c657732d0bf09c99db.jpg`,type:`texture`,channel:1,sampler:{filter:`mipmap`,wrap:`repeat`,vflip:`true`,srgb:`false`,internal:`byte`},published:1},{id:`XsfGzn`,filepath:`/media/a/585f9546c092f53ded45332b343144396c0b2d70d9965f585ebc172080d8aa58.jpg`,type:`cubemap`,channel:0,sampler:{filter:`mipmap`,wrap:`clamp`,vflip:`false`,srgb:`false`,internal:`byte`},published:1},{id:`4dXGR8`,filepath:`/media/previz/buffer00.png`,type:`buffer`,channel:2,sampler:{filter:`linear`,wrap:`clamp`,vflip:`true`,srgb:`false`,internal:`byte`},published:1},{id:`XsXGR8`,filepath:`/media/previz/buffer01.png`,type:`buffer`,channel:3,sampler:{filter:`linear`,wrap:`clamp`,vflip:`true`,srgb:`false`,internal:`byte`},published:1}],outputs:[{id:`XsXGR8`,channel:0}],code:`// Old watch (RT). Created by Reinder Nijhoff 2018
// @reindernijhoff
//
// https://www.shadertoy.com/view/MlyyzW
//
// A simple path tracer is used to render an old watch. The old watch scene is
// (almost) the same scene as rendered using image based lighting in my shader "Old
// watch (IBL)":
// 
// https://www.shadertoy.com/view/lscBW4
//
// I'm no expert in ray- or path-tracing so there are probably a lot of errors in this code.
//

#define PATH_LENGTH 5

vec3 getBGColor( vec3 N ) {
    if (N.y <= 0.) {
        return vec3(0.); 
    } else {
	    return (.25 + pow(textureLod(iChannel0, N, 0.).rgb, vec3(6.5)) * 8.5) * (N.y) * .3;
    }
}

float FresnelSchlickRoughness(float cosTheta, float F0, float roughness) {
    return F0 + (max((1. - roughness), F0) - F0) * pow(abs(1. - cosTheta), 5.0);
}

vec3 cosWeightedRandomHemisphereDirection( const vec3 n, inout float seed ) {
  	vec2 r = hash2(seed);
    
	vec3  uu = normalize(cross(n, abs(n.y) > .5 ? vec3(1.,0.,0.) : vec3(0.,1.,0.)));
	vec3  vv = cross(uu, n);
	
	float ra = sqrt(r.y);
	float rx = ra*cos(6.2831*r.x); 
	float ry = ra*sin(6.2831*r.x);
	float rz = sqrt( abs(1.0-r.y) );
	vec3  rr = vec3( rx*uu + ry*vv + rz*n );
    
    return normalize(rr);
}

vec3 modifyDirectionWithRoughness( const vec3 n, const float roughness, inout float seed ) {
  	vec2 r = hash2(seed);
    
	vec3  uu = normalize(cross(n, abs(n.y) > .5 ? vec3(1.,0.,0.) : vec3(0.,1.,0.)));
	vec3  vv = cross(uu, n);
	
    float a = roughness*roughness;
    a *= a; a *= a; // I want to have a really shiny watch.
	float rz = sqrt(abs((1.0-r.y) / clamp(1.+(a - 1.)*r.y,.00001,1.)));
	float ra = sqrt(abs(1.-rz*rz));
	float rx = ra*cos(6.2831*r.x); 
	float ry = ra*sin(6.2831*r.x);
	vec3  rr = vec3( rx*uu + ry*vv + rz*n );
    
    return normalize(rr);
}

vec2 randomInUnitDisk(inout float seed) {
    vec2 h = hash2(seed) * vec2(1.,6.28318530718);
    float phi = h.y;
    float r = sqrt(h.x);
	return r*vec2(sin(phi),cos(phi));
}

//
// main 
//

vec3 render( in vec3 ro, in vec3 rd, inout float seed ) {
    vec3 col = vec3(1.); 
    vec3 firstPos = vec3(100.);
    bool firstHit = false;
    
    for (int i=0; i<PATH_LENGTH; ++i) {    
    	vec2 res = castRay( ro, rd );
		float gd = castRayGlass( ro, rd );
        
		vec3 gpos = ro + rd * gd;
		vec3 gN = calcNormalGlass(gpos);
        
        if (gd > 0. && (res.x < 0. || gd < res.x) && dot(gN, rd) < 0.) {
            // Glass material. 
            // Not correct: I only handle rays that enter the glass and the glass
            // is modelled as one solid piece, instead as a thin layer. By using a
            // non-physically plausible refraction index of 1.25, it still looks
            // good (I think).
            float F = FresnelSchlickRoughness(max(0., dot(-gN, rd)), (0.08), 0.);
            if (F < hash1(seed)) {
                rd = refract(rd, gN, 1./1.25);
            } else {
                rd = reflect(rd, gN);
            }
            ro = gpos;
        }
        else if (res.x > 0.) {
			vec3 pos = ro + rd * res.x;
			vec3 N, albedo;
            float roughness, metallic;

			getMaterialProperties(pos, res.y, N, albedo, roughness, metallic, iChannel1, iChannel2, iChannel3);

            float F = FresnelSchlickRoughness(max(0., -dot(N, rd)), 0.04, roughness);
            
            ro = pos;
            if (F > hash1(seed) - metallic) { // Reflections and metals.
                if (metallic > .5) {
                    col *= albedo; 
                }
				rd = modifyDirectionWithRoughness(reflect(rd,N), roughness, seed);            
                if (dot(rd, N) <= 0.) {
                    rd = cosWeightedRandomHemisphereDirection(N, seed);
                }
            } else { // Diffuse
				col *= albedo;
				rd = cosWeightedRandomHemisphereDirection(N, seed);
            }
        } else {
            col *= getBGColor(rd);
			col *= max(0.0, min(1.1, 10./dot(firstPos,firstPos)) - .15);
			return col;
        }            
        if (!firstHit) {
            firstHit = true;
            firstPos = ro;
        }
    }  
    return vec3(0.);
}

void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
    bool reset = iFrame == 0;
    ivec2 f = ivec2(fragCoord);
    vec4 data1 = texelFetch(iChannel3, ivec2(0), 0);
    vec4 data2 = texelFetch(iChannel2, ivec2(0), 0);
    
    vec2 uv = fragCoord/iResolution.xy;
    vec2 mo = abs(iMouse.xy)/iResolution.xy - .5;
    if (iMouse.xy == vec2(0)) mo = vec2(.05,.1);
    
    if (floor(mo*iResolution.xy*10.) != data1.yz) {
        reset = true;
    }
    if (data2.xy != iResolution.xy) {
        reset = true;
    }
    
    TIME = data2.w;
    
    float a = 5.05;
    vec3 ro = vec3( .25+ 2.*cos(6.0*mo.x+a), 2. + 2. * mo.y, 2.0*sin(6.0*mo.x+a) );
    vec3 ta = vec3( .25, .5, 0.0 );
    mat3 ca = setCamera( ro, ta );

    float fpd = data1.x;
    if(all(equal(f, ivec2(0)))) {
        // Calculate focus plane and store distance.
        float nfpd = castRay(ro, normalize(vec3(0.,.2,0.)-ro)).x;
		fragColor = vec4(nfpd, floor(mo*iResolution.xy*10.), iResolution.x);
        return;
    }
    
    vec2 p = (-iResolution.xy + 2.0*fragCoord - 1.)/iResolution.y;
    float seed = float(baseHash(floatBitsToUint(p)))/float(0xffffffffU) + iTime;

    // AA
	p += 2.*hash2(seed)/iResolution.y;
    vec3 rd = ca * normalize( vec3(p.xy,1.6) );  
    
    // DOF
    vec3 fp = ro + rd * fpd;
    ro = ro + ca * vec3(randomInUnitDisk(seed), 0.)*.02;
    rd = normalize(fp - ro);
    
    vec3 col = render(ro, rd, seed);           
  
    if (reset) {
       fragColor = vec4(col, 1.0);
    } else {
       fragColor = vec4(col, 1.0) + texelFetch(iChannel3, ivec2(fragCoord), 0);
    }
}
`,name:`Buffer B`,description:``,type:`buffer`}]},{ver:`0.1`,info:{id:`llVcDz`,date:`1536012316`,viewed:5646,name:`RIOW 1.07: Diffuse`,description:`These shaders are my implementation of the ray/path tracer described in the book "Raytracing in one weekend" by Peter Shirley. I have tried to follow the code from his book as much as possible.`,likes:19,published:`Public API`,usePreview:0,tags:[`raytracing`,`ray`,`tracer`,`one`,`in`,`path`,`7`,`weekend`,`chapter`]},renderpass:[{inputs:[{id:`4dXGR8`,filepath:`/media/previz/buffer00.png`,type:`buffer`,channel:0,sampler:{filter:`linear`,wrap:`clamp`,vflip:`true`,srgb:`false`,internal:`byte`},published:1}],outputs:[{id:`4dfGRr`,channel:0}],code:`// Raytracing in one weekend, chapter 7: Diffuse. Created by Reinder Nijhoff 2018
// Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License.
// @reindernijhoff
//
// https://www.shadertoy.com/view/llVcDz
//
// These shaders are my implementation of the raytracer described in the (excellent) 
// book "Raytracing in one weekend" [1] by Peter Shirley (@Peter_shirley). I have tried 
// to follow the code from his book as much as possible, but I had to make some changes 
// to get it running in a fragment shader:
//
// - There are no classes (and methods) in glsl so I use structs and functions instead. 
//   Inheritance is implemented by adding a type variable to the struct and adding ugly 
//   if/else statements to the (not so overloaded) functions.
// - The scene description is procedurally implemented in the world_hit function to save
//   memory.
// - The color function is implemented using a loop because it is not possible to have a 
//   recursive function call in glsl.
// - Only one sample per pixel per frame is calculated. Samples of all frames are added 
//   in Buffer A and averaged in the Image tab.
//
// You can find the raytracer / pathtracer in Buffer A.
//
// = Ray tracing in one week =
// Chapter  7: Diffuse                           https://www.shadertoy.com/view/llVcDz
// Chapter  9: Dielectrics                       https://www.shadertoy.com/view/MlVcDz
// Chapter 11: Defocus blur                      https://www.shadertoy.com/view/XlGcWh
// Chapter 12: Where next?                       https://www.shadertoy.com/view/XlycWh
//
// = Ray tracing: the next week =
// Chapter  6: Rectangles and lights             https://www.shadertoy.com/view/4tGcWD
// Chapter  7: Instances                         https://www.shadertoy.com/view/XlGcWD
// Chapter  8: Volumes                           https://www.shadertoy.com/view/XtyyDD
// Chapter  9: A Scene Testing All New Features  https://www.shadertoy.com/view/MtycDD
//
// [1] http://in1weekend.blogspot.com/2016/01/ray-tracing-in-one-weekend.html
//

void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
    vec4 data = texelFetch(iChannel0, ivec2(fragCoord),0);
    fragColor = vec4(sqrt(data.rgb/data.w),1.0);
}`,name:`Image`,description:``,type:`image`},{inputs:[{id:`4dXGR8`,filepath:`/media/previz/buffer00.png`,type:`buffer`,channel:0,sampler:{filter:`linear`,wrap:`clamp`,vflip:`true`,srgb:`false`,internal:`byte`},published:1}],outputs:[{id:`4dXGR8`,channel:0}],code:`// Raytracing in one weekend, chapter 7: Diffuse. Created by Reinder Nijhoff 2018
// @reindernijhoff
//
// https://www.shadertoy.com/view/llVcDz
//
// These shaders are my implementation of the raytracer described in the (excellent) 
// book "Raytracing in one weekend" [1] by Peter Shirley (@Peter_shirley). I have tried 
// to follow the code from his book as much as possible.
//
// [1] http://in1weekend.blogspot.com/2016/01/ray-tracing-in-one-weekend.html
//

#define MAX_FLOAT 1e5
#define MAX_RECURSION 5

//
// Hash functions by Nimitz:
// https://www.shadertoy.com/view/Xt3cDn
//

uint base_hash(uvec2 p) {
    p = 1103515245U*((p >> 1U)^(p.yx));
    uint h32 = 1103515245U*((p.x)^(p.y>>3U));
    return h32^(h32 >> 16);
}

float g_seed = 0.;

vec2 hash2(inout float seed) {
    uint n = base_hash(floatBitsToUint(vec2(seed+=.1,seed+=.1)));
    uvec2 rz = uvec2(n, n*48271U);
    return vec2(rz.xy & uvec2(0x7fffffffU))/float(0x7fffffff);
}

vec3 hash3(inout float seed) {
    uint n = base_hash(floatBitsToUint(vec2(seed+=.1,seed+=.1)));
    uvec3 rz = uvec3(n, n*16807U, n*48271U);
    return vec3(rz & uvec3(0x7fffffffU))/float(0x7fffffff);
}

//
// Ray trace helper functions
//

float schlick(float cosine, float ior) {
    float r0 = (1.-ior)/(1.+ior);
    r0 = r0*r0;
    return r0 + (1.-r0)*pow((1.-cosine),5.);
}

vec3 random_in_unit_sphere(inout float seed) {
    vec3 h = hash3(seed) * vec3(2.,6.28318530718,1.)-vec3(1,0,0);
    float phi = h.y;
    float r = pow(h.z, 1./3.);
	return r * vec3(sqrt(1.-h.x*h.x)*vec2(sin(phi),cos(phi)),h.x);
}

//
// Ray
//

struct ray {
    vec3 origin, direction;
};
    
//
// Hit record
//

struct hit_record {
    float t;
    vec3 p, normal;
};

//
// Hitable, for now this is always a sphere
//

struct hitable {
    vec3 center;
    float radius;
};

bool hitable_hit(const in hitable hb, const in ray r, const in float t_min, 
                 const in float t_max, inout hit_record rec) {
    // always a sphere
    vec3 oc = r.origin - hb.center;
    float b = dot(oc, r.direction);
    float c = dot(oc, oc) - hb.radius * hb.radius;
    float discriminant = b * b - c;
    if (discriminant < 0.0) return false;

	float s = sqrt(discriminant);
	float t1 = -b - s;
	float t2 = -b + s;
	
	float t = t1 < t_min ? t2 : t1;
    if (t < t_max && t > t_min) {
        rec.t = t;
        rec.p = r.origin + t*r.direction;
        rec.normal = (rec.p - hb.center) / hb.radius;
	    return true;
    } else {
        return false;
    }
}

//
// Camera
//

struct camera {
    vec3 origin, lower_left_corner, horizontal, vertical;
};

ray camera_get_ray(camera c, vec2 uv) {
    return ray(c.origin, 
               normalize(c.lower_left_corner + uv.x*c.horizontal + uv.y*c.vertical - c.origin));
}

//
// Color & Scene
//

bool world_hit(const in ray r, const in float t_min, const in float t_max, out hit_record rec) {
    rec.t = t_max;
    bool hit = false;
    
	hit = hitable_hit(hitable(vec3(0,0,-1), .5), r, t_min, rec.t, rec) || hit;
	hit = hitable_hit(hitable(vec3(0,-100.5,-1),100.), r, t_min, rec.t, rec) || hit;
    
    return hit;
}

vec3 color(in ray r) {
    vec3 col = vec3(1);  
	hit_record rec;
    
    for (int i=0; i<MAX_RECURSION; i++) {
    	if (world_hit(r, 0.001, MAX_FLOAT, rec)) {
        	vec3 rd = normalize(rec.normal + random_in_unit_sphere(g_seed));
            col *= .5;

            r.origin = rec.p;
            r.direction = rd;
	    } else {
            float t = .5*r.direction.y + .5;
            col *= mix(vec3(1),vec3(.5,.7,1), t);
            return col;
    	}
    }
    return col;
}

//
// Main
//

void mainImage( out vec4 frag_color, in vec2 frag_coord ) {
    if (ivec2(frag_coord) == ivec2(0)) {
        frag_color = iResolution.xyxy;
    } else {
        g_seed = float(base_hash(floatBitsToUint(frag_coord)))/float(0xffffffffU)+iTime;

        vec2 uv = (frag_coord + hash2(g_seed))/iResolution.xy;
        float aspect = iResolution.x/iResolution.y;

        ray r = camera_get_ray(camera(vec3(0), vec3(-2,-1,-1), vec3(4,0,0), vec3(0,4./aspect,0)), uv);
        vec3 col = color(r);
        
        if (texelFetch(iChannel0, ivec2(0),0).xy == iResolution.xy) {        
	        frag_color = vec4(col,1) + texelFetch(iChannel0, ivec2(frag_coord), 0);
        } else {        
	        frag_color = vec4(col,1);
        }
    }
}`,name:`Buffer A`,description:``,type:`buffer`}]},{ver:`0.1`,info:{id:`MlVcDz`,date:`1536012325`,viewed:4591,name:`RIOW 1.09: Dielectrics`,description:`These shaders are my implementation of the ray/path tracer described in the book "Raytracing in one weekend" by Peter Shirley. I have tried to follow the code from his book as much as possible.`,likes:6,published:`Public API`,usePreview:0,tags:[`raytracing`,`ray`,`tracer`,`one`,`in`,`path`,`weekend`]},renderpass:[{inputs:[{id:`4dXGR8`,filepath:`/media/previz/buffer00.png`,type:`buffer`,channel:0,sampler:{filter:`linear`,wrap:`clamp`,vflip:`true`,srgb:`false`,internal:`byte`},published:1}],outputs:[{id:`4dfGRr`,channel:0}],code:`// Raytracing in one weekend, chapter 9: Dielectrics. Created by Reinder Nijhoff 2018
// Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License.
// @reindernijhoff
//
// https://www.shadertoy.com/view/MlVcDz
//
// These shaders are my implementation of the raytracer described in the (excellent) 
// book "Raytracing in one weekend" [1] by Peter Shirley (@Peter_shirley). I have tried 
// to follow the code from his book as much as possible, but I had to make some changes 
// to get it running in a fragment shader:
//
// - There are no classes (and methods) in glsl so I use structs and functions instead. 
//   Inheritance is implemented by adding a type variable to the struct and adding ugly 
//   if/else statements to the (not so overloaded) functions.
// - The scene description is procedurally implemented in the world_hit function to save
//   memory.
// - The color function is implemented using a loop because it is not possible to have a 
//   recursive function call in glsl.
// - Only one sample per pixel per frame is calculated. Samples of all frames are added 
//   in Buffer A and averaged in the Image tab.
//
// You can find the raytracer / pathtracer in Buffer A.
//
// = Ray tracing in one week =
// Chapter  7: Diffuse                           https://www.shadertoy.com/view/llVcDz
// Chapter  9: Dielectrics                       https://www.shadertoy.com/view/MlVcDz
// Chapter 11: Defocus blur                      https://www.shadertoy.com/view/XlGcWh
// Chapter 12: Where next?                       https://www.shadertoy.com/view/XlycWh
//
// = Ray tracing: the next week =
// Chapter  6: Rectangles and lights             https://www.shadertoy.com/view/4tGcWD
// Chapter  7: Instances                         https://www.shadertoy.com/view/XlGcWD
// Chapter  8: Volumes                           https://www.shadertoy.com/view/XtyyDD
// Chapter  9: A Scene Testing All New Features  https://www.shadertoy.com/view/MtycDD
//
// [1] http://in1weekend.blogspot.com/2016/01/ray-tracing-in-one-weekend.html
//

void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
    vec4 data = texelFetch(iChannel0, ivec2(fragCoord),0);
    fragColor = vec4(sqrt(data.rgb/data.w),1.0);
}`,name:`Image`,description:``,type:`image`},{inputs:[{id:`4dXGR8`,filepath:`/media/previz/buffer00.png`,type:`buffer`,channel:0,sampler:{filter:`linear`,wrap:`clamp`,vflip:`true`,srgb:`false`,internal:`byte`},published:1}],outputs:[{id:`4dXGR8`,channel:0}],code:`// Raytracing in one weekend, chapter 9: Dielectrics. Created by Reinder Nijhoff 2018
// @reindernijhoff
//
// https://www.shadertoy.com/view/MlVcDz
//
// These shaders are my implementation of the raytracer described in the (excellent) 
// book "Raytracing in one weekend" [1] by Peter Shirley (@Peter_shirley). I have tried 
// to follow the code from his book as much as possible.
//
// [1] http://in1weekend.blogspot.com/2016/01/ray-tracing-in-one-weekend.html
//

#define MAX_FLOAT 1e5
#define MAX_RECURSION (16+min(0,iFrame))

#define LAMBERTIAN 0
#define METAL 1
#define DIELECTRIC 2

//
// Hash functions by Nimitz:
// https://www.shadertoy.com/view/Xt3cDn
//

uint base_hash(uvec2 p) {
    p = 1103515245U*((p >> 1U)^(p.yx));
    uint h32 = 1103515245U*((p.x)^(p.y>>3U));
    return h32^(h32 >> 16);
}

float g_seed = 0.;

float hash1(inout float seed) {
    uint n = base_hash(floatBitsToUint(vec2(seed+=.1,seed+=.1)));
    return float(n)*(1.0/float(0xffffffffU));
}

vec2 hash2(inout float seed) {
    uint n = base_hash(floatBitsToUint(vec2(seed+=.1,seed+=.1)));
    uvec2 rz = uvec2(n, n*48271U);
    return vec2(rz.xy & uvec2(0x7fffffffU))/float(0x7fffffff);
}

vec3 hash3(inout float seed) {
    uint n = base_hash(floatBitsToUint(vec2(seed+=.1,seed+=.1)));
    uvec3 rz = uvec3(n, n*16807U, n*48271U);
    return vec3(rz & uvec3(0x7fffffffU))/float(0x7fffffff);
}

//
// Ray trace helper functions
//

float schlick(float cosine, float ior) {
    float r0 = (1.-ior)/(1.+ior);
    r0 = r0*r0;
    return r0 + (1.-r0)*pow((1.-cosine),5.);
}

bool modified_refract(const in vec3 v, const in vec3 n, const in float ni_over_nt, 
                      out vec3 refracted) {
    float dt = dot(v, n);
    float discriminant = 1. - ni_over_nt*ni_over_nt*(1.-dt*dt);
    if (discriminant > 0.) {
        refracted = ni_over_nt*(v - n*dt) - n*sqrt(discriminant);
        return true;
    } else { 
        return false;
    }
}

vec3 random_in_unit_sphere(inout float seed) {
    vec3 h = hash3(seed) * vec3(2.,6.28318530718,1.)-vec3(1,0,0);
    float phi = h.y;
    float r = pow(h.z, 1./3.);
	return r * vec3(sqrt(1.-h.x*h.x)*vec2(sin(phi),cos(phi)),h.x);
}

//
// Ray
//

struct ray {
    vec3 origin, direction;
};

//
// Material
//

struct material {
    int type;
    vec3 albedo;
    float v;
};

//
// Hit record
//

struct hit_record {
    float t;
    vec3 p, normal;
    material mat;
};

bool material_scatter(const in ray r_in, const in hit_record rec, out vec3 attenuation, 
                      out ray scattered) {
    if(rec.mat.type == LAMBERTIAN) {
        vec3 rd = normalize(rec.normal + random_in_unit_sphere(g_seed));
        scattered = ray(rec.p, rd);
        attenuation = rec.mat.albedo;
        return true;
    } else if(rec.mat.type == METAL) {
        vec3 rd = reflect(r_in.direction, rec.normal);
        scattered = ray(rec.p, normalize(rd + rec.mat.v*random_in_unit_sphere(g_seed)));
        attenuation = rec.mat.albedo;
        return true;
    } else if(rec.mat.type == DIELECTRIC) {
        vec3 outward_normal, refracted, 
             reflected = reflect(r_in.direction, rec.normal);
        float ni_over_nt, reflect_prob, cosine;
        
        attenuation = vec3(1);
        if (dot(r_in.direction, rec.normal) > 0.) {
            outward_normal = -rec.normal;
            ni_over_nt = rec.mat.v;
            cosine = dot(r_in.direction, rec.normal);
            cosine = sqrt(1. - rec.mat.v*rec.mat.v*(1.-cosine*cosine));
        } else {
            outward_normal = rec.normal;
            ni_over_nt = 1. / rec.mat.v;
            cosine = -dot(r_in.direction, rec.normal);
        }
        
        if (modified_refract(r_in.direction, outward_normal, ni_over_nt, refracted)) {
	        reflect_prob = schlick(cosine, rec.mat.v);
        } else {
            reflect_prob = 1.;
        }
        
        if (hash1(g_seed) < reflect_prob) {
            scattered = ray(rec.p, reflected);
        } else {
            scattered = ray(rec.p, refracted);
        }
        return true;
    }
    return false;
}

//
// Hitable, for now this is always a sphere
//

struct hitable {
    vec3 center;
    float radius;
};

bool hitable_hit(const in hitable hb, const in ray r, const in float t_min, 
                 const in float t_max, inout hit_record rec) {
    // always a sphere
    vec3 oc = r.origin - hb.center;
    float b = dot(oc, r.direction);
    float c = dot(oc, oc) - hb.radius * hb.radius;
    float discriminant = b * b - c;
    if (discriminant < 0.0) return false;

	float s = sqrt(discriminant);
	float t1 = -b - s;
	float t2 = -b + s;
	
	float t = t1 < t_min ? t2 : t1;
    if (t < t_max && t > t_min) {
        rec.t = t;
        rec.p = r.origin + t*r.direction;
        rec.normal = (rec.p - hb.center) / hb.radius;
	    return true;
    } else {
        return false;
    }
}

//
// Camera
//

struct camera {
    vec3 origin, lower_left_corner, horizontal, vertical;
};

ray camera_get_ray(camera c, vec2 uv) {
    return ray(c.origin, 
               normalize(c.lower_left_corner + uv.x*c.horizontal + uv.y*c.vertical - c.origin));
}

//
// Color & Scene
//

bool world_hit(const in ray r, const in float t_min, 
               const in float t_max, out hit_record rec) {
    rec.t = t_max;
    bool hit = false;
    
	if (hitable_hit(hitable(vec3(0,0,-1),.5),r,t_min,rec.t,rec))        hit=true,rec.mat=material(LAMBERTIAN,vec3(.1,.2,.5),0.);
	if (hitable_hit(hitable(vec3(0,-100.5,-1),100.),r,t_min,rec.t,rec)) hit=true,rec.mat=material(LAMBERTIAN,vec3(.8,.8,0),0.);
	if (hitable_hit(hitable(vec3(1,0,-1),.5),r,t_min,rec.t,rec))        hit=true,rec.mat=material(METAL     ,vec3(.8,.6,.2),.2);
	if (hitable_hit(hitable(vec3(-1,0,-1),.5),r,t_min,rec.t,rec))       hit=true,rec.mat=material(DIELECTRIC,vec3(0),1.5);
	if (hitable_hit(hitable(vec3(-1,0,-1),-.45),r,t_min,rec.t,rec))     hit=true,rec.mat=material(DIELECTRIC,vec3(0),1.5);
    
    return hit;
}

vec3 color(in ray r) {
    vec3 col = vec3(1);  
	hit_record rec;
    
    for (int i=0; i<MAX_RECURSION; i++) {
    	if (world_hit(r, 0.001, MAX_FLOAT, rec)) {
            ray scattered;
            vec3 attenuation;
            if (material_scatter(r, rec, attenuation, scattered)) {
                col *= attenuation;
                r = scattered;
            } else {
                return vec3(0);
            }
	    } else {
            float t = .5*r.direction.y + .5;
            col *= mix(vec3(1),vec3(.5,.7,1), t);
            return col;
    	}
    }
    return vec3(0);
}

//
// Main
//

void mainImage( out vec4 frag_color, in vec2 frag_coord ) {
    if (ivec2(frag_coord) == ivec2(0)) {
        frag_color = iResolution.xyxy;
    } else {
        g_seed = float(base_hash(floatBitsToUint(frag_coord)))/float(0xffffffffU)+iTime;

        vec2 uv = (frag_coord + hash2(g_seed))/iResolution.xy;
        float aspect = iResolution.x/iResolution.y;

        ray r = camera_get_ray(camera(vec3(0), vec3(-2,-1,-1), vec3(4,0,0), vec3(0,4./aspect,0)), uv);
        vec3 col = color(r);
        
        if (texelFetch(iChannel0, ivec2(0),0).xy == iResolution.xy) {        
	        frag_color = vec4(col,1) + texelFetch(iChannel0, ivec2(frag_coord), 0);
        } else {        
	        frag_color = vec4(col,1);
        }
    }
}`,name:`Buffer A`,description:``,type:`buffer`}]},{ver:`0.1`,info:{id:`XlGcWh`,date:`1536012335`,viewed:4948,name:`RIOW 1.11: Defocus Blur`,description:`These shaders are my implementation of the ray/path tracer described in the book "Raytracing in one weekend" by Peter Shirley. I have tried to follow the code from his book as much as possible.`,likes:13,published:`Public API`,usePreview:0,tags:[`raytracing`,`ray`,`tracer`,`one`,`in`,`path`,`weekend`]},renderpass:[{inputs:[{id:`4dXGR8`,filepath:`/media/previz/buffer00.png`,type:`buffer`,channel:0,sampler:{filter:`linear`,wrap:`clamp`,vflip:`true`,srgb:`false`,internal:`byte`},published:1}],outputs:[{id:`4dfGRr`,channel:0}],code:`// Raytracing in one weekend, chapter 11: Defocus Blur. Created by Reinder Nijhoff 2018
// Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License.
// @reindernijhoff
//
// https://www.shadertoy.com/view/XlGcWh
//
// These shaders are my implementation of the raytracer described in the (excellent) 
// book "Raytracing in one weekend" [1] by Peter Shirley (@Peter_shirley). I have tried 
// to follow the code from his book as much as possible, but I had to make some changes 
// to get it running in a fragment shader:
//
// - There are no classes (and methods) in glsl so I use structs and functions instead. 
//   Inheritance is implemented by adding a type variable to the struct and adding ugly 
//   if/else statements to the (not so overloaded) functions.
// - The scene description is procedurally implemented in the world_hit function to save
//   memory.
// - The color function is implemented using a loop because it is not possible to have a 
//   recursive function call in glsl.
// - Only one sample per pixel per frame is calculated. Samples of all frames are added 
//   in Buffer A and averaged in the Image tab.
//
// You can find the raytracer / pathtracer in Buffer A.
//
// = Ray tracing in one week =
// Chapter  7: Diffuse                           https://www.shadertoy.com/view/llVcDz
// Chapter  9: Dielectrics                       https://www.shadertoy.com/view/MlVcDz
// Chapter 11: Defocus blur                      https://www.shadertoy.com/view/XlGcWh
// Chapter 12: Where next?                       https://www.shadertoy.com/view/XlycWh
//
// = Ray tracing: the next week =
// Chapter  6: Rectangles and lights             https://www.shadertoy.com/view/4tGcWD
// Chapter  7: Instances                         https://www.shadertoy.com/view/XlGcWD
// Chapter  8: Volumes                           https://www.shadertoy.com/view/XtyyDD
// Chapter  9: A Scene Testing All New Features  https://www.shadertoy.com/view/MtycDD
//
// [1] http://in1weekend.blogspot.com/2016/01/ray-tracing-in-one-weekend.html
//

void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
    vec4 data = texelFetch(iChannel0, ivec2(fragCoord),0);
    fragColor = vec4(sqrt(data.rgb/data.w),1.0);
}`,name:`Image`,description:``,type:`image`},{inputs:[{id:`4dXGR8`,filepath:`/media/previz/buffer00.png`,type:`buffer`,channel:0,sampler:{filter:`linear`,wrap:`clamp`,vflip:`true`,srgb:`false`,internal:`byte`},published:1}],outputs:[{id:`4dXGR8`,channel:0}],code:`// Raytracing in one weekend, chapter 11: Defocus Blur. Created by Reinder Nijhoff 2018
// @reindernijhoff
//
// https://www.shadertoy.com/view/XlGcWh
//
// These shaders are my implementation of the raytracer described in the (excellent) 
// book "Raytracing in one weekend" [1] by Peter Shirley (@Peter_shirley). I have tried 
// to follow the code from his book as much as possible.
//
// [1] http://in1weekend.blogspot.com/2016/01/ray-tracing-in-one-weekend.html
//

#define MAX_FLOAT 1e5
#define MAX_RECURSION (16+min(0,iFrame))

#define LAMBERTIAN 0
#define METAL 1
#define DIELECTRIC 2

//
// Hash functions by Nimitz:
// https://www.shadertoy.com/view/Xt3cDn
//

uint base_hash(uvec2 p) {
    p = 1103515245U*((p >> 1U)^(p.yx));
    uint h32 = 1103515245U*((p.x)^(p.y>>3U));
    return h32^(h32 >> 16);
}

float g_seed = 0.;

float hash1(inout float seed) {
    uint n = base_hash(floatBitsToUint(vec2(seed+=.1,seed+=.1)));
    return float(n)*(1.0/float(0xffffffffU));
}

vec2 hash2(inout float seed) {
    uint n = base_hash(floatBitsToUint(vec2(seed+=.1,seed+=.1)));
    uvec2 rz = uvec2(n, n*48271U);
    return vec2(rz.xy & uvec2(0x7fffffffU))/float(0x7fffffff);
}

vec3 hash3(inout float seed) {
    uint n = base_hash(floatBitsToUint(vec2(seed+=.1,seed+=.1)));
    uvec3 rz = uvec3(n, n*16807U, n*48271U);
    return vec3(rz & uvec3(0x7fffffffU))/float(0x7fffffff);
}

//
// Ray trace helper functions
//

float schlick(float cosine, float ior) {
    float r0 = (1.-ior)/(1.+ior);
    r0 = r0*r0;
    return r0 + (1.-r0)*pow((1.-cosine),5.);
}

bool modified_refract(const in vec3 v, const in vec3 n, const in float ni_over_nt, 
                      out vec3 refracted) {
    float dt = dot(v, n);
    float discriminant = 1. - ni_over_nt*ni_over_nt*(1.-dt*dt);
    if (discriminant > 0.) {
        refracted = ni_over_nt*(v - n*dt) - n*sqrt(discriminant);
        return true;
    } else { 
        return false;
    }
}

vec2 random_in_unit_disk(inout float seed) {
    vec2 h = hash2(seed) * vec2(1.,6.28318530718);
    float phi = h.y;
    float r = sqrt(h.x);
	return r * vec2(sin(phi),cos(phi));
}

vec3 random_in_unit_sphere(inout float seed) {
    vec3 h = hash3(seed) * vec3(2.,6.28318530718,1.)-vec3(1,0,0);
    float phi = h.y;
    float r = pow(h.z, 1./3.);
	return r * vec3(sqrt(1.-h.x*h.x)*vec2(sin(phi),cos(phi)),h.x);
}

//
// Ray
//

struct ray {
    vec3 origin, direction;
};

//
// Material
//

struct material {
    int type;
    vec3 albedo;
    float v;
};

//
// Hit record
//

struct hit_record {
    float t;
    vec3 p, normal;
    material mat;
};

bool material_scatter(const in ray r_in, const in hit_record rec, out vec3 attenuation, 
                      out ray scattered) {
    if(rec.mat.type == LAMBERTIAN) {
        vec3 rd = normalize(rec.normal + random_in_unit_sphere(g_seed));
        scattered = ray(rec.p, rd);
        attenuation = rec.mat.albedo;
        return true;
    } else if(rec.mat.type == METAL) {
        vec3 rd = reflect(r_in.direction, rec.normal);
        scattered = ray(rec.p, normalize(rd + rec.mat.v*random_in_unit_sphere(g_seed)));
        attenuation = rec.mat.albedo;
        return true;
    } else if(rec.mat.type == DIELECTRIC) {
        vec3 outward_normal, refracted, 
             reflected = reflect(r_in.direction, rec.normal);
        float ni_over_nt, reflect_prob, cosine;
        
        attenuation = vec3(1);
        if (dot(r_in.direction, rec.normal) > 0.) {
            outward_normal = -rec.normal;
            ni_over_nt = rec.mat.v;
            cosine = dot(r_in.direction, rec.normal);
            cosine = sqrt(1. - rec.mat.v*rec.mat.v*(1.-cosine*cosine));
        } else {
            outward_normal = rec.normal;
            ni_over_nt = 1. / rec.mat.v;
            cosine = -dot(r_in.direction, rec.normal);
        }
        
        if (modified_refract(r_in.direction, outward_normal, ni_over_nt, refracted)) {
	        reflect_prob = schlick(cosine, rec.mat.v);
        } else {
            reflect_prob = 1.;
        }
        
        if (hash1(g_seed) < reflect_prob) {
            scattered = ray(rec.p, reflected);
        } else {
            scattered = ray(rec.p, refracted);
        }
        return true;
    }
    return false;
}

//
// Hitable, for now this is always a sphere
//

struct hitable {
    vec3 center;
    float radius;
};

bool hitable_hit(const in hitable hb, const in ray r, const in float t_min, 
                 const in float t_max, inout hit_record rec) {
    // always a sphere
    vec3 oc = r.origin - hb.center;
    float b = dot(oc, r.direction);
    float c = dot(oc, oc) - hb.radius * hb.radius;
    float discriminant = b * b - c;
    if (discriminant < 0.0) return false;

	float s = sqrt(discriminant);
	float t1 = -b - s;
	float t2 = -b + s;
	
	float t = t1 < t_min ? t2 : t1;
    if (t < t_max && t > t_min) {
        rec.t = t;
        rec.p = r.origin + t*r.direction;
        rec.normal = (rec.p - hb.center) / hb.radius;
	    return true;
    } else {
        return false;
    }
}

//
// Camera
//

struct camera {
    vec3 origin, lower_left_corner, horizontal, vertical, u, v, w;
    float lens_radius;
};

camera camera_const(const in vec3 lookfrom, const in vec3 lookat, const in vec3 vup, 
                    const in float vfov, const in float aspect, const in float aperture, 
                    const in float focus_dist) {
    camera cam;    
    cam.lens_radius = aperture / 2.;
    float theta = vfov*3.14159265359/180.;
    float half_height = tan(theta/2.);
    float half_width = aspect * half_height;
    cam.origin = lookfrom;
    cam.w = normalize(lookfrom - lookat);
    cam.u = normalize(cross(vup, cam.w));
    cam.v = cross(cam.w, cam.u);
    cam.lower_left_corner = cam.origin  - half_width*focus_dist*cam.u -half_height*focus_dist*cam.v - focus_dist*cam.w;
    cam.horizontal = 2.*half_width*focus_dist*cam.u;
    cam.vertical = 2.*half_height*focus_dist*cam.v;
    return cam;
}
    
ray camera_get_ray(camera c, vec2 uv) {
    vec2 rd = c.lens_radius*random_in_unit_disk(g_seed);
    vec3 offset = c.u * rd.x + c.v * rd.y;
    return ray(c.origin + offset, 
               normalize(c.lower_left_corner + uv.x*c.horizontal + uv.y*c.vertical - c.origin - offset));
}

//
// Color & Scene
//

bool world_hit(const in ray r, const in float t_min, 
               const in float t_max, out hit_record rec) {
    rec.t = t_max;
    bool hit = false;
    
	if (hitable_hit(hitable(vec3(0,0,-1),.5),r,t_min,rec.t,rec))        hit=true,rec.mat=material(LAMBERTIAN,vec3(.1,.2,.5),0.);
	if (hitable_hit(hitable(vec3(0,-100.5,-1),100.),r,t_min,rec.t,rec)) hit=true,rec.mat=material(LAMBERTIAN,vec3(.8,.8,0),0.);
	if (hitable_hit(hitable(vec3(1,0,-1),.5),r,t_min,rec.t,rec))        hit=true,rec.mat=material(METAL     ,vec3(.8,.6,.2),0.);
	if (hitable_hit(hitable(vec3(-1,0,-1),.5),r,t_min,rec.t,rec))       hit=true,rec.mat=material(DIELECTRIC,vec3(0),1.5);
	if (hitable_hit(hitable(vec3(-1,0,-1),-.45),r,t_min,rec.t,rec))     hit=true,rec.mat=material(DIELECTRIC,vec3(0),1.5);
    
    return hit;
}

vec3 color(in ray r) {
    vec3 col = vec3(1);  
	hit_record rec;
    
    for (int i=0; i<MAX_RECURSION; i++) {
    	if (world_hit(r, 0.001, MAX_FLOAT, rec)) {
            ray scattered;
            vec3 attenuation;
            if (material_scatter(r, rec, attenuation, scattered)) {
                col *= attenuation;
                r = scattered;
            } else {
                return vec3(0);
            }
	    } else {
            float t = .5*r.direction.y + .5;
            col *= mix(vec3(1),vec3(.5,.7,1), t);
            return col;
    	}
    }
    return vec3(0);
}

//
// Main
//

void mainImage( out vec4 frag_color, in vec2 frag_coord ) {
    if (ivec2(frag_coord) == ivec2(0)) {
        frag_color = iResolution.xyxy;
    } else {
        g_seed = float(base_hash(floatBitsToUint(frag_coord)))/float(0xffffffffU)+iTime;

        vec2 uv = (frag_coord + hash2(g_seed))/iResolution.xy;
        float aspect = iResolution.x/iResolution.y;
        vec3 lookfrom = vec3(3,3,2);
        vec3 lookat = vec3(0,0,-1);
        
        camera cam = camera_const(lookfrom, lookat, vec3(0,1,0), 20., aspect, 2., distance(lookfrom,lookat));
        ray r = camera_get_ray(cam, uv);
        vec3 col = color(r);
        
        if (texelFetch(iChannel0, ivec2(0),0).xy == iResolution.xy) {        
	        frag_color = vec4(col,1) + texelFetch(iChannel0, ivec2(frag_coord), 0);
        } else {        
	        frag_color = vec4(col,1);
        }
    }
}`,name:`Buffer A`,description:``,type:`buffer`}]},{ver:`0.1`,info:{id:`XlycWh`,date:`1536012353`,viewed:6955,name:`RIOW 1.12: Where next?`,description:`These shaders are my implementation of the ray/path tracer described in the book "Raytracing in one weekend" by Peter Shirley. I have tried to follow the code from his book as much as possible.`,likes:33,published:`Public API`,usePreview:0,tags:[`raytracing`,`ray`,`tracer`,`one`,`in`,`path`,`weekend`]},renderpass:[{inputs:[{id:`4dXGR8`,filepath:`/media/previz/buffer00.png`,type:`buffer`,channel:0,sampler:{filter:`linear`,wrap:`clamp`,vflip:`true`,srgb:`false`,internal:`byte`},published:1}],outputs:[{id:`4dfGRr`,channel:0}],code:`// Raytracing in one weekend, chapter 12: Where next? Created by Reinder Nijhoff 2018
// Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License.
// @reindernijhoff
//
// https://www.shadertoy.com/view/XlycWh
//
// These shaders are my implementation of the raytracer described in the (excellent) 
// book "Raytracing in one weekend" [1] by Peter Shirley (@Peter_shirley). I have tried 
// to follow the code from his book as much as possible, but I had to make some changes 
// to get it running in a fragment shader:
//
// - There are no classes (and methods) in glsl so I use structs and functions instead. 
//   Inheritance is implemented by adding a type variable to the struct and adding ugly 
//   if/else statements to the (not so overloaded) functions.
// - The scene description is procedurally implemented in the world_hit function to save
//   memory.
// - The color function is implemented using a loop because it is not possible to have a 
//   recursive function call in glsl.
// - Only one sample per pixel per frame is calculated. Samples of all frames are added 
//   in Buffer A and averaged in the Image tab.
//
// You can find the raytracer / pathtracer in Buffer A.
//
// = Ray tracing in one week =
// Chapter  7: Diffuse                           https://www.shadertoy.com/view/llVcDz
// Chapter  9: Dielectrics                       https://www.shadertoy.com/view/MlVcDz
// Chapter 11: Defocus blur                      https://www.shadertoy.com/view/XlGcWh
// Chapter 12: Where next?                       https://www.shadertoy.com/view/XlycWh
//
// = Ray tracing: the next week =
// Chapter  6: Rectangles and lights             https://www.shadertoy.com/view/4tGcWD
// Chapter  7: Instances                         https://www.shadertoy.com/view/XlGcWD
// Chapter  8: Volumes                           https://www.shadertoy.com/view/XtyyDD
// Chapter  9: A Scene Testing All New Features  https://www.shadertoy.com/view/MtycDD
//
// This particular shader can be optimized (a lot) by using an acceleration structure,
// as done in my shader "More spheres": https://www.shadertoy.com/view/lsX3DH
//
// [1] http://in1weekend.blogspot.com/2016/01/ray-tracing-in-one-weekend.html
//

void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
    vec4 data = texelFetch(iChannel0, ivec2(fragCoord),0);
    fragColor = vec4(sqrt(data.rgb/data.w),1.0);
}`,name:`Image`,description:``,type:`image`},{inputs:[{id:`4dXGR8`,filepath:`/media/previz/buffer00.png`,type:`buffer`,channel:0,sampler:{filter:`linear`,wrap:`clamp`,vflip:`true`,srgb:`false`,internal:`byte`},published:1}],outputs:[{id:`4dXGR8`,channel:0}],code:`// Raytracing in one weekend, chapter 12: Where next? Created by Reinder Nijhoff 2018
// @reindernijhoff
//
// https://www.shadertoy.com/view/XlycWh
//
// These shaders are my implementation of the raytracer described in the (excellent) 
// book "Raytracing in one weekend" [1] by Peter Shirley (@Peter_shirley). I have tried 
// to follow the code from his book as much as possible.
//
// [1] http://in1weekend.blogspot.com/2016/01/ray-tracing-in-one-weekend.html
//

#define MAX_FLOAT 1e5
#define MAX_RECURSION (6+min(0,iFrame))

#define LAMBERTIAN 0
#define METAL 1
#define DIELECTRIC 2

//
// Hash functions by Nimitz:
// https://www.shadertoy.com/view/Xt3cDn
//

uint base_hash(uvec2 p) {
    p = 1103515245U*((p >> 1U)^(p.yx));
    uint h32 = 1103515245U*((p.x)^(p.y>>3U));
    return h32^(h32 >> 16);
}

float g_seed = 0.;

float hash1(inout float seed) {
    uint n = base_hash(floatBitsToUint(vec2(seed+=.1,seed+=.1)));
    return float(n)/float(0xffffffffU);
}

vec2 hash2(inout float seed) {
    uint n = base_hash(floatBitsToUint(vec2(seed+=.1,seed+=.1)));
    uvec2 rz = uvec2(n, n*48271U);
    return vec2(rz.xy & uvec2(0x7fffffffU))/float(0x7fffffff);
}

vec3 hash3(inout float seed) {
    uint n = base_hash(floatBitsToUint(vec2(seed+=.1,seed+=.1)));
    uvec3 rz = uvec3(n, n*16807U, n*48271U);
    return vec3(rz & uvec3(0x7fffffffU))/float(0x7fffffff);
}

//
// Ray trace helper functions
//

float schlick(float cosine, float ior) {
    float r0 = (1.-ior)/(1.+ior);
    r0 = r0*r0;
    return r0 + (1.-r0)*pow((1.-cosine),5.);
}

bool modified_refract(const in vec3 v, const in vec3 n, const in float ni_over_nt, 
                      out vec3 refracted) {
    float dt = dot(v, n);
    float discriminant = 1. - ni_over_nt*ni_over_nt*(1.-dt*dt);
    if (discriminant > 0.) {
        refracted = ni_over_nt*(v - n*dt) - n*sqrt(discriminant);
        return true;
    } else { 
        return false;
    }
}

vec2 random_in_unit_disk(inout float seed) {
    vec2 h = hash2(seed) * vec2(1.,6.28318530718);
    float phi = h.y;
    float r = sqrt(h.x);
	return r * vec2(sin(phi),cos(phi));
}

vec3 random_in_unit_sphere(inout float seed) {
    vec3 h = hash3(seed) * vec3(2.,6.28318530718,1.)-vec3(1,0,0);
    float phi = h.y;
    float r = pow(h.z, 1./3.);
	return r * vec3(sqrt(1.-h.x*h.x)*vec2(sin(phi),cos(phi)),h.x);
}

//
// Ray
//

struct ray {
    vec3 origin, direction;
};

//
// Material
//

struct material {
    int type;
    vec3 albedo;
    float v;
};

//
// Hit record
//

struct hit_record {
    float t;
    vec3 p, normal;
    material mat;
};

bool material_scatter(const in ray r_in, const in hit_record rec, out vec3 attenuation, 
                      out ray scattered) {
    if(rec.mat.type == LAMBERTIAN) {
        vec3 rd = normalize(rec.normal + random_in_unit_sphere(g_seed));
        scattered = ray(rec.p, rd);
        attenuation = rec.mat.albedo;
        return true;
    } else if(rec.mat.type == METAL) {
        vec3 rd = reflect(r_in.direction, rec.normal);
        scattered = ray(rec.p, normalize(rd + rec.mat.v*random_in_unit_sphere(g_seed)));
        attenuation = rec.mat.albedo;
        return true;
    } else if(rec.mat.type == DIELECTRIC) {
        vec3 outward_normal, refracted, 
             reflected = reflect(r_in.direction, rec.normal);
        float ni_over_nt, reflect_prob, cosine;
        
        attenuation = vec3(1);
        if (dot(r_in.direction, rec.normal) > 0.) {
            outward_normal = -rec.normal;
            ni_over_nt = rec.mat.v;
            cosine = dot(r_in.direction, rec.normal);
            cosine = sqrt(1. - rec.mat.v*rec.mat.v*(1.-cosine*cosine));
        } else {
            outward_normal = rec.normal;
            ni_over_nt = 1. / rec.mat.v;
            cosine = -dot(r_in.direction, rec.normal);
        }
        
        if (modified_refract(r_in.direction, outward_normal, ni_over_nt, refracted)) {
	        reflect_prob = schlick(cosine, rec.mat.v);
        } else {
            reflect_prob = 1.;
        }
        
        if (hash1(g_seed) < reflect_prob) {
            scattered = ray(rec.p, reflected);
        } else {
            scattered = ray(rec.p, refracted);
        }
        return true;
    }
    return false;
}

//
// Hitable, for now this is always a sphere
//

struct hitable {
    vec3 center;
    float radius;
};

bool hitable_hit(const in hitable hb, const in ray r, const in float t_min, 
                 const in float t_max, inout hit_record rec) {
    // always a sphere
    vec3 oc = r.origin - hb.center;
    float b = dot(oc, r.direction);
    float c = dot(oc, oc) - hb.radius * hb.radius;
    float discriminant = b * b - c;
    if (discriminant < 0.0) return false;

	float s = sqrt(discriminant);
	float t1 = -b - s;
	float t2 = -b + s;
	
	float t = t1 < t_min ? t2 : t1;
    if (t < t_max && t > t_min) {
        rec.t = t;
        rec.p = r.origin + t*r.direction;
        rec.normal = (rec.p - hb.center) / hb.radius;
	    return true;
    } else {
        return false;
    }
}

//
// Camera
//

struct camera {
    vec3 origin, lower_left_corner, horizontal, vertical, u, v, w;
    float lens_radius;
};

camera camera_const(const in vec3 lookfrom, const in vec3 lookat, const in vec3 vup, 
                    const in float vfov, const in float aspect, const in float aperture, 
                    const in float focus_dist) {
    camera cam;    
    cam.lens_radius = aperture / 2.;
    float theta = vfov*3.14159265359/180.;
    float half_height = tan(theta/2.);
    float half_width = aspect * half_height;
    cam.origin = lookfrom;
    cam.w = normalize(lookfrom - lookat);
    cam.u = normalize(cross(vup, cam.w));
    cam.v = cross(cam.w, cam.u);
    cam.lower_left_corner = cam.origin  - half_width*focus_dist*cam.u -half_height*focus_dist*cam.v - focus_dist*cam.w;
    cam.horizontal = 2.*half_width*focus_dist*cam.u;
    cam.vertical = 2.*half_height*focus_dist*cam.v;
    return cam;
}
    
ray camera_get_ray(camera c, vec2 uv) {
    vec2 rd = c.lens_radius*random_in_unit_disk(g_seed);
    vec3 offset = c.u * rd.x + c.v * rd.y;
    return ray(c.origin + offset, 
               normalize(c.lower_left_corner + uv.x*c.horizontal + uv.y*c.vertical - c.origin - offset));
}

//
// Color & Scene
//

bool world_hit(const in ray r, const in float t_min, 
               const in float t_max, out hit_record rec) {
    rec.t = t_max;
    bool hit = false;

  	if (hitable_hit(hitable(vec3(0,-1000,-1),1000.),r,t_min,rec.t,rec)) hit=true,rec.mat=material(LAMBERTIAN,vec3(.5),0.);

  	if (hitable_hit(hitable(vec3( 0,1,0),1.),r,t_min,rec.t,rec))        hit=true,rec.mat=material(DIELECTRIC,vec3(0),1.5);
    if (hitable_hit(hitable(vec3(-4,1,0),1.),r,t_min,rec.t,rec))        hit=true,rec.mat=material(LAMBERTIAN,vec3(.4,.2,.1),0.);
	if (hitable_hit(hitable(vec3( 4,1,0),1.),r,t_min,rec.t,rec))        hit=true,rec.mat=material(METAL     ,vec3(.7,.6,.5),0.);
    
    int NO_UNROLL = min(0,iFrame);
    for (int a = -11; a < 11+NO_UNROLL; a++) {
        for (int b = -11; b < 11+NO_UNROLL; b++) {
            float m_seed = float(a) + float(b)/1000.;
            vec3 rand1 = hash3(m_seed);            
            vec3 center = vec3(float(a)+.9*rand1.x,.2,float(b)+.9*rand1.y); 
            float choose_mat = rand1.z;
            
            if (distance(center,vec3(4,.2,0)) > .9) {
                if (choose_mat < .8) { // diffuse
                    if (hitable_hit(hitable(center,.2),r,t_min,rec.t,rec)) {
                        hit=true, rec.mat=material(LAMBERTIAN, hash3(m_seed)* hash3(m_seed),0.);
                    }
                } else if (choose_mat < 0.95) { // metal
                    if (hitable_hit(hitable(center,.2),r,t_min,rec.t,rec)) {
                        hit=true, rec.mat=material(METAL,.5*(hash3(m_seed)+1.),.5*hash1(m_seed));
                    }
                } else { // glass
                    if (hitable_hit(hitable(center,.2),r,t_min,rec.t,rec)) {
                        hit=true, rec.mat=material(DIELECTRIC,vec3(0),1.5);
                    }
                }
            }
        }
    }
    
    return hit;
}

vec3 color(in ray r) {
    vec3 col = vec3(1);  
	hit_record rec;
    
    for (int i=0; i<MAX_RECURSION; i++) {
    	if (world_hit(r, 0.001, MAX_FLOAT, rec)) {
            ray scattered;
            vec3 attenuation;
            if (material_scatter(r, rec, attenuation, scattered)) {
                col *= attenuation;
                r = scattered;
            } else {
                return vec3(0);
            }
	    } else {
            float t = .5*r.direction.y + .5;
            col *= mix(vec3(1),vec3(.5,.7,1), t);
            return col;
    	}
    }
    return vec3(0);
}

//
// Main
//

void mainImage( out vec4 frag_color, in vec2 frag_coord ) {
    if (ivec2(frag_coord) == ivec2(0)) {
        frag_color = iResolution.xyxy;
    } else {
        g_seed = float(base_hash(floatBitsToUint(frag_coord)))/float(0xffffffffU)+iTime;

        vec2 uv = (frag_coord + hash2(g_seed))/iResolution.xy;
        float aspect = iResolution.x/iResolution.y;
        vec3 lookfrom = vec3(13,2,3);
        vec3 lookat = vec3(0);
        
        camera cam = camera_const(lookfrom, lookat, vec3(0,1,0), 20., aspect, .1, 10.);
        ray r = camera_get_ray(cam, uv);
        vec3 col = color(r);
        
        if (texelFetch(iChannel0, ivec2(0),0).xy == iResolution.xy) {        
	        frag_color = vec4(col,1) + texelFetch(iChannel0, ivec2(frag_coord), 0);
        } else {        
	        frag_color = vec4(col,1);
        }
    }
}`,name:`Buffer A`,description:``,type:`buffer`}]},{ver:`0.1`,info:{id:`4tGcWD`,date:`1536332983`,viewed:3808,name:`RIOW 2.06: Rectangles and lights`,description:`These shaders are my implementation of the ray/path tracer described in the book "Raytracing in one weekend" by Peter Shirley. Note: I didn't implement Perlin noise but used value noise instead.`,likes:17,published:`Public API`,usePreview:0,tags:[`raytracing`,`ray`,`tracer`,`one`,`in`,`path`,`weekend`]},renderpass:[{inputs:[{id:`4dXGR8`,filepath:`/media/previz/buffer00.png`,type:`buffer`,channel:0,sampler:{filter:`linear`,wrap:`clamp`,vflip:`true`,srgb:`false`,internal:`byte`},published:1}],outputs:[{id:`4dfGRr`,channel:0}],code:`// Ray tracing: the next week, chapter 6: Rectangles and lights. Created by Reinder Nijhoff 2018
// Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License.
// @reindernijhoff
//
// https://www.shadertoy.com/view/4tGcWD
//
// These shaders are my implementation of the raytracer described in the (excellent) 
// book "Ray tracing in one weekend" and "Ray tracing: the next week"[1] by Peter Shirley 
// (@Peter_shirley). I have tried to follow the code from his book as much as possible, but 
// I had to make some changes to get it running in a fragment shader:
//
// - There are no classes (and methods) in glsl so I use structs and functions instead. 
//   Inheritance is implemented by adding a type variable to the struct and adding ugly 
//   if/else statements to the (not so overloaded) functions.
// - The scene description is procedurally implemented in the world_hit function to save
//   memory.
// - The color function is implemented using a loop because it is not possible to have a 
//   recursive function call in glsl.
// - Only one sample per pixel per frame is calculated. Samples of all frames are added 
//   in Buffer A and averaged in the Image tab.
//
// Besides that, I also made some other design choices. Most notably:
//
// - In my code ray.direction is always a unit vector so I could clean up the rest of
//   the code by removing some implicit normalizations.
// - Cosine weighted hemisphere sampling is used for the Lambertian material.
//
// You can find the raytracer / pathtracer in Buffer A.
//
// = Ray tracing in one week =
// Chapter  7: Diffuse                           https://www.shadertoy.com/view/llVcDz
// Chapter  9: Dielectrics                       https://www.shadertoy.com/view/MlVcDz
// Chapter 11: Defocus blur                      https://www.shadertoy.com/view/XlGcWh
// Chapter 12: Where next?                       https://www.shadertoy.com/view/XlycWh
//
// = Ray tracing: the next week =
// Chapter  6: Rectangles and lights             https://www.shadertoy.com/view/4tGcWD
// Chapter  7: Instances                         https://www.shadertoy.com/view/XlGcWD
// Chapter  8: Volumes                           https://www.shadertoy.com/view/XtyyDD
// Chapter  9: A Scene Testing All New Features  https://www.shadertoy.com/view/MtycDD
//
// [1] http://in1weekend.blogspot.com/2016/01/ray-tracing-in-one-weekend.html
//

void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
    vec4 data = texelFetch(iChannel0, ivec2(fragCoord),0);
    fragColor = vec4(sqrt(data.rgb/data.w),1.0);
}`,name:`Image`,description:``,type:`image`},{inputs:[{id:`4dXGR8`,filepath:`/media/previz/buffer00.png`,type:`buffer`,channel:0,sampler:{filter:`linear`,wrap:`clamp`,vflip:`true`,srgb:`false`,internal:`byte`},published:1}],outputs:[{id:`4dXGR8`,channel:0}],code:`// Ray tracing: the next week, chapter 6: Rectangles and lights. Created by Reinder Nijhoff 2018
// @reindernijhoff
//
// https://www.shadertoy.com/view/4tGcWD
//
// These shaders are my implementation of the raytracer described in the (excellent) 
// book "Ray tracing in one weekend" and "Ray tracing: the next week"[1] by Peter Shirley 
// (@Peter_shirley). I have tried to follow the code from his book as much as possible.
//
// [1] http://in1weekend.blogspot.com/2016/01/ray-tracing-in-one-weekend.html
//

#define MAX_FLOAT 1e5
#define EPSILON 0.0001
#define MAX_RECURSION (6+min(0,iFrame))

#define LAMBERTIAN 0
#define METAL 1
#define DIELECTRIC 2
#define DIFFUSE_LIGHT 3

#define SPHERE 0
#define MOVING_SPHERE 1
#define BOX 2

#define SOLID 0
#define NOISE 1

//
// Hash functions by Nimitz:
// https://www.shadertoy.com/view/Xt3cDn
//

uint base_hash(uvec2 p) {
    p = 1103515245U*((p >> 1U)^(p.yx));
    uint h32 = 1103515245U*((p.x)^(p.y>>3U));
    return h32^(h32 >> 16);
}

float g_seed = 0.;

float hash1(inout float seed) {
    uint n = base_hash(floatBitsToUint(vec2(seed+=.1,seed+=.1)));
    return float(n)/float(0xffffffffU);
}

vec2 hash2(inout float seed) {
    uint n = base_hash(floatBitsToUint(vec2(seed+=.1,seed+=.1)));
    uvec2 rz = uvec2(n, n*48271U);
    return vec2(rz.xy & uvec2(0x7fffffffU))/float(0x7fffffff);
}

vec3 hash3(inout float seed) {
    uint n = base_hash(floatBitsToUint(vec2(seed+=.1,seed+=.1)));
    uvec3 rz = uvec3(n, n*16807U, n*48271U);
    return vec3(rz & uvec3(0x7fffffffU))/float(0x7fffffff);
}

//
// Noise functions by Inigo Quilez:
// https://www.shadertoy.com/view/4sfGzS
//

float hash(vec3 p) {
    p  = fract( p*0.3183099+.1 );
	p *= 17.0;
    return 2. * fract( p.x*p.y*p.z*(p.x+p.y+p.z) ) - 1.;
}

float noise(const in vec3 x ) {
    vec3 p = floor(x);
    vec3 f = fract(x);
    f = f*f*(3.0-2.0*f);
	
    return mix(mix(mix( hash(p+vec3(0,0,0)), 
                        hash(p+vec3(1,0,0)),f.x),
                   mix( hash(p+vec3(0,1,0)), 
                        hash(p+vec3(1,1,0)),f.x),f.y),
               mix(mix( hash(p+vec3(0,0,1)), 
                        hash(p+vec3(1,0,1)),f.x),
                   mix( hash(p+vec3(0,1,1)), 
                        hash(p+vec3(1,1,1)),f.x),f.y),f.z);
}

float fbm(const in vec3 p, const in int octaves) {
    float accum = 0.;
    vec3 temp_p = p;
    float weight = 1.;
     
    for (int i=0; i<octaves; i++) {
        accum += weight * noise(temp_p);
        weight *= .5;
        temp_p *= 2.;
    }
    return abs(accum);
}

//
// Ray trace helper functions
//

float schlick(float cosine, float ior) {
    float r0 = (1.-ior)/(1.+ior);
    r0 = r0*r0;
    return r0 + (1.-r0)*pow((1.-cosine),5.);
}

bool modified_refract(const in vec3 v, const in vec3 n, const in float ni_over_nt, 
                      out vec3 refracted) {
    float dt = dot(v, n);
    float discriminant = 1. - ni_over_nt*ni_over_nt*(1.-dt*dt);
    if (discriminant > 0.) {
        refracted = ni_over_nt*(v - n*dt) - n*sqrt(discriminant);
        return true;
    } else { 
        return false;
    }
}

vec3 random_cos_weighted_hemisphere_direction( const vec3 n, inout float seed ) {
  	vec2 r = hash2(seed);
	vec3  uu = normalize(cross(n, abs(n.y) > .5 ? vec3(1.,0.,0.) : vec3(0.,1.,0.)));
	vec3  vv = cross(uu, n);
	float ra = sqrt(r.y);
	float rx = ra*cos(6.28318530718*r.x); 
	float ry = ra*sin(6.28318530718*r.x);
	float rz = sqrt(1.-r.y);
	vec3  rr = vec3(rx*uu + ry*vv + rz*n);
    return normalize(rr);
}

vec2 random_in_unit_disk(inout float seed) {
    vec2 h = hash2(seed) * vec2(1.,6.28318530718);
    float phi = h.y;
    float r = sqrt(h.x);
	return r * vec2(sin(phi),cos(phi));
}

vec3 random_in_unit_sphere(inout float seed) {
    vec3 h = hash3(seed) * vec3(2.,6.28318530718,1.)-vec3(1,0,0);
    float phi = h.y;
    float r = pow(h.z, 1./3.);
	return r * vec3(sqrt(1.-h.x*h.x)*vec2(sin(phi),cos(phi)),h.x);
}

//
// Ray
//

struct ray {
    vec3 origin, direction;
    float time;
};

//
// Texture
//

struct texture_ {
    int type;
    vec3 v;
};

vec3 texture_value(const in texture_ t, const in vec3 p) {
    if (t.type == SOLID) {
	    return t.v;
    } else if (t.type == NOISE) {
        return vec3(.5*(1. + sin(t.v.x*p.z + 5.*fbm((t.v.x*.5)*p, 7))));
    }
}

#define NO_TEX texture_(SOLID,vec3(0))

//
// Material
//

struct material {
    int type;
    texture_ albedo;
    texture_ emit;
    float v;
};

//
// Hit record
//

struct hit_record {
    float t;
    vec3 p, normal;
    material mat;
};

bool material_scatter(const in ray r_in, const in hit_record rec, out vec3 attenuation, 
                      out ray scattered) {
    if(rec.mat.type == LAMBERTIAN) {
        scattered = ray(rec.p, random_cos_weighted_hemisphere_direction(rec.normal, g_seed), r_in.time);
        attenuation = texture_value(rec.mat.albedo, rec.p);
        return true;
    } else if(rec.mat.type == METAL) {
        vec3 rd = reflect(r_in.direction, rec.normal);
        scattered = ray(rec.p, normalize(rd + rec.mat.v*random_in_unit_sphere(g_seed)), r_in.time);
        attenuation = texture_value(rec.mat.albedo, rec.p);
        return true;
    } else if(rec.mat.type == DIELECTRIC) {
        vec3 outward_normal, refracted, 
             reflected = reflect(r_in.direction, rec.normal);
        float ni_over_nt, reflect_prob, cosine;
        
        attenuation = vec3(1);
        if (dot(r_in.direction, rec.normal) > 0.) {
            outward_normal = -rec.normal;
            ni_over_nt = rec.mat.v;
            cosine = dot(r_in.direction, rec.normal);
            cosine = sqrt(1. - rec.mat.v*rec.mat.v*(1.-cosine*cosine));
        } else {
            outward_normal = rec.normal;
            ni_over_nt = 1. / rec.mat.v;
            cosine = -dot(r_in.direction, rec.normal);
        }
        
        if (modified_refract(r_in.direction, outward_normal, ni_over_nt, refracted)) {
	        reflect_prob = schlick(cosine, rec.mat.v);
        } else {
            reflect_prob = 1.;
        }
        
        if (hash1(g_seed) < reflect_prob) {
            scattered = ray(rec.p, reflected, r_in.time);
        } else {
            scattered = ray(rec.p, refracted, r_in.time);
        }
        return true;
    }
    return false;
}

vec3 material_emitted(const in hit_record rec) {
    if (rec.mat.type == DIFFUSE_LIGHT) {
        return texture_value(rec.mat.emit, rec.p);
    } else {
        return vec3(0);
    }
}

//
// Hitable
//

struct hitable {
    int type;
    vec3 center, v3; // v3 is speed for moving sphere (with center at t=0) 
                     //    or dimensions for box.
    float v;         // Radius for sphere.
};
    

bool sphere_intersect(const in ray r, const in float t_min, const in float t_max,
                      const in vec3 center, const in float radius, inout float dist) {
	vec3 oc = r.origin - center;
    float b = dot(oc, r.direction);
    float c = dot(oc, oc) - radius * radius;
    float discriminant = b * b - c;
    if (discriminant < 0.0) return false;

	float s = sqrt(discriminant);
	float t1 = -b - s;
	float t2 = -b + s;
	
	float t = t1 < t_min ? t2 : t1;
    if (t < t_max && t > t_min) {
        dist = t;
	    return true;
    } else {
        return false;
    }
}

bool box_intersect(const in ray r, const in float t_min, const in float t_max,
                   const in vec3 center, const in vec3 rad, out vec3 normal, inout float dist) {
    vec3 m = 1./r.direction;
    vec3 n = m*(r.origin - center);
    vec3 k = abs(m)*rad;
	
    vec3 t1 = -n - k;
    vec3 t2 = -n + k;

	float tN = max( max( t1.x, t1.y ), t1.z );
	float tF = min( min( t2.x, t2.y ), t2.z );
	
	if( tN > tF || tF < 0.) return false;
    
    float t = tN < t_min ? tF : tN;
    if (t < t_max && t > t_min) {
        dist = t;
		normal = -sign(r.direction)*step(t1.yzx,t1.xyz)*step(t1.zxy,t1.xyz);
	    return true;
    } else {
        return false;
    }
}

bool hitable_hit(const in hitable hb, const in ray r, const in float t_min, 
                 const in float t_max, inout hit_record rec) {
    
    if(hb.type == SPHERE || hb.type == MOVING_SPHERE) {
        vec3 center = hb.type == SPHERE ? hb.center : hb.center + r.time * hb.v3;
        float radius = hb.v;
        float dist;
        if (sphere_intersect(r, t_min, t_max, center, radius, dist)) {
            rec.t = dist;
            rec.p = r.origin + dist*r.direction;
            rec.normal = (rec.p - center) / hb.v;
            return true;
        } else {
            return false;
        }
    } else { // box
        float dist;
        vec3 normal;
        if (box_intersect(r, t_min, t_max, hb.center, hb.v3, normal, dist)) {
            rec.t = dist;
            rec.p = r.origin + dist*r.direction;
            rec.normal = normal;
            return true;
        } else {
            return false;
        }
    }
}

//
// Camera
//

struct camera {
    vec3 origin, lower_left_corner, horizontal, vertical, u, v, w;
    float time0, time1, lens_radius;
};

camera camera_const(const in vec3 lookfrom, const in vec3 lookat, const in vec3 vup, 
                    const in float vfov, const in float aspect, const in float aperture, 
                    const in float focus_dist, const in float time0, const in float time1) {
    camera cam;    
    cam.lens_radius = aperture / 2.;
    float theta = vfov*3.14159265359/180.;
    float half_height = tan(theta/2.);
    float half_width = aspect * half_height;
    cam.origin = lookfrom;
    cam.w = normalize(lookfrom - lookat);
    cam.u = normalize(cross(vup, cam.w));
    cam.v = cross(cam.w, cam.u);
    cam.lower_left_corner = cam.origin  - half_width*focus_dist*cam.u -half_height*focus_dist*cam.v - focus_dist*cam.w;
    cam.horizontal = 2.*half_width*focus_dist*cam.u;
    cam.vertical = 2.*half_height*focus_dist*cam.v;
    cam.time0 = time0;
    cam.time1 = time1;
    return cam;
}
    
ray camera_get_ray(camera c, vec2 uv) {
    vec2 rd = c.lens_radius*random_in_unit_disk(g_seed);
    vec3 offset = c.u * rd.x + c.v * rd.y;
    return ray(c.origin + offset, 
               normalize(c.lower_left_corner + uv.x*c.horizontal + uv.y*c.vertical - c.origin - offset),
               mix(c.time0, c.time1, hash1(g_seed)));
}

//
// Color & Scene
//

bool world_hit(const in ray r, const in float t_min, 
               const in float t_max, out hit_record rec) {
    rec.t = t_max;
    bool hit = false;

    const material perlin = material(LAMBERTIAN, texture_(NOISE,vec3(4.)), NO_TEX,0.);
    const material light  = material(DIFFUSE_LIGHT, NO_TEX, texture_(SOLID,vec3(4.)),0.);
    
  	if (hitable_hit(hitable(SPHERE, vec3(0,-1000,0), vec3(0), 1000.),r,t_min,rec.t,rec)) 
        hit=true, rec.mat=perlin;

  	if (hitable_hit(hitable(SPHERE, vec3(0,2,0), vec3(0), 2.),r,t_min,rec.t,rec)) 
        hit=true, rec.mat=perlin;

  	if (hitable_hit(hitable(SPHERE, vec3(0,7,0), vec3(0), 2.),r,t_min,rec.t,rec)) 
        hit=true, rec.mat=light;

  	if (hitable_hit(hitable(BOX, vec3(4,2,-2), vec3(1,1,0), 2.),r,t_min,rec.t,rec)) 
        hit=true, rec.mat=light;
    
    return hit;
}

vec3 color(in ray r) {
    vec3 col = vec3(0);
    vec3 emitted = vec3(0);
	hit_record rec;
    
    for (int i=0; i<MAX_RECURSION; i++) {
    	if (world_hit(r, EPSILON, MAX_FLOAT, rec)) {
            ray scattered;
            vec3 attenuation;
            vec3 emit = material_emitted(rec);
            emitted += i == 0 ? emit : col * emit;
            
            if (material_scatter(r, rec, attenuation, scattered)) {
                col = i == 0 ? attenuation : col * attenuation;
                r = scattered;
            } else {
                return emitted;
            }
	    } else {
            return emitted;
    	}
        if(dot(col,col) < 0.0001) return emitted; // optimisation
    }
    return emitted;
}

//
// Main
//

void mainImage( out vec4 frag_color, in vec2 frag_coord ) {
    if (ivec2(frag_coord) == ivec2(0)) {
        frag_color = iResolution.xyxy;
    } else {
        g_seed = float(base_hash(floatBitsToUint(frag_coord)))/float(0xffffffffU)+iTime;

        vec2 uv = (frag_coord + hash2(g_seed))/iResolution.xy;
        float aspect = iResolution.x/iResolution.y;
        vec3 lookfrom = vec3(25,3.5,6);
        vec3 lookat = vec3(0,2,0);
        
        camera cam = camera_const(lookfrom, lookat, vec3(0,1,0), 20., aspect, .0, 10., 0., 1.);
        ray r = camera_get_ray(cam, uv);
        vec3 col = color(r);
        
        if (texelFetch(iChannel0, ivec2(0),0).xy == iResolution.xy) {        
	        frag_color = vec4(col,1) + texelFetch(iChannel0, ivec2(frag_coord), 0);
        } else {        
	        frag_color = vec4(col,1);
        }
    }
}`,name:`Buffer A`,description:``,type:`buffer`}]},{ver:`0.1`,info:{id:`XlGcWD`,date:`1536332988`,viewed:4336,name:`RIOW 2.07: Instances`,description:`The Cornell box. These shaders are my implementation of the ray/path tracer described in the book "Raytracing in one weekend" by Peter Shirley. I didn't implement the rectangle-primitive, so I have used the box-primitive for the thin walls.`,likes:14,published:`Public API`,usePreview:0,tags:[`raytracing`,`ray`,`cornell`,`tracer`,`one`,`in`,`path`,`weekend`]},renderpass:[{inputs:[{id:`4dXGR8`,filepath:`/media/previz/buffer00.png`,type:`buffer`,channel:0,sampler:{filter:`linear`,wrap:`clamp`,vflip:`true`,srgb:`false`,internal:`byte`},published:1}],outputs:[{id:`4dfGRr`,channel:0}],code:`// Ray tracing: the next week, chapter 7: Instances. Created by Reinder Nijhoff 2018
// Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License.
// @reindernijhoff
//
// https://www.shadertoy.com/view/XlGcWD
//
// These shaders are my implementation of the raytracer described in the (excellent) 
// book "Ray tracing in one weekend" and "Ray tracing: the next week"[1] by Peter Shirley 
// (@Peter_shirley). I have tried to follow the code from his book as much as possible, but 
// I had to make some changes to get it running in a fragment shader:
//
// - There are no classes (and methods) in glsl so I use structs and functions instead. 
//   Inheritance is implemented by adding a type variable to the struct and adding ugly 
//   if/else statements to the (not so overloaded) functions.
// - The scene description is procedurally implemented in the world_hit function to save
//   memory.
// - The color function is implemented using a loop because it is not possible to have a 
//   recursive function call in glsl.
// - Only one sample per pixel per frame is calculated. Samples of all frames are added 
//   in Buffer A and averaged in the Image tab.
//
// Besides that, I also made some other design choices. Most notably:
//
// - In my code ray.direction is always a unit vector so I could clean up the rest of
//   the code by removing some implicit normalizations.
// - Cosine weighted hemisphere sampling is used for the Lambertian material.
//
// You can find the raytracer / pathtracer in Buffer A.
//
// = Ray tracing in one week =
// Chapter  7: Diffuse                           https://www.shadertoy.com/view/llVcDz
// Chapter  9: Dielectrics                       https://www.shadertoy.com/view/MlVcDz
// Chapter 11: Defocus blur                      https://www.shadertoy.com/view/XlGcWh
// Chapter 12: Where next?                       https://www.shadertoy.com/view/XlycWh
//
// = Ray tracing: the next week =
// Chapter  6: Rectangles and lights             https://www.shadertoy.com/view/4tGcWD
// Chapter  7: Instances                         https://www.shadertoy.com/view/XlGcWD
// Chapter  8: Volumes                           https://www.shadertoy.com/view/XtyyDD
// Chapter  9: A Scene Testing All New Features  https://www.shadertoy.com/view/MtycDD
//
// [1] http://in1weekend.blogspot.com/2016/01/ray-tracing-in-one-weekend.html
//

void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
    vec4 data = texelFetch(iChannel0, ivec2(fragCoord),0);
    fragColor = vec4(sqrt(data.rgb/data.w),1.0);
}`,name:`Image`,description:``,type:`image`},{inputs:[{id:`4dXGR8`,filepath:`/media/previz/buffer00.png`,type:`buffer`,channel:0,sampler:{filter:`linear`,wrap:`clamp`,vflip:`true`,srgb:`false`,internal:`byte`},published:1}],outputs:[{id:`4dXGR8`,channel:0}],code:`// Ray tracing: the next week, chapter 7: Instances. Created by Reinder Nijhoff 2018
// @reindernijhoff
//
// https://www.shadertoy.com/view/XlGcWD
//
// These shaders are my implementation of the raytracer described in the (excellent) 
// book "Ray tracing in one weekend" and "Ray tracing: the next week"[1] by Peter Shirley 
// (@Peter_shirley). I have tried to follow the code from his book as much as possible.
//
// [1] http://in1weekend.blogspot.com/2016/01/ray-tracing-in-one-weekend.html
//

#define MAX_FLOAT 1e5
#define EPSILON 0.01
#define MAX_RECURSION (64+min(0,iFrame))

#define LAMBERTIAN 0
#define METAL 1
#define DIELECTRIC 2
#define DIFFUSE_LIGHT 3

#define SPHERE 0
#define MOVING_SPHERE 1
#define BOX 2

#define SOLID 0
#define NOISE 1

//
// Hash functions by Nimitz:
// https://www.shadertoy.com/view/Xt3cDn
//

uint base_hash(uvec2 p) {
    p = 1103515245U*((p >> 1U)^(p.yx));
    uint h32 = 1103515245U*((p.x)^(p.y>>3U));
    return h32^(h32 >> 16);
}

float g_seed = 0.;

float hash1(inout float seed) {
    uint n = base_hash(floatBitsToUint(vec2(seed+=.1,seed+=.1)));
    return float(n)/float(0xffffffffU);
}

vec2 hash2(inout float seed) {
    uint n = base_hash(floatBitsToUint(vec2(seed+=.1,seed+=.1)));
    uvec2 rz = uvec2(n, n*48271U);
    return vec2(rz.xy & uvec2(0x7fffffffU))/float(0x7fffffff);
}

vec3 hash3(inout float seed) {
    uint n = base_hash(floatBitsToUint(vec2(seed+=.1,seed+=.1)));
    uvec3 rz = uvec3(n, n*16807U, n*48271U);
    return vec3(rz & uvec3(0x7fffffffU))/float(0x7fffffff);
}

//
// Noise functions by Inigo Quilez:
// https://www.shadertoy.com/view/4sfGzS
//

float hash(vec3 p) {
    p  = fract( p*0.3183099+.1 );
	p *= 17.0;
    return 2. * fract( p.x*p.y*p.z*(p.x+p.y+p.z) ) - 1.;
}

float noise(const in vec3 x ) {
    vec3 p = floor(x);
    vec3 f = fract(x);
    f = f*f*(3.0-2.0*f);
	
    return mix(mix(mix( hash(p+vec3(0,0,0)), 
                        hash(p+vec3(1,0,0)),f.x),
                   mix( hash(p+vec3(0,1,0)), 
                        hash(p+vec3(1,1,0)),f.x),f.y),
               mix(mix( hash(p+vec3(0,0,1)), 
                        hash(p+vec3(1,0,1)),f.x),
                   mix( hash(p+vec3(0,1,1)), 
                        hash(p+vec3(1,1,1)),f.x),f.y),f.z);
}

float fbm(const in vec3 p, const in int octaves) {
    float accum = 0.;
    vec3 temp_p = p;
    float weight = 1.;
     
    for (int i=0; i<octaves; i++) {
        accum += weight * noise(temp_p);
        weight *= .5;
        temp_p *= 2.;
    }
    return abs(accum);
}

//
// Ray trace helper functions
//

float schlick(float cosine, float ior) {
    float r0 = (1.-ior)/(1.+ior);
    r0 = r0*r0;
    return r0 + (1.-r0)*pow((1.-cosine),5.);
}

bool modified_refract(const in vec3 v, const in vec3 n, const in float ni_over_nt, 
                      out vec3 refracted) {
    float dt = dot(v, n);
    float discriminant = 1. - ni_over_nt*ni_over_nt*(1.-dt*dt);
    if (discriminant > 0.) {
        refracted = ni_over_nt*(v - n*dt) - n*sqrt(discriminant);
        return true;
    } else { 
        return false;
    }
}

vec3 random_cos_weighted_hemisphere_direction( const vec3 n, inout float seed ) {
  	vec2 r = hash2(seed);
	vec3  uu = normalize(cross(n, abs(n.y) > .5 ? vec3(1.,0.,0.) : vec3(0.,1.,0.)));
	vec3  vv = cross(uu, n);
	float ra = sqrt(r.y);
	float rx = ra*cos(6.28318530718*r.x); 
	float ry = ra*sin(6.28318530718*r.x);
	float rz = sqrt(1.-r.y);
	vec3  rr = vec3(rx*uu + ry*vv + rz*n);
    return normalize(rr);
}

vec2 random_in_unit_disk(inout float seed) {
    vec2 h = hash2(seed) * vec2(1.,6.28318530718);
    float phi = h.y;
    float r = sqrt(h.x);
	return r * vec2(sin(phi),cos(phi));
}

vec3 random_in_unit_sphere(inout float seed) {
    vec3 h = hash3(seed) * vec3(2.,6.28318530718,1.)-vec3(1,0,0);
    float phi = h.y;
    float r = pow(h.z, 1./3.);
	return r * vec3(sqrt(1.-h.x*h.x)*vec2(sin(phi),cos(phi)),h.x);
}

vec3 rotate_y(const in vec3 p, const in float t) {
    float co = cos(t);
    float si = sin(t);
    vec2 xz = mat2(co,si,-si,co)*p.xz;
    return vec3(xz.x, p.y, xz.y);
}

//
// Ray
//

struct ray {
    vec3 origin, direction;
    float time;
};

ray ray_translate(const in ray r, const in vec3 t) {
    ray rt = r;
    rt.origin -= t;
    return rt;
}

ray ray_rotate_y(const in ray r, const in float t) {
    ray rt = r;
    rt.origin = rotate_y(rt.origin, t);
    rt.direction = rotate_y(rt.direction, t);
    return rt;
}

//
// Texture
//

struct texture_ {
    int type;
    vec3 v;
};

vec3 texture_value(const in texture_ t, const in vec3 p) {
    if (t.type == SOLID) {
	    return t.v;
    } else if (t.type == NOISE) {
        return vec3(.5*(1. + sin(t.v.x*p.z + 5.*fbm((t.v.x*.5)*p, 7))));
    }
}

#define NO_TEX texture_(SOLID,vec3(0))

//
// Material
//

struct material {
    int type;
    texture_ albedo;
    texture_ emit;
    float v;
};

//
// Hit record
//

struct hit_record {
    float t;
    vec3 p, normal;
    material mat;
};

hit_record hit_record_translate(const in hit_record h, const in vec3 t) {
    hit_record ht = h;
    ht.p -= t;
    return ht;
}
   
hit_record hit_record_rotate_y(const in hit_record h, const in float t) {
    hit_record ht = h;
    ht.p = rotate_y(ht.p, t);
    ht.normal = rotate_y(ht.normal, t);
    return ht;
}

bool material_scatter(const in ray r_in, const in hit_record rec, out vec3 attenuation, 
                      out ray scattered) {
    if(rec.mat.type == LAMBERTIAN) {
        scattered = ray(rec.p, random_cos_weighted_hemisphere_direction(rec.normal, g_seed), r_in.time);
        attenuation = texture_value(rec.mat.albedo, rec.p);
        return true;
    } else if(rec.mat.type == METAL) {
        vec3 rd = reflect(r_in.direction, rec.normal);
        scattered = ray(rec.p, normalize(rd + rec.mat.v*random_in_unit_sphere(g_seed)), r_in.time);
        attenuation = texture_value(rec.mat.albedo, rec.p);
        return true;
    } else if(rec.mat.type == DIELECTRIC) {
        vec3 outward_normal, refracted, 
             reflected = reflect(r_in.direction, rec.normal);
        float ni_over_nt, reflect_prob, cosine;
        
        attenuation = vec3(1);
        if (dot(r_in.direction, rec.normal) > 0.) {
            outward_normal = -rec.normal;
            ni_over_nt = rec.mat.v;
            cosine = dot(r_in.direction, rec.normal);
            cosine = sqrt(1. - rec.mat.v*rec.mat.v*(1.-cosine*cosine));
        } else {
            outward_normal = rec.normal;
            ni_over_nt = 1. / rec.mat.v;
            cosine = -dot(r_in.direction, rec.normal);
        }
        
        if (modified_refract(r_in.direction, outward_normal, ni_over_nt, refracted)) {
	        reflect_prob = schlick(cosine, rec.mat.v);
        } else {
            reflect_prob = 1.;
        }
        
        if (hash1(g_seed) < reflect_prob) {
            scattered = ray(rec.p, reflected, r_in.time);
        } else {
            scattered = ray(rec.p, refracted, r_in.time);
        }
        return true;
    }
    return false;
}

vec3 material_emitted(const in hit_record rec) {
    if (rec.mat.type == DIFFUSE_LIGHT) {
        return texture_value(rec.mat.emit, rec.p);
    } else {
        return vec3(0);
    }
}

//
// Hitable
//

struct hitable {
    int type;
    vec3 center, v3; // v3 is speed for moving sphere (with center at t=0) 
                     //    or dimensions for box.
    float v;         // Radius for sphere.
};
    

bool sphere_intersect(const in ray r, const in float t_min, const in float t_max,
                      const in vec3 center, const in float radius, inout float dist) {
	vec3 oc = r.origin - center;
    float b = dot(oc, r.direction);
    float c = dot(oc, oc) - radius * radius;
    float discriminant = b * b - c;
    if (discriminant < 0.0) return false;

	float s = sqrt(discriminant);
	float t1 = -b - s;
	float t2 = -b + s;
	
	float t = t1 < t_min ? t2 : t1;
    if (t < t_max && t > t_min) {
        dist = t;
	    return true;
    } else {
        return false;
    }
}

bool box_intersect(const in ray r, const in float t_min, const in float t_max,
                   const in vec3 center, const in vec3 rad, out vec3 normal, inout float dist) {
    vec3 m = 1./r.direction;
    vec3 n = m*(r.origin - center);
    vec3 k = abs(m)*rad;
	
    vec3 t1 = -n - k;
    vec3 t2 = -n + k;

	float tN = max( max( t1.x, t1.y ), t1.z );
	float tF = min( min( t2.x, t2.y ), t2.z );
	
	if( tN > tF || tF < 0.) return false;
    
    float t = tN < t_min ? tF : tN;
    if (t < t_max && t > t_min) {
        dist = t;
		normal = -sign(r.direction)*step(t1.yzx,t1.xyz)*step(t1.zxy,t1.xyz);
	    return true;
    } else {
        return false;
    }
}

bool hitable_hit(const in hitable hb, const in ray r, const in float t_min, 
                 const in float t_max, inout hit_record rec) {
    
    if(hb.type == SPHERE || hb.type == MOVING_SPHERE) {
        vec3 center = hb.type == SPHERE ? hb.center : hb.center + r.time * hb.v3;
        float radius = hb.v;
        float dist;
        if (sphere_intersect(r, t_min, t_max, center, radius, dist)) {
            rec.t = dist;
            rec.p = r.origin + dist*r.direction;
            rec.normal = (rec.p - center) / hb.v;
            return true;
        } else {
            return false;
        }
    } else { // box
        float dist;
        vec3 normal;
        if (box_intersect(r, t_min, t_max, hb.center, hb.v3, normal, dist)) {
            rec.t = dist;
            rec.p = r.origin + dist*r.direction;
            rec.normal = normal;
            return true;
        } else {
            return false;
        }
    }
}

//
// Camera
//

struct camera {
    vec3 origin, lower_left_corner, horizontal, vertical, u, v, w;
    float time0, time1, lens_radius;
};

camera camera_const(const in vec3 lookfrom, const in vec3 lookat, const in vec3 vup, 
                    const in float vfov, const in float aspect, const in float aperture, 
                    const in float focus_dist, const in float time0, const in float time1) {
    camera cam;    
    cam.lens_radius = aperture / 2.;
    float theta = vfov*3.14159265359/180.;
    float half_height = tan(theta/2.);
    float half_width = aspect * half_height;
    cam.origin = lookfrom;
    cam.w = normalize(lookfrom - lookat);
    cam.u = normalize(cross(vup, cam.w));
    cam.v = cross(cam.w, cam.u);
    cam.lower_left_corner = cam.origin  - half_width*focus_dist*cam.u -half_height*focus_dist*cam.v - focus_dist*cam.w;
    cam.horizontal = 2.*half_width*focus_dist*cam.u;
    cam.vertical = 2.*half_height*focus_dist*cam.v;
    cam.time0 = time0;
    cam.time1 = time1;
    return cam;
}
    
ray camera_get_ray(camera c, vec2 uv) {
    vec2 rd = c.lens_radius*random_in_unit_disk(g_seed);
    vec3 offset = c.u * rd.x + c.v * rd.y;
    return ray(c.origin + offset, 
               normalize(c.lower_left_corner + uv.x*c.horizontal + uv.y*c.vertical - c.origin - offset),
               mix(c.time0, c.time1, hash1(g_seed)));
}

//
// Color & Scene
//

bool world_hit(const in ray r, const in float t_min, 
               const in float t_max, out hit_record rec) {
    rec.t = t_max;
    bool hit = false;

    const material red = material(LAMBERTIAN, texture_(SOLID,vec3(.65,.05,.05)), NO_TEX,0.);
    const material white = material(LAMBERTIAN, texture_(SOLID,vec3(.73)), NO_TEX,0.);
    const material green = material(LAMBERTIAN, texture_(SOLID,vec3(.12,.45,.15)), NO_TEX,0.);

    const material light = material(DIFFUSE_LIGHT, NO_TEX, texture_(SOLID,vec3(15)),0.);
    
  	if (hitable_hit(hitable(BOX, vec3(556,277.5,277.5), vec3(1,277.5,277.5), 0.),r,t_min,rec.t,rec)) 
        hit=true, rec.mat=green;
    if (hitable_hit(hitable(BOX, vec3(-1,277.5,277.5), vec3(1,277.5,277.5), 0.),r,t_min,rec.t,rec)) 
        hit=true, rec.mat=red;
   
    if (hitable_hit(hitable(BOX, vec3(277.5,556,277.5), vec3(277.5,1,277.5), 0.),r,t_min,rec.t,rec)) 
        hit=true, rec.mat=white;
    if (hitable_hit(hitable(BOX, vec3(277.5,-1,277.5), vec3(277.5,1,277.5), 0.),r,t_min,rec.t,rec)) 
        hit=true, rec.mat=white;
    if (hitable_hit(hitable(BOX, vec3(277.5,277.5,556), vec3(277.5,277.5,1), 0.),r,t_min,rec.t,rec)) 
        hit=true, rec.mat=white;
    
    if (hitable_hit(hitable(BOX, vec3(278,555,279.5), vec3(65,1,52.5), 0.),r,t_min,rec.t,rec)) 
        hit=true, rec.mat=light;   
   
    ray r_ = ray_rotate_y(ray_translate(r, vec3(130,0,65)), -18./180.*3.14159265359);
    hit_record rec_ = rec;    
    if (hitable_hit(hitable(BOX, vec3(82.5), vec3(82.5), 0.),r_,t_min,rec.t,rec_)) 
        hit=true, 
        rec=hit_record_translate(hit_record_rotate_y(rec_, 18./180.*3.14159265359),-vec3(130,0,65.)), 
        rec.mat=white;
    
	r_ = ray_rotate_y(ray_translate(r, vec3(265,0,295)), 15./180.*3.14159265359);
    rec_ = rec;    
    if (hitable_hit(hitable(BOX, vec3(82.5,165,82.5), vec3(82.5,165,82.5), 0.),r_,t_min,rec.t,rec_)) 
        hit=true, 
        rec=hit_record_translate(hit_record_rotate_y(rec_, -15./180.*3.14159265359),-vec3(265,0,295)), 
        rec.mat=white;
  
    return hit;
}

vec3 color(in ray r) {
    vec3 col = vec3(0);
    vec3 emitted = vec3(0);
	hit_record rec;
    
    for (int i=0; i<MAX_RECURSION; i++) {
    	if (world_hit(r, EPSILON, MAX_FLOAT, rec)) {
            ray scattered;
            vec3 attenuation;
            vec3 emit = material_emitted(rec);
            emitted += i == 0 ? emit : col * emit;
            
            if (material_scatter(r, rec, attenuation, scattered)) {
                col = i == 0 ? attenuation : col * attenuation;
                r = scattered;
            } else {
                return emitted;
            }
	    } else {
            return emitted;
    	}
        if(dot(col,col) < 0.0001) return emitted; // optimisation
    }
    return emitted;
}

//
// Main
//

void mainImage( out vec4 frag_color, in vec2 frag_coord ) {
    if (ivec2(frag_coord) == ivec2(0)) {
        frag_color = iResolution.xyxy;
    } else {
        g_seed = float(base_hash(floatBitsToUint(frag_coord)))/float(0xffffffffU)+iTime;

        vec2 uv = (frag_coord + hash2(g_seed))/iResolution.xy;
        float aspect = iResolution.x/iResolution.y;
        vec3 lookfrom = vec3(278, 278, -800);
        vec3 lookat = vec3(278,278,0);
        
        camera cam = camera_const(lookfrom, lookat, vec3(0,1,0), 40., aspect, .0, 10., 0., 1.);
        ray r = camera_get_ray(cam, uv);
        vec3 col = color(r);
        
        if (texelFetch(iChannel0, ivec2(0),0).xy == iResolution.xy) {        
	        frag_color = vec4(col,1) + texelFetch(iChannel0, ivec2(frag_coord), 0);
        } else {        
	        frag_color = vec4(col,1);
        }
    }
}`,name:`Buffer A`,description:``,type:`buffer`}]},{ver:`0.1`,info:{id:`XtyyDD`,date:`1536332991`,viewed:3678,name:`RIOW 2.08: Volumes`,description:`These shaders are my implementation of the ray/path tracer described in the book "Raytracing in one weekend" by Peter Shirley.`,likes:22,published:`Public API`,usePreview:0,tags:[`raytracing`,`ray`,`tracer`,`one`,`in`,`path`,`weekend`]},renderpass:[{inputs:[{id:`4dXGR8`,filepath:`/media/previz/buffer00.png`,type:`buffer`,channel:0,sampler:{filter:`linear`,wrap:`clamp`,vflip:`true`,srgb:`false`,internal:`byte`},published:1}],outputs:[{id:`4dfGRr`,channel:0}],code:`// Ray tracing: the next week, chapter 8: Volumes. Created by Reinder Nijhoff 2018
// Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License.
// @reindernijhoff
//
// https://www.shadertoy.com/view/MtycDD
//
// These shaders are my implementation of the raytracer described in the (excellent) 
// book "Ray tracing in one weekend" and "Ray tracing: the next week"[1] by Peter Shirley 
// (@Peter_shirley). I have tried to follow the code from his book as much as possible, but 
// I had to make some changes to get it running in a fragment shader:
//
// - There are no classes (and methods) in glsl so I use structs and functions instead. 
//   Inheritance is implemented by adding a type variable to the struct and adding ugly 
//   if/else statements to the (not so overloaded) functions.
// - The scene description is procedurally implemented in the world_hit function to save
//   memory.
// - The color function is implemented using a loop because it is not possible to have a 
//   recursive function call in glsl.
// - Only one sample per pixel per frame is calculated. Samples of all frames are added 
//   in Buffer A and averaged in the Image tab.
//
// Besides that, I also made some other design choices. Most notably:
//
// - In my code ray.direction is always a unit vector so I could clean up the rest of
//   the code by removing some implicit normalizations.
// - Cosine weighted hemisphere sampling is used for the Lambertian material.
//
// You can find the raytracer / pathtracer in Buffer A.
//
// = Ray tracing in one week =
// Chapter  7: Diffuse                           https://www.shadertoy.com/view/llVcDz
// Chapter  9: Dielectrics                       https://www.shadertoy.com/view/MlVcDz
// Chapter 11: Defocus blur                      https://www.shadertoy.com/view/XlGcWh
// Chapter 12: Where next?                       https://www.shadertoy.com/view/XlycWh
//
// = Ray tracing: the next week =
// Chapter  6: Rectangles and lights             https://www.shadertoy.com/view/4tGcWD
// Chapter  7: Instances                         https://www.shadertoy.com/view/XlGcWD
// Chapter  8: Volumes                           https://www.shadertoy.com/view/XtyyDD
// Chapter  9: A Scene Testing All New Features  https://www.shadertoy.com/view/MtycDD
//
// [1] http://in1weekend.blogspot.com/2016/01/ray-tracing-in-one-weekend.html
//

void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
    vec4 data = texelFetch(iChannel0, ivec2(fragCoord),0);
    fragColor = vec4(sqrt(data.rgb/data.w),1.0);
}`,name:`Image`,description:``,type:`image`},{inputs:[{id:`4dXGR8`,filepath:`/media/previz/buffer00.png`,type:`buffer`,channel:0,sampler:{filter:`linear`,wrap:`clamp`,vflip:`true`,srgb:`false`,internal:`byte`},published:1}],outputs:[{id:`4dXGR8`,channel:0}],code:`// Ray tracing: the next week, chapter 8: Volumes. Created by Reinder Nijhoff 2018
// @reindernijhoff
//
// https://www.shadertoy.com/view/MtycDD
//
// These shaders are my implementation of the raytracer described in the (excellent) 
// book "Ray tracing in one weekend" and "Ray tracing: the next week"[1] by Peter Shirley 
// (@Peter_shirley). I have tried to follow the code from his book as much as possible.
//
// [1] http://in1weekend.blogspot.com/2016/01/ray-tracing-in-one-weekend.html
//

#define MAX_FLOAT 1e5
#define EPSILON 0.01
#define MAX_RECURSION (40+min(0,iFrame))

#define LAMBERTIAN 0
#define METAL 1
#define DIELECTRIC 2
#define DIFFUSE_LIGHT 3
#define ISOTROPIC 4

#define SPHERE 0
#define MOVING_SPHERE 1
#define BOX 2
#define CONSTANT_MEDIUM_SPHERE 3
#define CONSTANT_MEDIUM_BOX 4

#define SOLID 0
#define NOISE 1

//
// Scene defines
//

#define DENSITY .01
#define RENDER_SPHERE (0)

//
// Hash functions by Nimitz:
// https://www.shadertoy.com/view/Xt3cDn
//

uint base_hash(uvec2 p) {
    p = 1103515245U*((p >> 1U)^(p.yx));
    uint h32 = 1103515245U*((p.x)^(p.y>>3U));
    return h32^(h32 >> 16);
}

float g_seed = 0.;

float hash1(inout float seed) {
    uint n = base_hash(floatBitsToUint(vec2(seed+=.1,seed+=.1)));
    return float(n)/float(0xffffffffU);
}

vec2 hash2(inout float seed) {
    uint n = base_hash(floatBitsToUint(vec2(seed+=.1,seed+=.1)));
    uvec2 rz = uvec2(n, n*48271U);
    return vec2(rz.xy & uvec2(0x7fffffffU))/float(0x7fffffff);
}

vec3 hash3(inout float seed) {
    uint n = base_hash(floatBitsToUint(vec2(seed+=.1,seed+=.1)));
    uvec3 rz = uvec3(n, n*16807U, n*48271U);
    return vec3(rz & uvec3(0x7fffffffU))/float(0x7fffffff);
}

//
// Noise functions by Inigo Quilez:
// https://www.shadertoy.com/view/4sfGzS
//

float hash(vec3 p) {
    p  = fract( p*0.3183099+.1 );
	p *= 17.0;
    return 2. * fract( p.x*p.y*p.z*(p.x+p.y+p.z) ) - 1.;
}

float noise(const in vec3 x ) {
    vec3 p = floor(x);
    vec3 f = fract(x);
    f = f*f*(3.0-2.0*f);
	
    return mix(mix(mix( hash(p+vec3(0,0,0)), 
                        hash(p+vec3(1,0,0)),f.x),
                   mix( hash(p+vec3(0,1,0)), 
                        hash(p+vec3(1,1,0)),f.x),f.y),
               mix(mix( hash(p+vec3(0,0,1)), 
                        hash(p+vec3(1,0,1)),f.x),
                   mix( hash(p+vec3(0,1,1)), 
                        hash(p+vec3(1,1,1)),f.x),f.y),f.z);
}

float fbm(const in vec3 p, const in int octaves) {
    float accum = 0.;
    vec3 temp_p = p;
    float weight = 1.;
     
    for (int i=0; i<octaves; i++) {
        accum += weight * noise(temp_p);
        weight *= .5;
        temp_p *= 2.;
    }
    return abs(accum);
}

//
// Ray trace helper functions
//

float schlick(float cosine, float ior) {
    float r0 = (1.-ior)/(1.+ior);
    r0 = r0*r0;
    return r0 + (1.-r0)*pow((1.-cosine),5.);
}

bool modified_refract(const in vec3 v, const in vec3 n, const in float ni_over_nt, 
                      out vec3 refracted) {
    float dt = dot(v, n);
    float discriminant = 1. - ni_over_nt*ni_over_nt*(1.-dt*dt);
    if (discriminant > 0.) {
        refracted = ni_over_nt*(v - n*dt) - n*sqrt(discriminant);
        return true;
    } else { 
        return false;
    }
}

vec3 random_cos_weighted_hemisphere_direction( const vec3 n, inout float seed ) {
  	vec2 r = hash2(seed);
	vec3  uu = normalize(cross(n, abs(n.y) > .5 ? vec3(1.,0.,0.) : vec3(0.,1.,0.)));
	vec3  vv = cross(uu, n);
	float ra = sqrt(r.y);
	float rx = ra*cos(6.28318530718*r.x); 
	float ry = ra*sin(6.28318530718*r.x);
	float rz = sqrt(1.-r.y);
	vec3  rr = vec3(rx*uu + ry*vv + rz*n);
    return normalize(rr);
}

vec2 random_in_unit_disk(inout float seed) {
    vec2 h = hash2(seed) * vec2(1.,6.28318530718);
    float phi = h.y;
    float r = sqrt(h.x);
	return r * vec2(sin(phi),cos(phi));
}

vec3 random_in_unit_sphere(inout float seed) {
    vec3 h = hash3(seed) * vec3(2.,6.28318530718,1.)-vec3(1,0,0);
    float phi = h.y;
    float r = pow(h.z, 1./3.);
	return r * vec3(sqrt(1.-h.x*h.x)*vec2(sin(phi),cos(phi)),h.x);
}

vec3 rotate_y(const in vec3 p, const in float t) {
    float co = cos(t);
    float si = sin(t);
    vec2 xz = mat2(co,si,-si,co)*p.xz;
    return vec3(xz.x, p.y, xz.y);
}

//
// Ray
//

struct ray {
    vec3 origin, direction;
    float time;
};

ray ray_translate(const in ray r, const in vec3 t) {
    ray rt = r;
    rt.origin -= t;
    return rt;
}

ray ray_rotate_y(const in ray r, const in float t) {
    ray rt = r;
    rt.origin = rotate_y(rt.origin, t);
    rt.direction = rotate_y(rt.direction, t);
    return rt;
}

//
// Texture
//

struct texture_ {
    int type;
    vec3 v;
};

vec3 texture_value(const in texture_ t, const in vec3 p) {
    if (t.type == SOLID) {
	    return t.v;
    } else if (t.type == NOISE) {
        return vec3(.5*(1. + sin(t.v.x*p.z + 5.*fbm((t.v.x*.5)*p, 7))));
    }
}

#define NO_TEX texture_(SOLID,vec3(0))

//
// Material
//

struct material {
    int type;
    texture_ albedo;
    texture_ emit;
    float v;
};

//
// Hit record
//

struct hit_record {
    float t;
    vec3 p, normal;
    material mat;
};

hit_record hit_record_translate(const in hit_record h, const in vec3 t) {
    hit_record ht = h;
    ht.p -= t;
    return ht;
}
   
hit_record hit_record_rotate_y(const in hit_record h, const in float t) {
    hit_record ht = h;
    ht.p = rotate_y(ht.p, t);
    ht.normal = rotate_y(ht.normal, t);
    return ht;
}

bool material_scatter(const in ray r_in, const in hit_record rec, out vec3 attenuation, 
                      out ray scattered) {
    if(rec.mat.type == LAMBERTIAN) {
        scattered = ray(rec.p, random_cos_weighted_hemisphere_direction(rec.normal, g_seed), r_in.time);
        attenuation = texture_value(rec.mat.albedo, rec.p);
        return true;
    } else if(rec.mat.type == METAL) {
        vec3 rd = reflect(r_in.direction, rec.normal);
        scattered = ray(rec.p, normalize(rd + rec.mat.v*random_in_unit_sphere(g_seed)), r_in.time);
        attenuation = texture_value(rec.mat.albedo, rec.p);
        return true;
    } else if(rec.mat.type == DIELECTRIC) {
        vec3 outward_normal, refracted, 
             reflected = reflect(r_in.direction, rec.normal);
        float ni_over_nt, reflect_prob, cosine;
        
        attenuation = vec3(1);
        if (dot(r_in.direction, rec.normal) > 0.) {
            outward_normal = -rec.normal;
            ni_over_nt = rec.mat.v;
            cosine = dot(r_in.direction, rec.normal);
            cosine = sqrt(1. - rec.mat.v*rec.mat.v*(1.-cosine*cosine));
        } else {
            outward_normal = rec.normal;
            ni_over_nt = 1. / rec.mat.v;
            cosine = -dot(r_in.direction, rec.normal);
        }
        
        if (modified_refract(r_in.direction, outward_normal, ni_over_nt, refracted)) {
	        reflect_prob = schlick(cosine, rec.mat.v);
        } else {
            reflect_prob = 1.;
        }
        
        if (hash1(g_seed) < reflect_prob) {
            scattered = ray(rec.p, reflected, r_in.time);
        } else {
            scattered = ray(rec.p, refracted, r_in.time);
        }
        return true;
    } else if(rec.mat.type == ISOTROPIC) {
        scattered = ray(rec.p, random_in_unit_sphere(g_seed), r_in.time);
        attenuation = texture_value(rec.mat.albedo, rec.p);
    	return true;    
    }
    
    return false;
}

vec3 material_emitted(const in hit_record rec) {
    if (rec.mat.type == DIFFUSE_LIGHT) {
        return texture_value(rec.mat.emit, rec.p);
    } else {
        return vec3(0);
    }
}

//
// Hitable
//

struct hitable {
    int type;
    vec3 center, v3; // v3 is speed for moving sphere (with center at t=0) 
                     //    or dimensions for box.
    float v;         // Radius for sphere.
};
    

bool sphere_intersect(const in ray r, const in float t_min, const in float t_max,
                      const in vec3 center, const in float radius, inout float dist) {
	vec3 oc = r.origin - center;
    float b = dot(oc, r.direction);
    float c = dot(oc, oc) - radius * radius;
    float discriminant = b * b - c;
    if (discriminant < 0.0) return false;

	float s = sqrt(discriminant);
	float t1 = -b - s;
	float t2 = -b + s;
	
	float t = t1 < t_min ? t2 : t1;
    if (t < t_max && t > t_min) {
        dist = t;
	    return true;
    } else {
        return false;
    }
}

bool box_intersect(const in ray r, const in float t_min, const in float t_max,
                   const in vec3 center, const in vec3 rad, out vec3 normal, inout float dist) {
    vec3 m = 1./r.direction;
    vec3 n = m*(r.origin - center);
    vec3 k = abs(m)*rad;
	
    vec3 t1 = -n - k;
    vec3 t2 = -n + k;

	float tN = max( max( t1.x, t1.y ), t1.z );
	float tF = min( min( t2.x, t2.y ), t2.z );
	
	if( tN > tF || tF < 0.) return false;
    
    float t = tN < t_min ? tF : tN;
    if (t < t_max && t > t_min) {
        dist = t;
		normal = -sign(r.direction)*step(t1.yzx,t1.xyz)*step(t1.zxy,t1.xyz);
	    return true;
    } else {
        return false;
    }
}

bool hitable_hit(const in hitable hb, const in ray r, const in float t_min, 
                 const in float t_max, inout hit_record rec) {
    
    if(hb.type == SPHERE || hb.type == MOVING_SPHERE) {
        vec3 center = hb.type == SPHERE ? hb.center : hb.center + r.time * hb.v3;
        float radius = hb.v;
        float dist;
        if (sphere_intersect(r, t_min, t_max, center, radius, dist)) {
            rec.t = dist;
            rec.p = r.origin + dist*r.direction;
            rec.normal = (rec.p - center) / radius;
            return true;
        } else {
            return false;
        }
    } else if (hb.type == BOX) { 
        float dist;
        vec3 normal;
        if (box_intersect(r, t_min, t_max, hb.center, hb.v3, normal, dist)) {
            rec.t = dist;
            rec.p = r.origin + dist*r.direction;
            rec.normal = normal;
            return true;
        } else {
            return false;
        }
    } else { // constant medium
        bool h1, h2;
        float t1, t2;
    	hit_record rec1, rec2;
        if (hb.type == CONSTANT_MEDIUM_SPHERE) {
            h1 = sphere_intersect(r, -MAX_FLOAT, MAX_FLOAT, hb.center, hb.v3.x, t1);
            h2 = sphere_intersect(r, t1+EPSILON, MAX_FLOAT, hb.center, hb.v3.x, t2);
        } else { // box
            vec3 normal;
            h1 = box_intersect(r, -MAX_FLOAT, MAX_FLOAT, hb.center, hb.v3, normal, t1);
            h2 = box_intersect(r, t1+EPSILON, MAX_FLOAT, hb.center, hb.v3, normal, t2);
        }
        if(h1 && h2) {
            if (t1 < t_min) t1 = t_min;
            if (t2 > t_max) t2 = t_max;
            if (t1 >= t2) {
                return false;
            } else {
                if (t1 < 0.) t1 = 0.;

                float distance_inside_boundary = t2 - t1;
                float hit_distance = -(1./hb.v)*log(hash1(g_seed)); 

                if (hit_distance < distance_inside_boundary) {
                    rec.t = t1 + hit_distance; 
                    rec.p = r.origin + r.direction * rec.t;
                    rec.normal = vec3(1,0,0);  // arbitrary
                    return true;
                } else {
                    return false;
                }
            }
        } else {
            return false;
        }
    } 
}

//
// Camera
//

struct camera {
    vec3 origin, lower_left_corner, horizontal, vertical, u, v, w;
    float time0, time1, lens_radius;
};

camera camera_const(const in vec3 lookfrom, const in vec3 lookat, const in vec3 vup, 
                    const in float vfov, const in float aspect, const in float aperture, 
                    const in float focus_dist, const in float time0, const in float time1) {
    camera cam;    
    cam.lens_radius = aperture / 2.;
    float theta = vfov*3.14159265359/180.;
    float half_height = tan(theta/2.);
    float half_width = aspect * half_height;
    cam.origin = lookfrom;
    cam.w = normalize(lookfrom - lookat);
    cam.u = normalize(cross(vup, cam.w));
    cam.v = cross(cam.w, cam.u);
    cam.lower_left_corner = cam.origin  - half_width*focus_dist*cam.u -half_height*focus_dist*cam.v - focus_dist*cam.w;
    cam.horizontal = 2.*half_width*focus_dist*cam.u;
    cam.vertical = 2.*half_height*focus_dist*cam.v;
    cam.time0 = time0;
    cam.time1 = time1;
    return cam;
}
    
ray camera_get_ray(camera c, vec2 uv) {
    vec2 rd = c.lens_radius*random_in_unit_disk(g_seed);
    vec3 offset = c.u * rd.x + c.v * rd.y;
    return ray(c.origin + offset, 
               normalize(c.lower_left_corner + uv.x*c.horizontal + uv.y*c.vertical - c.origin - offset),
               mix(c.time0, c.time1, hash1(g_seed)));
}

//
// Color & Scene
//

bool world_hit(const in ray r, const in float t_min, 
               const in float t_max, out hit_record rec) {
    rec.t = t_max;
    bool hit = false;

    const material red = material(LAMBERTIAN, texture_(SOLID,vec3(.65,.05,.05)), NO_TEX,0.);
    const material white = material(LAMBERTIAN, texture_(SOLID,vec3(.73)), NO_TEX,0.);
    const material green = material(LAMBERTIAN, texture_(SOLID,vec3(.12,.45,.15)), NO_TEX,0.);

    const material light = material(DIFFUSE_LIGHT, NO_TEX, texture_(SOLID,vec3(7)),0.);
    
    const material smoke_1 = material(ISOTROPIC, texture_(SOLID,vec3(.97)), NO_TEX,0.);
    const material smoke_2 = material(ISOTROPIC, texture_(SOLID,vec3(.03)), NO_TEX,0.);
        
  	if (hitable_hit(hitable(BOX, vec3(556,277.5,277.5), vec3(1,277.5,277.5), 0.),r,t_min,rec.t,rec)) 
        hit=true, rec.mat=green;
    if (hitable_hit(hitable(BOX, vec3(-1,277.5,277.5), vec3(1,277.5,277.5), 0.),r,t_min,rec.t,rec)) 
        hit=true, rec.mat=red;
   
    if (hitable_hit(hitable(BOX, vec3(277.5,556,277.5), vec3(277.5,1,277.5), 0.),r,t_min,rec.t,rec)) 
        hit=true, rec.mat=white;
    if (hitable_hit(hitable(BOX, vec3(277.5,-1,277.5), vec3(277.5,1,277.5), 0.),r,t_min,rec.t,rec)) 
        hit=true, rec.mat=white;
    if (hitable_hit(hitable(BOX, vec3(277.5,277.5,556), vec3(277.5,277.5,1), 0.),r,t_min,rec.t,rec)) 
        hit=true, rec.mat=white;
    
    if (hitable_hit(hitable(BOX, vec3(278,555,279.5), vec3(115,1,157.5), 0.),r,t_min,rec.t,rec)) 
        hit=true, rec.mat=light;   
   
#if RENDER_SPHERE // blue subsurface scattering sphere
    const material glass =  material(DIELECTRIC, NO_TEX, NO_TEX,1.02);
    const material blue  =  material(ISOTROPIC, texture_(SOLID,vec3(.2,.4,.9)), NO_TEX,0.);
    
    if (hitable_hit(hitable(SPHERE, vec3(210,120,180), vec3(0), 120.),r,t_min,rec.t,rec)) 
        hit=true, rec.mat=glass;   
    
    if (hitable_hit(hitable(CONSTANT_MEDIUM_SPHERE, vec3(210,120,180), vec3(120), .04),r,t_min,rec.t,rec)) 
        hit=true, rec.mat=blue; 
    
#else
    ray r_ = ray_rotate_y(ray_translate(r, vec3(130,0,65)), -18./180.*3.14159265359);
    hit_record rec_ = rec;    
    if (hitable_hit(hitable(CONSTANT_MEDIUM_BOX, vec3(82.5), vec3(82.5), DENSITY),r_,t_min,rec.t,rec_)) 
        hit=true, 
        rec=hit_record_translate(hit_record_rotate_y(rec_, 18./180.*3.14159265359),-vec3(130,0,65.)), 
        rec.mat=smoke_1;
    
	r_ = ray_rotate_y(ray_translate(r, vec3(265,0,295)), 15./180.*3.14159265359);
    rec_ = rec;    
    if (hitable_hit(hitable(CONSTANT_MEDIUM_BOX, vec3(82.5,165,82.5), vec3(82.5,165,82.5), DENSITY),r_,t_min,rec.t,rec_)) 
        hit=true, 
        rec=hit_record_translate(hit_record_rotate_y(rec_, -15./180.*3.14159265359),-vec3(265,0,295)), 
        rec.mat=smoke_2;
#endif 
    
    return hit;
}

vec3 color(in ray r) {
    vec3 col = vec3(0);
    vec3 emitted = vec3(0);
	hit_record rec;
    
    for (int i=0; i<MAX_RECURSION; i++) {
    	if (world_hit(r, EPSILON, MAX_FLOAT, rec)) {
            ray scattered;
            vec3 attenuation;
            vec3 emit = material_emitted(rec);
            emitted += i == 0 ? emit : col * emit;
            
            if (material_scatter(r, rec, attenuation, scattered)) {
                col = i == 0 ? attenuation : col * attenuation;
                r = scattered;
            } else {
                return emitted;
            }
	    } else {
            return emitted;
    	}
        if(dot(col,col) < 0.0001) return emitted; // optimisation
    }
    return emitted;
}

//
// Main
//

void mainImage( out vec4 frag_color, in vec2 frag_coord ) {
    if (ivec2(frag_coord) == ivec2(0)) {
        frag_color = iResolution.xyxy;
    } else {
        g_seed = float(base_hash(floatBitsToUint(frag_coord)))/float(0xffffffffU)+iTime;

        vec2 uv = (frag_coord + hash2(g_seed))/iResolution.xy;
        float aspect = iResolution.x/iResolution.y;
        vec3 lookfrom = vec3(278, 278, -800);
        vec3 lookat = vec3(278,278,0);
        
        camera cam = camera_const(lookfrom, lookat, vec3(0,1,0), 40., aspect, .0, 10., 0., 1.);
        ray r = camera_get_ray(cam, uv);
        vec3 col = color(r);
        
        if (texelFetch(iChannel0, ivec2(0),0).xy == iResolution.xy) {        
	        frag_color = vec4(col,1) + texelFetch(iChannel0, ivec2(frag_coord), 0);
        } else {        
	        frag_color = vec4(col,1);
        }
    }
}`,name:`Buffer A`,description:``,type:`buffer`}]},{ver:`0.1`,info:{id:`MtycDD`,date:`1536332994`,viewed:7207,name:`RIOW 2.09: A Scene Testing All`,description:`These shaders are my implementation of the ray/path tracer described in the book "Raytracing in one weekend" by Peter Shirley. - DOF and motion blur; boxes, spheres and constant mediums; Lambertian, dielectric, isotropic, emissive and metal materials -`,likes:76,published:`Public API`,usePreview:0,tags:[`raytracing`,`ray`,`tracer`,`one`,`in`,`path`,`weekend`]},renderpass:[{inputs:[{id:`4dXGR8`,filepath:`/media/previz/buffer00.png`,type:`buffer`,channel:0,sampler:{filter:`linear`,wrap:`clamp`,vflip:`true`,srgb:`false`,internal:`byte`},published:1}],outputs:[{id:`4dfGRr`,channel:0}],code:`// Ray tracing: the next week, chapter 9: A scene testing all new features. Created by Reinder Nijhoff 2018
// Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License.
// @reindernijhoff
//
// https://www.shadertoy.com/view/MtycDD
//
// These shaders are my implementation of the raytracer described in the (excellent) 
// book "Ray tracing in one weekend" and "Ray tracing: the next week"[1] by Peter Shirley 
// (@Peter_shirley). I have tried to follow the code from his book as much as possible, but 
// I had to make some changes to get it running in a fragment shader:
//
// - There are no classes (and methods) in glsl so I use structs and functions instead. 
//   Inheritance is implemented by adding a type variable to the struct and adding ugly 
//   if/else statements to the (not so overloaded) functions.
// - The scene description is procedurally implemented in the world_hit function to save
//   memory.
// - The color function is implemented using a loop because it is not possible to have a 
//   recursive function call in glsl.
// - Only one sample per pixel per frame is calculated. Samples of all frames are added 
//   in Buffer A and averaged in the Image tab.
//
// Besides that, I also made some other design choices. Most notably:
//
// - In my code ray.direction is always a unit vector so I could clean up the rest of
//   the code by removing some implicit normalizations.
// - Cosine weighted hemisphere sampling is used for the Lambertian material.
//
// You can find the raytracer / pathtracer in Buffer A.
//
// = Ray tracing in one week =
// Chapter  7: Diffuse                           https://www.shadertoy.com/view/llVcDz
// Chapter  9: Dielectrics                       https://www.shadertoy.com/view/MlVcDz
// Chapter 11: Defocus blur                      https://www.shadertoy.com/view/XlGcWh
// Chapter 12: Where next?                       https://www.shadertoy.com/view/XlycWh
//
// = Ray tracing: the next week =
// Chapter  6: Rectangles and lights             https://www.shadertoy.com/view/4tGcWD
// Chapter  7: Instances                         https://www.shadertoy.com/view/XlGcWD
// Chapter  8: Volumes                           https://www.shadertoy.com/view/XtyyDD
// Chapter  9: A Scene Testing All New Features  https://www.shadertoy.com/view/MtycDD
//
// [1] http://in1weekend.blogspot.com/2016/01/ray-tracing-in-one-weekend.html
//

void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
    vec4 data = texelFetch(iChannel0, ivec2(fragCoord),0);
    fragColor = vec4(sqrt(data.rgb/data.w),1.0);
}`,name:`Image`,description:``,type:`image`},{inputs:[{id:`4dXGR8`,filepath:`/media/previz/buffer00.png`,type:`buffer`,channel:0,sampler:{filter:`linear`,wrap:`clamp`,vflip:`true`,srgb:`false`,internal:`byte`},published:1}],outputs:[{id:`4dXGR8`,channel:0}],code:`// Ray tracing: the next week, chapter 9: A scene testing all new features. Created by Reinder Nijhoff 2018
// @reindernijhoff
//
// https://www.shadertoy.com/view/MtycDD
//
// These shaders are my implementation of the raytracer described in the (excellent) 
// book "Ray tracing in one weekend" and "Ray tracing: the next week"[1] by Peter Shirley 
// (@Peter_shirley). I have tried to follow the code from his book as much as possible.
//
// [1] http://in1weekend.blogspot.com/2016/01/ray-tracing-in-one-weekend.html
//

#define MAX_FLOAT 1e5
#define EPSILON 0.01
#define MAX_RECURSION (24+min(0,iFrame))

#define LAMBERTIAN 0
#define METAL 1
#define DIELECTRIC 2
#define DIFFUSE_LIGHT 3
#define ISOTROPIC 4

#define SPHERE 0
#define MOVING_SPHERE 1
#define BOX 2
#define CONSTANT_MEDIUM_SPHERE 3
#define CONSTANT_MEDIUM_BOX 4

#define SOLID 0
#define NOISE 1

//
// Hash functions by Nimitz:
// https://www.shadertoy.com/view/Xt3cDn
//

uint base_hash(uvec2 p) {
    p = 1103515245U*((p >> 1U)^(p.yx));
    uint h32 = 1103515245U*((p.x)^(p.y>>3U));
    return h32^(h32 >> 16);
}

float g_seed = 0.;

float hash1(inout float seed) {
    uint n = base_hash(floatBitsToUint(vec2(seed+=.1,seed+=.1)));
    return float(n)/float(0xffffffffU);
}

vec2 hash2(inout float seed) {
    uint n = base_hash(floatBitsToUint(vec2(seed+=.1,seed+=.1)));
    uvec2 rz = uvec2(n, n*48271U);
    return vec2(rz.xy & uvec2(0x7fffffffU))/float(0x7fffffff);
}

vec3 hash3(inout float seed) {
    uint n = base_hash(floatBitsToUint(vec2(seed+=.1,seed+=.1)));
    uvec3 rz = uvec3(n, n*16807U, n*48271U);
    return vec3(rz & uvec3(0x7fffffffU))/float(0x7fffffff);
}

//
// Noise functions by Inigo Quilez:
// https://www.shadertoy.com/view/4sfGzS
//

float hash(vec3 p) {
    p  = fract( p*0.3183099+.1 );
	p *= 17.0;
    return 2. * fract( p.x*p.y*p.z*(p.x+p.y+p.z) ) - 1.;
}

float noise(const in vec3 x ) {
    vec3 p = floor(x);
    vec3 f = fract(x);
    f = f*f*(3.0-2.0*f);
	
    return mix(mix(mix( hash(p+vec3(0,0,0)), 
                        hash(p+vec3(1,0,0)),f.x),
                   mix( hash(p+vec3(0,1,0)), 
                        hash(p+vec3(1,1,0)),f.x),f.y),
               mix(mix( hash(p+vec3(0,0,1)), 
                        hash(p+vec3(1,0,1)),f.x),
                   mix( hash(p+vec3(0,1,1)), 
                        hash(p+vec3(1,1,1)),f.x),f.y),f.z);
}

float fbm(const in vec3 p, const in int octaves) {
    float accum = 0.;
    vec3 temp_p = p;
    float weight = 1.;
     
    for (int i=0; i<octaves; i++) {
        accum += weight * noise(temp_p);
        weight *= .5;
        temp_p *= 2.;
    }
    return abs(accum);
}

//
// Ray trace helper functions
//

float schlick(float cosine, float ior) {
    float r0 = (1.-ior)/(1.+ior);
    r0 = r0*r0;
    return r0 + (1.-r0)*pow((1.-cosine),5.);
}

bool modified_refract(const in vec3 v, const in vec3 n, const in float ni_over_nt, 
                      out vec3 refracted) {
    float dt = dot(v, n);
    float discriminant = 1. - ni_over_nt*ni_over_nt*(1.-dt*dt);
    if (discriminant > 0.) {
        refracted = ni_over_nt*(v - n*dt) - n*sqrt(discriminant);
        return true;
    } else { 
        return false;
    }
}

vec3 random_cos_weighted_hemisphere_direction( const vec3 n, inout float seed ) {
  	vec2 r = hash2(seed);
	vec3  uu = normalize(cross(n, abs(n.y) > .5 ? vec3(1.,0.,0.) : vec3(0.,1.,0.)));
	vec3  vv = cross(uu, n);
	float ra = sqrt(r.y);
	float rx = ra*cos(6.28318530718*r.x); 
	float ry = ra*sin(6.28318530718*r.x);
	float rz = sqrt(1.-r.y);
	vec3  rr = vec3(rx*uu + ry*vv + rz*n);
    return normalize(rr);
}

vec2 random_in_unit_disk(inout float seed) {
    vec2 h = hash2(seed) * vec2(1.,6.28318530718);
    float phi = h.y;
    float r = sqrt(h.x);
	return r * vec2(sin(phi),cos(phi));
}

vec3 random_in_unit_sphere(inout float seed) {
    vec3 h = hash3(seed) * vec3(2.,6.28318530718,1.)-vec3(1,0,0);
    float phi = h.y;
    float r = pow(h.z, 1./3.);
	return r * vec3(sqrt(1.-h.x*h.x)*vec2(sin(phi),cos(phi)),h.x);
}

vec3 rotate_y(const in vec3 p, const in float t) {
    float co = cos(t);
    float si = sin(t);
    vec2 xz = mat2(co,si,-si,co)*p.xz;
    return vec3(xz.x, p.y, xz.y);
}

//
// Ray
//

struct ray {
    vec3 origin, direction;
    float time;
};

ray ray_translate(const in ray r, const in vec3 t) {
    ray rt = r;
    rt.origin -= t;
    return rt;
}

ray ray_rotate_y(const in ray r, const in float t) {
    ray rt = r;
    rt.origin = rotate_y(rt.origin, t);
    rt.direction = rotate_y(rt.direction, t);
    return rt;
}

//
// Texture
//

struct texture_ {
    int type;
    vec3 v;
};

vec3 texture_value(const in texture_ t, const in vec3 p) {
    if (t.type == SOLID) {
	    return t.v;
    } else if (t.type == NOISE) {
        return vec3(.5*(1. + sin(t.v.x*p.x + 5.*fbm((t.v.x)*p, 7))));
    }
}

#define NO_TEX texture_(SOLID,vec3(0))

//
// Material
//

struct material {
    int type;
    texture_ albedo;
    texture_ emit;
    float v;
};

//
// Hit record
//

struct hit_record {
    float t;
    vec3 p, normal;
    material mat;
};

hit_record hit_record_translate(const in hit_record h, const in vec3 t) {
    hit_record ht = h;
    ht.p -= t;
    return ht;
}
   
hit_record hit_record_rotate_y(const in hit_record h, const in float t) {
    hit_record ht = h;
    ht.p = rotate_y(ht.p, t);
    ht.normal = rotate_y(ht.normal, t);
    return ht;
}

bool material_scatter(const in ray r_in, const in hit_record rec, out vec3 attenuation, 
                      out ray scattered) {
    if(rec.mat.type == LAMBERTIAN) {
        scattered = ray(rec.p, random_cos_weighted_hemisphere_direction(rec.normal, g_seed), r_in.time);
        attenuation = texture_value(rec.mat.albedo, rec.p);
        return true;
    } else if(rec.mat.type == METAL) {
        vec3 rd = reflect(r_in.direction, rec.normal);
        scattered = ray(rec.p, normalize(rd + rec.mat.v*random_in_unit_sphere(g_seed)), r_in.time);
        attenuation = texture_value(rec.mat.albedo, rec.p);
        return true;
    } else if(rec.mat.type == DIELECTRIC) {
        vec3 outward_normal, refracted, 
             reflected = reflect(r_in.direction, rec.normal);
        float ni_over_nt, reflect_prob, cosine;
        
        attenuation = vec3(1);
        if (dot(r_in.direction, rec.normal) > 0.) {
            outward_normal = -rec.normal;
            ni_over_nt = rec.mat.v;
            cosine = dot(r_in.direction, rec.normal);
            cosine = sqrt(1. - rec.mat.v*rec.mat.v*(1.-cosine*cosine));
        } else {
            outward_normal = rec.normal;
            ni_over_nt = 1. / rec.mat.v;
            cosine = -dot(r_in.direction, rec.normal);
        }
        
        if (modified_refract(r_in.direction, outward_normal, ni_over_nt, refracted)) {
	        reflect_prob = schlick(cosine, rec.mat.v);
        } else {
            reflect_prob = 1.;
        }
        
        if (hash1(g_seed) < reflect_prob) {
            scattered = ray(rec.p, reflected, r_in.time);
        } else {
            scattered = ray(rec.p, refracted, r_in.time);
        }
        return true;
    } else if(rec.mat.type == ISOTROPIC) {
        scattered = ray(rec.p, random_in_unit_sphere(g_seed), r_in.time);
        attenuation = texture_value(rec.mat.albedo, rec.p);
    	return true;    
    }
    
    return false;
}

vec3 material_emitted(const in hit_record rec) {
    if (rec.mat.type == DIFFUSE_LIGHT) {
        return texture_value(rec.mat.emit, rec.p);
    } else {
        return vec3(0);
    }
}

//
// Hitable
//

struct hitable {
    int type;
    vec3 center, v3; // v3 is speed for moving sphere (with center at t=0) 
                     //    or dimensions for box.
    float v;         // Radius for sphere.
};
    

bool sphere_intersect(const in ray r, const in float t_min, const in float t_max,
                      const in vec3 center, const in float radius, inout float dist) {
	vec3 oc = r.origin - center;
    float b = dot(oc, r.direction);
    float c = dot(oc, oc) - radius * radius;
    float discriminant = b * b - c;
    if (discriminant < 0.0) return false;

	float s = sqrt(discriminant);
	float t1 = -b - s;
	float t2 = -b + s;
	
	float t = t1 < t_min ? t2 : t1;
    if (t < t_max && t > t_min) {
        dist = t;
	    return true;
    } else {
        return false;
    }
}

bool box_intersect(const in ray r, const in float t_min, const in float t_max,
                   const in vec3 center, const in vec3 rad, out vec3 normal, inout float dist) {
    vec3 m = 1./r.direction;
    vec3 n = m*(r.origin - center);
    vec3 k = abs(m)*rad;
	
    vec3 t1 = -n - k;
    vec3 t2 = -n + k;

	float tN = max( max( t1.x, t1.y ), t1.z );
	float tF = min( min( t2.x, t2.y ), t2.z );
	
	if( tN > tF || tF < 0.) return false;
    
    float t = tN < t_min ? tF : tN;
    if (t < t_max && t > t_min) {
        dist = t;
		normal = -sign(r.direction)*step(t1.yzx,t1.xyz)*step(t1.zxy,t1.xyz);
	    return true;
    } else {
        return false;
    }
}

bool hitable_hit(const in hitable hb, const in ray r, const in float t_min, 
                 const in float t_max, inout hit_record rec) {
    
    if(hb.type == SPHERE || hb.type == MOVING_SPHERE) {
        vec3 center = hb.type == SPHERE ? hb.center : hb.center + r.time * hb.v3;
        float radius = hb.v;
        float dist;
        if (sphere_intersect(r, t_min, t_max, center, radius, dist)) {
            rec.t = dist;
            rec.p = r.origin + dist*r.direction;
            rec.normal = (rec.p - center) / radius;
            return true;
        } else {
            return false;
        }
    } else if (hb.type == BOX) { 
        float dist;
        vec3 normal;
        if (box_intersect(r, t_min, t_max, hb.center, hb.v3, normal, dist)) {
            rec.t = dist;
            rec.p = r.origin + dist*r.direction;
            rec.normal = normal;
            return true;
        } else {
            return false;
        }
    } else { // constant medium
        bool h1, h2;
        float t1, t2;
    	hit_record rec1, rec2;
        if (hb.type == CONSTANT_MEDIUM_SPHERE) {
            h1 = sphere_intersect(r, -MAX_FLOAT, MAX_FLOAT, hb.center, hb.v3.x, t1);
            h2 = sphere_intersect(r, t1+EPSILON, MAX_FLOAT, hb.center, hb.v3.x, t2);
        } else { // box
            vec3 normal;
            h1 = box_intersect(r, -MAX_FLOAT, MAX_FLOAT, hb.center, hb.v3, normal, t1);
            h2 = box_intersect(r, t1+EPSILON, MAX_FLOAT, hb.center, hb.v3, normal, t2);
        }
        if(h1 && h2) {
            if (t1 < t_min) t1 = t_min;
            if (t2 > t_max) t2 = t_max;
            if (t1 >= t2) {
                return false;
            } else {
                if (t1 < 0.) t1 = 0.;

                float distance_inside_boundary = t2 - t1;
                float hit_distance = -(1./hb.v)*log(hash1(g_seed)); 

                if (hit_distance < distance_inside_boundary) {
                    rec.t = t1 + hit_distance; 
                    rec.p = r.origin + r.direction * rec.t;
                    rec.normal = vec3(1,0,0);  // arbitrary
                    return true;
                } else {
                    return false;
                }
            }
        } else {
            return false;
        }
    } 
}

//
// Camera
//

struct camera {
    vec3 origin, lower_left_corner, horizontal, vertical, u, v, w;
    float time0, time1, lens_radius;
};

camera camera_const(const in vec3 lookfrom, const in vec3 lookat, const in vec3 vup, 
                    const in float vfov, const in float aspect, const in float aperture, 
                    const in float focus_dist, const in float time0, const in float time1) {
    camera cam;    
    cam.lens_radius = aperture / 2.;
    float theta = vfov*3.14159265359/180.;
    float half_height = tan(theta/2.);
    float half_width = aspect * half_height;
    cam.origin = lookfrom;
    cam.w = normalize(lookfrom - lookat);
    cam.u = normalize(cross(vup, cam.w));
    cam.v = cross(cam.w, cam.u);
    cam.lower_left_corner = cam.origin  - half_width*focus_dist*cam.u -half_height*focus_dist*cam.v - focus_dist*cam.w;
    cam.horizontal = 2.*half_width*focus_dist*cam.u;
    cam.vertical = 2.*half_height*focus_dist*cam.v;
    cam.time0 = time0;
    cam.time1 = time1;
    return cam;
}
    
ray camera_get_ray(camera c, vec2 uv) {
    vec2 rd = c.lens_radius*random_in_unit_disk(g_seed);
    vec3 offset = c.u * rd.x + c.v * rd.y;
    return ray(c.origin + offset, 
               normalize(c.lower_left_corner + uv.x*c.horizontal + uv.y*c.vertical - c.origin - offset),
               mix(c.time0, c.time1, hash1(g_seed)));
}

//
// Color & Scene
//

bool world_hit(const in ray r, const in float t_min, 
               const in float t_max, out hit_record rec) {
    rec.t = t_max;
    bool hit = false;
        
    if (hitable_hit(hitable(BOX, vec3(273,555,279.5), vec3(150,.1,132.5), 0.),r,t_min,rec.t,rec)) 
        hit=true, rec.mat=material(DIFFUSE_LIGHT, NO_TEX, texture_(SOLID,vec3(7)),0.);   
    
    if (hitable_hit(hitable(MOVING_SPHERE, vec3(400,400,200), vec3(30,0,0), 50.),r,t_min,rec.t,rec)) 
        hit=true, rec.mat=material(LAMBERTIAN, texture_(SOLID,vec3(.7,.3,.1)), NO_TEX,0.);
    if (hitable_hit(hitable(SPHERE, vec3(260,150,45), vec3(0), 50.),r,t_min,rec.t,rec)) 
        hit=true, rec.mat=material(DIELECTRIC, NO_TEX, NO_TEX,1.5);
    if (hitable_hit(hitable(SPHERE, vec3(0,150,145), vec3(0), 50.),r,t_min,rec.t,rec)) 
        hit=true, rec.mat=material(METAL, texture_(SOLID,vec3(.8,.8,.9)), NO_TEX,1.);
    if (hitable_hit(hitable(SPHERE, vec3(220,280,300), vec3(0), 80.),r,t_min,rec.t,rec)) 
        hit=true, rec.mat=material(LAMBERTIAN, texture_(NOISE,vec3(.1)), NO_TEX,.1);
    
    if (hitable_hit(hitable(SPHERE, vec3(360, 150, 145), vec3(0), 70.),r,t_min,rec.t,rec)) 
        hit=true, rec.mat=material(DIELECTRIC, NO_TEX, NO_TEX,1.5);
    if (hitable_hit(hitable(CONSTANT_MEDIUM_SPHERE, vec3(360, 150, 145), vec3(70), .2),r,t_min,rec.t,rec)) 
        hit=true, rec.mat=material(ISOTROPIC, texture_(SOLID,vec3(.2,.4,.9)), NO_TEX,0.);
        
    if (hitable_hit(hitable(SPHERE, vec3(400,200,400), vec3(0), 100.),r,t_min,rec.t,rec)) 
        hit=true, rec.mat=material(DIELECTRIC, NO_TEX, NO_TEX, 1.04);
    if (hitable_hit(hitable(CONSTANT_MEDIUM_SPHERE, vec3(400,200,400), vec3(100), .1),r,t_min,rec.t,rec)) 
        hit=true, rec.mat=material(ISOTROPIC, texture_(SOLID,vec3(.4,.5,.7)), NO_TEX,0.);
    
    if (hitable_hit(hitable(CONSTANT_MEDIUM_SPHERE, vec3(0), vec3(1000), .0001),r,t_min,rec.t,rec)) 
        hit=true, rec.mat=material(ISOTROPIC, texture_(SOLID,vec3(1)), NO_TEX,0.);
    
// A 2D grid for the ground and a 3D grid for the cube with spheres are implemented as an optimization    
    
// cube with spheres
    ray r_ = ray_rotate_y(ray_translate(r, vec3(-100,270,395)+82.5), 15./180.*3.14159265359);
    vec3 normal; float dist;
    if (box_intersect(r_,EPSILON,MAX_FLOAT, vec3(0), vec3(100), normal, dist)) {
        const float cubeGridScale = 20.;   
        vec3 ro = r_.origin/cubeGridScale;
        vec3 pos = floor(ro + (all(lessThan(abs(r_.origin),vec3(100)))?EPSILON:dist)*r_.direction/cubeGridScale);
        vec3 rdi = 1./r_.direction;
        vec3 rda = abs(rdi);
        vec3 rds = sign(r.direction);
        vec3 dis = (pos-ro+ .5 + rds*.5) * rdi;
		bool b_hit = false;
        
        // traverse grid in 3D
        vec3 mm = vec3(0);
        int steps = 12 + min(0,iFrame);
        for (int i=0; i<steps; i++) {
            for(float x=-1.;x<=1.;x+=1.) {
                for(float y=-1.;y<=1.;y+=1.) {
                    for(float z=-1.;z<=1.;z+=1.) {
                        vec3 posc = pos + vec3(x,y,z);
                        if (all(lessThan(abs(posc),vec3(4.1)))) { 
                            float seed = dot(posc, vec3(.1,.11,.111));
                            vec3 scenter = posc*cubeGridScale + cubeGridScale*((hash3(seed)-.5)*.75);
                            hit_record rec_ = rec;
                            if (hitable_hit(hitable(SPHERE, scenter, vec3(0),10.),r_,t_min,rec_.t,rec_)) 
                                b_hit=true, 
                                rec=hit_record_translate(hit_record_rotate_y(rec_,-15./180.*3.14159265359),-82.5-vec3(-100,270,395)), 
                                rec.mat=material(LAMBERTIAN, texture_(SOLID,vec3(.73)), NO_TEX,0.);  
                        }
                    }
                }
            }
            
            if(b_hit) {
                hit=true;
                break;
            }
            
            // step to next cell	
            vec3 mm = step(dis.xyz, dis.yxy) * step(dis.xyz, dis.zzx);
            dis += mm * rda;
            pos += mm * rds;
        }
    }
    
// floor     
    if (r.origin.y < 101. || r.direction.y < 0.) {
   		const float floorGridScale = 100.;   
        vec3 ro = r.origin/floorGridScale;
        vec2 pos = floor(ro.xz);
        vec3 rdi = 1./r.direction;
        vec3 rda = abs(rdi);
        vec2 rds = sign(r.direction.xz);
        vec2 dis = (pos-ro.xz+ .5 + rds*.5) * rdi.xz;
		bool b_hit = false;

        // traverse grid in 2D
        vec2 mm = vec2(0);
        int steps = 26 + min(0,iFrame);
        for (int i=0; i<steps; i++) {
            float seed = dot(pos, vec2(.7,.17));
			vec3 bcenter = vec3(pos.x*floorGridScale+floorGridScale*.5,0,pos.y*floorGridScale+.5*floorGridScale);
            vec3 bsize = vec3(floorGridScale*.5,100.*(hash1(seed)+0.01),floorGridScale*.5);

            if (hitable_hit(hitable(BOX, bcenter, bsize, 0.),r,t_min,rec.t,rec)) 
                b_hit=true, rec.mat=material(LAMBERTIAN, texture_(SOLID,vec3(.48,.83,.53)), NO_TEX,0.);     
            
            if(b_hit) {
                hit = true;
                break;
            }
            
            // step to next cell		
            mm = step( dis.xy, dis.yx ); 
            dis += mm*rda.xz;
            pos += mm*rds;
        }
    }
   
    return hit;
}

vec3 color(in ray r) {
    vec3 col = vec3(0);
    vec3 emitted = vec3(0);
	hit_record rec;
    
    for (int i=0; i<MAX_RECURSION; i++) {
    	if (world_hit(r, EPSILON, MAX_FLOAT, rec)) {
            ray scattered;
            vec3 attenuation;
            vec3 emit = material_emitted(rec);
            emitted += i == 0 ? emit : col * emit;
            
            if (material_scatter(r, rec, attenuation, scattered)) {
                col = i == 0 ? attenuation : col * attenuation;
                r = scattered;
            } else {
                return emitted;
            }
	    } else {
            return emitted;
    	}
        if(dot(col,col) < 0.0001) return emitted; // optimisation
    }
    return emitted;
}

//
// Main
//

void mainImage( out vec4 frag_color, in vec2 frag_coord ) {
    if (ivec2(frag_coord) == ivec2(0)) {
        frag_color = iResolution.xyxy;
    } else {
        g_seed = float(base_hash(floatBitsToUint(frag_coord)))/float(0xffffffffU)+iTime;

        vec2 uv = (frag_coord + hash2(g_seed))/iResolution.xy;
        float aspect = iResolution.x/iResolution.y;
        vec3 lookfrom = vec3(478, 278, -600);
        vec3 lookat = vec3(278,278,0);
        
        camera cam = camera_const(lookfrom, lookat, vec3(0,1,0), 40., aspect, 2.0, 800., 0., 1.);
        ray r = camera_get_ray(cam, uv);
        vec3 col = color(r);
        
        if (texelFetch(iChannel0, ivec2(0),0).xy == iResolution.xy) {        
	        frag_color = vec4(col,1) + texelFetch(iChannel0, ivec2(frag_coord), 0);
        } else {        
	        frag_color = vec4(col,1);
        }
    }
}`,name:`Buffer A`,description:``,type:`buffer`}]},{ver:`0.1`,info:{id:`XttfRN`,date:`1538844868`,viewed:2199,name:`Menger Sponge - iOS AR`,description:`This is an experiment to create an "AR shader" by implementing the mainVR-function and using the WebCam texture as background. Use the [url=https://itunes.apple.com/us/app/shadertoy/id717961814]Shadertoy iOS app[/url] to view this shader.`,likes:5,published:`Public API`,usePreview:0,tags:[`menger`,`ar`,`sponge`,`ios`]},renderpass:[{inputs:[{id:`4dfGRn`,filepath:`/media/a/8de3a3924cb95bd0e95a443fff0326c869f9d4979cd1d5b6e94e2a01f5be53e9.jpg`,type:`texture`,channel:1,sampler:{filter:`mipmap`,wrap:`repeat`,vflip:`true`,srgb:`false`,internal:`byte`},published:1},{id:`4sf3zn`,filepath:`/presets/webcam.png`,type:`webcam`,channel:0,sampler:{filter:`mipmap`,wrap:`clamp`,vflip:`true`,srgb:`false`,internal:`byte`},published:1},{id:`Xsf3Rr`,filepath:`/media/a/79520a3d3a0f4d3caa440802ef4362e99d54e12b1392973e4ea321840970a88a.jpg`,type:`texture`,channel:2,sampler:{filter:`mipmap`,wrap:`repeat`,vflip:`true`,srgb:`false`,internal:`byte`},published:1}],outputs:[{id:`4dfGRr`,channel:0}],code:`// Menger Sponge - iOS AR. Created by Reinder Nijhoff 2018
// Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License.
// @reindernijhoff
//
// https://www.shadertoy.com/view/XttfRN
//
// This is an experiment to create an "AR shader" by implementing the mainVR-function and 
// using the WebCam texture as background. If you view this shader with the Shadertoy iOS 
// app[1], you can walk around the cube to view it from all sides.
//
// If you don't have an iOS device (or if you don't have the app installed) you can find a
// screen capture of the shader in action here: https://youtu.be/7woT6cTx-bo.
//
// The SDF of this shader is based on the "Menger Sponge" shader by Íñigo Quílez:
// https://www.shadertoy.com/view/4sX3Rn
//
// [1] https://itunes.apple.com/us/app/shadertoy/id717961814
//

float sdBox( vec3 p, vec3 b ) {
  vec3  di = abs(p) - b;
  float mc = max(di.x,max(di.y,di.z));
  return min(mc,length(max(di,0.0)));
}

float boxIntersect( in vec3 ro, in vec3 rd, in vec3 rad ) {
    vec3 m = 1.0/rd;
    vec3 n = m*ro;
    vec3 k = abs(m)*rad;
	
    vec3 t1 = -n - k;
    vec3 t2 = -n + k;

	float tN = max( max( t1.x, t1.y ), t1.z );
	float tF = min( min( t2.x, t2.y ), t2.z );
	
	if( tN > tF || tF < 0.0) return 1e30;
	return tN;
}

float map( in vec3 p ) {
    float d = sdBox(p,vec3(1.0));
    float s = .5;
    for( int m=0; m<4; m++ ) {
        vec3 a = fract( p*s )-.5;
        s *= 3.;
        vec3 r = abs(1.-6.*abs(a));
        float da = max(r.x,r.y);
        float db = max(r.y,r.z);
        float dc = max(r.z,r.x);
        float c = (min(da,min(db,dc))-1.0)/(2.*s);

        if( c>d ) {
          d = c;
        }
    }
    return d;
}

float calcSoftshadow( in vec3 ro, in vec3 rd, in float mint, in float tmax ) {
	float res = 1.0;
    float t = mint;
    float ph = 1e10; 
    for( int i=0; i<32; i++ ) {
		float h = map( ro + rd*t );
       	float y = h*h/(2.0*ph);
        float d = sqrt(max(0.,h*h-y*y));
        res = min( res, 8.0*d/max(0.0001,t-y) );
        ph = h;
        t += h;//min(h, .1);// clamp( h, 0.02, 0.10 );
        if( res<0.001 || t>tmax ) break;
    }
    return clamp( res, 0.0, 1.0 );
}

float calcAO( in vec3 pos, in vec3 nor ) {
	float occ = 0.0;
    float sca = 1.0;
    for( int i=0; i<5; i++ ) {
        float hr = 0.01 + 0.5*float(i)/4.0;
        vec3 aopos =  nor * hr + pos;
        float dd = map( aopos );
        occ += -(dd-hr)*sca;
        sca *= 0.9;
    }
    return clamp( 1. - 3.0*occ, 0.0, 1.0 );    
}

vec3 calcNormal(in vec3 pos) {
    vec3  eps = vec3(.001,0.0,0.0);
    vec3 nor;
    nor.x = map(pos+eps.xyy) - map(pos-eps.xyy);
    nor.y = map(pos+eps.yxy) - map(pos-eps.yxy);
    nor.z = map(pos+eps.yyx) - map(pos-eps.yyx);
    return normalize(nor);
}

vec4 tex3D( sampler2D sam, in vec3 p, in vec3 n ) {
	vec4 x = texture( sam, p.yz );
	vec4 y = texture( sam, p.zx );
	vec4 z = texture( sam, p.xy );

	return x*abs(n.x) + y*abs(n.y) + z*abs(n.z);
}

vec3 render( in vec3 ro, in vec3 rd, in vec2 uv, in sampler2D tex ) {
    ro *= 2.; // scale scene
    const float tmax = 100.;
    vec3 lightDir = normalize(vec3(0.7,1.,.2));
    float tmin = boxIntersect(ro, rd, vec3(1.));
    if (all(lessThan(abs(ro),vec3(1)))) tmin = 0.01;
    
    float t = tmin;
    for( int i=0; i<64; i++ ) {
	    float precis = 0.001*t;
	    float d = map( ro+rd*t );
        if( abs(d)<precis || t>tmax ) break;
        t += d;
    }
    
    vec3 col = texture(tex, uv).xyz;
    // Use mipmap level 9 to get an average environment color from the webcam texture
    // used for lighting.
    vec3 lightColor = pow(.25 + .75 * texelFetch(tex, ivec2(0), 9).rgb, vec3(2.2)) * 3.;
    
    if (t < tmax) {
        vec3 p = ro + t * rd;
  		vec3 n = calcNormal(p);
        vec3 ref = reflect(rd, n);

        float ao = .4 + .6 * calcAO(p, n);
        float sh = .4 + .6 * calcSoftshadow(p, lightDir, 0.005, 1.);
    
        float diff = max(0.,dot(lightDir,n)) * ao * sh;
        float amb  = (.4+.2*n.y) * ao * sh;
		float spe = pow(clamp(dot(ref,lightDir), 0., 1.),8.) * sh * .5;
           
        vec3 mat = tex3D(iChannel2, p, n).rgb;
        col = (amb + diff) * mix(vec3(.4,.6,.8),vec3(.1,.2,.3),mat.r) + spe * dot(mat,mat);
        col *= lightColor;
    }
    
    // gamma
    col = mix(col, sqrt(clamp(col,vec3(0),vec3(1))), .95);
    
    return clamp(col,vec3(0),vec3(1));
}

mat3 setCamera( in vec3 ro, in vec3 ta, float cr ) {
	vec3 cw = normalize(ta-ro);
	vec3 cp = vec3(sin(cr), cos(cr),0.0);
	vec3 cu = normalize( cross(cw,cp) );
	vec3 cv = normalize( cross(cu,cw) );
    return mat3( cu, cv, cw );
}

void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
    vec2 p = (-iResolution.xy + 2.0*fragCoord)/iResolution.y;
   
    float a = .3 * iTime;
    vec3 ro = 2. * vec3( sin(a), .1, cos(a) );
    vec3 ta = vec3( 0.0, 0., 0.0 );
    
    mat3 ca = setCamera( ro, ta, 0.0 );
    vec3 rd = ca * normalize( vec3(p.xy,2.0) );

    vec3 col = render( ro, rd, fragCoord.xy/iResolution.xy, iChannel1 );
    fragColor = vec4(col,1.0);
}

void mainVR( out vec4 fragColor, in vec2 fragCoord, in vec3 ro, in vec3 rd ) {
    ro += vec3(0,0.5,1.5);
    vec3 col = render( ro, rd, fragCoord.xy/iResolution.xy, iChannel0 );
    fragColor = vec4(col,1.0);
}`,name:`Image`,description:``,type:`image`}]},{ver:`0.1`,info:{id:`3dfGR2`,date:`1547043986`,viewed:6432,name:`Yet another Cornell Box`,description:`Yet another Cornell Box. I have optimised the code of [url=https://www.shadertoy.com/view/XlGcWD]RIOW 2.07: Instances[/url] for the Cornell Box and added direct light sampling to reduce noise. Only Lambertian solid materials and cubes are supported. `,likes:52,published:`Public API`,usePreview:0,tags:[`ray`,`cornellbox`,`pathtracer`,`box`,`cornell`,`tracer`,`path`]},renderpass:[{inputs:[],outputs:[{id:`4dfGRr`,channel:0}],code:`// Yet another Cornell Box. Created by Reinder Nijhoff 2019
// Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License.
// @reindernijhoff
//
// https://www.shadertoy.com/view/3dfGR2
// 
// Yet another Cornell Box. I have optimised the code of my shader "RIOW 2.07: Instances"
// for the Cornell Box and added direct light sampling to reduce noise. Only Lambertian 
// solid materials and cubes are supported. 
//
// These shaders are my implementation of the raytracer described in the (excellent) 
// book "Ray tracing in one weekend" and "Ray tracing: the next week"[1] by Peter Shirley 
// (@Peter_shirley).
//
// = Ray tracing in one week =
// Chapter  7: Diffuse                           https://www.shadertoy.com/view/llVcDz
// Chapter  9: Dielectrics                       https://www.shadertoy.com/view/MlVcDz
// Chapter 11: Defocus blur                      https://www.shadertoy.com/view/XlGcWh
// Chapter 12: Where next?                       https://www.shadertoy.com/view/XlycWh
//
// = Ray tracing: the next week =
// Chapter  6: Rectangles and lights             https://www.shadertoy.com/view/4tGcWD
// Chapter  7: Instances                         https://www.shadertoy.com/view/XlGcWD
// Chapter  8: Volumes                           https://www.shadertoy.com/view/XtyyDD
// Chapter  9: A Scene Testing All New Features  https://www.shadertoy.com/view/MtycDD
//
// [1] http://in1weekend.blogspot.com/2016/01/ray-tracing-in-one-weekend.html
//

#define MOVE_CAMERA

#define MAX_FLOAT 1e5
#define EPSILON 0.01
#define MAX_RECURSION 3
#define SAMPLES (12+min(0,iFrame))

#define LAMBERTIAN 0
#define DIFFUSE_LIGHT 1

//
// Hash functions by Nimitz:
// https://www.shadertoy.com/view/Xt3cDn
//

uint base_hash(uvec2 p) {
    p = 1103515245U*((p >> 1U)^(p.yx));
    uint h32 = 1103515245U*((p.x)^(p.y>>3U));
    return h32^(h32 >> 16);
}

float g_seed = 0.;

vec2 hash2(inout float seed) {
    uint n = base_hash(floatBitsToUint(vec2(seed+=.1,seed+=.1)));
    uvec2 rz = uvec2(n, n*48271U);
    return vec2(rz.xy & uvec2(0x7fffffffU))/float(0x7fffffff);
}

vec3 hash3(inout float seed) {
    uint n = base_hash(floatBitsToUint(vec2(seed+=.1,seed+=.1)));
    uvec3 rz = uvec3(n, n*16807U, n*48271U);
    return vec3(rz & uvec3(0x7fffffffU))/float(0x7fffffff);
}

//
// Ray trace helper functions
//

vec3 random_cos_weighted_hemisphere_direction( const vec3 n, inout float seed ) {
  	vec2 r = hash2(seed);
	vec3  uu = normalize(cross(n, abs(n.y) > .5 ? vec3(1.,0.,0.) : vec3(0.,1.,0.)));
	vec3  vv = cross(uu, n);
	float ra = sqrt(r.y);
	float rx = ra*cos(6.28318530718*r.x); 
	float ry = ra*sin(6.28318530718*r.x);
	float rz = sqrt(1.-r.y);
	vec3  rr = vec3(rx*uu + ry*vv + rz*n);
    return normalize(rr);
}

vec2 random_in_unit_disk(inout float seed) {
    vec2 h = hash2(seed) * vec2(1.,6.28318530718);
    float phi = h.y;
    float r = sqrt(h.x);
	return r * vec2(sin(phi),cos(phi));
}

vec3 rotate_y(const in vec3 p, const in float t) {
    float co = cos(t);
    float si = sin(t);
    vec2 xz = mat2(co,si,-si,co)*p.xz;
    return vec3(xz.x, p.y, xz.y);
}

//
// Ray
//

struct ray {
    vec3 origin, direction;
};

ray ray_translate(const in ray r, const in vec3 t) {
    ray rt = r;
    rt.origin -= t;
    return rt;
}

ray ray_rotate_y(const in ray r, const in float t) {
    ray rt = r;
    rt.origin = rotate_y(rt.origin, t);
    rt.direction = rotate_y(rt.direction, t);
    return rt;
}

//
// Material
//

struct material {
    int type;
    vec3 color;
};

//
// Hit record
//

struct hit_record {
    float t;
    vec3 p, normal;
    material mat;
};

hit_record hit_record_translate(const in hit_record h, const in vec3 t) {
    hit_record ht = h;
    ht.p -= t;
    return ht;
}
   
hit_record hit_record_rotate_y(const in hit_record h, const in float t) {
    hit_record ht = h;
    ht.p = rotate_y(ht.p, t);
    ht.normal = rotate_y(ht.normal, t);
    return ht;
}

void material_scatter(const in ray r_in, const in hit_record rec, out vec3 attenuation, 
                      out ray scattered) {
    scattered = ray(rec.p, random_cos_weighted_hemisphere_direction(rec.normal, g_seed));
    attenuation = rec.mat.color;
}

vec3 material_emitted(const in hit_record rec) {
    if (rec.mat.type == DIFFUSE_LIGHT) {
        return rec.mat.color;
    } else {
        return vec3(0);
    }
}

//
// Hitable
//

struct hitable { // always a box
    vec3 center, dimension; 
};
    
bool box_intersect(const in ray r, const in float t_min, const in float t_max,
                   const in vec3 center, const in vec3 rad, out vec3 normal, inout float dist) {
    vec3 m = 1./r.direction;
    vec3 n = m*(r.origin - center);
    vec3 k = abs(m)*rad;
	
    vec3 t1 = -n - k;
    vec3 t2 = -n + k;

	float tN = max( max( t1.x, t1.y ), t1.z );
	float tF = min( min( t2.x, t2.y ), t2.z );
	
	if( tN > tF || tF < 0.) return false;
    
    float t = tN < t_min ? tF : tN;
    if (t < t_max && t > t_min) {
        dist = t;
		normal = -sign(r.direction)*step(t1.yzx,t1.xyz)*step(t1.zxy,t1.xyz);
	    return true;
    } else {
        return false;
    }
}

bool hitable_hit(const in hitable hb, const in ray r, const in float t_min, 
                 const in float t_max, inout hit_record rec) {
    float dist;
    vec3 normal;
    if (box_intersect(r, t_min, t_max, hb.center, hb.dimension, normal, dist)) {
        rec.t = dist;
        rec.p = r.origin + dist*r.direction;
        rec.normal = normal;
        return true;
    } else {
        return false;
    }
}

//
// Camera
//

struct camera {
    vec3 origin, lower_left_corner, horizontal, vertical, u, v, w;
    float lens_radius;
};

camera camera_const(const in vec3 lookfrom, const in vec3 lookat, const in vec3 vup, 
                    const in float vfov, const in float aspect, const in float aperture, 
                    const in float focus_dist) {
    camera cam;    
    cam.lens_radius = aperture / 2.;
    float theta = vfov*3.14159265359/180.;
    float half_height = tan(theta/2.);
    float half_width = aspect * half_height;
    cam.origin = lookfrom;
    cam.w = normalize(lookfrom - lookat);
    cam.u = normalize(cross(vup, cam.w));
    cam.v = cross(cam.w, cam.u);
    cam.lower_left_corner = cam.origin  - half_width*focus_dist*cam.u -half_height*focus_dist*cam.v - focus_dist*cam.w;
    cam.horizontal = 2.*half_width*focus_dist*cam.u;
    cam.vertical = 2.*half_height*focus_dist*cam.v;
    return cam;
}
    
ray camera_get_ray(camera c, vec2 uv) {
    vec2 rd = c.lens_radius*random_in_unit_disk(g_seed);
    vec3 offset = c.u * rd.x + c.v * rd.y;
    return ray(c.origin + offset, 
               normalize(c.lower_left_corner + uv.x*c.horizontal + uv.y*c.vertical - c.origin - offset));
}

//
// Color & Scene
//

bool world_hit(const in ray r, const in float t_min, 
               const in float t_max, out hit_record rec) {
    rec.t = t_max;
    bool hit = false;

    const material red = material(LAMBERTIAN, vec3(.65,.05,.05));
    const material white = material(LAMBERTIAN, vec3(.73));
    const material green = material(LAMBERTIAN, vec3(.12,.45,.15));

    const material light = material(DIFFUSE_LIGHT, vec3(15));
    
    if (hitable_hit(hitable(vec3(278,555,279.5), vec3(65,1,52.5)),r,t_min,rec.t,rec)) 
        hit=true, rec.mat=light;   
   
    ray r_ = ray_rotate_y(ray_translate(r, vec3(130,0,65)), -18./180.*3.14159265359);
    hit_record rec_ = rec;    
    if (hitable_hit(hitable(vec3(82.5), vec3(82.5)),r_,t_min,rec.t,rec_)) 
        hit=true, 
        rec=hit_record_translate(hit_record_rotate_y(rec_, 18./180.*3.14159265359),-vec3(130,0,65.)), 
        rec.mat=white;
    
	r_ = ray_rotate_y(ray_translate(r, vec3(265,0,295)), 15./180.*3.14159265359);
    rec_ = rec;    
    if (hitable_hit(hitable(vec3(82.5,165,82.5), vec3(82.5,165,82.5)),r_,t_min,rec.t,rec_)) 
        hit=true, 
        rec=hit_record_translate(hit_record_rotate_y(rec_, -15./180.*3.14159265359),-vec3(265,0,295)), 
        rec.mat=white;

  	if (hitable_hit(hitable(vec3(556,277.5,277.5), vec3(1,277.5,277.5)),r,t_min,rec.t,rec)) 
        hit=true, rec.mat=red;
    if (hitable_hit(hitable(vec3(-1,277.5,277.5), vec3(1,277.5,277.5)),r,t_min,rec.t,rec)) 
        hit=true, rec.mat=green;
   
    if (hitable_hit(hitable(vec3(277.5,556,277.5), vec3(277.5,1,277.5)),r,t_min,rec.t,rec)) 
        hit=true, rec.mat=white;
    if (hitable_hit(hitable(vec3(277.5,-1,277.5), vec3(277.5,1,277.5)),r,t_min,rec.t,rec)) 
        hit=true, rec.mat=white;
    if (hitable_hit(hitable(vec3(277.5,277.5,556), vec3(277.5,277.5,1)),r,t_min,rec.t,rec)) 
        hit=true, rec.mat=white;
    
    return hit;
}


bool shadow_hit(const in ray r, const in float t_min, const in float t_max) {
    hit_record rec;
    rec.t = t_max;
   
    ray r_ = ray_rotate_y(ray_translate(r, vec3(130,0,65)), -18./180.*3.14159265359);  
    if (hitable_hit(hitable(vec3(82.5), vec3(82.5)),r_,t_min,rec.t,rec)) 
        return true;
    
	r_ = ray_rotate_y(ray_translate(r, vec3(265,0,295)), 15./180.*3.14159265359);  
    if (hitable_hit(hitable(vec3(82.5,165,82.5), vec3(82.5,165,82.5)),r_,t_min,rec.t,rec)) 
        return true;
  
    return false;
}

vec3 color(in ray r) {
    vec3 col = vec3(0);
    vec3 emitted = vec3(0);
	hit_record rec;
    
    for (int i=0; i<MAX_RECURSION && world_hit(r, EPSILON, MAX_FLOAT, rec); i++) {
        if (rec.mat.type == DIFFUSE_LIGHT) { // direct light sampling code
            return i == 0 ? rec.mat.color : emitted;
        }

        vec3 attenuation;
        material_scatter(r, rec, attenuation, r);
        col = i == 0 ? attenuation : col * attenuation;

        // direct light sampling
        vec3 pointInSource = (2.*hash3(g_seed)-1.) * vec3(65,1,52.5) + vec3(278,555,279.5);
        vec3 L = pointInSource - rec.p;
        float rr = dot(L, L);
        L = normalize(L);

        ray shadowRay = ray(rec.p, L);
        if (L.y > 0.01 && dot(rec.normal, L) > 0. && !shadow_hit(shadowRay, .01, 1000.)) {
	        const float area = (65.*52.5*4.);
            float weight = area * L.y * dot(rec.normal, L) / (3.14 * rr);
            emitted += col * 15. * weight;
        }
    }
    return emitted;
}

//
// Main
//

void mainImage( out vec4 frag_color, in vec2 frag_coord ) {
    float aspect = iResolution.x/iResolution.y;
#ifdef MOVE_CAMERA
    vec3 lookfrom = vec3(278. + sin(iTime * .7)*200., 278, -800. + sin(iTime)*100.);
#else
    vec3 lookfrom = vec3(278. , 278, -800.);
#endif
    vec3 lookat = vec3(278,278,0);
    g_seed = float(base_hash(floatBitsToUint(frag_coord)))/float(0xffffffffU)+iTime;

    vec3 tcol = vec3(0);
    
    for (int i=0, l = SAMPLES; i<l; i++) {
        vec2 uv = (frag_coord + hash2(g_seed))/iResolution.xy;

        camera cam = camera_const(lookfrom, lookat, vec3(0,1,0), 40., aspect, .0, 10.);
        ray r = camera_get_ray(cam, uv);
        tcol += color(r);
    }
    
    frag_color = vec4(sqrt(tcol / float(SAMPLES)), 1.);
}`,name:`Image`,description:``,type:`image`}]},{ver:`0.1`,info:{id:`tl23Rm`,date:`1559573266`,viewed:19614,name:`Ray Tracing - Primitives`,description:`This is a collection of ray-primitive intersection routines ([url=http://iquilezles.org/articles/intersectors/intersectors.htm]by Íñigo Quílez[/url]).

Use your mouse to change the camera viewpoint.`,likes:216,published:`Public API`,usePreview:0,tags:[`3d`,`raytracer`,`ray`,`intersection`,`dof`,`primitives`,`field`,`tracing`,`depth`,`path`,`of`]},renderpass:[{inputs:[{id:`4dXGR8`,filepath:`/media/previz/buffer00.png`,type:`buffer`,channel:0,sampler:{filter:`linear`,wrap:`clamp`,vflip:`true`,srgb:`false`,internal:`byte`},published:1}],outputs:[{id:`4dfGRr`,channel:0}],code:`// Ray Tracing - Primitives. Created by Reinder Nijhoff 2019
// The MIT License
// @reindernijhoff
//
// https://www.shadertoy.com/view/tl23Rm
//
// I wanted to create a reference shader similar to "Raymarching - Primitives" 
// (https://www.shadertoy.com/view/Xds3zN), but with ray-primitive intersection 
// routines instead of sdf routines.
// 
// As usual, I ended up mostly just copy-pasting code from Íñigo Quílez: 
// 
// https://iquilezles.org/articles/intersectors
// 
// Please let me know if there are other routines that I should add to this shader.
// 
// You can find all intersection routines in the Common tab. The routines have a similar 
// signature: a routine returns the distance to the first hit inside the 
// [distBound.x, distBound.y] interval and will set the normal if an intersection is found.
// If no intersection is found, the routine will return MAX_DIST.
//
// I made a simple ray tracer (Buffer A) to visualize a scene with all primitives.
//
// Use your mouse to change the camera viewpoint.
//

void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
    vec4 data = texelFetch(iChannel0, ivec2(fragCoord), 0);
    vec3 col = data.rgb / data.w;
    
    // gamma correction
    col = max( vec3(0), col - 0.004);
    col = (col*(6.2*col + .5)) / (col*(6.2*col+1.7) + 0.06);
    
    // Output to screen
    fragColor = vec4(col,1.0);
}`,name:`Image`,description:``,type:`image`},{inputs:[],outputs:[],code:`// Ray Tracing - Primitives. Created by Reinder Nijhoff 2019
// The MIT License
// @reindernijhoff
//
// https://www.shadertoy.com/view/tl23Rm
//
// I wanted to create a reference shader similar to "Raymarching - Primitives" 
// (https://www.shadertoy.com/view/Xds3zN), but with ray-primitive intersection 
// routines instead of sdf routines.
// 
// As usual, I ended up mostly just copy-pasting code from Íñigo Quílez: 
// 
// https://iquilezles.org/articles/intersectors
// 
// Please let me know if there are other routines that I should add to this shader.
// 
// Sphere:          https://www.shadertoy.com/view/4d2XWV
// Box:             https://www.shadertoy.com/view/ld23DV
// Capped Cylinder: https://www.shadertoy.com/view/4lcSRn
// Torus:           https://www.shadertoy.com/view/4sBGDy
// Capsule:         https://www.shadertoy.com/view/Xt3SzX
// Capped Cone:     https://www.shadertoy.com/view/llcfRf
// Ellipsoid:       https://www.shadertoy.com/view/MlsSzn
// Rounded Cone:    https://www.shadertoy.com/view/MlKfzm
// Triangle:        https://www.shadertoy.com/view/MlGcDz
// Sphere4:         https://www.shadertoy.com/view/3tj3DW
// Goursat:         https://www.shadertoy.com/view/3lj3DW
// Rounded Box:     https://www.shadertoy.com/view/WlSXRW
//
// Disk:            https://www.shadertoy.com/view/lsfGDB
//

#define MAX_DIST 1e10
float dot2( in vec3 v ) { return dot(v,v); }

// Plane 
float iPlane( in vec3 ro, in vec3 rd, in vec2 distBound, inout vec3 normal,
              in vec3 planeNormal, in float planeDist) {
    float a = dot(rd, planeNormal);
    float d = -(dot(ro, planeNormal)+planeDist)/a;
    if (a > 0. || d < distBound.x || d > distBound.y) {
        return MAX_DIST;
    } else {
        normal = planeNormal;
    	return d;
    }
}

// Sphere:          https://www.shadertoy.com/view/4d2XWV
float iSphere( in vec3 ro, in vec3 rd, in vec2 distBound, inout vec3 normal,
               float sphereRadius ) {
    float b = dot(ro, rd);
    float c = dot(ro, ro) - sphereRadius*sphereRadius;
    float h = b*b - c;
    if (h < 0.) {
        return MAX_DIST;
    } else {
	    h = sqrt(h);
        float d1 = -b-h;
        float d2 = -b+h;
        if (d1 >= distBound.x && d1 <= distBound.y) {
            normal = normalize(ro + rd*d1);
            return d1;
        } else if (d2 >= distBound.x && d2 <= distBound.y) { 
            normal = normalize(ro + rd*d2);            
            return d2;
        } else {
            return MAX_DIST;
        }
    }
}

// Box:             https://www.shadertoy.com/view/ld23DV
float iBox( in vec3 ro, in vec3 rd, in vec2 distBound, inout vec3 normal, 
            in vec3 boxSize ) {
    vec3 m = sign(rd)/max(abs(rd), 1e-8);
    vec3 n = m*ro;
    vec3 k = abs(m)*boxSize;
	
    vec3 t1 = -n - k;
    vec3 t2 = -n + k;

	float tN = max( max( t1.x, t1.y ), t1.z );
	float tF = min( min( t2.x, t2.y ), t2.z );
	
    if (tN > tF || tF <= 0.) {
        return MAX_DIST;
    } else {
        if (tN >= distBound.x && tN <= distBound.y) {
        	normal = -sign(rd)*step(t1.yzx,t1.xyz)*step(t1.zxy,t1.xyz);
            return tN;
        } else if (tF >= distBound.x && tF <= distBound.y) { 
        	normal = -sign(rd)*step(t1.yzx,t1.xyz)*step(t1.zxy,t1.xyz);
            return tF;
        } else {
            return MAX_DIST;
        }
    }
}

// Capped Cylinder: https://www.shadertoy.com/view/4lcSRn
float iCylinder( in vec3 ro, in vec3 rd, in vec2 distBound, inout vec3 normal,
                 in vec3 pa, in vec3 pb, float ra ) {
    vec3 ca = pb-pa;
    vec3 oc = ro-pa;

    float caca = dot(ca,ca);
    float card = dot(ca,rd);
    float caoc = dot(ca,oc);
    
    float a = caca - card*card;
    float b = caca*dot( oc, rd) - caoc*card;
    float c = caca*dot( oc, oc) - caoc*caoc - ra*ra*caca;
    float h = b*b - a*c;
    
    if (h < 0.) return MAX_DIST;
    
    h = sqrt(h);
    float d = (-b-h)/a;

    float y = caoc + d*card;
    if (y > 0. && y < caca && d >= distBound.x && d <= distBound.y) {
        normal = (oc+d*rd-ca*y/caca)/ra;
        return d;
    }

    d = ((y < 0. ? 0. : caca) - caoc)/card;
    
    if( abs(b+a*d) < h && d >= distBound.x && d <= distBound.y) {
        normal = normalize(ca*sign(y)/caca);
        return d;
    } else {
        return MAX_DIST;
    }
}

// Torus:           https://www.shadertoy.com/view/4sBGDy
float iTorus( in vec3 ro, in vec3 rd, in vec2 distBound, inout vec3 normal,
              in vec2 torus ) {
    // bounding sphere
    vec3 tmpnormal;
    if (iSphere(ro, rd, distBound, tmpnormal, torus.y+torus.x) > distBound.y) {
        return MAX_DIST;
    }
    
    float po = 1.0;
    
	float Ra2 = torus.x*torus.x;
	float ra2 = torus.y*torus.y;
	
	float m = dot(ro,ro);
	float n = dot(ro,rd);

#if 1
	float k = (m + Ra2 - ra2)/2.0;
    float k3 = n;
	float k2 = n*n - Ra2*dot(rd.xy,rd.xy) + k;
    float k1 = n*k - Ra2*dot(rd.xy,ro.xy);
    float k0 = k*k - Ra2*dot(ro.xy,ro.xy);
#else
	float k = (m - Ra2 - ra2)/2.0;
	float k3 = n;
	float k2 = n*n + Ra2*rd.z*rd.z + k;
	float k1 = k*n + Ra2*ro.z*rd.z;
	float k0 = k*k + Ra2*ro.z*ro.z - Ra2*ra2;
#endif
    
#if 1
    // prevent |c1| from being too close to zero
    if (abs(k3*(k3*k3-k2)+k1) < 0.01) {
        po = -1.0;
        float tmp=k1; k1=k3; k3=tmp;
        k0 = 1.0/k0;
        k1 = k1*k0;
        k2 = k2*k0;
        k3 = k3*k0;
    }
#endif
    
    // reduced cubic
    float c2 = k2*2.0 - 3.0*k3*k3;
    float c1 = k3*(k3*k3-k2)+k1;
    float c0 = k3*(k3*(c2+2.0*k2)-8.0*k1)+4.0*k0;
    
    c2 /= 3.0;
    c1 *= 2.0;
    c0 /= 3.0;

    float Q = c2*c2 + c0;
    float R = c2*c2*c2 - 3.0*c2*c0 + c1*c1;
    
    float h = R*R - Q*Q*Q;
    float t = MAX_DIST;
    
    if (h>=0.0) {
        // 2 intersections
        h = sqrt(h);
        
        float v = sign(R+h)*pow(abs(R+h),1.0/3.0); // cube root
        float u = sign(R-h)*pow(abs(R-h),1.0/3.0); // cube root

        vec2 s = vec2( (v+u)+4.0*c2, (v-u)*sqrt(3.0));
    
        float y = sqrt(0.5*(length(s)+s.x));
        float x = 0.5*s.y/y;
        float r = 2.0*c1/(x*x+y*y);

        float t1 =  x - r - k3; t1 = (po<0.0)?2.0/t1:t1;
        float t2 = -x - r - k3; t2 = (po<0.0)?2.0/t2:t2;

        if (t1 >= distBound.x) t=t1;
        if (t2 >= distBound.x) t=min(t,t2);
	} else {
        // 4 intersections
        float sQ = sqrt(Q);
        float w = sQ*cos( acos(-R/(sQ*Q)) / 3.0 );

        float d2 = -(w+c2); if( d2<0.0 ) return MAX_DIST;
        float d1 = sqrt(d2);

        float h1 = sqrt(w - 2.0*c2 + c1/d1);
        float h2 = sqrt(w - 2.0*c2 - c1/d1);
        float t1 = -d1 - h1 - k3; t1 = (po<0.0)?2.0/t1:t1;
        float t2 = -d1 + h1 - k3; t2 = (po<0.0)?2.0/t2:t2;
        float t3 =  d1 - h2 - k3; t3 = (po<0.0)?2.0/t3:t3;
        float t4 =  d1 + h2 - k3; t4 = (po<0.0)?2.0/t4:t4;

        if (t1 >= distBound.x) t=t1;
        if (t2 >= distBound.x) t=min(t,t2);
        if (t3 >= distBound.x) t=min(t,t3);
        if (t4 >= distBound.x) t=min(t,t4);
    }
    
	if (t >= distBound.x && t <= distBound.y) {
        vec3 pos = ro + rd*t;
        normal = normalize( pos*(dot(pos,pos) - torus.y*torus.y - torus.x*torus.x*vec3(1,1,-1)));
        return t;
    } else {
        return MAX_DIST;
    }
}

// Capsule:         https://www.shadertoy.com/view/Xt3SzX
float iCapsule( in vec3 ro, in vec3 rd, in vec2 distBound, inout vec3 normal,
                in vec3 pa, in vec3 pb, in float r ) {
    vec3  ba = pb - pa;
    vec3  oa = ro - pa;

    float baba = dot(ba,ba);
    float bard = dot(ba,rd);
    float baoa = dot(ba,oa);
    float rdoa = dot(rd,oa);
    float oaoa = dot(oa,oa);

    float a = baba      - bard*bard;
    float b = baba*rdoa - baoa*bard;
    float c = baba*oaoa - baoa*baoa - r*r*baba;
    float h = b*b - a*c;
    if (h >= 0.) {
        float t = (-b-sqrt(h))/a;
        float d = MAX_DIST;
        
        float y = baoa + t*bard;
        
        // body
        if (y > 0. && y < baba) {
            d = t;
        } else {
            // caps
            vec3 oc = (y <= 0.) ? oa : ro - pb;
            b = dot(rd,oc);
            c = dot(oc,oc) - r*r;
            h = b*b - c;
            if( h>0.0 ) {
                d = -b - sqrt(h);
            }
        }
        if (d >= distBound.x && d <= distBound.y) {
            vec3  pa = ro + rd * d - pa;
            float h = clamp(dot(pa,ba)/dot(ba,ba),0.0,1.0);
            normal = (pa - h*ba)/r;
            return d;
        }
    }
    return MAX_DIST;
}

// Capped Cone:     https://www.shadertoy.com/view/llcfRf
float iCone( in vec3 ro, in vec3 rd, in vec2 distBound, inout vec3 normal,
             in vec3  pa, in vec3  pb, in float ra, in float rb ) {
    vec3  ba = pb - pa;
    vec3  oa = ro - pa;
    vec3  ob = ro - pb;
    
    float m0 = dot(ba,ba);
    float m1 = dot(oa,ba);
    float m2 = dot(ob,ba); 
    float m3 = dot(rd,ba);

    //caps
    if (m1 < 0.) { 
        if( dot2(oa*m3-rd*m1)<(ra*ra*m3*m3) ) {
            float d = -m1/m3;
            if (d >= distBound.x && d <= distBound.y) {
                normal = -ba*inversesqrt(m0);
                return d;
            }
        }
    }
    else if (m2 > 0.) { 
        if( dot2(ob*m3-rd*m2)<(rb*rb*m3*m3) ) {
            float d = -m2/m3;
            if (d >= distBound.x && d <= distBound.y) {
                normal = ba*inversesqrt(m0);
                return d;
            }
        }
    }
                       
    // body
    float m4 = dot(rd,oa);
    float m5 = dot(oa,oa);
    float rr = ra - rb;
    float hy = m0 + rr*rr;
    
    float k2 = m0*m0    - m3*m3*hy;
    float k1 = m0*m0*m4 - m1*m3*hy + m0*ra*(rr*m3*1.0        );
    float k0 = m0*m0*m5 - m1*m1*hy + m0*ra*(rr*m1*2.0 - m0*ra);
    
    float h = k1*k1 - k2*k0;
    if( h < 0. ) return MAX_DIST;

    float t = (-k1-sqrt(h))/k2;

    float y = m1 + t*m3;
    if (y > 0. && y < m0 && t >= distBound.x && t <= distBound.y) {
        normal = normalize(m0*(m0*(oa+t*rd)+rr*ba*ra)-ba*hy*y);
        return t;
    } else {   
	    return MAX_DIST;
    }
}

// Ellipsoid:       https://www.shadertoy.com/view/MlsSzn
float iEllipsoid( in vec3 ro, in vec3 rd, in vec2 distBound, inout vec3 normal,
                  in vec3 rad ) {
    vec3 ocn = ro / rad;
    vec3 rdn = rd / rad;
    
    float a = dot( rdn, rdn );
	float b = dot( ocn, rdn );
	float c = dot( ocn, ocn );
	float h = b*b - a*(c-1.);
    
    if (h < 0.) {
        return MAX_DIST;
    }
    
	float d = (-b - sqrt(h))/a;
    
    if (d < distBound.x || d > distBound.y) {
        return MAX_DIST;
    } else {
        normal = normalize((ro + d*rd)/rad);
    	return d;
    }
}

// Rounded Cone:    https://www.shadertoy.com/view/MlKfzm
float iRoundedCone( in vec3 ro, in vec3 rd, in vec2 distBound, inout vec3 normal,
                    in vec3  pa, in vec3  pb, in float ra, in float rb ) {
    vec3  ba = pb - pa;
	vec3  oa = ro - pa;
	vec3  ob = ro - pb;
    float rr = ra - rb;
    float m0 = dot(ba,ba);
    float m1 = dot(ba,oa);
    float m2 = dot(ba,rd);
    float m3 = dot(rd,oa);
    float m5 = dot(oa,oa);
	float m6 = dot(ob,rd);
    float m7 = dot(ob,ob);
    
    float d2 = m0-rr*rr;
    
	float k2 = d2    - m2*m2;
    float k1 = d2*m3 - m1*m2 + m2*rr*ra;
    float k0 = d2*m5 - m1*m1 + m1*rr*ra*2. - m0*ra*ra;
    
	float h = k1*k1 - k0*k2;
    if (h < 0.0) {
        return MAX_DIST;
    }
    
    float t = (-sqrt(h)-k1)/k2;
    
    float y = m1 - ra*rr + t*m2;
    if (y>0.0 && y<d2) {
        if (t >= distBound.x && t <= distBound.y) {
        	normal = normalize( d2*(oa + t*rd)-ba*y );
            return t;
        } else {
            return MAX_DIST;
        }
    } else {
        float h1 = m3*m3 - m5 + ra*ra;
        float h2 = m6*m6 - m7 + rb*rb;

        if (max(h1,h2)<0.0) {
            return MAX_DIST;
        }

        vec3 n = vec3(0);
        float r = MAX_DIST;

        if (h1 > 0.) {        
            r = -m3 - sqrt( h1 );
            n = (oa+r*rd)/ra;
        }
        if (h2 > 0.) {
            t = -m6 - sqrt( h2 );
            if( t<r ) {
                n = (ob+t*rd)/rb;
                r = t;
            }
        }
        if (r >= distBound.x && r <= distBound.y) {
            normal = n;
            return r;
        } else {
            return MAX_DIST;
        }
    }
}

// Triangle:        https://www.shadertoy.com/view/MlGcDz
float iTriangle( in vec3 ro, in vec3 rd, in vec2 distBound, inout vec3 normal,
                 in vec3 v0, in vec3 v1, in vec3 v2 ) {
    vec3 v1v0 = v1 - v0;
    vec3 v2v0 = v2 - v0;
    vec3 rov0 = ro - v0;

    vec3  n = cross( v1v0, v2v0 );
    vec3  q = cross( rov0, rd );
    float d = 1.0/dot( rd, n );
    float u = d*dot( -q, v2v0 );
    float v = d*dot(  q, v1v0 );
    float t = d*dot( -n, rov0 );

    if( u<0. || v<0. || (u+v)>1. || t<distBound.x || t>distBound.y) {
        return MAX_DIST;
    } else {
        normal = normalize(-n);
        return t;
    }
}

// Sphere4:         https://www.shadertoy.com/view/3tj3DW
float iSphere4( in vec3 ro, in vec3 rd, in vec2 distBound, inout vec3 normal,
                in float ra ) {
    // -----------------------------
    // solve quartic equation
    // -----------------------------
    
    float r2 = ra*ra;
    
    vec3 d2 = rd*rd; vec3 d3 = d2*rd;
    vec3 o2 = ro*ro; vec3 o3 = o2*ro;

    float ka = 1.0/dot(d2,d2);

    float k0 = ka* dot(ro,d3);
    float k1 = ka* dot(o2,d2);
    float k2 = ka* dot(o3,rd);
    float k3 = ka*(dot(o2,o2) - r2*r2);

    // -----------------------------
    // solve cubic
    // -----------------------------

    float c0 = k1 - k0*k0;
    float c1 = k2 + 2.0*k0*(k0*k0 - (3.0/2.0)*k1);
    float c2 = k3 - 3.0*k0*(k0*(k0*k0 - 2.0*k1) + (4.0/3.0)*k2);

    float p = c0*c0*3.0 + c2;
    float q = c0*c0*c0 - c0*c2 + c1*c1;
    float h = q*q - p*p*p*(1.0/27.0);

    // -----------------------------
    // skip the case of 3 real solutions for the cubic, which involves 
    // 4 complex solutions for the quartic, since we know this objcet is 
    // convex
    // -----------------------------
    if (h<0.0) {
        return MAX_DIST;
    }
    
    // one real solution, two complex (conjugated)
    h = sqrt(h);

    float s = sign(q+h)*pow(abs(q+h),1.0/3.0); // cuberoot
    float t = sign(q-h)*pow(abs(q-h),1.0/3.0); // cuberoot

    vec2 v = vec2( (s+t)+c0*4.0, (s-t)*sqrt(3.0) )*0.5;
    
    // -----------------------------
    // the quartic will have two real solutions and two complex solutions.
    // we only want the real ones
    // -----------------------------
    
    float r = length(v);
	float d = -abs(v.y)/sqrt(r+v.x) - c1/r - k0;

    if (d >= distBound.x && d <= distBound.y) {
	    vec3 pos = ro + rd * d;
	    normal = normalize( pos*pos*pos );
	    return d;
    } else {
        return MAX_DIST;
    }
}

// Goursat:         https://www.shadertoy.com/view/3lj3DW
float cuberoot( float x ) { return sign(x)*pow(abs(x),1.0/3.0); }

float iGoursat( in vec3 ro, in vec3 rd, in vec2 distBound, inout vec3 normal,
                in float ra, float rb ) {
// hole: x4 + y4 + z4 - (r2^2)·(x2 + y2 + z2) + r1^4 = 0;
    float ra2 = ra*ra;
    float rb2 = rb*rb;
    
    vec3 rd2 = rd*rd; vec3 rd3 = rd2*rd;
    vec3 ro2 = ro*ro; vec3 ro3 = ro2*ro;

    float ka = 1.0/dot(rd2,rd2);

    float k3 = ka*(dot(ro ,rd3));
    float k2 = ka*(dot(ro2,rd2) - rb2/6.0);
    float k1 = ka*(dot(ro3,rd ) - rb2*dot(rd,ro)/2.0  );
    float k0 = ka*(dot(ro2,ro2) + ra2*ra2 - rb2*dot(ro,ro) );

    float c2 = k2 - k3*(k3);
    float c1 = k1 + k3*(2.0*k3*k3-3.0*k2);
    float c0 = k0 + k3*(k3*(c2+k2)*3.0-4.0*k1);

    c0 /= 3.0;

    float Q = c2*c2 + c0;
    float R = c2*c2*c2 - 3.0*c0*c2 + c1*c1;
    float h = R*R - Q*Q*Q;
    
    
    // 2 intersections
    if (h>0.0) {
        h = sqrt(h);

        float s = cuberoot( R + h );
        float u = cuberoot( R - h );
        
        float x = s+u+4.0*c2;
        float y = s-u;
        
        float k2 = x*x + y*y*3.0;
  
        float k = sqrt(k2);

		float d = -0.5*abs(y)*sqrt(6.0/(k+x)) 
                  -2.0*c1*(k+x)/(k2+x*k) 
                  -k3;
        
        if (d >= distBound.x && d <= distBound.y) {
            vec3 pos = ro + rd * d;
            normal = normalize( 4.0*pos*pos*pos - 2.0*pos*rb*rb );
            return d;
        } else {
            return MAX_DIST;
        }
    } else {	
        // 4 intersections
        float sQ = sqrt(Q);
        float z = c2 - 2.0*sQ*cos( acos(-R/(sQ*Q)) / 3.0 );

        float d1 = z   - 3.0*c2;
        float d2 = z*z - 3.0*c0;

        if (abs(d1)<1.0e-4) {  
            if( d2<0.0) return MAX_DIST;
            d2 = sqrt(d2);
        } else {
            if (d1<0.0) return MAX_DIST;
            d1 = sqrt( d1/2.0 );
            d2 = c1/d1;
        }

        //----------------------------------

        float h1 = sqrt(d1*d1 - z + d2);
        float h2 = sqrt(d1*d1 - z - d2);
        float t1 = -d1 - h1 - k3;
        float t2 = -d1 + h1 - k3;
        float t3 =  d1 - h2 - k3;
        float t4 =  d1 + h2 - k3;

        if (t2<0.0 && t4<0.0) return MAX_DIST;

        float result = 1e20;
             if (t1>0.0) result=t1;
        else if (t2>0.0) result=t2;
             if (t3>0.0) result=min(result,t3);
        else if (t4>0.0) result=min(result,t4);

        if (result >= distBound.x && result <= distBound.y) {
            vec3 pos = ro + rd * result;
            normal = normalize( 4.0*pos*pos*pos - 2.0*pos*rb*rb );
            return result;
        } else {
            return MAX_DIST;
        }
    }
}

// Rounded Box:     https://www.shadertoy.com/view/WlSXRW
float iRoundedBox(in vec3 ro, in vec3 rd, in vec2 distBound, inout vec3 normal,
   				  in vec3 size, in float rad ) {
	// bounding box
    vec3 m = 1.0/rd;
    vec3 n = m*ro;
    vec3 k = abs(m)*(size+rad);
    vec3 t1 = -n - k;
    vec3 t2 = -n + k;
	float tN = max( max( t1.x, t1.y ), t1.z );
	float tF = min( min( t2.x, t2.y ), t2.z );
    if (tN > tF || tF < 0.0) {
    	return MAX_DIST;
    }
    float t = (tN>=distBound.x&&tN<=distBound.y)?tN:
    		  (tF>=distBound.x&&tF<=distBound.y)?tF:MAX_DIST;

    // convert to first octant
    vec3 pos = ro+t*rd;
    vec3 s = sign(pos);
    vec3 ros = ro*s;
    vec3 rds = rd*s;
    pos *= s;
        
    // faces
    pos -= size;
    pos = max( pos.xyz, pos.yzx );
    if (min(min(pos.x,pos.y),pos.z)<0.0) {
        if (t >= distBound.x && t <= distBound.y) {
            vec3 p = ro + rd * t;
            normal = sign(p)*normalize(max(abs(p)-size,0.0));
            return t;
        }
    }
    
    // some precomputation
    vec3 oc = ros - size;
    vec3 dd = rds*rds;
	vec3 oo = oc*oc;
    vec3 od = oc*rds;
    float ra2 = rad*rad;

    t = MAX_DIST;        

    // corner
    {
    float b = od.x + od.y + od.z;
	float c = oo.x + oo.y + oo.z - ra2;
	float h = b*b - c;
	if (h > 0.0) t = -b-sqrt(h);
    }

    // edge X
    {
	float a = dd.y + dd.z;
	float b = od.y + od.z;
	float c = oo.y + oo.z - ra2;
	float h = b*b - a*c;
	if (h>0.0) {
	  h = (-b-sqrt(h))/a;
      if (h>=distBound.x && h<t && abs(ros.x+rds.x*h)<size.x ) t = h;
    }
	}
    // edge Y
    {
	float a = dd.z + dd.x;
	float b = od.z + od.x;
	float c = oo.z + oo.x - ra2;
	float h = b*b - a*c;
	if (h>0.0) {
	  h = (-b-sqrt(h))/a;
      if (h>=distBound.x && h<t && abs(ros.y+rds.y*h)<size.y) t = h;
    }
	}
    // edge Z
    {
	float a = dd.x + dd.y;
	float b = od.x + od.y;
	float c = oo.x + oo.y - ra2;
	float h = b*b - a*c;
	if (h>0.0) {
	  h = (-b-sqrt(h))/a;
      if (h>=distBound.x && h<t && abs(ros.z+rds.z*h)<size.z) t = h;
    }
	}
    
	if (t >= distBound.x && t <= distBound.y) {
        vec3 p = ro + rd * t;
        normal = sign(p)*normalize(max(abs(p)-size,1e-16));
        return t;
    } else {
        return MAX_DIST;
    };
}`,name:`Common`,description:``,type:`common`},{inputs:[{id:`4dXGR8`,filepath:`/media/previz/buffer00.png`,type:`buffer`,channel:0,sampler:{filter:`linear`,wrap:`clamp`,vflip:`true`,srgb:`false`,internal:`byte`},published:1}],outputs:[{id:`4dXGR8`,channel:0}],code:`// Ray Tracing - Primitives. Created by Reinder Nijhoff 2019
// @reindernijhoff
//
// https://www.shadertoy.com/view/tl23Rm
//
// I have combined different intersection routines in one shader (similar 
// to "Raymarching - Primitives": https://www.shadertoy.com/view/Xds3zN) and
// added a simple ray tracer to visualize a scene with all primitives.
//

#define PATH_LENGTH 12

//
// Hash functions by Nimitz:
// https://www.shadertoy.com/view/Xt3cDn
//

uint baseHash( uvec2 p ) {
    p = 1103515245U*((p >> 1U)^(p.yx));
    uint h32 = 1103515245U*((p.x)^(p.y>>3U));
    return h32^(h32 >> 16);
}

float hash1( inout float seed ) {
    uint n = baseHash(floatBitsToUint(vec2(seed+=.1,seed+=.1)));
    return float(n)/float(0xffffffffU);
}

vec2 hash2( inout float seed ) {
    uint n = baseHash(floatBitsToUint(vec2(seed+=.1,seed+=.1)));
    uvec2 rz = uvec2(n, n*48271U);
    return vec2(rz.xy & uvec2(0x7fffffffU))/float(0x7fffffff);
}

//
// Ray tracer helper functions
//

float FresnelSchlickRoughness( float cosTheta, float F0, float roughness ) {
    return F0 + (max((1. - roughness), F0) - F0) * pow(abs(1. - cosTheta), 5.0);
}

vec3 cosWeightedRandomHemisphereDirection( const vec3 n, inout float seed ) {
  	vec2 r = hash2(seed);
	vec3  uu = normalize(cross(n, abs(n.y) > .5 ? vec3(1.,0.,0.) : vec3(0.,1.,0.)));
	vec3  vv = cross(uu, n);
	float ra = sqrt(r.y);
	float rx = ra*cos(6.28318530718*r.x); 
	float ry = ra*sin(6.28318530718*r.x);
	float rz = sqrt(1.-r.y);
	vec3  rr = vec3(rx*uu + ry*vv + rz*n);
    return normalize(rr);
}

vec3 modifyDirectionWithRoughness( const vec3 normal, const vec3 n, const float roughness, inout float seed ) {
    vec2 r = hash2(seed);
    
	vec3  uu = normalize(cross(n, abs(n.y) > .5 ? vec3(1.,0.,0.) : vec3(0.,1.,0.)));
	vec3  vv = cross(uu, n);
	
    float a = roughness*roughness;
    
	float rz = sqrt(abs((1.0-r.y) / clamp(1.+(a - 1.)*r.y,.00001,1.)));
	float ra = sqrt(abs(1.-rz*rz));
	float rx = ra*cos(6.28318530718*r.x); 
	float ry = ra*sin(6.28318530718*r.x);
	vec3  rr = vec3(rx*uu + ry*vv + rz*n);
    
    vec3 ret = normalize(rr);
    return dot(ret,normal) > 0. ? ret : n;
}

vec2 randomInUnitDisk( inout float seed ) {
    vec2 h = hash2(seed) * vec2(1,6.28318530718);
    float phi = h.y;
    float r = sqrt(h.x);
	return r*vec2(sin(phi),cos(phi));
}

//
// Scene description
//

vec3 rotateY( const in vec3 p, const in float t ) {
    float co = cos(t);
    float si = sin(t);
    vec2 xz = mat2(co,si,-si,co)*p.xz;
    return vec3(xz.x, p.y, xz.y);
}

vec3 opU( vec3 d, float iResult, float mat ) {
	return (iResult < d.y) ? vec3(d.x, iResult, mat) : d;
}

float iMesh( in vec3 ro, in vec3 rd, in vec2 distBound, inout vec3 normal) {
	const vec3 tri0 = vec3(-2./3. * 0.43301270189, 0, 0);
	const vec3 tri1 = vec3( 1./3. * 0.43301270189, 0, .25);
	const vec3 tri2 = vec3( 1./3. * 0.43301270189, 0,-.25);
	const vec3 tri3 = vec3( 0, 0.41079191812, 0);
    
    vec2 d = distBound;
	d.y = min(d.y, iTriangle(ro, rd, d, normal, tri0, tri1, tri2));   
	d.y = min(d.y, iTriangle(ro, rd, d, normal, tri0, tri3, tri1));  
	d.y = min(d.y, iTriangle(ro, rd, d, normal, tri2, tri3, tri0));   
	d.y = min(d.y, iTriangle(ro, rd, d, normal, tri1, tri3, tri2));
    
    return d.y < distBound.y ? d.y : MAX_DIST;
}
         
vec3 worldhit( in vec3 ro, in vec3 rd, in vec2 dist, out vec3 normal ) {
    vec3 tmp0, tmp1, d = vec3(dist, 0.);
    
    d = opU(d, iPlane      (ro,                  rd, d.xy, normal, vec3(0,1,0), 0.), 1.);
    d = opU(d, iBox        (ro-vec3( 1,.250, 0), rd, d.xy, normal, vec3(.25)), 2.);
    d = opU(d, iSphere     (ro-vec3( 0,.250, 0), rd, d.xy, normal, .25), 3.);
    d = opU(d, iCylinder   (ro,                  rd, d.xy, normal, vec3(2.1,.1,-2), vec3(1.9,.5,-1.9), .08 ), 4.);
    d = opU(d, iCylinder   (ro-vec3( 1,.100,-2), rd, d.xy, normal, vec3(0,0,0), vec3(0,.4,0), .1 ), 5.);
    d = opU(d, iTorus      (ro-vec3( 0,.250, 1), rd, d.xy, normal, vec2(.2,.05)), 6.);
    d = opU(d, iCapsule    (ro-vec3( 1,.000,-1), rd, d.xy, normal, vec3(-.1,.1,-.1), vec3(.2,.4,.2), .1), 7.);
    d = opU(d, iCone       (ro-vec3( 2,.200, 0), rd, d.xy, normal, vec3(.1,0,0), vec3(-.1,.3,.1), .15, .05), 8.);
    d = opU(d, iRoundedBox (ro-vec3( 0,.250,-2), rd, d.xy, normal, vec3(.15,.125,.15), .045), 9.);
    d = opU(d, iGoursat    (ro-vec3( 1,.275, 1), rd, d.xy, normal, .16, .2), 10.);
    d = opU(d, iEllipsoid  (ro-vec3(-1,.300, 0), rd, d.xy, normal, vec3(.2,.25, .05)), 11.);
    d = opU(d, iRoundedCone(ro-vec3( 2,.200,-1), rd, d.xy, normal, vec3(.1,0,0), vec3(-.1,.3,.1), 0.15, 0.05), 12.);
    d = opU(d, iRoundedCone(ro-vec3(-1,.200,-2), rd, d.xy, normal, vec3(0,.3,0), vec3(0,0,0), .1, .2), 13.);
    d = opU(d, iMesh       (ro-vec3( 2,.090, 1), rd, d.xy, normal), 14.);
    d = opU(d, iSphere4    (ro-vec3(-1,.275,-1), rd, d.xy, normal, .225), 15.);
    
    tmp1 = opU(d, iBox     (rotateY(ro-vec3(0,.25,-1), 0.78539816339), rotateY(rd, 0.78539816339), d.xy, tmp0, vec3(.1,.2,.1)), 16.);
    if (tmp1.y < d.y) {
        d = tmp1;
        normal = rotateY(tmp0, -0.78539816339);
    }
    
    return d;
}

//
// Palette by Íñigo Quílez: 
// https://www.shadertoy.com/view/ll2GD3
//
vec3 pal(in float t, in vec3 a, in vec3 b, in vec3 c, in vec3 d) {
    return a + b*cos(6.28318530718*(c*t+d));
}

float checkerBoard( vec2 p ) {
   return mod(floor(p.x) + floor(p.y), 2.);
}

vec3 getSkyColor( vec3 rd ) {
    vec3 col = mix(vec3(1),vec3(.5,.7,1), .5+.5*rd.y);
    float sun = clamp(dot(normalize(vec3(-.4,.7,-.6)),rd), 0., 1.);
    col += vec3(1,.6,.1)*(pow(sun,4.) + 10.*pow(sun,32.));
    return col;
}

#define LAMBERTIAN 0.
#define METAL 1.
#define DIELECTRIC 2.

float gpuIndepentHash(float p) {
    p = fract(p * .1031);
    p *= p + 19.19;
    p *= p + p;
    return fract(p);
}

void getMaterialProperties(in vec3 pos, in float mat, 
                           out vec3 albedo, out float type, out float roughness) {
    albedo = pal(mat*.59996323+.5, vec3(.5),vec3(.5),vec3(1),vec3(0,.1,.2));

    if( mat < 1.5 ) {            
        albedo = vec3(.25 + .25*checkerBoard(pos.xz * 5.));
        roughness = .75 * albedo.x - .15;
        type = METAL;
    } else {
        type = floor(gpuIndepentHash(mat+.3) * 3.);
        roughness = (1.-type*.475) * gpuIndepentHash(mat);
    }
}

//
// Simple ray tracer
//

float schlick(float cosine, float r0) {
    return r0 + (1.-r0)*pow((1.-cosine),5.);
}
vec3 render( in vec3 ro, in vec3 rd, inout float seed ) {
    vec3 albedo, normal, col = vec3(1.); 
    float roughness, type;
    
    for (int i=0; i<PATH_LENGTH; ++i) {    
    	vec3 res = worldhit( ro, rd, vec2(.0001, 100), normal );
		if (res.z > 0.) {
			ro += rd * res.y;
       		
            getMaterialProperties(ro, res.z, albedo, type, roughness);
            
            if (type < LAMBERTIAN+.5) { // Added/hacked a reflection term
                float F = FresnelSchlickRoughness(max(0.,-dot(normal, rd)), .04, roughness);
                if (F > hash1(seed)) {
                    rd = modifyDirectionWithRoughness(normal, reflect(rd,normal), roughness, seed);
                } else {
                    col *= albedo;
			        rd = cosWeightedRandomHemisphereDirection(normal, seed);
                }
            } else if (type < METAL+.5) {
                col *= albedo;
                rd = modifyDirectionWithRoughness(normal, reflect(rd,normal), roughness, seed);            
            } else { // DIELECTRIC
                vec3 normalOut, refracted;
                float ni_over_nt, cosine, reflectProb = 1.;
                if (dot(rd, normal) > 0.) {
                    normalOut = -normal;
            		ni_over_nt = 1.4;
                    cosine = dot(rd, normal);
                    cosine = sqrt(1.-(1.4*1.4)-(1.4*1.4)*cosine*cosine);
                } else {
                    normalOut = normal;
                    ni_over_nt = 1./1.4;
                    cosine = -dot(rd, normal);
                }
            
	            // Refract the ray.
	            refracted = refract(normalize(rd), normalOut, ni_over_nt);
    	        
        	    // Handle total internal reflection.
                if(refracted != vec3(0)) {
                	float r0 = (1.-ni_over_nt)/(1.+ni_over_nt);
	        		reflectProb = FresnelSchlickRoughness(cosine, r0*r0, roughness);
                }
                
                rd = hash1(seed) <= reflectProb ? reflect(rd,normalOut) : refracted;
                rd = modifyDirectionWithRoughness(-normalOut, rd, roughness, seed);            
            }
        } else {
            col *= getSkyColor(rd);
			return col;
        }
    }  
    return vec3(0);
}

mat3 setCamera( in vec3 ro, in vec3 ta, float cr ) {
	vec3 cw = normalize(ta-ro);
	vec3 cp = vec3(sin(cr), cos(cr),0.0);
	vec3 cu = normalize( cross(cw,cp) );
	vec3 cv =          ( cross(cu,cw) );
    return mat3( cu, cv, cw );
}

void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
    bool reset = iFrame == 0;
            
    vec2 mo = iMouse.xy == vec2(0) ? vec2(.125) : 
              abs(iMouse.xy)/iResolution.xy - .5;
        
    vec4 data = texelFetch(iChannel0, ivec2(0), 0);
    if (round(mo*iResolution.xy) != round(data.yz) || round(data.w) != round(iResolution.x)) {
        reset = true;
    }
    
    vec3 ro = vec3(.5+2.5*cos(1.5+6.*mo.x), 1.+2.*mo.y, -.5+2.5*sin(1.5+6.*mo.x));
    vec3 ta = vec3(.5, -.4, -.5);
    mat3 ca = setCamera(ro, ta, 0.);    
    vec3 normal;
    
    float fpd = data.x;
    if(all(equal(ivec2(fragCoord), ivec2(0)))) {
        // Calculate focus plane.
        float nfpd = worldhit(ro, normalize(vec3(.5,0,-.5)-ro), vec2(0, 100), normal).y;
		fragColor = vec4(nfpd, mo*iResolution.xy, iResolution.x);
    } else { 
        vec2 p = (-iResolution.xy + 2.*fragCoord - 1.)/iResolution.y;
        float seed = float(baseHash(floatBitsToUint(p - iTime)))/float(0xffffffffU);

        // AA
        p += 2.*hash2(seed)/iResolution.y;
        vec3 rd = ca * normalize( vec3(p.xy,1.6) );  

        // DOF
        vec3 fp = ro + rd * fpd;
        ro = ro + ca * vec3(randomInUnitDisk(seed), 0.)*.02;
        rd = normalize(fp - ro);

        vec3 col = render(ro, rd, seed);

        if (reset) {
           fragColor = vec4(col, 1);
        } else {
           fragColor = vec4(col, 1) + texelFetch(iChannel0, ivec2(fragCoord), 0);
        }
    }
}`,name:`Buffer A`,description:``,type:`buffer`}]},{ver:`0.1`,info:{id:`Wtj3Wc`,date:`1561384782`,viewed:2667,name:`Gaussian Weights and Fake AO`,description:`A shader about Gaussian weights and fake AO. (Set AA to 1. if the shader is running <60fps - line 27)`,likes:55,published:`Public API`,usePreview:0,tags:[`blur`,`fake`,`ao`,`occlusion`,`ambient`,`gaussian`,`error`,`weights`]},renderpass:[{inputs:[],outputs:[{id:`4dfGRr`,channel:0}],code:`// Gaussian Weights and Fake AO. Created by Reinder Nijhoff 2019
// Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License.
// @reindernijhoff
//
// https://www.shadertoy.com/view/Wtj3Wc
//
// Sometimes you need to calculate the weights of a Gaussian blur kernel 
// yourself. For example if you want to calculate weights for a kernel where
// the center of the Gaussian curve is not exactly in the "center of the
// kernel" but has a sub-pixel offset. These "shifted" Gaussian kernels can be
// used if you want to blur-and-upscale an image in a single pass, e.g. if you
// are adding a low-res raytraced reflection buffer to your high-res
// rasterized scene. It is also needed for the fake ambient occlusion (AO)
// term as used in this shader.
//
// The Gaussian weights for a blur kernel can be calculated, either by
// numerical integration, or by directly calculating the value of the Gauss
// error funtion, as shown below.
//
// In this shader I calculate a fake ambient occlusion (AO) term for each
// sample point. The AO-term is based on the weighted average of fake AO-terms
// for all cells in a 7x7 grid around the sample point, corresponding with a
// 7x7 Gaussian kernel with the sample point as its center. The AO-term for
// a single cell in this weighted average is simply given by the difference in
// height of the cell and that of the sample point.
//

#define AA 2.
#define MAX_DIST 10000.

//
// Approximation of the Gauss error function (https://en.wikipedia.org/wiki/Error_function)
// http://people.math.sfu.ca/~cbm/aands/page_299.htm
//
float erf(float x) {
    const float p  =  .47047;
    const float a1 =  .3480242;
    const float a2 = -.0958798;  
    const float a3 =  .7478556;

    float t = 1. / (1. + p * x);
    return 1. - t * (a1 + t * (a2 + t * a3)) * exp(-x*x);
}
    
float gaussianWeight(int cell, float center, const float sigma) {
    float x0 = float(cell) - center;
    float x1 = abs(x0+1.);
    x0 = abs(x0);
    
    float erfx0 = erf(x0 / sigma);
    float erfx1 = erf(x1 / sigma);
    
    return x0 < 1. && x1 < 1. ? abs(erfx0 + erfx1) : abs(erfx0 - erfx1);
}

float gaussianWeight(ivec2 cell, vec2 center, const float sigma) {
	float ix = gaussianWeight(cell.x, center.x, sigma);
	float iy = gaussianWeight(cell.y, center.y, sigma);
    
    return ix * iy;
}

// Hash by Dave_Hoskins: https://www.shadertoy.com/view/4djSRW
float hash12(vec2 p) {
	vec3 p3  = fract(vec3(p.xyx) * .1031);
    p3 += dot(p3, p3.yzx + 19.19);
    return fract((p3.x + p3.y) * p3.z);
}

float curveXOffset(vec2 pos) {
    return 15.*cos(pos.y*.1);;
}

// camera path
vec3 curve(float time) {
	vec3 p = vec3(0., 3.5+.8*cos(.95*time), 8.5*sin(.1+.37*time)+12.*time);
    p.x = curveXOffset(p.xz);
    return p;
}

float map(vec2 pos) {
    float x = pos.x - curveXOffset(pos);
    return (2.*hash12(pos) + 5.) * (.3+min(3.,.002*(x*x)));
}

float fakeAO(vec3 p) {
    const int gridOffset = 3;
    float sum =0., accum = 0.;
    
    for (int x = -gridOffset; x <= gridOffset; x++) {
        for (int y = -gridOffset; y <= gridOffset; y++) {
            ivec2 s = ivec2(x,y) + ivec2(p.xz);
            float weight = gaussianWeight(s, p.xz, 1.5);
            
            sum += max(map(vec2(s))-p.y, 0.) * weight;
            accum += weight;
        }
    }
    return sum / accum;
}

// trace cubes in grid
vec3 trace( in vec3 ro, in vec3 rd, const int steps, inout vec3 normal ) {
	vec2 pos = floor(ro.xz);
    vec3 rdi = 1./rd;
    vec3 rda = abs(rdi);
	vec3 rds = sign(rd);
	vec2 dis = (pos - ro.xz + .5 + rds.xz*.5) * rdi.xz;
	vec3 roi = rdi*(ro-vec3(.5,0,.5));
    
	vec2 mm = vec2(0.0);
	for( int i=0; i<steps; i++ ) {        
        vec3 n = roi - rdi * vec3(pos.x, 0, pos.y);
        vec3 k = rda*vec3(.5, map(pos), .5);

        vec3 t1 = -n - k;
        vec3 t2 = -n + k;

        float tN = max( max( t1.x, t1.y ), t1.z );
        float tF = min( min( t2.x, t2.y ), t2.z );

        if (tN < tF && tN >= 0.) {
            normal = -rds*step(t1.yzx,t1.xyz)*step(t1.zxy,t1.xyz);
            return vec3(tN, pos);
        }
        
		mm = step( dis.xy, dis.yx ); 
		dis += mm*rda.xz;
        pos += mm*rds.xz;
	}

	return vec3(MAX_DIST);
}

vec3 render( in vec3 ro, in vec3 rd, bool full ) {
    vec3 normal, col = vec3(0);
	float ref = 1.;
    
    for (int i=1; i>=0; i--) {
        vec3 d = trace(ro, rd, i*64+64, normal);
        if (d.x < MAX_DIST) { // cube hit
            ro += d.x * rd;
            
            float fresnel = full ? pow(1.-max(0.,-dot(normal,rd)),5.) : 0.;
            float mat = full ? hash12(d.zy) : 1.;
            mat *= exp(-1.5*fakeAO(ro)) * ref * (1.-fresnel) 
                * (.8 + .2 * dot(normal, vec3(-.25916,.8639,-.4319)));
	       	col += mat;
            
            ref *= fresnel;
            rd = reflect(rd, normal);
        } else { // background 
            col +=vec3(.5,.8,1) * (ref*(5.-2.5*rd.y));
            return col;
        }
        if (ref <= .001) return col;
    }    
    return col;
}

mat3 setLookAt( in vec3 ro, in vec3 ta, float cr ) {
	vec3  cw = normalize(ta-ro);
	vec3  cp = vec3(sin(cr), cos(cr), 0.);
	vec3  cu = normalize(cross(cw,cp));
	vec3  cv = normalize(cross(cu,cw));
    return mat3(cu, cv, cw);
}

void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
    float time = .2*iTime + 20.*iMouse.x/iResolution.x;    
    vec2 p = (-iResolution.xy+2.*(fragCoord)) / iResolution.y;
	bool full = fract(.5*time + .015*(p.x + p.y)) < .5;
    
    vec3 ro = curve(time);
    vec3 ta = curve(time+.1);
    ta.y -= .3 + .1*sin(time);
    float roll = .2*sin(.1*ro.z-1.6);

    mat3 ca = setLookAt( ro, ta, roll );
    
    vec3 tot = vec3(0);    
    for (float x=0.; x<AA; x+=1.) {     
        for (float y=0.; y<AA; y+=1.) {
            vec3 rd = normalize(ca * vec3(p + vec2(x,y)*(2./(AA*iResolution.y)), 2.));
            vec3 col = render(ro, rd, full);
            col = pow(col, vec3(.4545));
            tot += min(col, vec3(1));
        }
	}
    tot /= (AA*AA);
    
    fragColor = vec4(tot, 1);
}
`,name:`Image`,description:``,type:`image`}]},{ver:`0.1`,info:{id:`tlSSDV`,date:`1567106604`,viewed:5935,name:`Robotic Arm Hunting Lights`,description:`This shader is a proof of concept to find out if I could create a "typical" Shadertoy shader, i.e. a shader that renders a non-trivial animated 3D scene, by using a ray tracer instead of the commonly used raymarching techniques. `,likes:130,published:`Public API`,usePreview:0,tags:[`raytracer`,`ray`,`tracer`,`inverse`,`kinematics`,`inversekinematics`]},renderpass:[{inputs:[],outputs:[{id:`4dfGRr`,channel:0}],code:`// Robotic Arm. Created by Reinder Nijhoff 2019
// Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License.
// @reindernijhoff
//
// https://www.shadertoy.com/view/tlSSDV
//
// This shader is a proof of concept to find out if I could 
// create a “typical” Shadertoy shader, i.e. a shader that renders 
// a non-trivial animated 3D scene, by using a ray tracer instead 
// of the commonly used raymarching techniques. 
//
// Some first conclusions:
// 
// - It is possible to visualize an animated 3D scene in a single 
//   shader using ray tracing.
// - The compile-time of this shader is quite long.
// - The ray tracer is not super fast, so it was not possible to cast
//   enough rays per pixel to support global illumination or soft
//   shadows. Here I miss the cheap AO and soft shadow algorithms that
//   are available when raymarching an SDF.
// - Modelling a 3D scene for a ray tracer in code is verbose. It was
//   not possible to exploit the symmetries in the arm and the domain
//   repetition of the sphere-grid that would have simplified the
//   description of an SDF.
// - I ran in GPU-dependent unpredictable precision problems. Hopefully,
//   most problems are solved now. I’m not sure if they are inherent
//   to ray tracing, but I didn’t have these kinds of problems using
//   raymarching before.
//

#define AA 1 // Set AA to 1 if you have a slow GPU
#define PATH_LENGTH 3
#define MAX_DIST 60.
#define MIN_DIST .001
#define ZERO (min(iFrame,0))

// Global variables
float time;
vec2[2] activeSpheres;
vec2[3] joints;
float joint0Rot;
float jointYRot;

//
// Hash by Dave_Hoskins: https://www.shadertoy.com/view/4djSRW
//
vec2 hash22(vec2 p) {
	vec3 p3 = fract(vec3(p.xyx) * vec3(.1031, .1030, .0973));
    p3 += dot(p3, p3.yzx+33.33);
    return fract((p3.xx+p3.yz)*p3.zy);
}

//
// Ray-primitive intersection routines: https://www.shadertoy.com/view/tl23Rm
//
float dot2( in vec3 v ) { return dot(v,v); }

// Plane 
float iPlane( const in vec3 ro, const in vec3 rd, in vec2 distBound, inout vec3 normal,
              const in vec3 planeNormal, const in float planeDist) {
    float a = dot(rd, planeNormal);
    float d = -(dot(ro, planeNormal)+planeDist)/a;
    if (a > 0. || d < distBound.x || d > distBound.y) {
        return MAX_DIST;
    } else {
        normal = planeNormal;
    	return d;
    }
}

// Sphere: https://www.shadertoy.com/view/4d2XWV
float iSphere( const in vec3 ro, const in vec3 rd, const in vec2 distBound, inout vec3 normal,
               const float sphereRadius ) {
    float b = dot(ro, rd);
    float c = dot(ro, ro) - sphereRadius*sphereRadius;
    float h = b*b - c;
    if (h < 0.) {
        return MAX_DIST;
    } else {
	    h = sqrt(h);
        float d1 = -b-h;
        float d2 = -b+h;
        if (d1 >= distBound.x && d1 <= distBound.y) {
            normal = normalize(ro + rd*d1);
            return d1;
        } else {
            return MAX_DIST;
        }
    }
}

// Capped Cylinder: https://www.shadertoy.com/view/4lcSRn
float iCylinder( const in vec3 oc, const in vec3 rd, const in vec2 distBound, inout vec3 normal,
                 const in vec3 ca, const float ra, const bool traceCaps ) {
    float caca = dot(ca,ca);
    float card = dot(ca,rd);
    float caoc = dot(ca,oc);
    
    float a = caca - card*card;
    float b = caca*dot( oc, rd) - caoc*card;
    float c = caca*dot( oc, oc) - caoc*caoc - ra*ra*caca;
    float h = b*b - a*c;
    
    if (h < 0.) return MAX_DIST;
    
    h = sqrt(h);
    float d = (-b-h)/a;

    float y = caoc + d*card;
    if (y >= 0. && y <= caca && d >= distBound.x && d <= distBound.y) {
        normal = (oc+d*rd-ca*y/caca)/ra;
        return d;
    } else if(!traceCaps) {
        return MAX_DIST;
    } else {
        d = ((y < 0. ? 0. : caca) - caoc)/card;

        if( abs(b+a*d) < h && d >= distBound.x && d <= distBound.y) {
            normal = normalize(ca*sign(y)/caca);
            return d;
        } else {
            return MAX_DIST;
        }
    }
}

// Capped Cone: https://www.shadertoy.com/view/llcfRf
float iCone( const in vec3 oa, const in vec3 rd, const in vec2 distBound, inout vec3 normal,
             const in vec3 pb, const in float ra, const in float rb ) {
    vec3  ba = pb;
    vec3  ob = oa - pb;
    
    float m0 = dot(ba,ba);
    float m1 = dot(oa,ba);
    float m2 = dot(ob,ba); 
    float m3 = dot(rd,ba);

    //caps - only top cap needed for scene
    if (m2 > 0. && dot2(ob*m3-rd*m2) < (rb*rb*m3*m3) ) {
        float d = -m2 / m3;
        if (d > distBound.x && d < distBound.y) {
            normal = ba*inversesqrt(m0);
            return d;
        }
    }
    
    // body
    float m4 = dot(rd,oa);
    float m5 = dot(oa,oa);
    float rr = ra - rb;
    float hy = m0 + rr*rr;

    float k2 = m0*m0    - m3*m3*hy;
    float k1 = m0*m0*m4 - m1*m3*hy + m0*ra*(rr*m3*1.0        );
    float k0 = m0*m0*m5 - m1*m1*hy + m0*ra*(rr*m1*2.0 - m0*ra);

    float h = k1*k1 - k2*k0;
    if( h < 0. ) return MAX_DIST;

    float t = (-k1-sqrt(h))/k2;

    float y = m1 + t*m3;
    if (y > 0. && y < m0 && t >= distBound.x && t <= distBound.y) {
        normal = normalize(m0*(m0*(oa+t*rd)+rr*ba*ra)-ba*hy*y);
        return t;
    } else {   
        return MAX_DIST;
    }
}

// Box: https://www.shadertoy.com/view/ld23DV
float iBox( const in vec3 ro, const in vec3 rd, const in vec2 distBound, inout vec3 normal, 
            const in vec3 boxSize ) {
    vec3 m = sign(rd)/max(abs(rd), 1e-8);
    vec3 n = m*ro;
    vec3 k = abs(m)*boxSize;
	
    vec3 t1 = -n - k;
    vec3 t2 = -n + k;

	float tN = max( max( t1.x, t1.y ), t1.z );
	float tF = min( min( t2.x, t2.y ), t2.z );
	
    if (tN > tF || tF <= 0.) {
        return MAX_DIST;
    } else {
        if (tN >= distBound.x && tN <= distBound.y) {
        	normal = -sign(rd)*step(t1.yzx,t1.xyz)*step(t1.zxy,t1.xyz);
            return tN;
        } else if (tF >= distBound.x && tF <= distBound.y) {
        //	normal = sign(rd)*step(t1.yzx,t1.xyz)*step(t1.zxy,t1.xyz);
            return tF;
        } else {
            return MAX_DIST;
        }
    }
}

//
// Ray tracer helper functions
//
vec3 FresnelSchlick(vec3 SpecularColor, vec3 E, vec3 H) {
    return SpecularColor + (1. - SpecularColor) * pow(1.0 - max(0., dot(E, H)), 5.);
}

vec2 randomInUnitDisk(const vec2 seed) {
    vec2 h = hash22(seed) * vec2(1.,6.28318530718);
    float phi = h.y;
    float r = sqrt(h.x);
	return r*vec2(sin(phi),cos(phi));
}

//
// Sphere functions
//
vec2 activeSphereGrid(float t) {
  vec2 p = randomInUnitDisk(vec2(floor(t),.5));
  return floor(p * 8.5 + 1.75*normalize(p));
}

vec3 sphereCenter(vec2 pos) {
    vec3 c = vec3(pos.x, 0., pos.y)+vec3(.25,.25,.25);
    c.xz += .5*hash22(pos);
	return c;
}

vec3 sphereCol(in float t) {
    return normalize(.5 + .5*cos(6.28318530718*(1.61803398875*floor(t)+vec3(0,.1,.2))));
}

//
// Inverse Kinematics
//
// Very hacky, analytical,  inverse kinematics. I came up with the algorithm myself;
// Íñigo Quílez can probably implement it without using trigonometry:
// https://iquilezles.org/articles/noacos
//
void initDynamics() {
    time = iTime * .25;

    activeSpheres[0] = activeSphereGrid(time);
    activeSpheres[1] = activeSphereGrid(time+1.);

    vec3 ta0 = sphereCenter(activeSpheres[0]);
    vec3 ta1 = sphereCenter(activeSpheres[1]);

    float taa0 = atan(-ta0.z, ta0.x);  
    float taa1 = atan(-ta1.z, ta1.x);

    if (abs(taa0-taa1) > 3.14159265359) {
        taa1 += taa1 < taa0 ? 2. * 3.14159265359 : -2. * 3.14159265359;  
    }
    jointYRot = mix(taa0, taa1, clamp(fract(time)*2.-.5,0.,1.));    

    float tal = mix(length(ta0), length(ta1), clamp(fract(time)*2.5-1.,0.,1.));

    vec2 target = vec2(tal,.5-.5*smoothstep(.35,.4,abs(fract(time)-.5)));  

    float c0 = length(target);
    float b0 = min(11., 4. + 2. * c0 / 11.);

    vec2 sd = normalize(target);
    float t0 = asin(sd.y)+acos(-(b0*b0-25.-c0*c0)/(10.*c0));

    joints[0] = vec2(5. * cos(t0), 5.* sin(t0));
    joint0Rot = t0;

    sd = normalize(target-joints[0]);  
    float c1 = min(6., distance(joints[0], target));
    const float b1 = 2.;  

    float t1 = asin(sd.y) * sign(sd.x) + acos(-(b1*b1-16.-c1*c1)/(8.*c1));
    t1 += sd.x < 0. ? 3.1415 : 0.;
    joints[1] = joints[0] + 4. * vec2(cos(t1),sin(t1));
    joints[2] = target;
}

//
// Scene description
//
vec3 opU( const in vec3 d, const in float iResult, const in float mat ) {
	return (iResult < d.y) ? vec3(d.x, iResult, mat) : d;
}
      
vec3 iPlaneInt(vec3 ro, vec3 rd, float d) {
    d = -(ro.y - d) / rd.y;
    return ro + d * rd;
}

vec3 traceSphereGrid( in vec3 ro, in vec3 rd, in vec2 dist, out vec3 normal, const int maxsteps ) {  
	float m = 0.;
    if (ro.y < .5 || rd.y < 0.) {
        vec3 ros = ro.y < .5 ? ro : iPlaneInt(ro, rd, .5);
        if (length(ros.xz) < 11.) {
            vec3 roe = iPlaneInt(ro, rd,rd.y < 0. ?0.:.5);
            vec3 pos = floor(ros);
            vec3 rdi = 1./rd;
            vec3 rda = abs(rdi);
            vec3 rds = sign(rd);
            vec3 dis = (pos-ros+ .5 + rds*.5) * rdi;
            bool b_hit = false;

            // traverse grid in 2D
            vec2 mm = vec2(0);
            for (int i = ZERO; i<maxsteps; i++) {
                float l = length(pos.xz+.5);
                if (pos.y > .5 || pos.y < -1.5 || l > 11.) {
                    break;
                }
                else if ( l > 2. && pos.y > -.5 && pos.y < 1.5 ) {
                    float d = iSphere(ro-sphereCenter(pos.xz), rd, dist, normal, .25);
                    if (d < dist.y) {
                        m = 2.;
                        dist.y = d;
                        break;
                    }
                }	
                vec3 mm = step(dis.xyz, dis.yxy) * step(dis.xyz, dis.zzx);
                dis += mm*rda;
                pos += mm*rds;
            }
        }
    }
	return vec3(dist, m);
}

vec3 rotateY( const in vec3 p, const in float t ) {
    float co = cos(t);
    float si = sin(t);
    vec2 xz = mat2(co,si,-si,co)*p.xz;
    return vec3(xz.x, p.y, xz.y);
}

vec3 worldhit( const in vec3 ro, const in vec3 rd, const in vec2 dist, out vec3 normal ) {
    vec3 d = vec3(dist, 0.);
    
    d = traceSphereGrid(ro, rd, d.xy, normal, 10);
    
    d = opU(d, iPlane   (ro, rd, d.xy, normal, vec3(0,1,0), 0.), 1.);
    d = opU(d, iCone    (ro-vec3(0,.2,0), rd, d.xy, normal, vec3(0,.2,0), 1.5, 1.4), 4.);
    d = opU(d, iCylinder(ro, rd, d.xy, normal, vec3(0,.2,0), 1.5, false), 4.);
    
    float dmax = d.y;
    vec3 roa = rotateY(vec3(ro.x, ro.y-1., ro.z), jointYRot);    
    vec3 rda = rotateY(rd, jointYRot); 
    
    vec3 bb = vec3(.5*max(joints[1].x,joints[2].x), joints[0].y*.5, .0);
    vec3 bbn;
    
    if (iBox(roa-bb, rda, vec2(0,100), bbn, bb+vec3(.75,.75,.8)) < 100.) {
	    vec3 dr = vec3(-sin(joint0Rot), cos(joint0Rot), 0);
        vec2 j21 = joints[2]-joints[1];
        
        for (int axis=0; axis<=1; axis++) {
            float a = axis == 0 ? -1. : 1.;
            d = opU(d, iCylinder(roa-vec3(0,0,a*.67), rda, d.xy, normal, vec3(0,0,-a*.2),.55, true), 3.);
            d = opU(d, iCylinder(roa-vec3(0,0,a*.58)-.4*dr, rda, d.xy, normal, vec3(joints[0],-a*.24)-.24*dr,.07, false), 4.);
            d = opU(d, iCylinder(roa-vec3(0,0,a*.58)+.4*dr, rda, d.xy, normal, vec3(joints[0],-a*.24)+.24*dr,.07, false), 4.);
            d = opU(d, iCylinder(roa-vec3(joints[0],a*.45), rda, d.xy, normal, vec3(0,0,-a*.2),.35, true), 3.);
            d = opU(d, iCylinder(roa-vec3(joints[1],a*.29), rda, d.xy, normal, vec3(0,0,-a*.08),.25, true), 3.);
            d = opU(d, iCylinder(roa-vec3(joints[1],a*.24), rda, d.xy, normal, vec3(j21,a*.08),.03, false), 4.);
        }

        vec2 j10 = joints[1]-joints[0];
        d = opU(d, iCylinder(roa-vec3(0,0,-.72), rda, d.xy, normal, vec3(0,0,1.44),.5, true), 5.);
        d = opU(d, iBox     (roa+vec3(0,.5,0), rda, d.xy, normal, vec3(.5,.5,.47)), 5.);
        d = opU(d, iCone    (roa-vec3(joints[0],0), rda, d.xy, normal, vec3(j10,0),.25, .15), 5.);
        d = opU(d, iCylinder(roa-vec3(joints[0],-.5), rda, d.xy, normal, vec3(0,0,1.),.3, true), 5.);
        d = opU(d, iCylinder(roa-vec3(joints[1],-.35), rda, d.xy, normal, vec3(0,0,.7),.2, true), 5.);
        d = opU(d, iCylinder(roa-vec3(joints[2],-.4), rda, d.xy, normal, vec3(0,0,.8),.2, true), 3.);
        d = opU(d, iSphere  (roa-vec3(joints[2],0), rda, d.xy, normal, .32), 5.);
        d = opU(d, iCylinder(roa-vec3(joints[2],0), rda, d.xy, normal, vec3(0,-.5,0),.06, true), 3.);

        if (d.y < dmax) {
            normal = rotateY(normal, -jointYRot);
        }
    }    
    return d;
}

float shadowhit( const vec3 ro, const vec3 rd, const float dist) {
    vec3 normal;
    float d = traceSphereGrid( ro, rd, vec2(.3, dist), normal, 4).y;
    d = min(d, iCylinder(ro, rd, vec2(.3, dist), normal, vec3(0,.2,0), 1.5, false));
    return d < dist-0.001 ? 0. : 1.;
}

//
// Simple ray tracer
//
float getSphereLightIntensity(float num) {
    return num > .5 ?
        clamp(fract(time)*10.-1., 0., 1.) :
		max(0., 1.-fract(time)*10.); 
}

float getLightIntensity( const vec3 pos, const vec3 normal, const vec3 light, const float intensity) {
    vec3 rd = pos - light;
    float i = max(0., dot(normal, -normalize(rd)) / dot(rd,rd));
    i = i > 0.0001 ? i * intensity * shadowhit(light, normalize(rd), length(rd)) : 0.;
    return max(0., i-0.0001);              
}

vec3 getLighting( vec3 p, vec3 normal ) {
    vec3 l = vec3(0.);
    
    float i = getSphereLightIntensity(0.);
    if (i > 0.) {
	    l += sphereCol(time) * (i * getLightIntensity(p, normal, sphereCenter(activeSpheres[0]), .375));
    } else {    
        i = getSphereLightIntensity(1.);
        if (i > 0.) {
            l += sphereCol(time+1.) * (i * getLightIntensity(p, normal, sphereCenter(activeSpheres[1]), .25));
        }
    }
    
    vec3 robot = mix(sphereCol(time), sphereCol(time-1.), getSphereLightIntensity(0.));
    vec3 lp = rotateY(vec3(joints[2].x, joints[2].y+1.,0), -jointYRot);
    i = getLightIntensity(p, normal, lp, .5);
    i += getLightIntensity(p, normal, vec3(0,2,0), .25);
    l += i * robot;
    
    return l;
}

vec3 getEmissive( in vec2 pos, in float mat ) {
    if (mat > 2.5 ) {
	   return mix(sphereCol(time), sphereCol(time-1.), getSphereLightIntensity(0.));
    } else if (mat > 1.5 ) {
        float li0 = getSphereLightIntensity(0.);
        float li1 = getSphereLightIntensity(1.);
        if (li0 > 0. && pos == activeSpheres[0]) {
            return sphereCol(time) * li0 * 1.25;
        } else if (li1 > 0. && pos == activeSpheres[1]) {
            return sphereCol(time+1.) * li1;
        } else {
            return vec3(0);
        }
    } else {
        return vec3(0);
    }
}

vec3 render( in vec3 ro, in vec3 rd) {
    vec3 col = vec3(1);
    vec3 emitted = vec3(0);
    vec3 normal;
        
    for (int i=ZERO; i<PATH_LENGTH; ++i) {
    	vec3 res = worldhit( ro, rd, vec2(MIN_DIST, MAX_DIST-1.), normal );
		if (res.z > 0.) {
			ro += rd * res.y;

            if (res.z < 3.5) { 
               	vec3 F = FresnelSchlick(vec3(0.4), normal, -rd);
                emitted += (col * (getEmissive(floor(ro.xz), res.z) + .5 * getLighting(ro, normal))) * (1.-F);
                col *= .5 * F;
            } else {
                col *= .15;   
            } 
            
            rd = normalize(reflect(rd,normal));
        } else {
			return emitted;
        }
    }  
    return emitted;
}

mat3 setCamera( in vec3 ro, in vec3 ta, float cr ) {
	vec3 cw = normalize(ta-ro);
	vec3 cp = vec3(sin(cr), cos(cr),0.0);
	vec3 cu = normalize( cross(cw,cp) );
	vec3 cv =          ( cross(cu,cw) );
    return mat3( cu, cv, cw );
}

void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
    initDynamics();

    vec2 mo = iMouse.xy == vec2(0) ? vec2(.4,-.1) : abs(iMouse.xy)/iResolution.xy - .5;

    vec3 ro = vec3(10.5*cos(1.5+6.*mo.x), 6.+10.*mo.y, 8.5*sin(1.5+6.*mo.x));
    vec3 ta = vec3(ro.x*ro.y*.02, .8, 0);
    mat3 ca = setCamera(ro, ta, 0.);    
    
    vec3 col = vec3(0);
    
#if AA>1
    for( int m=ZERO; m<AA; m++ )
    for( int n=ZERO; n<AA; n++ ) {
        vec2 o = vec2(float(m),float(n)) / float(AA) - 0.5;
        vec2 p = (-iResolution.xy + 2.0*(fragCoord+o))/iResolution.y;
#else    
        vec2 p = (-iResolution.xy + 2.0*fragCoord)/iResolution.y;
#endif
        vec3 rd = ca * normalize( vec3(p.xy,1.6) );  
        col += pow(8. * render(ro, rd), vec3(1./2.2));
#if AA>1
    }
    col /= float(AA*AA);
#endif
    
    col = clamp(col + ((hash22(fragCoord).x-.5)/64.), vec3(0), vec3(1));
    
	fragColor = vec4(col , 1);
}`,name:`Image`,description:``,type:`image`}]},{ver:`0.1`,info:{id:`Wd3XDr`,date:`1571755007`,viewed:1709,name:`Inverse Barrel Distortion`,description:`The inverse of a Barrel Distortion.

I couldn't find this function online, so I derived it myself. A surprisingly complex formula ;-)`,likes:6,published:`Public API`,usePreview:0,tags:[`distortion`,`barrel`,`inverse`]},renderpass:[{inputs:[{id:`4dfGRn`,filepath:`/media/a/8de3a3924cb95bd0e95a443fff0326c869f9d4979cd1d5b6e94e2a01f5be53e9.jpg`,type:`texture`,channel:0,sampler:{filter:`mipmap`,wrap:`repeat`,vflip:`true`,srgb:`false`,internal:`byte`},published:1}],outputs:[{id:`4dfGRr`,channel:0}],code:`// Inverse Barrel Distortion. Created by Reinder Nijhoff 2019
// The MIT License
// @reindernijhoff
//
// https://www.shadertoy.com/view/Wd3XDr
//
// The inverse of a Barrel Distortion. 
//
// I couldn't find this function online, so I derived it myself. 
// A surprisingly complex formula ;-).
//
// \`\`\`
// uv -= .5;
//    
// float b = distortion;
// float l = length(uv);
//    
// float x0 = pow(9.*b*b*l + sqrt(3.) * sqrt(27.*b*b*b*b*l*l + 4.*b*b*b), 1./3.);
// float x = x0 / (pow(2., 1./3.) * pow(3., 2./3.) * b) - pow(2./3., 1./3.) / x0;
//    
// return uv * (x / l) + .5;
// \`\`\`
//

#define BARREL_DISTORTION 1.5

vec2 barrelDistortion(vec2 uv, float distortion) {    
    uv -= .5;
    uv *= 1. + dot(uv, uv) * distortion;
    return uv + .5;
}

vec2 inverseBarrelDistortion(vec2 uv, float distortion) {    
    uv -= .5;
    
    float b = distortion;
    float l = length(uv);
    
    float x0 = pow(9.*b*b*l + sqrt(3.) * sqrt(27.*b*b*b*b*l*l + 4.*b*b*b), 1./3.);
    float x = x0 / (pow(2., 1./3.) * pow(3., 2./3.) * b) - pow(2./3., 1./3.) / x0;
       
    return uv * (x / l) + .5;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
    vec2 uv = fragCoord/iResolution.xy;
    
    vec2 uvDist = barrelDistortion(uv, BARREL_DISTORTION);
    vec2 uvInv  = inverseBarrelDistortion(uvDist, BARREL_DISTORTION);
        
    vec3 col = texture(iChannel0, fract(iTime*.5) > .5 ? uvDist : uvInv).rgb;
    
    fragColor = vec4(col,1.0);
}`,name:`Image`,description:``,type:`image`}]},{ver:`0.1`,info:{id:`wdyBRV`,date:`1607508890`,viewed:2185,name:`Cameras and Lenses`,description:`Based on the shaders of the excellent article 'Cameras and Lenses' by @BCiechanowski: [URL]https://ciechanow.ski/cameras-and-lenses[/URL]. Use your mouse to focus.`,likes:67,published:`Public API`,usePreview:0,tags:[`dof`,`aperture`,`cameras`,`lenses`]},renderpass:[{inputs:[],outputs:[{id:`4dfGRr`,channel:0}],code:`// Cameras and Lenses. Created by Reinder Nijhoff 2020
// https://www.shadertoy.com/view/wdyBRV
//
// Based on the shaders of the excellent article 'Cameras and Lenses' by 
// @BCiechanowski: https://ciechanow.ski/cameras-and-lenses/
//

const float aperture = 0.15;

vec2 hash2(float n) {
	return fract(n * vec2(0.754878, 0.56984));
}

vec2 random_in_unit_disk(float seed) {
    vec2 h = hash2(seed) * vec2(1.,6.28318530718);
	return sqrt(h.x) * vec2(sin(h.y),cos(h.y));
}

// https://www.shadertoy.com/view/4d2XWV by Inigo Quilez
float sphere_intersect(vec3 ro, vec3 rd, vec4 sph) {
	vec3 oc = ro - sph.xyz;
	float b = dot( oc, rd );
	float c = dot( oc, oc ) - sph.w*sph.w;
	float h = b*b - c;
	if( h<0.0 ) return -1.0;
	return -b - sqrt( h );
}

vec4 render(vec3 ro, vec3 rd) {
    vec3 color = vec3(0.94);

    // sphere positions and sphere colors
    const vec4 s0 = vec4(0.7, 0.7, 0.3, 0.3);
    const vec4 s1 = vec4(-0.7, -0.7, 0.5, 0.5);
    const vec3 c0 = vec3(1.0, 0.1, 0.05);
    const vec3 c1 = vec3(0.1, 0.8, 0.05);

    vec4 sphere = rd.y > 0.0 ? s0 : s1;

    float dist = sphere_intersect(ro, rd, sphere);
    if (dist > 0.0) { // spheres
        float diff = 0.5 + 0.5 * normalize(ro + rd * dist - sphere.xyz).z;
        color = ( rd.y > 0.0 ? c0 : c1) * sqrt(diff);
    }
    else if (rd.z < 0.0) { // plane
        dist = -ro.z / rd.z;
        vec2 pos = ro.xy + rd.xy * dist;

        if (abs(pos.x) < 2. && abs(pos.y) < 2.) {
            // checker pattern
            vec2  fpos = floor(pos * 2.0);
            float s = mod(fpos.x + fpos.y, 2.0) > 0.5 ? 0.54 : 0.66;
            
            // fake ambient occlusion
            vec2  d0 = pos - s0.xy;
            float f0 = 12.0 * dot(d0, d0);
            vec2  d1 = pos - s1.xy;
            float f1 = 5.0 * dot(d1, d1);
            float f = (f0*f1 - 1.0) / ((f0 + 1.0)*(f1 + 1.0));

            color = vec3(f * s);
        }
    }
    return vec4(color, clamp(dist, 1.5, 3.7));
}

void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
    float seed = fract(sin(dot(fragCoord.xy, vec2(1234.0, 5134.0))));
    
    vec2 uv = (fragCoord*2.0-iResolution.xy)/iResolution.y;
    
    vec3 ro = vec3(2.7, 0, 0.7);
    vec3 color = vec3(0.0);

	vec3  focusrd = normalize(vec3(-1., 0.6 * (iMouse.xy*2.-iResolution.xy)/iResolution.y));
	float focusingDistance = iMouse.x > 0. ? abs((ro + focusrd * render(ro, focusrd).w).x - ro.x) : 2.;
      
    for (float x = 0.0; x <= 6.0; x += 1.) {
        for (float y = 0.0; y <= 6.0; y += 1.) {
            vec2 offset = random_in_unit_disk(seed + x + 5.0 * y) * aperture;
            vec2 aa     = vec2(x - 2.5, y - 2.5) * (0.4 / iResolution.y);
            
            vec3 rd = normalize(vec3(-focusingDistance, (uv + aa) * focusingDistance * 0.6 + offset));
    
            color += render(ro - vec3(0.0, offset), rd).rgb;
        }
    }
 
    color *= (1.0/36.);
    
    fragColor = vec4(pow(color.rgb, vec3(0.45454)), 1.0);
}`,name:`Image`,description:``,type:`image`}]}]},F={"/media/a/f735bee5b64ef98879dc618b016ecf7939a5756040c2cde21ccb15e69a6e1cfb.png":`./media/f735bee5b64ef98879dc618b016ecf7939a5756040c2cde21ccb15e69a6e1cfb.png`,"/media/a/cd4c518bc6ef165c39d4405b347b51ba40f8d7a065ab0e8d2e4f422cbc1e8a43.jpg":`./media/cd4c518bc6ef165c39d4405b347b51ba40f8d7a065ab0e8d2e4f422cbc1e8a43.jpg`,"/media/a/cbcbb5a6cfb55c36f8f021fbb0e3f69ac96339a39fa85cd96f2017a2192821b5.png":`./media/cbcbb5a6cfb55c36f8f021fbb0e3f69ac96339a39fa85cd96f2017a2192821b5.png`,"/media/a/0c7bf5fe9462d5bffbd11126e82908e39be3ce56220d900f633d58fb432e56f5.png":`./media/0c7bf5fe9462d5bffbd11126e82908e39be3ce56220d900f633d58fb432e56f5.png`,"/media/a/1f7dca9c22f324751f2a5a59c9b181dfe3b5564a04b724c657732d0bf09c99db.jpg":`./media/1f7dca9c22f324751f2a5a59c9b181dfe3b5564a04b724c657732d0bf09c99db.jpg`,"/media/a/3083c722c0c738cad0f468383167a0d246f91af2bfa373e9c5c094fb8c8413e0.png":`./media/3083c722c0c738cad0f468383167a0d246f91af2bfa373e9c5c094fb8c8413e0.png`,"/media/a/10eb4fe0ac8a7dc348a2cc282ca5df1759ab8bf680117e4047728100969e7b43.jpg":`./media/10eb4fe0ac8a7dc348a2cc282ca5df1759ab8bf680117e4047728100969e7b43.jpg`,"/media/a/92d7758c402f0927011ca8d0a7e40251439fba3a1dac26f5b8b62026323501aa.jpg":`./media/92d7758c402f0927011ca8d0a7e40251439fba3a1dac26f5b8b62026323501aa.jpg`,"/media/a/fb918796edc3d2221218db0811e240e72e340350008338b0c07a52bd353666a6.jpg":`./media/fb918796edc3d2221218db0811e240e72e340350008338b0c07a52bd353666a6.jpg`,"/media/a/95b90082f799f48677b4f206d856ad572f1d178c676269eac6347631d4447258.jpg":`./media/95b90082f799f48677b4f206d856ad572f1d178c676269eac6347631d4447258.jpg`,"/media/a/79520a3d3a0f4d3caa440802ef4362e99d54e12b1392973e4ea321840970a88a.jpg":`./media/79520a3d3a0f4d3caa440802ef4362e99d54e12b1392973e4ea321840970a88a.jpg`,"/media/a/08b42b43ae9d3c0605da11d0eac86618ea888e62cdd9518ee8b9097488b31560.png":`./media/08b42b43ae9d3c0605da11d0eac86618ea888e62cdd9518ee8b9097488b31560.png`,"/media/a/8de3a3924cb95bd0e95a443fff0326c869f9d4979cd1d5b6e94e2a01f5be53e9.jpg":`./media/8de3a3924cb95bd0e95a443fff0326c869f9d4979cd1d5b6e94e2a01f5be53e9.jpg`,"/media/a/52d2a8f514c4fd2d9866587f4d7b2a5bfa1a11a0e772077d7682deb8b3b517e5.jpg":`./media/52d2a8f514c4fd2d9866587f4d7b2a5bfa1a11a0e772077d7682deb8b3b517e5.jpg`,"/media/a/585f9546c092f53ded45332b343144396c0b2d70d9965f585ebc172080d8aa58.jpg":`./media/585f9546c092f53ded45332b343144396c0b2d70d9965f585ebc172080d8aa58.jpg`,"/media/a/488bd40303a2e2b9a71987e48c66ef41f5e937174bf316d3ed0e86410784b919.jpg":`./media/488bd40303a2e2b9a71987e48c66ef41f5e937174bf316d3ed0e86410784b919.jpg`},I=[...P.shaders].sort((e,t)=>e.info.name.localeCompare(t.info.name)),L=null,R=document.getElementById(`canvas-container`),z=document.getElementById(`shader-select`),B=document.getElementById(`shader-info`);I.forEach((e,t)=>{let n=document.createElement(`option`);n.value=t.toString(),n.textContent=e.info.name,z.appendChild(n)});function V(e){L&&=(L.destruct(),null);try{L=new N(R,e,{loop:!0,pixelRatio:Math.min(window.devicePixelRatio,2),mediaMapping:e=>F[e]});let t=`https://www.shadertoy.com/view/${e.info.id}`;B.innerHTML=`
      <strong>${e.info.name}</strong><br>
      <a href="${t}" target="_blank">${t}</a>
    `}catch(e){B.innerHTML=`<span style="color: #f88;">Failed to load shader: ${e.message}</span>`}}z.addEventListener(`change`,()=>{let e=parseInt(z.value,10);!isNaN(e)&&I[e]&&V(I[e])}),I.length>0&&(z.value=`0`,V(I[0]));