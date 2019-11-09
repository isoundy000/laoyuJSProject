package com.gggame.quanguonn.utils;
import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.net.Uri;
import android.os.Environment;
import android.util.Log;
import org.cocos2dx.javascript.AppActivity;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;

public class SystemShareUtil {

    private static final int THUMB_SIZE = 400;

    public static void shareText(String title, String text) {
        Log.e("SystemShareUtil", "进来了");
        Intent textIntent = new Intent(Intent.ACTION_SEND);
        textIntent.setType("text/plain");
        textIntent.putExtra(Intent.EXTRA_TEXT, text);
        AppActivity.getAppContext().startActivity(Intent.createChooser(textIntent, title));

    }

    public static void sharePic(String title, String path) {
        Intent imageIntent = new Intent(Intent.ACTION_SEND);

        File file = new File(path);
        if (file.exists()) {
            Bitmap bmp = BitmapFactory.decodeFile(path);
//
//            int width = bmp.getWidth();
//            int height = bmp.getHeight();
//            int newWidth;
//            int newHeight;
//            if (width > height) {
//                newWidth = THUMB_SIZE;
//                newHeight = THUMB_SIZE * height / width;
//            } else {
//                newHeight = THUMB_SIZE;
//                newWidth = THUMB_SIZE * width / height;
//            }
//            Bitmap thumbBmp = Bitmap.createScaledBitmap(bmp, newWidth, newHeight, true);
//            bmp.recycle();
            File imageFile = bitMap2File(bmp);
            Uri imageUri = Uri.fromFile(imageFile);
            imageIntent.setType("image/jpeg");
            imageIntent.putExtra(Intent.EXTRA_STREAM, imageUri);
            AppActivity.getAppContext().startActivity(Intent.createChooser(imageIntent, title));

        }


    }

    /*
  * 把bitmap转化为file
  * */
    public static File bitMap2File(Bitmap bitmap) {


        String path = "";
        if (Environment.MEDIA_MOUNTED.equals(Environment.getExternalStorageState())) {
            path = Environment.getExternalStorageDirectory() + File.separator;//保存到sd根目录下
        }


        //        File f = new File(path, System.currentTimeMillis() + ".jpg");
        File f = new File(path, "share" + ".jpg");
        if (f.exists()) {
            f.delete();
        }
        try {
            FileOutputStream out = new FileOutputStream(f);
            bitmap.compress(Bitmap.CompressFormat.JPEG, 100, out);
            out.flush();
            out.close();
            bitmap.recycle();
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            return f;
        }
    }

}