uniform float uOpacity;

void main() {
  float strength = distance(gl_PointCoord, vec2(0.5));
  strength = 1.0 - strength; 
  strength = pow(strength, 3.0);
  // gl_FragColor = vec4(vec3(1.0), 0.25);
  gl_FragColor = vec4(vec3(1.0, 1.0, 1.0), strength);
}