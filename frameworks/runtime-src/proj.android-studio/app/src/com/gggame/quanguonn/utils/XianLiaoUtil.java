package com.gggame.quanguonn.utils;

import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.util.Log;

import com.gggame.quanguonn.Global;
import com.gggame.quanguonn.R;

import org.cocos2dx.lib.Cocos2dxActivity;
import org.cocos2dx.lib.Cocos2dxHelper;
import org.xianliao.im.sdk.api.ISGAPI;
import org.xianliao.im.sdk.api.SGAPIFactory;
import org.xianliao.im.sdk.constants.SGConstants;
import org.xianliao.im.sdk.modelmsg.SGGameObject;
import org.xianliao.im.sdk.modelmsg.SGImageObject;
import org.xianliao.im.sdk.modelmsg.SGMediaMessage;
import org.xianliao.im.sdk.modelmsg.SGTextObject;
import org.xianliao.im.sdk.modelmsg.SendAuth;
import org.xianliao.im.sdk.modelmsg.SendMessageToSG;

import java.io.File;

/**
 * 闲聊工具
 * Created by zhangluxin on 2017/11/2.
 */

public class XianLiaoUtil {

    /**
     * 闲聊房间号
     */
    public static String XianLiaoRoomId = "";

    /**
     * 闲聊房间数据
     */
    public static String XIAN_LIAO_RoomData = "";

    public static String XianLiaoLoginCode = "";

    public static String XianLiaoLoginState = "";

    private ISGAPI mApi;
    private String appid;

    /**
     * 缩略图大小
     */
    private static final int THUMB_SIZE = 400;

    private static XianLiaoUtil instance;

    public static XianLiaoUtil getInstance() {
        if (instance == null) {
            instance = new XianLiaoUtil();
        }
        return instance;
    }

    /**
     * 注册闲聊api
     *
     * @param appid appid
     */
    public void register(String appid) {
        ISGAPI api = SGAPIFactory.createSGAPI(Cocos2dxActivity.getContext(), appid);
        XianLiaoUtil.getInstance().setmApi(api);
        XianLiaoUtil.getInstance().setAppid(appid);
        Log.i("XianLiaoUtil.register", "注册闲聊:" + appid);
    }

    public ISGAPI getmApi() {
        return mApi;
    }

    public void setmApi(ISGAPI mApi) {
        this.mApi = mApi;
    }

    public String getAppid() {
        return appid;
    }

    public void setAppid(String appid) {
        this.appid = appid;
    }

    public static String buildTransaction(final String type) {
        return (type == null) ? String.valueOf(System.currentTimeMillis()) : type + System.currentTimeMillis();
    }

    /**
     * 取得结果
     *
     * @param key key
     * @return value
     */
    public static String getTransResult(String key) {
        return Global.getTransResult(key);
    }

    /**
     * 闲聊是否安装
     *
     * @return 1 是 0 否
     */
    public static int isXLAppInstalled() {
        return XianLiaoUtil.getInstance().getmApi().isSGAppInstalled() ? 1 : 0;
    }

    /**
     * 拉起闲聊登录
     */
    public static void redirectXianLiaoLogin() {
        SendAuth.Req req = new SendAuth.Req();
        req.state = "none";
        XianLiaoUtil.getInstance().getmApi().sendReq(req);
    }

    /**
     * 分享文本
     *
     * @param text 文本
     */
    public static void shareText(String text) {
        SGTextObject textObject = new SGTextObject();
        textObject.text = text;
        SGMediaMessage msg = new SGMediaMessage();
        msg.mediaObject = textObject;
        SendMessageToSG.Req req = new SendMessageToSG.Req();
        req.transaction = SGConstants.T_TEXT;
        req.mediaMessage = msg;
        req.scene = SendMessageToSG.Req.SGSceneSession; //代表分享到会话列表
        XianLiaoUtil.getInstance().getmApi().sendReq(req);
    }

    /**
     * 分享图片
     *
     * @param filename 图片路径
     */
    public static void sharePic(String filename) {
        File file = new File(Cocos2dxHelper.getCocos2dxWritablePath() + "/" + filename);
        if (file.exists()) {

            Bitmap bmp = BitmapFactory.decodeFile(Cocos2dxHelper.getCocos2dxWritablePath() + "/" + filename);
//            Bitmap thumbBmp = Bitmap.createScaledBitmap(bmp, THUMB_SIZE, (int) (THUMB_SIZE / (double) bmp.getWidth() * bmp.getHeight()), true);
//            bmp.recycle();

            SGImageObject imageObject = new SGImageObject();
            imageObject.imageData = Global.bmpToByteArray(bmp, true);


            SGMediaMessage msg = new SGMediaMessage();
            msg.mediaObject = imageObject;
            SendMessageToSG.Req req = new SendMessageToSG.Req();
            req.transaction = SGConstants.T_IMAGE;
            req.mediaMessage = msg;
            req.scene = SendMessageToSG.Req.SGSceneSession; //代表分享到会话列表
            XianLiaoUtil.getInstance().getmApi().sendReq(req);
        }
    }

    /**
     * 分享网址
     *
     * @param url 网址
     */
    public static void shareUrlWithIcon(String url) {
        SGImageObject imageObject = new SGImageObject();
        imageObject.imagePath = url;

        SGMediaMessage msg = new SGMediaMessage();
        msg.mediaObject = imageObject;

        SendMessageToSG.Req req = new SendMessageToSG.Req();
        req.transaction = SGConstants.T_IMAGE;
        req.mediaMessage = msg;
        req.scene = SendMessageToSG.Req.SGSceneSession;

        XianLiaoUtil.getInstance().getmApi().sendReq(req);
    }

    /**
     * 分享游戏
     *
     * @param roomId 房间号
     * @param title  标题
     * @param text   文本
     */
    public static void shareGame(String roomId, String title, String text) {
        SGGameObject gameObject = new SGGameObject(BitmapFactory.decodeResource(Cocos2dxActivity.getContext().getResources(), R.mipmap.ic_launcher));
        gameObject.roomId = roomId;
        gameObject.roomToken = roomId;

        SGMediaMessage msg = new SGMediaMessage();
        msg.mediaObject = gameObject;
        msg.title = title;
        msg.description = text;

        SendMessageToSG.Req req = new SendMessageToSG.Req();
        req.transaction = SGConstants.T_GAME;
        req.mediaMessage = msg;
        req.scene = SendMessageToSG.Req.SGSceneSession; //代表分享到会话列表

        XianLiaoUtil.getInstance().getmApi().sendReq(req);
    }

    public static void clearRoomId() {
        XianLiaoRoomId = "";
    }

    public static void setXianLiaoRoomId(String roomid) {
        XianLiaoRoomId = roomid;
    }

    public static String getXianLiaoRoomId() {
        return XianLiaoRoomId;
    }

    public static String getXianLiaoRoomData() {
        return XIAN_LIAO_RoomData;
    }

    public static String getXianLiaoLoginState() {
        return XianLiaoLoginState;
    }

    public static void setXianLiaoLoginState(String xianLiaoLoginState) {
        XianLiaoLoginState = xianLiaoLoginState;
    }

    public static String getXianLiaoLoginCode() {
        return XianLiaoLoginCode;
    }

    public static void setXianLiaoLoginCode(String xianLiaoLoginCode) {
        XianLiaoLoginCode = xianLiaoLoginCode;
    }
}
