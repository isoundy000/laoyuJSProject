package com.gggame.quanguonn.wxapi;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;

import com.gggame.quanguonn.Global;
import com.gggame.quanguonn.utils.WeixinUtil;
import com.gggame.quanguonn.utils.XianLiaoUtil;
import com.tencent.mm.opensdk.modelbase.BaseReq;
import com.tencent.mm.opensdk.modelbase.BaseResp;
import com.tencent.mm.opensdk.modelmsg.SendAuth;
import com.tencent.mm.opensdk.modelmsg.SendMessageToWX;
import com.tencent.mm.opensdk.modelmsg.ShowMessageFromWX;
import com.tencent.mm.opensdk.modelmsg.WXAppExtendObject;
import com.tencent.mm.opensdk.modelmsg.WXMediaMessage;
import com.tencent.mm.opensdk.openapi.IWXAPI;
import com.tencent.mm.opensdk.openapi.IWXAPIEventHandler;
import com.tencent.mm.opensdk.openapi.WXAPIFactory;

import org.cocos2dx.javascript.AppActivity;
import org.cocos2dx.lib.Cocos2dxActivity;

/**
 * 微信回调
 * Created by zhangluxin on 2017/11/1.
 */

public class WXEntryActivity extends Activity implements IWXAPIEventHandler {

    /**
     *
     */
    private IWXAPI mApi;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        mApi = WeixinUtil.getApiObject();
        if (mApi == null) {
            mApi = WXAPIFactory.createWXAPI(Cocos2dxActivity.getContext(), WeixinUtil.getAppId());
        }
        mApi.handleIntent(getIntent(), this);
    }

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        setIntent(intent);
        mApi.handleIntent(intent, this);
    }

    @Override
    public void onReq(BaseReq baseReq) {
        Log.d("gggame", "wx onReq!");
        if (baseReq instanceof ShowMessageFromWX.Req) {
            goToShowMsg((ShowMessageFromWX.Req) baseReq);
        }
    }

    @Override
    public void onResp(BaseResp resp) {
        Log.d("errCode is ", "======" + resp.errCode);
        switch (resp.errCode) {
            case BaseResp.ErrCode.ERR_OK:
                if (resp instanceof SendAuth.Resp)
                    WeixinUtil.getInstance().setWXLoginCode(((SendAuth.Resp) resp).code);
                if (resp instanceof SendMessageToWX.Resp)
                    Global.setTransResult(resp.transaction, "ERR_OK");
                if (resp instanceof ShowMessageFromWX.Resp) {
                    Global.setTransResult(resp.transaction, "ERR_OK");
                }
                break;
            case BaseResp.ErrCode.ERR_USER_CANCEL:
                if (resp instanceof SendMessageToWX.Resp)
                    Global.setTransResult(resp.transaction, "ERR_USER_CANCEL");
                if (resp instanceof ShowMessageFromWX.Resp) {
                    Global.setTransResult(resp.transaction, "ERR_USER_CANCEL");
                }
                break;
            case BaseResp.ErrCode.ERR_AUTH_DENIED:
                if (resp instanceof SendMessageToWX.Resp)
                    Global.setTransResult(resp.transaction, "ERR_AUTH_DENIED");
                if (resp instanceof ShowMessageFromWX.Resp) {
                    Global.setTransResult(resp.transaction, "ERR_AUTH_DENIED");
                }
                break;
            case BaseResp.ErrCode.ERR_COMM:
                if (resp instanceof SendMessageToWX.Resp)
                    Global.setTransResult(resp.transaction, "ERR_COMM");
                if (resp instanceof ShowMessageFromWX.Resp) {
                    Global.setTransResult(resp.transaction, "ERR_COMM");
                }
                break;
            case BaseResp.ErrCode.ERR_UNSUPPORT:
                if (resp instanceof SendMessageToWX.Resp)
                    Global.setTransResult(resp.transaction, "ERR_UNSUPPORT");
                if (resp instanceof ShowMessageFromWX.Resp) {
                    Global.setTransResult(resp.transaction, "ERR_UNSUPPORT");
                }
                break;
            case BaseResp.ErrCode.ERR_SENT_FAILED:
                if (resp instanceof SendMessageToWX.Resp)
                    Global.setTransResult(resp.transaction, "ERR_SENT_FAILED");
                if (resp instanceof ShowMessageFromWX.Resp) {
                    Global.setTransResult(resp.transaction, "ERR_SENT_FAILED");
                }
                break;

            default:
                break;
        }
        this.finish();
    }

    private void goToShowMsg(ShowMessageFromWX.Req showReq) {
        WXMediaMessage wxMsg = showReq.message;
        WXAppExtendObject obj = (WXAppExtendObject) wxMsg.mediaObject;

        WeixinUtil.setminiRroRoomId(obj.extInfo);
        System.out.println("extInfo=====" + obj.extInfo);

        Intent intent = new Intent(this, AppActivity.class);
        startActivity(intent);
        this.finish();
    }
}
