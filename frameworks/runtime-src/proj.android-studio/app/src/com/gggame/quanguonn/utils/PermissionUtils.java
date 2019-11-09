package com.gggame.quanguonn.utils;

import android.Manifest;
import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.pm.PackageManager;
import android.support.v4.app.ActivityCompat;
import android.support.v4.content.ContextCompat;

import java.util.ArrayList;
import java.util.List;

/**
 * 权限管理
 * Created by zhangluxin on 2017/11/1.
 */
public class PermissionUtils {
    @SuppressLint("StaticFieldLeak")
    private static Activity mActivity;
    @SuppressLint("StaticFieldLeak")
    private static PermissionUtils instance;

    /**
     * 单例
     *
     * @return 单例xOO
     */
    public static PermissionUtils getInstance() {
        if (instance == null) {
            instance = new PermissionUtils();
        }
        return instance;
    }

    /**
     * 初始化
     *
     * @param activity AppActivity
     */
    public void init(Activity activity) {
        mActivity = activity;
    }

    /**
     * 是否有权限
     *
     * @param target 权限
     * @return 有没有
     */
    public static boolean hasPermission(String target) {
        return ContextCompat.checkSelfPermission(mActivity, target) == PackageManager.PERMISSION_GRANTED;
    }

    /**
     * 请求权限
     *
     * @param target 权限
     */
    public static void requestPermission(String target) {
        if (ContextCompat.checkSelfPermission(mActivity, target) != PackageManager.PERMISSION_GRANTED) {
            ActivityCompat.requestPermissions(mActivity, new String[]{target}, 1);
        }
    }

    /**
     * 请求权限
     */
    public static void requestPermissions(String strs) {
        String[] checkPermissions = strs.split("requestPermissions;");
        List<String> permissionList = new ArrayList<>();
        for (int i = 0; i < checkPermissions.length; i++) {
            if (ContextCompat.checkSelfPermission(mActivity, checkPermissions[i]) != PackageManager.PERMISSION_GRANTED) {
                permissionList.add(checkPermissions[i]);
            }
        }
        String[] permissions = permissionList.toArray(new String[permissionList.size()]);
        ActivityCompat.requestPermissions(mActivity, permissions, 1);
    }

    /**
     * 请求所有权限
     */
    public static void requestAllPermission() {
        System.out.println("PermissionUtils.requestAllPermission");

        String[] checkPermissions = {
                Manifest.permission.ACCESS_FINE_LOCATION,
                Manifest.permission.CAMERA,
                Manifest.permission.ACCESS_NOTIFICATION_POLICY,
                Manifest.permission.BIND_NOTIFICATION_LISTENER_SERVICE,
                Manifest.permission.READ_EXTERNAL_STORAGE,
                Manifest.permission.WRITE_EXTERNAL_STORAGE,
                Manifest.permission.RECORD_AUDIO
        };
        List<String> permissionList = new ArrayList<>();
        for (int i = 0; i < checkPermissions.length; i++) {
            if (ContextCompat.checkSelfPermission(mActivity, checkPermissions[i]) != PackageManager.PERMISSION_GRANTED) {
                permissionList.add(checkPermissions[i]);
            }
        }
        String[] permissions = permissionList.toArray(new String[permissionList.size()]);
        ActivityCompat.requestPermissions(mActivity, permissions, 1);
    }
}
