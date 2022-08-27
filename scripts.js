const runCoco = async () => {
  
    const net = await cocoSsd.load();
    console.log("Loading Neural Network...");
    detect(net);

};

const detect = async (net) => {
    const img = document.getElementById("img");
    const imgWidth = img.width;
    const imgHeight = img.height;

  
    const canvas = document.getElementById("mesh");
    canvas.width = imgWidth;
    canvas.height = imgHeight;

    const obj = await net.detect(img);

    const ctx = canvas.getContext("2d");
  
    drawRect(obj, ctx);

    getCaption(obj);

    img.style.visibility = "visible";
};

const drawRect = (predictions, ctx) => {
  
    predictions.forEach((prediction) => {
        
        const [x, y, width, height] = prediction["bbox"];
        const text = prediction["class"];


        const color = Math.floor(Math.random() * 16777215).toString(16);
        ctx.strokeStyle = "#" + color;
        ctx.font = "18px Arial";

  
        ctx.beginPath();
        ctx.fillStyle = "#" + color;
        ctx.fillText(text, x, y);
        ctx.rect(x, y, width, height);
        ctx.stroke();
    });
};

const getCaption = (predictions) => {

    predictions.forEach(async (prediction) => {
        const caption = document.getElementById("caption");
        const entity = prediction['class'];

        try {

            const accessToken = '31a8e146b4e7159a496fd087c9d777a3ca34bdf9';

            const response = await axios.get(
                `https://owlbot.info/api/v4/dictionary/${entity}`,
                { headers: { "Access-Control-Allow-Origin": "*", "Authorization": `Token ${accessToken}` } }
                );
            const data = response.data;
            const entry = data.definitions[0];
            let lineText;
            if (entry.example) {
                lineText = entry.example;
            } else {
                lineText = entry.definition;
            }
            if (entry.emoji) {
                lineText += " " + entry.emoji;
            }
            lineText += "#" + entity;

            const line = document.createElement("p");
            line.innerText = lineText;
            line.id = "caption_sentence";
            caption.appendChild(line);
        } catch (error) {
            console.log(error);
        }
    })

}


const input = document.getElementById("img-upload");

input.addEventListener("change", (event) => {
    const caption = document.getElementById("caption");
    caption.replaceChildren();
    const img = document.getElementById("img");
    img.src = URL.createObjectURL(event.target.files[0])
    runCoco();
})
