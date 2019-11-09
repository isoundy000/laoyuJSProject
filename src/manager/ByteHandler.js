var ByteHandler = {
    setInt:function(buffer, value, offset) {
        var ByteBuffer = dcodeIO.ByteBuffer;
        //var msg = new ByteBuffer(4);
        var msg = new ByteBuffer(4, ByteBuffer.LITTLE_ENDIAN);
        //var msg = new ByteBuffer(4, ByteBuffer.BIG_ENDIAN);
        msg.writeInt(value);
        msg.copyTo(buffer, offset, 0, 4);
    },

    getInt:function(buffer, offset){
        var ByteBuffer = dcodeIO.ByteBuffer;
        var msg = new ByteBuffer(4, ByteBuffer.LITTLE_ENDIAN);
        //var msg = new ByteBuffer(4, ByteBuffer.BIG_ENDIAN);
        buffer.copyTo(msg, 0, offset, offset+4);
        var ret = msg.readInt32(0);
        return ret;
    }

};