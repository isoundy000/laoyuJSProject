package com.gggame.quanguonn.utils;

import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.net.Uri;
import android.os.Environment;
import android.util.Log;

import com.gggame.quanguonn.Global;
import com.gggame.quanguonn.R;
import com.launch.topcmm.liaobeilaunch.LbEntity.LiaoBeiForwardEntity;
import com.launch.topcmm.liaobeilaunch.LbUtil.LiaoBeiAPICreator;
import com.launch.topcmm.liaobeilaunch.LiaoBeiEngine;

import org.cocos2dx.lib.Cocos2dxActivity;
import org.cocos2dx.lib.Cocos2dxHelper;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;

/**
 * 聊呗工具类
 * Created by zhangluxin on 2017/11/1.
 */
public class LBUtil {
    /**
     * 单例
     */
    private static LBUtil instance = null;
    /**
     * 微信Api
     */
    private static LiaoBeiEngine mApi;
    private static String tokenCode = null;


    /**
     * 缩略图大小
     */
    private static final int THUMB_SIZE = 400;

    /**
     * 单例
     */
    public static LBUtil getInstance() {
        if (instance == null) {
            instance = new LBUtil();
        }
        return instance;
    }

    /**
     * 注册聊呗api
     *
     * @param appid appid
     */
    public void register(String appid) {
        Log.i("LBUtil.register", "注册聊呗:" + appid);
        try {
            mApi = LiaoBeiAPICreator.createLiaoBeiEngine(Cocos2dxActivity.getContext(), appid);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    /**
     * 微信是否安装
     *
     * @return 1 是 0 否
     */
    public static int isLBAppInstalled() {
        LiaoBeiEngine.LiaoBeiStatus status = mApi.checkInstallChaoXinStatus();
        if (status == LiaoBeiEngine.LiaoBeiStatus.SUPPORT) {
            return 1;
        } else if (status == LiaoBeiEngine.LiaoBeiStatus.VERSION_LOW_ERROR) {
            return 2;
        } else {
            return 0;
        }
    }

    /**
     * 拉起微信登录
     */
    public static void redirectToLBLogin() {
        mApi.authorize();
    }

    /**
     * 取得微信code
     *
     * @return 微信code
     */
    public static String getLBLoginCode() {
        return tokenCode;
    }

    /**
     * 设置微信code
     *
     * @param str 微信code
     */
    public void setLBLoginCode(String str) {
        tokenCode = str;
    }

    /**
     * 分享文本
     *
     * @param text        文本
     * @param isTimeline  是否分享到朋友圈
     * @param transaction transaction
     */
    public static void shareText(String text, boolean isTimeline, String transaction) {

        LiaoBeiForwardEntity entity = LiaoBeiForwardEntity.newBuild().shareText(text).create();
        mApi.share(entity);
    }

    /**
     * 分享图片
     *
     * @param filename   文件名
     * @param isTimeline 是否分享到朋友圈
     */
    public static void sharePic(String filename, boolean isTimeline) {
        File file = new File(Cocos2dxHelper.getCocos2dxWritablePath() + "/" + filename);
        Uri uri = null;
        if (file.exists()) {
            String newPath = null;
            if (QQUtil.getInstance().isHaveSDCard()) {
                newPath = Environment.getExternalStorageDirectory().getPath();
            } else {
                newPath = Environment.getDataDirectory().getPath();
            }

            File newFileDir = new File(newPath + "/" + Global.getPackageName() + "/image/");
            if (!newFileDir.isDirectory()) {
                newFileDir.delete();
                newFileDir.mkdirs();
            }
            if (!newFileDir.exists()) {
                newFileDir.mkdirs();
            }
            File newFile = new File(newFileDir.getPath() + "/" + filename);
            if (newFile.exists()) {
                newFile.delete();
            }
            Bitmap bmp = BitmapFactory.decodeFile(Cocos2dxHelper.getCocos2dxWritablePath() + "/" + filename);
            try {
                FileOutputStream fos = new FileOutputStream(newFile);
                bmp.compress(Bitmap.CompressFormat.JPEG, 75, fos);

            } catch (FileNotFoundException e) {
                e.printStackTrace();
            }
            if (newFile.exists()) {
                //newFile.delete();
                uri = Uri.fromFile(newFile);
                LiaoBeiForwardEntity entity = LiaoBeiForwardEntity.newBuild().shareImage(uri).create();
                mApi.share(entity);
            }

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
     *                    thumbnailUrl
     */
    public static void shareUrl(String url, String title, String description, boolean isTimeline, String transaction) {
        LiaoBeiForwardEntity entity = LiaoBeiForwardEntity.newBuild()
                .shareMixLink(title, description, url, BitmapFactory.decodeResource(Cocos2dxActivity.getContext().getResources(), R.mipmap.ic_launcher)).create();
        mApi.share(entity);
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
//        PayReq req = new PayReq();
//        req.appId = appId;
//        req.partnerId = partnerId;
//        req.prepayId = prepayId;
//        req.packageValue = packageValue;
//        req.nonceStr = nonceStr;
//        req.timeStamp = timeStamp;
//        req.sign = sign;
//        mApi.sendReq(req);
    }

    /**
     * 取得api
     *
     * @return wxapi
     */
    public static LiaoBeiEngine getApiObject() {
        return mApi;
    }
}
