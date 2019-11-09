package com.gggame.quanguonn.utils;

import android.media.AudioManager;
import android.os.Handler;

import com.loopj.android.http.AsyncHttpClient;
import com.loopj.android.http.BinaryHttpResponseHandler;
import com.netease.nimlib.sdk.media.player.AudioPlayer;
import com.netease.nimlib.sdk.media.player.OnPlayListener;
import com.netease.nimlib.sdk.media.record.AudioRecorder;
import com.netease.nimlib.sdk.media.record.IAudioRecordCallback;
import com.netease.nimlib.sdk.media.record.RecordType;

import org.cocos2dx.lib.Cocos2dxActivity;
import org.cocos2dx.lib.Cocos2dxHelper;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.Random;

import cz.msebera.android.httpclient.Header;

/**
 * 声音工具
 * Created by zhangluxin on 2017/11/1.
 */

public class VoiceUtil {
    private static final int MAX_RECORD_SECONDS = 60;
    private static final int RECORD_STATUS_END = 0;
    private static final int RECORD_STATUS_RECORDING = 1;
    private static final int RECORD_STATUS_RECORD_SUCCESS = 2;

    private static AudioRecorder recorder = null;
    private static String curSavedVoiceFilePath = null;

    private static int curRecordStatus = 0;

    public static void clearVoiceFolder() {
        File dir = new File(Cocos2dxHelper.getCocos2dxWritablePath() + "/audio");
        if (!dir.exists()) {
            dir.mkdir();
            return;
        }
        File[] childFile = dir.listFiles();
        for (File file : childFile)
            file.delete();
    }

    public static void init() {
        recorder = new AudioRecorder(
                Cocos2dxActivity.getContext(),
                RecordType.AAC,
                MAX_RECORD_SECONDS,
                new IAudioRecordCallback() {
                    @Override
                    public void onRecordReady() {

                    }

                    @Override
                    public void onRecordStart(File file, RecordType recordType) {
                        curRecordStatus = RECORD_STATUS_RECORDING;
                    }

                    @Override
                    public void onRecordSuccess(File file, long l, RecordType recordType) {
                        curSavedVoiceFilePath = file.getAbsolutePath();
                        curRecordStatus = RECORD_STATUS_RECORD_SUCCESS;
                    }

                    @Override
                    public void onRecordFail() {
                        curRecordStatus = RECORD_STATUS_END;
                    }

                    @Override
                    public void onRecordCancel() {
                        curRecordStatus = RECORD_STATUS_END;
                    }

                    @Override
                    public void onRecordReachedMaxTime(int i) {

                    }
                }
        );
    }

    public static void startRecord() {
        if (!isRecording()) {
            curSavedVoiceFilePath = null;
            try {
                recorder.startRecord();
            } catch (Exception e) {
//                PermissionUtils.setPermissionError("voiceError");
            }
        }
    }

    public static void cancelRecord() {
        if (recorder != null)
            recorder.completeRecord(true);
    }

    public static void stopRecord() {
        if (recorder != null)
            recorder.completeRecord(false);
    }

    public static boolean isRecording() {
        return recorder != null && recorder.isRecording();
    }

    public static int getCurrentAmplitude() {
        if (recorder == null)
            return 0;
        if (recorder.isRecording())
            return recorder.getCurrentRecordMaxAmplitude();
        return 0;
    }

    public static void play(String filePath) {
        // 构造播放器对象
        AudioPlayer player = new AudioPlayer(Cocos2dxActivity.getContext(), filePath, new OnPlayListener() {
            // 音频转码解码完成，会马上开始播放了
            public void onPrepared() {
            }

            // 播放结束
            public void onCompletion() {
            }

            // 播放被中断了
            public void onInterrupt() {
            }

            // 播放过程中出错。参数为出错原因描述
            public void onError(String error) {
            }

            // 播放进度报告，每隔 500ms 会回调一次，告诉当前进度。 参数为当前进度，单位为毫秒，可用于更新 UI
            public void onPlaying(long curPosition) {
            }
        });

        player.start(AudioManager.STREAM_MUSIC);
    }

    public static int getCurRecordStatus() {
        return curRecordStatus;
    }

    public static void setCurRecordStatus(int curRecordStatus) {
        VoiceUtil.curRecordStatus = curRecordStatus;
    }

    public static String getCurSavedVoiceFilePath() {
        return curSavedVoiceFilePath;
    }

    public static void setCurSavedVoiceFilePath(String curSavedVoiceFilePath) {
        VoiceUtil.curSavedVoiceFilePath = curSavedVoiceFilePath;
    }

    public static void playVoiceByUrl(final String url) {
        Handler handler = new Handler(Cocos2dxActivity.getContext().getMainLooper());
        handler.post(new Runnable() {
            @Override
            public void run() {
                final String filePath = Cocos2dxHelper.getCocos2dxWritablePath() + "/audio/d" + String.valueOf(new Random().nextLong());
                AsyncHttpClient client = new AsyncHttpClient();
                String[] fileTypes = new String[]{"application/x-www-form-urlencoded"};
                client.get(url, new BinaryHttpResponseHandler(fileTypes) {
                    @Override
                    public void onSuccess(int i, Header[] headers, byte[] bytes) {
                        try {
                            FileOutputStream os = new FileOutputStream(filePath, true);
                            os.write(bytes);
                            os.close();

                            play(filePath);
                        } catch (FileNotFoundException e) {
                            e.printStackTrace();
                        } catch (IOException e) {
                            e.printStackTrace();
                        }
                    }

                    @Override
                    public void onFailure(int i, Header[] headers, byte[] bytes, Throwable throwable) {

                    }
                });
            }
        });
    }
}
