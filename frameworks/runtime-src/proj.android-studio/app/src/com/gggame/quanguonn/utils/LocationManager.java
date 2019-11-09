package com.gggame.quanguonn.utils;

import android.content.Context;
import android.util.Log;

import com.baidu.location.BDLocation;
import com.baidu.location.BDLocationListener;
import com.baidu.location.LocationClient;
import com.baidu.location.LocationClientOption;

import org.cocos2dx.lib.Cocos2dxActivity;

/**
 * 定位工具
 * Created by zhangluxin on 2017/11/1.
 */

public class LocationManager implements BDLocationListener {

    /**
     * 位置监控客户端
     */
    private static LocationClient mLocationClient;
    /**
     * 详细地址
     */
    private static String locationInfo = "";
    /**
     * 经纬度
     */
    private static String locationTube = "";

    public LocationManager() {
        mLocationClient = new LocationClient(Cocos2dxActivity.getContext());
        mLocationClient.registerLocationListener(this);
        initOption();
    }

    private void initOption() {
        LocationClientOption option = new LocationClientOption();
        option.setLocationMode(LocationClientOption.LocationMode.Hight_Accuracy);//可选，默认高精度，设置定位模式，高精度，低功耗，仅设备
        option.setCoorType("bd09ll");//可选，默认gcj02，设置返回的定位结果坐标系
        int span = 1000;
        option.setScanSpan(span);//可选，默认0，即仅定位一次，设置发起定位请求的间隔需要大于等于1000ms才是有效的
        option.setIsNeedAddress(true);//可选，设置是否需要地址信息，默认不需要
        option.setOpenGps(true);//可选，默认false,设置是否使用gps
        option.setLocationNotify(true);//可选，默认false，设置是否当gps有效时按照1S1次频率输出GPS结果
        option.setIsNeedLocationDescribe(true);//可选，默认false，设置是否需要位置语义化结果，可以在BDLocation.getLocationDescribe里得到，结果类似于“在北京天安门附近”
        option.setIsNeedLocationPoiList(true);//可选，默认false，设置是否需要POI结果，可以在BDLocation.getPoiList里得到
        option.setIgnoreKillProcess(false);//可选，默认true，定位SDK内部是一个SERVICE，并放到了独立进程，设置是否在stop的时候杀死这个进程，默认不杀死
        option.SetIgnoreCacheException(false);//可选，默认false，设置是否收集CRASH信息，默认收集
        option.setEnableSimulateGps(false);//可选，默认false，设置是否需要过滤gps仿真结果，默认需要
        mLocationClient.setLocOption(option);
    }


    @Override
    public void onReceiveLocation(BDLocation location) {
        if (location.getLocType() == BDLocation.TypeGpsLocation || location.getLocType() == BDLocation.TypeNetWorkLocation) {
            locationInfo = location.getAddrStr();
            locationTube = location.getLatitude() + "," + location.getLongitude();
        } else {
            locationInfo = "";
        }
        mLocationClient.stop();
    }

    @Override
    public void onConnectHotSpotMessage(String connectWifiMac, int hotSpotState) {
        Log.i("gggame", "connectWifiMac = " + connectWifiMac);
        Log.i("gggame", "hotSpotState = " + hotSpotState);
    }

    /**
     * @return 用户是否开启了定位
     */
    public static boolean isUserOpen() {
        android.location.LocationManager locationManager = (android.location.LocationManager) Cocos2dxActivity.getContext().getSystemService(Context.LOCATION_SERVICE);
        boolean gps = locationManager.isProviderEnabled(android.location.LocationManager.GPS_PROVIDER);
        boolean network = locationManager.isProviderEnabled(android.location.LocationManager.NETWORK_PROVIDER);
        return gps || network;
    }

    /**
     * 开始地址查询
     */
    public static void startLocation() {
        try {
            mLocationClient.start();
        } catch (Exception e) {
//            PermissionUtils.setPermissionError("locationError");
        }
    }

    /**
     * 返回经纬度
     *
     * @return 经纬度
     */
    public static String getCurLocation() {
        return locationTube;
    }

    /**
     * 返回详细地址
     *
     * @return 详细地址
     */
    public static String getCurLocationInfo() {
        return locationInfo;
    }

    /**
     * 清除地址信息
     */
    public static void clearCurLocation() {
        locationInfo = "";
        locationTube = "";
    }
}
