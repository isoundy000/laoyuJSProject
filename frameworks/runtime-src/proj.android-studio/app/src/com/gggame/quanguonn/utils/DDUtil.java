package com.gggame.quanguonn.utils;

import android.app.Activity;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.os.Environment;
import android.util.Log;

import com.android.dingtalk.share.ddsharemodule.DDShareApiFactory;
import com.android.dingtalk.share.ddsharemodule.IDDShareApi;
import com.android.dingtalk.share.ddsharemodule.message.*;
import com.gggame.quanguonn.R;

import org.cocos2dx.javascript.AppActivity;
import org.cocos2dx.lib.Cocos2dxHelper;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;

/**
 * 钉钉工具类
 * Created by zhangluxin on 2017/2/18.
 */
public class DDUtil {
    /**
     * 分享结果
     */
    public String shareResult;
    /**
     * 单例
     */
    private static DDUtil instance = null;

    private IDDShareApi mApi;

    private String appId;

    /**
     * 单例
     */
    public static DDUtil getInstance() {
        if (instance == null) {
            instance = new DDUtil();
        }
        return instance;
    }

    public void register(AppActivity activity, String appId) {
        IDDShareApi api = DDShareApiFactory.createDDShareApi(activity, appId, false);
        DDUtil.getInstance().setAppid(appId);
        DDUtil.getInstance().setmApi(api);
        Log.i("DDUtil.register", "注册钉钉：" + appId);
        System.out.println(AppActivity.getAppContext());
    }

    public IDDShareApi getmApi() {
        return mApi;
    }

    public void setmApi(IDDShareApi mApi) {
        this.mApi = mApi;
    }

    public String getAppid() {
        return appId;
    }

    public void setAppid(String appId) {
        this.appId = appId;
    }

    public static boolean isInstalled() {
        return DDUtil.getInstance().getmApi().isDDAppInstalled();
    }

    /**
     * 分享文本
     *
     * @param text 文本
     */
    public static void shareText(String text) {
        DDTextMessage textObject = new DDTextMessage();
        textObject.mText = text;
        DDMediaMessage mediaMessage = new DDMediaMessage();
        mediaMessage.mMediaObject = textObject;
        SendMessageToDD.Req req = new SendMessageToDD.Req();
        req.mMediaMessage = mediaMessage;
        DDUtil.getInstance().getmApi().sendReq(req);
    }

    /**
     * 分享url
     *
     * @param url         地址
     * @param title       标题
     * @param description 内容
     * @param isTimeline  0
     * @param transaction 0
     */
    public static void shareUrl(String url, String title, String description, boolean isTimeline, String transaction) {
        DDWebpageMessage webPageObject = new DDWebpageMessage();
        webPageObject.mUrl = url;
        DDMediaMessage webMessage = new DDMediaMessage();
        webMessage.mMediaObject = webPageObject;
        webMessage.mTitle = title;
        webMessage.mContent = description;
        webMessage.setThumbImage(BitmapFactory.decodeResource(AppActivity.getAppContext().getResources(), R.mipmap.ic_launcher));
        SendMessageToDD.Req webReq = new SendMessageToDD.Req();
        webReq.mMediaMessage = webMessage;
        DDUtil.getInstance().getmApi().sendReq(webReq);
    }

    /**
     * 分享url
     *
     * @param url         地址
     * @param title       标题
     * @param description 内容
     * @param isTimeline  0
     * @param transaction 0
     * @param path        路径
     */
    public static void shareUrlWithIcon(String url, String title, String description, boolean isTimeline, String transaction, String path) {
        DDWebpageMessage webPageObject = new DDWebpageMessage();
        webPageObject.mUrl = url;
        DDMediaMessage webMessage = new DDMediaMessage();
        webMessage.mMediaObject = webPageObject;
        webMessage.mTitle = title;
        webMessage.mContent = description;
        webMessage.setThumbImage(BitmapFactory.decodeFile(path));
        SendMessageToDD.Req webReq = new SendMessageToDD.Req();
        webReq.mMediaMessage = webMessage;
        DDUtil.getInstance().getmApi().sendReq(webReq);
    }

    /**
     * 分享图片
     *
     * @param filename   图片名
     * @param isTimeline 0
     */
    public static void sharePic(String filename, boolean isTimeline) {
        String path = Cocos2dxHelper.getCocos2dxWritablePath() + "/" + filename;
        File file = new File(path);
        if (file.exists()) {
            String newPath = null;
            if (QQUtil.getInstance().isHaveSDCard()) {
                newPath = Environment.getExternalStorageDirectory().getPath();
            } else {
                newPath = Environment.getDataDirectory().getPath();
            }

            File newFileDir = new File(newPath + "/" + AppActivity.getAppContext().getPackageName() + "/image/");
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

            DDImageMessage imageObject = new DDImageMessage();
            imageObject.mImagePath = newFile.getPath();

            DDMediaMessage mediaMessage = new DDMediaMessage();
            mediaMessage.mMediaObject = imageObject;

            SendMessageToDD.Req req = new SendMessageToDD.Req();
            req.mMediaMessage = mediaMessage;

            DDUtil.getInstance().getmApi().sendReq(req);
        }
    }
}
