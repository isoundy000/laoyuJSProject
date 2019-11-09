package com.gggame.quanguonn;

import android.graphics.Bitmap;

import java.io.ByteArrayOutputStream;
import java.util.HashMap;

/**
 * 参数定义
 * Created by zhangluxin on 2017/11/1.
 */
public class Global {
    /**
     * 微信支付code
     */
    private static String wxPayCode;

    /**
     * udid
     */
    private static String udid;

    /**
     * 包名
     */
    private static String packageName;

    /**
     * 版本号
     */
    private static String versionName;

    /**
     * 版本code
     */
    private static int versionCode;

    /**
     * 签名
     */
    private static String signature;

    /**
     * 结果
     */
    private static final HashMap<String, String> transResultMap = new HashMap<String, String>();

    /**
     * 设置结果
     *
     * @param key   key
     * @param value value
     */
    public static void setTransResult(String key, String value) {
        transResultMap.put(key, value);
    }

    /**
     * 返回结果
     *
     * @param key key
     * @return value
     */
    public static String getTransResult(String key) {
        if (!transResultMap.containsKey(key))
            return "";
        return transResultMap.get(key);
    }

    /**
     * 图片转byte数组
     *
     * @param bmp         图片
     * @param needRecycle needRecycle
     * @return byte数组
     */
    public static byte[] bmpToByteArray(final Bitmap bmp, final boolean needRecycle) {
        ByteArrayOutputStream output = new ByteArrayOutputStream();
        bmp.compress(Bitmap.CompressFormat.JPEG, 60, output);
        if (needRecycle) {
            bmp.recycle();
        }

        byte[] result = output.toByteArray();
        try {
            output.close();
        } catch (Exception e) {
            e.printStackTrace();
        }

        return result;
    }

    public static String getWxPayCode() {
        return wxPayCode;
    }

    public static void setWxPayCode(String wxPayCode) {
        Global.wxPayCode = wxPayCode;
    }

    public static String getUdid() {
        return udid;
    }

    public static void setUdid(String udid) {
        Global.udid = udid;
    }

    public static String getPackageName() {
        return packageName;
    }

    public static void setPackageName(String packageName) {
        Global.packageName = packageName;
    }

    public static String getVersionName() {
        return versionName;
    }

    public static void setVersionName(String versionName) {
        Global.versionName = versionName;
    }

    public static int getVersionCode() {
        return versionCode;
    }

    public static void setVersionCode(int versionCode) {
        Global.versionCode = versionCode;
    }

    public static String getSignature() {
        return signature;
    }

    public static void setSignature(String signature) {
        Global.signature = signature;
    }
}
