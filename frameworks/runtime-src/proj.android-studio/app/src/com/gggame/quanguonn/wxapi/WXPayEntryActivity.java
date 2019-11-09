package com.gggame.quanguonn.wxapi;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;

import com.gggame.quanguonn.Global;
import com.gggame.quanguonn.utils.WeixinUtil;
import com.tencent.mm.opensdk.modelbase.BaseReq;
import com.tencent.mm.opensdk.modelbase.BaseResp;
import com.tencent.mm.opensdk.openapi.IWXAPI;
import com.tencent.mm.opensdk.openapi.IWXAPIEventHandler;

/**
 * 微信支付回调
 * Created by zhangluxin on 2017/11/1.
 */

public class WXPayEntryActivity extends Activity implements IWXAPIEventHandler {
    private IWXAPI api;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        api = WeixinUtil.getApiObject();
        api.handleIntent(getIntent(), this);
    }

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        setIntent(intent);
        api.handleIntent(intent, this);
    }

    @Override
    public void onReq(BaseReq baseReq) {
        Log.d("gggame", "wx pay onReq!");
    }

    @Override
    public void onResp(BaseResp resp) {
        Log.d("errCode", "onPayFinish, errCode = " + resp.errCode);
        if (resp.errCode == 0) {
            Global.setWxPayCode("sucess");
        } else {
            Global.setWxPayCode("failed");
        }

        this.finish();
    }
}
