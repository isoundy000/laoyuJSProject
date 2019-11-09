package com.gggame.quanguonn.cxapi;

import android.os.Bundle;
import android.widget.Toast;

import com.gggame.quanguonn.utils.LBUtil;
import com.launch.topcmm.liaobeilaunch.ILiaoBeiEventHandler;
import com.launch.topcmm.liaobeilaunch.LbEntity.BaseLiaoBeiEntity;
import com.launch.topcmm.liaobeilaunch.LbEntity.LiaoBeiForwardEntity;
import com.launch.topcmm.liaobeilaunch.LbEntity.LiaoBeiLaunchEntity;
import com.launch.topcmm.liaobeilaunch.LbUtil.LiaoBeiResultCode;
import com.launch.topcmm.liaobeilaunch.LiaoBeiHandlerActivity;

/**
 * 聊呗返回
 */
public class CXEntryActivity extends LiaoBeiHandlerActivity implements ILiaoBeiEventHandler {

    public static final int AUTH = 0;
    public static final int SHARE = 1;


    public void onCreate(Bundle bundle) {
        registerEventHandler(this);
        super.onCreate(bundle);

    }

    public void onDestroy() {
        super.onDestroy();
        unregisterEventHandler(this);
    }


    @Override
    public void rsp(BaseLiaoBeiEntity baseChaoxinEntity) {
        if (baseChaoxinEntity.getResultCode() == LiaoBeiResultCode.SUCESS) {
            switch (baseChaoxinEntity.getEntityType()) {
                case AUTH:
                    //Toast.makeText(this, "launch success,access code is " + ((LiaoBeiLaunchEntity) baseChaoxinEntity).getTokenCode(), Toast.LENGTH_LONG).show();
                    LBUtil.getInstance().setLBLoginCode(((LiaoBeiLaunchEntity) baseChaoxinEntity).getTokenCode());
                    break;
                case SHARE:
//                    if (((LiaoBeiForwardEntity) baseChaoxinEntity).getImageUri() != null) {
//                        Toast.makeText(this, "share image suc ,image is" + ((LiaoBeiForwardEntity) baseChaoxinEntity).getImageUri().toString(), Toast.LENGTH_LONG).show();
//                    } else {
//                        Toast.makeText(this, "share text suc,text is  " + ((LiaoBeiForwardEntity) baseChaoxinEntity).getTextContent().toString(), Toast.LENGTH_LONG).show();
//                    }
                    if (((LiaoBeiForwardEntity) baseChaoxinEntity).getImageUri() != null) {
                        Toast.makeText(this, "分享图片成功",Toast.LENGTH_LONG).show();
                    } else {
                        Toast.makeText(this, "分享文字成功",Toast.LENGTH_LONG).show();
                    }
                    break;
            }

        } else {
            switch (baseChaoxinEntity.getResultCode()) {
                case LiaoBeiResultCode.CANCEL_AUTH:
                    Toast.makeText(this, "已取消登录", Toast.LENGTH_LONG).show();
                    break;
                case LiaoBeiResultCode.CANCEL_SHARE:
                    Toast.makeText(this, "已取消分享", Toast.LENGTH_LONG).show();
                    break;
            }
        }
        finish();
    }
}