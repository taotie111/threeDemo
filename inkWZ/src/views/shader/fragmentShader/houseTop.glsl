
in vec3 Normal;
out vec4 FragColor;

void main(){
    // 检查法线是否大致指向上方（y轴正方向）
    if(abs(Normal.y)>.9){
        // 如果是顶面（朝上的面），使用一种颜色
        FragColor=vec4(1.,1.,0.,1.);// 黄色
    }else{
        // 如果不是，使用另一种颜色
        FragColor=vec4(.5,.5,.5,1.);// 灰色
    }
}