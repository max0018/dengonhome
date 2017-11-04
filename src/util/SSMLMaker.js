export default class SSMLMaker
{
    createSSML(text)
    {
        let result = '<voice name="aoi">'
        result += text
        result += '</voice>'
        
        return result;
    }    
}