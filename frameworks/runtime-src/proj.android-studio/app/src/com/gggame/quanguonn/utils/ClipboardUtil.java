package com.gggame.quanguonn.utils;

import android.content.ClipData;
import android.content.ClipboardManager;
import android.content.Context;
import android.os.Build;

/**
 * 剪切板工具
 * Created by zhangluxin on 2017/11/1.
 */

public class ClipboardUtil {
    private static ClipboardUtil cu = null;

    private static ClipboardManager cm = null;

    public static ClipboardUtil getInstance() {
        if (cu == null) {
            cu = new ClipboardUtil();
        }
        return cu;
    }

    public static String getPasteBoard() {
        if (cm != null) {
            try {
                ClipData data = cm.getPrimaryClip();
                ClipData.Item item = data.getItemAt(0);
                return item.getText().toString();
            } catch (Exception e) {
                return "";
            }
        }
        return "";
    }

    public void initClipboardManager(Context context) {
        cm = (ClipboardManager) context.getSystemService(Context.CLIPBOARD_SERVICE);
    }

    public static void clipboardCopyText(String text) {
        if (cm != null) {
            try {
                ClipData myClip;
                if (Build.VERSION.SDK_INT >= 11) {  // Build.VERSION_CODES.HONEYCOMB
                    myClip = ClipData.newPlainText("text", text);
                    cm.setPrimaryClip(myClip);
                }
            } catch (Exception e) {
                System.out.println(e.toString());
            }
        }
    }

    public static int clipboardTextLength(Context context) {
        ClipboardManager cm = (ClipboardManager) context.getSystemService(Context.CLIPBOARD_SERVICE);
        CharSequence text = cm != null ? cm.getText() : null;
        return text != null ? text.length() : 0;
    }

    public static CharSequence pasteToResult(Context context) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.HONEYCOMB) {
            ClipData clipData = ((android.content.ClipboardManager) context
                    .getSystemService(Context.CLIPBOARD_SERVICE))
                    .getPrimaryClip();
            if ((clipData == null) || (clipData.getItemCount() <= 0)) {
                return null;
            }

            ClipData.Item item = clipData.getItemAt(0);
            if (item == null) {
                return null;
            }
            return item.getText();
        }

        return ((android.text.ClipboardManager) context.getSystemService(Context.CLIPBOARD_SERVICE)).getText();
    }
}
