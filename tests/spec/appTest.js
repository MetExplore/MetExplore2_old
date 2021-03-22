describe("Ext", function() {
    // Test ExtJS initialization
    it("is defined", function() {
        expect(Ext).toBeDefined();
    });
    // Check ExtJS version
    it("is version 4", function() {
        expect(Ext.getVersion().major).toEqual(4);
    });
});