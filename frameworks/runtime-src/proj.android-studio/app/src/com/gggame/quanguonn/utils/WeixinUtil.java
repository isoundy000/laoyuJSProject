package com.gggame.quanguonn.utils;

import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.util.Log;

import com.gggame.quanguonn.Global;
import com.gggame.quanguonn.R;
import com.tencent.mm.opensdk.modelmsg.SendAuth;
import com.tencent.mm.opensdk.modelmsg.SendMessageToWX;
import com.tencent.mm.opensdk.modelmsg.WXImageObject;
import com.tencent.mm.opensdk.modelmsg.WXMediaMessage;
import com.tencent.mm.opensdk.modelmsg.WXMiniProgramObject;
import com.tencent.mm.opensdk.modelmsg.WXTextObject;
import com.tencent.mm.opensdk.modelmsg.WXWebpageObject;
import com.tencent.mm.opensdk.modelpay.PayReq;
import com.tencent.mm.opensdk.openapi.IWXAPI;
import com.tencent.mm.opensdk.openapi.WXAPIFactory;

import org.cocos2dx.lib.Cocos2dxActivity;
import org.cocos2dx.lib.Cocos2dxHelper;

import java.io.File;

/**
 * 微信工具类
 * Created by zhangluxin on 2017/11/1.
 */

public class WeixinUtil {
    /**
     * 微信 appId
     */
    private String appId;

    /**
     * 微信Api
     */
    private IWXAPI mApi;

    /**
     * 缩略图大小
     */
    private static final int THUMB_SIZE = 400;

    /**
     * 微信code
     */
    private static String WXLoginCode;

    private String miniRroRoomId;

    /**
     * 单例
     */
    private static WeixinUtil instance = null;

    /**
     * 单例
     */
    public static WeixinUtil getInstance() {
        if (instance == null) {
            instance = new WeixinUtil();
        }
        return instance;
    }

    /**
     * 注册微信
     *
     * @param appId appId
     */
    public void register(String appId) {
        IWXAPI api = WXAPIFactory.createWXAPI(Cocos2dxActivity.getContext(), appId);
        api.registerApp(appId);
        WeixinUtil.getInstance().setAppid(appId);
        WeixinUtil.getInstance().setmApi(api);
        Log.i("WeixinUtil.register", "注册微信：" + appId);
    }

    public static String getAppId() {
        return WeixinUtil.getInstance().appId;
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
     * 微信是否安装
     *
     * @return 1 是 0 否
     */
    public static int isWXAppInstalled() {
        return WeixinUtil.getInstance().getmApi().isWXAppInstalled() ? 1 : 0;
    }

    /**
     * 拉起微信登录
     */
    public static void redirectToWeixinLogin() {
        final SendAuth.Req req = new SendAuth.Req();
        req.scope = "snsapi_userinfo";
        WeixinUtil.getInstance().getmApi().sendReq(req);
    }

    /**
     * 取得微信code
     *
     * @return 微信code
     */
    public static String getWXLoginCode() {
        return WXLoginCode;
    }

    /**
     * 设置微信code
     *
     * @param code 微信code
     */
    public static void setWXLoginCode(String code) {
        WeixinUtil.WXLoginCode = code;
    }

    /**
     * 分享文本
     *
     * @param text        文本
     * @param isTimeline  是否分享到朋友圈
     * @param transaction transaction
     */
    public static void shareText(String text, boolean isTimeline, String transaction) {
        WXTextObject textObj = new WXTextObject();
        textObj.text = text;

        WXMediaMessage msg = new WXMediaMessage();
        msg.mediaObject = textObj;
        msg.description = text;

        SendMessageToWX.Req req = new SendMessageToWX.Req();
        req.transaction = transaction;
        req.message = msg;
        req.scene = isTimeline ? SendMessageToWX.Req.WXSceneTimeline : SendMessageToWX.Req.WXSceneSession;

        WeixinUtil.getInstance().getmApi().sendReq(req);
    }

    /**
     * 分享图片
     *
     * @param filename   文件名
     * @param isTimeline 是否分享到朋友圈
     */
    public static void sharePic(String filename, boolean isTimeline) {
        File file = new File(Cocos2dxHelper.getCocos2dxWritablePath() + "/" + filename);
        if (file.exists()) {
            Bitmap bmp = BitmapFactory.decodeFile(Cocos2dxHelper.getCocos2dxWritablePath() + "/" + filename);
            WXImageObject imgObj = new WXImageObject(bmp);

            WXMediaMessage msg = new WXMediaMessage();
            msg.mediaObject = imgObj;

            Bitmap thumbBmp = Bitmap.createScaledBitmap(bmp, THUMB_SIZE, (int) (THUMB_SIZE / (double) bmp.getWidth() * bmp.getHeight()), true);
            bmp.recycle();
            msg.thumbData = Global.bmpToByteArray(thumbBmp, true);

            SendMessageToWX.Req req = new SendMessageToWX.Req();
            req.transaction = buildTransaction("img");
            req.message = msg;
            req.scene = isTimeline ? SendMessageToWX.Req.WXSceneTimeline : SendMessageToWX.Req.WXSceneSession;
            WeixinUtil.getInstance().getmApi().sendReq(req);
        }
    }

    /**
     * 分享网址
     *
     * @param url         网址
     * @param title       标题
     * @param description 文本
     * @param isTimeline  是否分享到朋友圈
     * @param transaction transaction
     */
    public static void shareUrl(String url, String title, String description, boolean isTimeline, String transaction) {
        WXWebpageObject webpage = new WXWebpageObject();
        webpage.webpageUrl = url;
        WXMediaMessage msg = new WXMediaMessage(webpage);
        msg.title = title;
        msg.description = description;
        msg.setThumbImage(BitmapFactory.decodeResource(Cocos2dxActivity.getContext().getResources(), R.mipmap.ic_launcher));

        SendMessageToWX.Req req = new SendMessageToWX.Req();
        req.transaction = transaction;
        req.message = msg;
        req.scene = isTimeline ? SendMessageToWX.Req.WXSceneTimeline : SendMessageToWX.Req.WXSceneSession;
        WeixinUtil.getInstance().getmApi().sendReq(req);
    }

    /**
     * 微信支付请求
     *
     * @param appId        appId
     * @param partnerId    partnerId
     * @param prepayId     prepayId
     * @param packageValue packageValue
     * @param nonceStr     nonceStr
     * @param timeStamp    timeStamp
     * @param sign         sign
     */
    public static void wxPay(String appId, String partnerId, String prepayId, String packageValue, String nonceStr, String timeStamp, String sign) {
        PayReq req = new PayReq();
        req.appId = appId;
        req.partnerId = partnerId;
        req.prepayId = prepayId;
        req.packageValue = packageValue;
        req.nonceStr = nonceStr;
        req.timeStamp = timeStamp;
        req.sign = sign;
        WeixinUtil.getInstance().getmApi().sendReq(req);
    }

    /**
     * 取得api
     *
     * @return wxapi
     */
    public static IWXAPI getApiObject() {
        return WeixinUtil.getInstance().getmApi();
    }

    public IWXAPI getmApi() {
        return this.mApi;
    }

    public void setmApi(IWXAPI mApi) {
        this.mApi = mApi;
    }

    public void setAppid(String appId) {
        this.appId = appId;
    }

    /**
     * 分享小程序
     *
     * @param url         网址  适配微信低版本兼容性
     * @param title       标题
     * @param description 文本
     * @param path  分享路径
     * @param miniProgramType 类型  是否正式
     */
    public static void shareMiniPro(String url, String title, String description,String filename,String miniId,String path,String miniProgramType ) {
        WXMiniProgramObject miniProgramObj = new WXMiniProgramObject();
        miniProgramObj.webpageUrl = url; // 兼容低版本的网页链接
        miniProgramObj.miniprogramType =  Integer.valueOf(miniProgramType).intValue();  // 正式版:0，测试版:1，体验版:2
        miniProgramObj.userName = miniId;     // 小程序原始id
        miniProgramObj.path = path;            //小程序页面路径
        WXMediaMessage msg = new WXMediaMessage(miniProgramObj);
        msg.title = title;                    // 小程序消息title
        msg.description = description;               // 小程序消息desc

        // 小程序消息封面图片，小于128k
        File file = new File(Cocos2dxHelper.getCocos2dxWritablePath() + "/" + filename);
        Bitmap bmp = null;
        if (file.exists()) {
            bmp = BitmapFactory.decodeFile(Cocos2dxHelper.getCocos2dxWritablePath() + "/" + filename);
        }else {
            bmp = BitmapFactory.decodeResource(Cocos2dxActivity.getContext().getResources(), R.mipmap.ic_launcher);
        }
        Bitmap thumbBmp = Bitmap.createScaledBitmap(bmp, THUMB_SIZE, (int) (THUMB_SIZE / (double) bmp.getWidth() * bmp.getHeight()), true);
        bmp.recycle();
        msg.thumbData = Global.bmpToByteArray(thumbBmp, true);



        SendMessageToWX.Req req = new SendMessageToWX.Req();
        req.transaction = buildTransaction("webpage");
        req.message = msg;
        req.scene = SendMessageToWX.Req.WXSceneSession;  // 目前支持会话
        WeixinUtil.getInstance().getmApi().sendReq(req);
    }

    public static String getminiRroRoomId() {
        return WeixinUtil.getInstance().miniRroRoomId;
    }

    public static void setminiRroRoomId(String _miniRroRoomId) {
        WeixinUtil.getInstance().miniRroRoomId = _miniRroRoomId;
    }
}
