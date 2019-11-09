var ChatErrorNode = {
    init:function () {
        return true;
    },

    /** @returns ChatErrorNode */
    getCom: function (p, name) {
        return getCom(p, name, this);
    }
};