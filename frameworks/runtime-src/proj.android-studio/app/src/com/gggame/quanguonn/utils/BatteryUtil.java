package com.gggame.quanguonn.utils;

import android.content.Intent;
import android.content.IntentFilter;
import android.os.BatteryManager;

import org.cocos2dx.lib.Cocos2dxActivity;

/**
 * 电池工具
 * Created by zhangluxin on 2017/11/1.
 */

public class BatteryUtil {
    public static String getBatteryInfo() {
        IntentFilter intentFilter = new IntentFilter(Intent.ACTION_BATTERY_CHANGED);
        Intent batteryStatus = Cocos2dxActivity.getContext().registerReceiver(null, intentFilter);

        if (batteryStatus != null) {
            int status = batteryStatus.getIntExtra(BatteryManager.EXTRA_STATUS, -1);

            // 当前剩余电量
            int level = batteryStatus.getIntExtra(BatteryManager.EXTRA_LEVEL, -1);
            // 电量最大值
            int scale = batteryStatus.getIntExtra(BatteryManager.EXTRA_SCALE, -1);
            // 电量百分比
            float batteryPercent = level / (float) scale * 100;

            return String.format("%d-%.2f", status, batteryPercent);
        }
        return "";
    }
}
