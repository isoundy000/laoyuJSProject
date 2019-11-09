package com.gggame.quanguonn.utils;

import android.content.pm.ApplicationInfo;
import android.util.Log;

import com.netease.nimlib.sdk.NIMClient;
import com.netease.nimlib.sdk.SDKOptions;
import com.tencent.bugly.Bugly;
import com.tendcloud.tenddata.TalkingDataGA;

import org.cocos2dx.javascript.AppActivity;
import org.cocos2dx.lib.Cocos2dxHelper;

/**
 * sdk管理
 */
public class Sdk {
    /**
     * 是否注册过
     */
    public static boolean isRegistered = false;

    /**
     * 微信appid
     */
    private static String _wxAppId = null;
    /**
     * 魔窗appid
     */
    private static String _mwKey = null;
    /**
     * 闲聊appid
     */
    public static String _xlAppId = null;
    /**
     * 闲聊appid
     */
    private static String _swAppId = null;
    /**
     * 钉钉appid
     */
    private static String _ddAppId = null;
    /**
     * 聊呗appid
     */
    private static String _lbAppId = null;
    /**
     * QQ appid
     */
    private static String _qqAppId = null;

    /**
     * bugly appid
     */
    private static String _buglyAppId = null;

    /**
     * talkingData appid
     */
    private static String _talkingDataAppId = null;

    /**
     * 主activity
     */
    private static AppActivity _activity = null;

    /**
     * 注册sdk（获取各种id）
     */
    public static void register(AppActivity activity, ApplicationInfo info) {
        _activity = activity;
        _wxAppId = info.metaData.getString("WX_APPID");
        _mwKey = info.metaData.getString("MW_KEY");
        _xlAppId = info.metaData.getString("XL_APPID");
        _swAppId = info.metaData.getString("SW_APPID");
        _ddAppId = info.metaData.getString("DD_APPID");
        _lbAppId = info.metaData.getString("LB_APPID");
        _qqAppId = info.metaData.getString("QQ_APPID");
        _buglyAppId = info.metaData.getString("BUGLY_APPID");
        _talkingDataAppId = info.metaData.getString("TALKINGDATA_APPID");

        if (_qqAppId != null && _qqAppId.length() > 7) {
            _qqAppId = _qqAppId.substring(7);
        }
        if (_buglyAppId != null && _buglyAppId.length() > 5) {
            _buglyAppId = _buglyAppId.substring(5);
        }

//        Sdk.print();

        // 下面是启动时必须先注册的
        PermissionUtils.getInstance().init(_activity);
        PermissionUtils.requestAllPermission();
        new LocationManager();
        VoiceUtil.init();
        VoiceUtil.clearVoiceFolder();
        ClipboardUtil.getInstance().initClipboardManager(_activity);
        Sdk.registerBugly();
        Sdk.registerNIM();
        Sdk.registerXianLiao();
//        Sdk.registerTalkingData();
        Sdk.registerMagicWindow();
//        Sdk.registerDingTalk();
    }

    private static void print() {
        Log.i("微信", _wxAppId);
        Log.i("魔窗", _mwKey);
        Log.i("闲聊", _xlAppId);
        Log.i("聊呗", _lbAppId);
        Log.i("钉钉", _ddAppId);
        Log.i("声网", _swAppId);
        Log.i("QQ", _qqAppId);
        Log.i("Bugly", _buglyAppId);
        Log.i("TalkingData", _talkingDataAppId);
    }

    /**
     * 注册微信
     */
    public static void registerWeChat() {
        if (_wxAppId == null) {
            return;
        }
        WeixinUtil.getInstance().register(_wxAppId);
    }

    public static void registerWeChatByAppId(String appId) {
        _wxAppId = appId;
        Sdk.registerWeChat();
    }

    /**
     * 注册魔窗
     */
    public static void registerMagicWindow() {
        if (_mwKey == null) {
            return;
        }
        MWUtil.register(_activity, _mwKey);
    }

    public static void registerMagicWindowByKey(String key) {
        _mwKey = key;
        Sdk.registerMagicWindow();
    }

    /**
     * 注册闲聊
     */
    public static void registerXianLiao() {
        if (_xlAppId == null) {
            return;
        }
        XianLiaoUtil.getInstance().register(_xlAppId);
    }

    /**
     * 注册闲聊
     */
    public static void registerXianLiaoByAppId(String appId) {
        _xlAppId = appId;
        Sdk.registerXianLiao();
    }

    /**
     * 注册声网
     */
    public static void registerAgora() {
        if (_swAppId == null || _activity == null) {
            return;
        }
        AgoraUtil.getInstance().register(_activity, _swAppId);
    }

    /**
     * 注册声网
     */
    public static void registerAgoraByAppId(String appId) {
        _swAppId = appId;
        Sdk.registerAgora();
    }


    /**
     * 注册qq
     */
    public static void registerQQ() {
        if (_qqAppId == null || _activity == null) {
            return;
        }
        QQUtil.getInstance().initQQ(_activity, _qqAppId);
    }

    public static void registerQQByAppId(String appId) {
        _qqAppId = appId;
        Sdk.registerQQ();
    }

    /**
     * 注册钉钉
     */
    public static void registerDingTalk() {
        if (_ddAppId == null) {
            return;
        }
        DDUtil.getInstance().register(_activity, _ddAppId);
    }

    public static void registerDingTalkByAppId(String appId) {
        _ddAppId = appId;
        Sdk.registerDingTalk();
    }

    /**
     * 注册聊呗
     */
    public static void registerLiaoBe() {
        if (_lbAppId == null) {
            return;
        }
        LBUtil.getInstance().register(_lbAppId);
    }

    /**
     * 注册聊呗
     */
    public static void registerLiaoBeByAppId(String appId) {
        _lbAppId = appId;
        Sdk.registerLiaoBe();
    }

    /**
     * 注册云信（初始化注册过）
     */
    public static void registerNIM() {
        SDKOptions options = new SDKOptions();
        options.sdkStorageRootPath = Cocos2dxHelper.getCocos2dxWritablePath();
        NIMClient.init(AppActivity.getContext(), null, options);
    }

    public static void registerTalkingData() {
        TalkingDataGA.init(AppActivity.getContext(), _talkingDataAppId, "Android");
    }

    /**
     * 注册bugly
     */
    public static void registerBugly() {
        Bugly.init(_activity.getApplicationContext(), _buglyAppId, false);
    }

    /**
     * 注册百度
     */
    public static void registerBaiDu() {

    }

    public static void registerBaiDuByAk() {

    }
}
