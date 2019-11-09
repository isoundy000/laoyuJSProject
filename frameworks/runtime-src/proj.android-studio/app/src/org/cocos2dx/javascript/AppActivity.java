/****************************************************************************
 Copyright (c) 2015-2017 Chukong Technologies Inc.

 http://www.cocos2d-x.org

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/
package org.cocos2dx.javascript;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.Intent;
import android.content.pm.ActivityInfo;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.content.pm.Signature;
import android.net.Uri;
import android.provider.Settings;
import android.view.View;

import com.aliyun.security.yunceng.android.sdk.YunCeng;
import com.gggame.quanguonn.Global;
import com.gggame.quanguonn.utils.MWUtil;
import com.gggame.quanguonn.utils.Sdk;
import com.gggame.quanguonn.utils.XianLiaoUtil;

import org.cocos2dx.lib.Cocos2dxActivity;
import org.cocos2dx.lib.Cocos2dxGLSurfaceView;
import org.cocos2dx.lib.Cocos2dxHelper;


import java.net.URLConnection;

import android.os.AsyncTask;

import java.net.URL;
import java.io.*;

import android.content.Context;
import android.util.Log;

import com.gauss.recorder.SpeexPlayer;
import com.gauss.recorder.SpeexRecorder;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;


public class AppActivity extends Cocos2dxActivity {

    /**
     * 跳转uri
     */
    private static String jmpUri;

    private static Context context;

    public static Activity mActivity;

    public static Context getAppContext() {
        return context;
    }

    public static Map<String, Boolean> recorderWritingMap = new ConcurrentHashMap<String, Boolean>();

    @Override
    public Cocos2dxGLSurfaceView onCreateView() {
        Cocos2dxGLSurfaceView glSurfaceView = new Cocos2dxGLSurfaceView(this);
        // TestCpp should create stencil buffer
        glSurfaceView.setEGLConfigChooser(5, 6, 5, 0, 16, 8);

        // 防止二次注册Sdk
        if (!Sdk.isRegistered) {
            initValue();
            try {
                Sdk.register(this, getPackageManager().getApplicationInfo(getPackageName(), PackageManager.GET_META_DATA));
            } catch (PackageManager.NameNotFoundException e) {
                e.printStackTrace();
            }
            Sdk.isRegistered = true;
        }
        return glSurfaceView;
    }

    /**
     * 初始化一些值
     */
    @SuppressLint("HardwareIds")
    private void initValue() {
        try {
            Global.setUdid(Settings.Secure.getString(getContext().getContentResolver(), Settings.Secure.ANDROID_ID));
            PackageInfo pInfo = getPackageManager().getPackageInfo(getPackageName(), 0);
            Global.setPackageName(pInfo.packageName);
            Global.setVersionName(pInfo.versionName);
            Global.setVersionCode(pInfo.versionCode);
            StringBuilder sb = new StringBuilder();
            if (pInfo.signatures != null) {
                for (Signature sign : pInfo.signatures)
                    sb.append(Integer.toHexString(sign.hashCode()));
                Global.setSignature(sb.toString());
            }
            Intent intent = getIntent();
            handlerIntent(intent);
            Uri uri = intent.getData();
            if (uri != null)
                setJmpUri(uri.toString());

            mActivity = this;
            context = getApplicationContext();


        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    /**
     * 添加一个view
     *
     * @param view view
     */
    public void addView(View view) {
        mFrameLayout.addView(view);
    }

    /**
     * 删除一个view
     *
     * @param view view
     */
    public void removeView(View view) {
        mFrameLayout.removeView(view);
    }

    /**
     * 取得包名
     *
     * @return packagename
     */
    public static String getBundleId() {
        return Global.getPackageName();
    }

    /**
     * 生成udid
     *
     * @return udid
     */
    public static String fetchUDID() {
        return Global.getUdid();
    }

    /**
     * 游戏盾
     *
     * @param k key
     * @param n group
     * @return ip
     */
    public static String ni2(String k, String n) {
        StringBuffer nextIp = new StringBuffer();
        int code = YunCeng.init(k);
        int res = -1;
        if (code == 0) {
            res = YunCeng.getNextIpByGroupName(n, nextIp);
        } else {
            nextIp.append(String.valueOf(code));
        }
        return nextIp.toString();
    }

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        setIntent(intent);
        handlerIntent(intent);
        Uri uri = intent.getData();
        System.out.println("yygame");
        System.out.println(uri);
        if (uri != null && uri.toString().indexOf("mw_ck") != -1) {
            String path = uri.getPath();
            System.out.println("yygame");
            System.out.println(path);
            //if (path.matches("/\\d{6}")) {
            MWUtil.setRoomId(path.substring(1));
            //}
        }
    }

    private void handlerIntent(Intent intent) {
        String action = intent.getAction();
        if (Intent.ACTION_VIEW.equals(action)) {
            Uri uri = intent.getData();
            if (uri != null) {
                if (uri.getQueryParameter("roomId") != null) {
                    String roomToken = uri.getQueryParameter("roomToken");
                    String openId = uri.getQueryParameter("openId");
                    XianLiaoUtil.XianLiaoRoomId = uri.getQueryParameter("roomId");
                    XianLiaoUtil.XIAN_LIAO_RoomData = "roomId:" + XianLiaoUtil.XianLiaoRoomId + " roomToken:" + roomToken + " openId:" + openId;
                }
            }
        }
    }

    public static String getJmpUri() {
        return jmpUri;
    }

    public static void setJmpUri(String jmpUri) {
        AppActivity.jmpUri = jmpUri;
    }


    public static String getVersionName() {
        return Global.getVersionName();
    }

    public static void playVoice(String fileName) {
        try {
            SpeexPlayer splayer = new SpeexPlayer(Cocos2dxHelper.getCocos2dxWritablePath() + "/" + fileName);
            splayer.startPlay();
        } catch (Exception e) {

        }
    }

    public static void playVoiceByUrl(String url) {
        new DownloadFileFromURL().execute(url, "voice");
    }

    static class DownloadFileFromURL extends AsyncTask<String, String, String> {

        private String root = null;
        private String fileName = null;
        private String type = null;

        @Override
        protected void onPreExecute() {
            super.onPreExecute();
        }

        @Override
        protected String doInBackground(String... f_url) {
            int count;
            try {
                URL url = new URL(f_url[0]);
                type = f_url[1];

                root = Cocos2dxHelper.getCocos2dxWritablePath();
                if (type.equals("apk"))
//                    root = Environment.getExternalStorageDirectory().getAbsolutePath();
                    root = context.getExternalFilesDir("apk").toString();

                URLConnection conection = url.openConnection();
                conection.connect();

                InputStream input = new BufferedInputStream(url.openStream(), 8192);

                String[] arr = f_url[0].split("/");
                fileName = arr[arr.length - 1];
                OutputStream output = new FileOutputStream(root + '/' + fileName);
                byte data[] = new byte[1024];

                while ((count = input.read(data)) != -1)
                    output.write(data, 0, count);

                output.flush();
                output.close();
                input.close();
            } catch (Exception e) {
                Log.e("Error: ", e.getMessage());
            }

            return null;
        }

        @Override
        protected void onPostExecute(String file_url) {
            if (type.equals("voice")) {
                File file = new File(root + '/' + fileName);
                if (file.exists()) {
                    playVoice(fileName);
                }
            } else if (type.equals("apk")) {
                File file = new File(root + '/' + fileName);
                if (file.exists()) {
                    Intent intent = new Intent(Intent.ACTION_VIEW).setDataAndType(Uri.fromFile(file), "application/vnd.android.package-archive");
                    intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                    context.startActivity(intent);
                }
            }
        }
    }

    public static void rotate(boolean isLandscape) {
        mActivity.setRequestedOrientation(isLandscape ? ActivityInfo.SCREEN_ORIENTATION_SENSOR_LANDSCAPE : ActivityInfo.SCREEN_ORIENTATION_SENSOR_PORTRAIT);
    }
}
