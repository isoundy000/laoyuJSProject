package com.gggame.quanguonn.utils;

import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.pm.ApplicationInfo;
import android.content.pm.PackageManager;
import android.os.BatteryManager;
import android.text.TextUtils;
import android.util.Log;

import org.cocos2dx.javascript.AppActivity;

import com.gggame.quanguonn.Global;

/**
 * 通用工具
 * Created by zhangluxin on 2018/3/30.
 */

public class CommonUtil {
    /**
     * 取得電池電量
     *
     * @return 剩餘電量
     */
    public static String getBatteryLevel() {
        Intent batteryInfoIntent = AppActivity.getAppContext().registerReceiver(null, new IntentFilter(Intent.ACTION_BATTERY_CHANGED));
        int level = 0;
        if (batteryInfoIntent != null) {
            level = batteryInfoIntent.getIntExtra(BatteryManager.EXTRA_LEVEL, 100);
        }
        return String.valueOf(level);
    }

    /**
     * 取得udid
     *
     * @return udid
     */
    public static String fetchUDID() {
        return Global.getUdid();
    }

    /**
     * 判断是否有sd卡
     *
     * @return 是否有sd卡
     */
    public static boolean isHaveSDCard() {
        String SDState = android.os.Environment.getExternalStorageState();
        return SDState.equals(android.os.Environment.MEDIA_MOUNTED);
    }

    /**
     * 打开指定app
     *
     * @return 是否打开成功
     */
    public static boolean openApp(String packageName) {
        Log.i("openApp：", packageName);
        if (TextUtils.isEmpty(packageName)) {
            return false;
        }
        try {
            Context context = AppActivity.getAppContext();
            ApplicationInfo info = context.getPackageManager().getApplicationInfo(packageName, PackageManager.GET_UNINSTALLED_PACKAGES);
            Intent intent = context.getPackageManager().getLaunchIntentForPackage(packageName);
            if (intent != null) {
                intent.putExtra("type", "110");
                intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                context.startActivity(intent);
            }
            return true;
        } catch (PackageManager.NameNotFoundException e) {
            e.printStackTrace();
            return false;
        }
    }
}
