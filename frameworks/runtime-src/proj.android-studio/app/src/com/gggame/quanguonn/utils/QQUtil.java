package com.gggame.quanguonn.utils;

import android.app.Activity;
import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.os.Bundle;
import android.os.Environment;
import com.tencent.connect.UserInfo;
import com.tencent.connect.share.QQShare;
import com.tencent.tauth.IUiListener;
import com.tencent.tauth.Tencent;
import com.tencent.tauth.UiError;
import org.cocos2dx.lib.Cocos2dxHelper;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;

/**
 * qq工具类
 * Created by zhangluxin on 2017/2/9.
 */
public class QQUtil implements IUiListener {
    /**
     * qq sdk实例
     */
    private Tencent mTencent = null;
    /**
     * Activity实例
     */
    private Activity mActivity = null;
    /**
     * openid
     */
    private String openid = null;
    /**
     * access_token
     */
    private String access_token = null;
    /**
     * userInfo
     */
    private String userInfo = null;
    /**
     * 分享结果
     */
    private String shareQQResult = null;
    /**
     * 单例
     */
    private static QQUtil instance = null;

    /**
     * 单例
     */
    public static QQUtil getInstance() {
        if (instance == null) {
            instance = new QQUtil();
        }
        return instance;
    }

    /**
     * 初始化qq sdk
     *
     * @param activity Activity实例
     */
    public void initQQ(Activity activity,String appid) {
        mActivity = activity;
        mTencent = Tencent.createInstance(appid, activity.getApplicationContext());
    }

    /**
     * 拉起qq登录
     */
    public static void redirectToQQLogin() {
        QQUtil.getInstance().doLogin();
    }

    /**
     * 拉起qq登录
     */
    private void doLogin() {
        mTencent.login(mActivity, "get_user_info", this);
    }

    /**
     * 请求用户信息
     */
    private void requestQQUserInfo() {
        UserInfo info = new UserInfo(mActivity, mTencent.getQQToken());
        info.getUserInfo(new IUiListener() {

            @Override
            public void onComplete(Object data) {
                if (data instanceof JSONObject) {
                    userInfo = data.toString();
                }
            }

            @Override
            public void onError(UiError uiError) {
                userInfo = null;
            }

            @Override
            public void onCancel() {
                userInfo = null;
            }
        });
    }

    /**
     * 取用户信息
     */
    public static String getQQUserInfo() {
        return QQUtil.getInstance().userInfo;
    }

    /**
     * 获取openid
     */
    public static String getOpenid() {
        return QQUtil.getInstance().openid;
    }

    /**
     * 获取access_token
     */
    public static String getAccess_token() {
        return QQUtil.getInstance().access_token;
    }

    /**
     * 获得分享结果
     *
     * @return 分享结果
     */
    public static String getShareResult() {
        return QQUtil.getInstance().shareQQResult;
    }

    /**
     * 分享文本到qq
     *
     * @param text 文本
     */
    public static void shareText(String text) {
        Intent sendIntent = new Intent();
        sendIntent.setAction(Intent.ACTION_SEND);
        sendIntent.putExtra(Intent.EXTRA_TEXT, text);
        sendIntent.setType("text/plain");
        try {
            sendIntent.setClassName("com.tencent.mobileqq", "com.tencent.mobileqq.activity.JumpActivity");
            Intent chooserIntent = Intent.createChooser(sendIntent, "选择分享途径");
            if (chooserIntent == null) {
                return;
            }
            QQUtil.getInstance().mActivity.startActivity(chooserIntent);
        } catch (Exception e) {
            QQUtil.getInstance().mActivity.startActivity(sendIntent);
        }
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
        final Bundle params = new Bundle();
        params.putInt(QQShare.SHARE_TO_QQ_KEY_TYPE, QQShare.SHARE_TO_QQ_TYPE_DEFAULT);
        params.putString(QQShare.SHARE_TO_QQ_TITLE, title);
        params.putString(QQShare.SHARE_TO_QQ_SUMMARY, description);
        params.putString(QQShare.SHARE_TO_QQ_TARGET_URL, url);

        QQUtil.getInstance().mTencent.shareToQQ(QQUtil.getInstance().mActivity, params, new IUiListener() {
            @Override
            public void onComplete(Object o) {
                QQUtil.getInstance().shareQQResult = "ok";
            }

            @Override
            public void onError(UiError uiError) {
                QQUtil.getInstance().shareQQResult = "failed";
            }

            @Override
            public void onCancel() {
                QQUtil.getInstance().shareQQResult = "failed";
            }
        });
    }

    /**
     * 分享url
     *
     * @param url         地址
     * @param title       标题
     * @param description 内容
     * @param isTimeline  0
     * @param transaction 0
     * @param path        图片路径
     */
    public static void shareUrlWithIcon(String url, String title, String description, boolean isTimeline, String transaction, String path) {
        final Bundle params = new Bundle();
        params.putInt(QQShare.SHARE_TO_QQ_KEY_TYPE, QQShare.SHARE_TO_QQ_TYPE_DEFAULT);
        params.putString(QQShare.SHARE_TO_QQ_TITLE, title);
        params.putString(QQShare.SHARE_TO_QQ_IMAGE_LOCAL_URL, path);
        params.putString(QQShare.SHARE_TO_QQ_SUMMARY, description);
        params.putString(QQShare.SHARE_TO_QQ_TARGET_URL, url);
        QQUtil.getInstance().mTencent.shareToQQ(QQUtil.getInstance().mActivity, params, new IUiListener() {
            @Override
            public void onComplete(Object o) {
                QQUtil.getInstance().shareQQResult = "ok";
            }

            @Override
            public void onError(UiError uiError) {
                QQUtil.getInstance().shareQQResult = "failed";
            }

            @Override
            public void onCancel() {
                QQUtil.getInstance().shareQQResult = "failed";
            }
        });
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

            File newFileDir = new File(newPath + "/" + QQUtil.getInstance().mActivity.getPackageName() + "/image/");
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
            final Bundle params = new Bundle();
            params.putInt(QQShare.SHARE_TO_QQ_KEY_TYPE, QQShare.SHARE_TO_QQ_TYPE_IMAGE);
            params.putString(QQShare.SHARE_TO_QQ_IMAGE_LOCAL_URL, newFile.getPath());
            QQUtil.getInstance().mTencent.shareToQQ(QQUtil.getInstance().mActivity, params, new IUiListener() {
                @Override
                public void onComplete(Object o) {
                    QQUtil.getInstance().shareQQResult = "ok";
                }

                @Override
                public void onError(UiError uiError) {
                    QQUtil.getInstance().shareQQResult = "failed";
                }

                @Override
                public void onCancel() {
                    QQUtil.getInstance().shareQQResult = "failed";
                }
            });
        }
    }

    /**
     * 判断是否有sd卡
     *
     * @return 是否有sd卡
     */
    public boolean isHaveSDCard() {
        String SDState = android.os.Environment.getExternalStorageState();
        return SDState.equals(android.os.Environment.MEDIA_MOUNTED);
    }

    @Override
    public void onComplete(Object data) {
        if (data instanceof JSONObject) {
            try {
                openid = ((JSONObject) data).getString("openid");
                access_token = ((JSONObject) data).getString("access_token");
                requestQQUserInfo();
            } catch (JSONException e) {
                e.printStackTrace();
                openid = null;
                access_token = null;
            }
        }
    }

    @Override
    public void onError(UiError uiError) {
        openid = null;
        access_token = null;
    }

    @Override
    public void onCancel() {
        openid = null;
        access_token = null;
    }
}
