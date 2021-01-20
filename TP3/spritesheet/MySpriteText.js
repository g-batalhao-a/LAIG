/*
 * MySpritetext
 */
class MySpriteText {
    constructor(scene,text) {
        this.scene=scene;
        this.text=text;
        this.shape=new MyRectangle(scene,-0.5,-0.5,0.5,0.5);
        this.spritesheet=new MySpritesheet(scene,this.scene.textTexture,26,4);
        this.textdict= {'A':0, 'B':1, 'C':2,'D':3,'E':4,'F':5,'G':6,'H':7, 'I':8,'J':9,'K':10,'L':11,'M':12,'N':13,'O':14,'P':15,'Q':16,'R':17,'S':18,'T':19,'U':20,'V':21,'W':22,'X':23,'Y':24,'Z':25,
                        'a':26, 'b':27, 'c':28,'d':29,'e':30,'f':31,'g':32,'h':33, 'i':34, 'j':35,'k':36,'l':37,'m':38,'n':39,'o':40,'p':41,'q':42,'r':43,'s':44,'t':45,'u':46,'v':47,'w':48,'x':49,'y':50,'z':51,
                        '0':52,'1':53,'2':54,'3':55,'4':56,'5':57,'6':58,'7':59,'8':60,'9':61,':':62,';':63,'<':64,'=':65,'>':66,'?':67,'@':68,'[':69,'\\':70,']':71,'^':72,'_':73,'à':74,'á':75,'ã':76,'é':77,
                        'è':78,'ò':79,'ó':80,'õ':81,'ç':82,'!':83,'"':84,'#':85,'$':86,'%':87,'&':88,'\'':89,'(':90,')':91,'*':92,'+':93,',':94,'-':95,'.':96,'/':97,'{':98,'|':99,'}':100,'~':101,'':102,
                        };
        this.init_translate= this.text.length/2 +0.5;
    }
    getTextLength(){
        return this.text.length
    }
    getCharacterPosition(char) {
        return this.textdict[char];
    }
    display() {
        this.scene.translate(-this.init_translate,0,0);
        this.spritesheet.setActive();
        for(let char of this.text) {
            this.spritesheet.activateCellP(this.getCharacterPosition(char));
            this.shape.display();
            this.scene.translate(1,0,0);
        }
        this.spritesheet.deactivate();
    }
    modifyText(text){
        this.text=text
    }
    getText(){
        return this.text
    }
}