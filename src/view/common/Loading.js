(function () {
    var exports = this;

    exports.Loading = cc.Layer.extend({
        ctor: function (content) {
            this._super();
            this.setContentSize(cc.winSize);
            addModalLayer(this);
            var anim = playAnimScene(this, res.PhzLoading_json, cc.winSize.width / 2, cc.winSize.height / 2, true);
            anim.setScale(1);

            this.m_content = new ccui.Text();
            this.m_content.setName('content');
            this.m_content.setFontSize(34);
            this.m_content.setAnchorPoint(0.5, 0.5);
            this.m_content.x = cc.winSize.width / 2;
            this.m_content.y = 200;
            this.addChild(this.m_content);
            this.m_content.setVisible(false);

            return true;
        },

        dismiss: function () {
            this.removeFromParent(true);
        },

        setContent: function (content) {
            if (content) {
                this.m_content.setVisible(true);
                this.m_content.setString(content);
            }
        }
    });
})(window);
