package org.cocos2dx.javascript;

import android.app.Application;
import com.gggame.quanguonn.utils.AliPushUtil;

public class AppApplication extends Application {
    @Override
    public void onCreate() {
        super.onCreate();
        AliPushUtil.getInstance().init(getApplicationContext());
    }
}
