package com.gggame.quanguonn.utils;

import com.cloudaemon.libguandujni.GuanduJNI;

/**
 * 太极盾
 * Created by zhangluxin on 2017/12/15.
 */

public class TaiJiDunUtil {

    /**
     * 初始化
     */
    public static void register() {
        GuanduJNI.init();
    }

    public static int getSecurityServerIP(String HostURL, String HostPort) {
        return GuanduJNI.getSecurityServerIPAndPort(HostURL, Integer.parseInt(HostPort), 6);
    }

    public static String getHost() {
        return GuanduJNI.ServerIP;
    }

    public static int getPort() {
        return GuanduJNI.ServerPort;
    }
}
