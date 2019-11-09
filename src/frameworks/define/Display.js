/**
 * 显示用的一些东西的封装
 * Created by zhangluxin on 16/7/28.
 */
yy.display = {};
var viewsize = cc.winSize;
yy.display.contentScaleFactor = cc.contentScaleFactor;
yy.display.size = {width: viewsize.width, height: viewsize.height};
yy.display.width = yy.display.size.width;
yy.display.height = yy.display.size.height;
yy.display.cx = yy.display.width / 2;
yy.display.cy = yy.display.height / 2;
yy.display.c_left = -yy.display.width / 2;
yy.display.c_right = yy.display.width / 2;
yy.display.c_top = yy.display.height / 2;
yy.display.c_bottom = -yy.display.height / 2;
yy.display.left = 0;
yy.display.right = yy.display.width;
yy.display.top = yy.display.height;
yy.display.bottom = 0;
yy.display.center = cc.p(yy.display.cx, yy.display.cy);
yy.display.left_top = cc.p(yy.display.left, yy.display.top);
yy.display.left_bottom = cc.p(yy.display.left, yy.display.bottom);
yy.display.left_center = cc.p(yy.display.left, yy.display.cy);
yy.display.right_top = cc.p(yy.display.right, yy.display.top);
yy.display.right_bottom = cc.p(yy.display.right, yy.display.bottom);
yy.display.right_center = cc.p(yy.display.right, yy.display.cy);
yy.display.top_center = cc.p(yy.display.cx, yy.display.top);
yy.display.top_bottom = cc.p(yy.display.cx, yy.display.bottom);

yy.display.CENTER = cc.p(0.5, 0.5);
yy.display.LEFT_TOP = cc.p(0, 1);
yy.display.LEFT_BOTTOM = cc.p(0, 0);
yy.display.LEFT_CENTER = cc.p(0, 0.5);
yy.display.RIGHT_TOP = cc.p(1, 1);
yy.display.RIGHT_BOTTOM = cc.p(1, 0);
yy.display.RIGHT_CENTER = cc.p(1, 0.5);
yy.display.CENTER_TOP = cc.p(0.5, 1);
yy.display.CENTER_BOTTOM = cc.p(0.5, 0);

yy.display.TEXTURES_PIXEL_FORMAT = {};
yy.display.DEFAULT_TTF_FONT = "Arial";
yy.display.DEFAULT_TTF_FONT_SIZE = 32;