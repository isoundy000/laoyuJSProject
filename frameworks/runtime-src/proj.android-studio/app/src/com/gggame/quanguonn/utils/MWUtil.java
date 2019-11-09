package com.gggame.quanguonn.utils;

import android.app.Activity;
import android.content.Context;
import android.net.Uri;
import java.util.Map;
import cn.magicwindow.MLink;
import cn.magicwindow.MWConfiguration;
import cn.magicwindow.MagicWindowSDK;
import cn.magicwindow.mlink.MLinkCallback;

/**
 * 魔窗工具
 * Created by zhangluxin on 2017/11/1.
 */

public class MWUtil {
    /**
     * 房间号
     */
    private static String roomid;

    /**
     * 注册
     */
    public static void register(Activity activity, String mwKey) {
        initMW(activity);
        registerMlink(activity, mwKey);
        if (activity.getIntent().getData() != null) {
            MLink.getInstance(activity).router(activity, activity.getIntent().getData());
        }
    }

    private static void initMW(Activity activity) {
        MWConfiguration config = new MWConfiguration(activity);
        config.setLogEnable(false);
        config.setSharePlatform(MWConfiguration.ORIGINAL);
        MagicWindowSDK.initSDK(config);

    }

    private static void registerMlink(Context context, String mwKey) {
        MLink.getInstance(context).registerDefault(new MLinkCallback() {
            @Override
            public void execute(Map<String, String> map, Uri uri, Context context) {
            }
        });
        MLink.getInstance(context).register(mwKey, new MLinkCallback() {
            @Override
            public void execute(Map<String, String> map, Uri uri, Context context) {
                roomid = map.get("roomid");
            }
        });
    }

    public static String getRoomId() {
        String tempRoomId = String.valueOf(MWUtil.roomid);
        MWUtil.roomid = null;
        return tempRoomId;
    }

    public static void setRoomId(String roomid) {
        MWUtil.roomid = roomid;
    }

    public static void clearRoomId() {
        MWUtil.roomid = null;
    }
}
