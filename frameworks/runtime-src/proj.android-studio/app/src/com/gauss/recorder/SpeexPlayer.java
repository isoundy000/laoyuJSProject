/**
 * 
 */
package com.gauss.recorder;

import com.gauss.speex.encode.SpeexDecoder;

import java.io.File;

/**
 * @author Gauss
 * 
 */
public class SpeexPlayer {
	private int mills = 0;
	private String fileName = null;
	private SpeexDecoder speexdec = null;
	private Thread th = null;

	public SpeexPlayer(String fileName) {

		String[] arr = fileName.split("\\.spx");
		String[] arr1 = arr[0].split("-");
		mills = Integer.parseInt(arr1[arr1.length - 1]);
		mills = 5000;

		this.fileName = fileName;
		System.out.println(this.fileName);
		try {
			speexdec = new SpeexDecoder(new File(this.fileName));
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	public void startPlay() {
		RecordPlayThread rpt = new RecordPlayThread();

		isStartPlay = true;

		th = new Thread(rpt);
		th.start();
	}

	public boolean isStartPlay = false;

	public boolean isStartedPlay = false;

	public boolean isStartedPlay() {
		return isStartedPlay;
	}

	public boolean isPlaying() {
		return isStartedPlay && th.isAlive();
	}

	class RecordPlayThread extends Thread {
		public void run() {
			try {
				long startTime = System.currentTimeMillis();
				if (speexdec != null) {
					isStartedPlay = true;
					speexdec.decode();
				}
				long endTime = System.currentTimeMillis();
				if (endTime - startTime < mills)
					Thread.sleep(mills - (endTime - startTime));
			} catch (Exception t) {
				t.printStackTrace();
			}
		}
	};
}
