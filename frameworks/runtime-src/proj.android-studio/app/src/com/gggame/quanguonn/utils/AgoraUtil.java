package com.gggame.quanguonn.utils;

import android.os.Handler;
import android.os.Message;
import android.view.Gravity;
import android.view.SurfaceView;
import android.view.View;
import android.widget.FrameLayout;

import io.agora.rtc.Constants;
import io.agora.rtc.IRtcEngineEventHandler;
import io.agora.rtc.RtcEngine;
import io.agora.rtc.video.VideoCanvas;

import org.cocos2dx.javascript.AppActivity;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.HashMap;
import java.util.Iterator;

/**
 * 视频相关
 * Created by zhangluxin on 2017/6/7.
 */
public class AgoraUtil {

    private RtcEngine mRtcEngine = null;
    private AppActivity appActivity = null;
    private HashMap<Integer, HashMap<String, String>> viewDict = null;
    private HashMap<Integer, SurfaceView> allViews = null;
    private HashMap<Integer, Boolean> userIsHasVideoDataMap = null;

    private static final int VIDEO_INIT = 0X1001;
    private static final int VIDEO_REMOTE = 0X1002;
    private static final int VIDEO_SHOW = 0X1003;
    private static final int VIDEO_HIDE = 0X1004;
    private static final int VIDEO_PREVIEW = 0X1005;
    private static final int VIDEO_VIEW_TO_CENTER = 0X1006;
    private static final int VIDEO_VIEW_TO_NORMAL = 0X1007;

    /**
     * 单例
     */
    private static AgoraUtil instance = null;

    /**
     * 单例
     */
    public static AgoraUtil getInstance() {
        if (instance == null) {
            instance = new AgoraUtil();
        }
        return instance;
    }


    public void register(AppActivity activity, String appId) {
        try {
            appActivity = activity;
            mRtcEngine = RtcEngine.create(appActivity.getApplicationContext(), appId, mRtcEventHandler);
            mRtcEngine.setChannelProfile(Constants.CHANNEL_PROFILE_COMMUNICATION);
            mRtcEngine.enableVideo();
            mRtcEngine.setVideoProfile(Constants.VIDEO_PROFILE_180P, false);
        } catch (Exception e) {

        }

    }

    public static void initVideoView(String viewData) {
        try {
            JSONObject jsonObject = new JSONObject(viewData);
            AgoraUtil.getInstance().viewDict = new HashMap<Integer, HashMap<String, String>>();
            Iterator iterator = jsonObject.keys();
            while (iterator.hasNext()) {
                String key = (String) iterator.next();
                String value = jsonObject.getString(key);
                JSONObject jsonObject1 = new JSONObject(value);
                Iterator iterator1 = jsonObject1.keys();
                HashMap<String, String> hashMap = new HashMap<String, String>();
                while (iterator1.hasNext()) {
                    String key1 = (String) iterator1.next();
                    String value1 = jsonObject1.getString(key1);
                    hashMap.put(key1, value1);
                }
                AgoraUtil.getInstance().viewDict.put(Integer.parseInt(key), hashMap);
            }
//            AgoraUtil.getInstance().initVideoView();
            AgoraUtil.getInstance().mVideohandler.sendEmptyMessage(VIDEO_INIT);
        } catch (JSONException e) {
            System.out.println("************** viewData is error!!!");
        }
    }

    private void initVideoView() {
        if (viewDict != null && viewDict.size() > 0) {

            allViews = new HashMap<Integer, SurfaceView>();
            for (int key : viewDict.keySet()) {
                HashMap<String, Integer> data = transPos(viewDict.get(key));
                SurfaceView _view = RtcEngine.CreateRendererView(appActivity.getApplicationContext());
                int x = data.get("x");
                int y = data.get("y");
                int width = data.get("width");
                int height = data.get("height");
                FrameLayout.LayoutParams params = new FrameLayout.LayoutParams(width, height);
                params.gravity = Gravity.LEFT | Gravity.TOP;
                params.leftMargin = x;
                params.topMargin = y;
                _view.setLayoutParams(params);
                _view.setZOrderOnTop(true);
                _view.setZOrderMediaOverlay(true);
                appActivity.addView(_view);
                _view.setVisibility(View.INVISIBLE);
                allViews.put(key, _view);
            }
            userIsHasVideoDataMap = new HashMap<Integer, Boolean>();
        }
    }

    private void releaseAllViews() {
        appActivity.runOnUiThread(new Runnable() {
            @Override
            public void run() {
                if (allViews != null && allViews.size() > 0) {
                    for (int key : allViews.keySet()) {
                        SurfaceView _view = allViews.get(key);
                        appActivity.removeView(_view);
                    }
                    allViews.clear();
                    allViews = null;
                }
            }
        });
    }

    private final IRtcEngineEventHandler mRtcEventHandler = new IRtcEngineEventHandler() {
//        @Override
//        public void onFirstLocalVideoFrame(int width, int height, int elapsed) {
//            System.out.println("11111");
//        }
//
//        @Override
//        public void onUserJoined(int uid, int elapsed) {
//            Message message = new Message();
//            message.what = VIDEO_REMOTE;
//            message.obj = new String[]{String.valueOf(uid)};
//            AgoraUtil.getInstance().mVideohandler.sendMessage(message);
//        }

        @Override
        public void onFirstRemoteVideoDecoded(int uid, int width, int height, int elapsed) {
            Message message = new Message();
            message.what = VIDEO_REMOTE;
            message.obj = new String[]{String.valueOf(uid)};
            AgoraUtil.getInstance().mVideohandler.sendMessage(message);
        }
    };

    private HashMap<String, Integer> transPos(HashMap<String, String> map) {
        int frame_width = appActivity.getGLSurfaceView().getWidth();
        int frame_height = appActivity.getGLSurfaceView().getHeight();
        float scale = frame_width / 1280.0f;

        int x = Math.round(Float.parseFloat(map.get("x")) * scale);
        int y = Math.round((720.0f - Float.parseFloat(map.get("y"))) * scale);
        int width = Math.round(Float.parseFloat(map.get("width")) * scale);
        int height = Math.round(Float.parseFloat(map.get("height")) * scale);

        HashMap<String, Integer> new_map = new HashMap<String, Integer>();
        new_map.put("x", x);
        new_map.put("y", y);
        new_map.put("width", width);
        new_map.put("height", height);
        return new_map;
    }

    private void loadAgoraKit(String roomid, String uid) {
        mRtcEngine.setupLocalVideo(new VideoCanvas(allViews.get(Integer.parseInt(uid)), VideoCanvas.RENDER_MODE_HIDDEN, Integer.parseInt(uid)));
        mRtcEngine.startPreview();
        allViews.get(Integer.parseInt(uid)).setVisibility(View.VISIBLE);
        userIsHasVideoDataMap.put(Integer.parseInt(uid), true);
        mRtcEngine.joinChannel(null, roomid, null, Integer.parseInt(uid));
    }

    private void _changeViewSizeToScreenCenter(int uid, int _x, int _y, int _width, int _height) {
        SurfaceView _view = allViews.get(uid);
        if (_view != null) {
            int frame_width = appActivity.getGLSurfaceView().getWidth();
            int frame_height = appActivity.getGLSurfaceView().getHeight();
            float scale = frame_width / 1280.0f;

            int x = Math.round(_x * scale);
            int y = Math.round((720.0f - _y) * scale);
            int width = Math.round(_width * scale);
            int height = Math.round(_height * scale);

            FrameLayout.LayoutParams params = new FrameLayout.LayoutParams(width, height);
            params.gravity = Gravity.LEFT | Gravity.TOP;
            params.leftMargin = x;
            params.topMargin = y;
            _view.setLayoutParams(params);

            _view.setVisibility(View.VISIBLE);
        }
    }

    private void _changeViewSizeToNormal(int uid) {
        HashMap<String, Integer> data = transPos(viewDict.get(uid));
        SurfaceView _view = allViews.get(uid);
        int x = data.get("x");
        int y = data.get("y");
        int width = data.get("width");
        int height = data.get("height");
        FrameLayout.LayoutParams params = new FrameLayout.LayoutParams(width, height);
        params.gravity = Gravity.LEFT | Gravity.TOP;
        params.leftMargin = x;
        params.topMargin = y;
        _view.setLayoutParams(params);
    }

    public static void openVideo(String roomid, String uid) {
        Message message = new Message();
        message.what = VIDEO_PREVIEW;
        message.obj = new String[]{String.valueOf(roomid), String.valueOf(uid)};
        AgoraUtil.getInstance().mVideohandler.sendMessage(message);
    }

    private void setupRemoteVideo(int uid) {
        allViews.get(uid).setVisibility(View.VISIBLE);
        if (userIsHasVideoDataMap.get(uid) == null) {
            userIsHasVideoDataMap.put(uid, true);
        }
        mRtcEngine.setupRemoteVideo(new VideoCanvas(allViews.get(uid), VideoCanvas.RENDER_MODE_HIDDEN, uid));
    }

    private Handler mVideohandler = new Handler() {
        @Override
        public void handleMessage(Message msg) {
            String[] obj = (String[]) msg.obj;
            switch (msg.what) {
                case VIDEO_INIT:
                    initVideoView();
                    break;
                case VIDEO_REMOTE:
                    setupRemoteVideo(Integer.parseInt(obj[0]));
                    break;
                case VIDEO_SHOW:
                    _showAllVideo();
                    break;
                case VIDEO_HIDE:
                    _hideAllVideo();
                    break;
                case VIDEO_PREVIEW:
                    loadAgoraKit(obj[0], obj[1]);
                    break;
                case VIDEO_VIEW_TO_CENTER:
                    _changeViewSizeToScreenCenter(Integer.parseInt(obj[0]), Integer.parseInt(obj[1]), Integer.parseInt(obj[2]), Integer.parseInt(obj[3]), Integer.parseInt(obj[4]));
                    break;
                case VIDEO_VIEW_TO_NORMAL:
                    _changeViewSizeToNormal(Integer.parseInt(obj[0]));
                    break;
            }
        }
    };

    private void _showAllVideo() {
        if (AgoraUtil.getInstance().allViews != null && AgoraUtil.getInstance().allViews.size() > 0) {
            for (int key : AgoraUtil.getInstance().allViews.keySet()) {
                if (userIsHasVideoDataMap.get(key) != null && userIsHasVideoDataMap.get(key) == true) {
                    SurfaceView _view = AgoraUtil.getInstance().allViews.get(key);
                    _view.setVisibility(View.VISIBLE);
                }
            }
        }
    }

    private void _hideAllVideo() {
        if (AgoraUtil.getInstance().allViews != null && AgoraUtil.getInstance().allViews.size() > 0) {
            for (int key : AgoraUtil.getInstance().allViews.keySet()) {
                SurfaceView _view = AgoraUtil.getInstance().allViews.get(key);
                _view.setVisibility(View.INVISIBLE);
            }
        }
    }

    public static void hideAllVideo() {
        AgoraUtil.getInstance().mVideohandler.sendEmptyMessage(VIDEO_HIDE);
    }

    public static void showAllVideo() {
        AgoraUtil.getInstance().mVideohandler.sendEmptyMessage(VIDEO_SHOW);
    }

    public static void closeVideo() {
        AgoraUtil.getInstance().mRtcEngine.setupLocalVideo(null);
        AgoraUtil.getInstance().mRtcEngine.leaveChannel();
        AgoraUtil.getInstance().mRtcEngine.stopPreview();
        AgoraUtil.getInstance().releaseAllViews();
    }

    public static void pause() {
        AgoraUtil.getInstance().mRtcEngine.muteAllRemoteAudioStreams(true);
        AgoraUtil.getInstance().mRtcEngine.muteAllRemoteVideoStreams(true);
        AgoraUtil.getInstance().mRtcEngine.muteLocalAudioStream(true);
        AgoraUtil.getInstance().mRtcEngine.muteLocalVideoStream(true);
    }

    public static void resume() {
        AgoraUtil.getInstance().mRtcEngine.muteAllRemoteAudioStreams(false);
        AgoraUtil.getInstance().mRtcEngine.muteAllRemoteVideoStreams(false);
        AgoraUtil.getInstance().mRtcEngine.muteLocalAudioStream(false);
        AgoraUtil.getInstance().mRtcEngine.muteLocalVideoStream(false);
    }

    /**
     * 玩家视频窗口置于屏幕中间放大
     *
     * @param uid
     */
    public static void changeViewSizeToScreenCenter(String uid, String x, String y, String width, String height) {
        Message message = new Message();
        message.what = VIDEO_VIEW_TO_CENTER;
        message.obj = new String[]{uid, x, y, width, height};
        AgoraUtil.getInstance().mVideohandler.sendMessage(message);
    }

    /**
     * 玩家视频窗口恢复最初尺寸
     *
     * @param uid
     */
    public static void changeViewSizeToNormal(String uid) {
        Message message = new Message();
        message.what = VIDEO_VIEW_TO_NORMAL;
        message.obj = new String[]{uid};
        AgoraUtil.getInstance().mVideohandler.sendMessage(message);
    }

    public static void muteRemoteAudioStream(String uid, boolean mute) {
        AgoraUtil.getInstance().mRtcEngine.muteRemoteAudioStream(Integer.parseInt(uid), mute);
    }

    public static void muteRemoteVideoStream(String uid, boolean mute) {
        AgoraUtil.getInstance().mRtcEngine.muteRemoteVideoStream(Integer.parseInt(uid), mute);
    }

    public static void muteLocalAudioStream(boolean mute) {
        AgoraUtil.getInstance().mRtcEngine.muteLocalAudioStream(mute);
    }

    public static void muteLocalVideoStream(boolean mute) {
        AgoraUtil.getInstance().mRtcEngine.muteLocalVideoStream(mute);
    }
}