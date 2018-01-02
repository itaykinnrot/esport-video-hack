
const express = require('express')
const {ThumbnailGenerator} = require('hls-live-thumbnails')
const cors = require('cors')

const app = express()
app.use(cors())

let generator = null;
let url = '';
let intervalId = null;
let data = null;

function startMonitor(){
    if (intervalId){
        stopMonitor()
    }
    setInterval(function(){
        try {
        const
        { spawnSync } = require( 'child_process' ),
        detect = spawnSync( 'python3', ['detect.py','out/' + generator._lastLocation.name] );
        data = detect.stdout.toString()
        } catch(e){}
    },1000)
}
function stopMonitor(){
    clearInterval(intervalId);
    intervalId = null;
}
app.get('/', (req, res) => {
    const
    { spawnSync } = require( 'child_process' ),
    ls = spawnSync( 'ls', [ '-lh', '/usr' ] );
    
    console.log( `stderr: ${ls.stderr.toString()}` );
    res.send( `stdout: ${ls.stdout.toString()}` );
});

app.get('/monitor/:url', (req, res) => {
    url = req.params.url;
    generator = new ThumbnailGenerator({interval:1,tempDir:"temp",outputDir:"out",thumbnailWidth:1280,thumbnailHeight:720,playlistUrl:"https://video-weaver.ams02.hls.ttvnw.net/v1/playlist/CpIDBGBZHGH6R5O2sBGBfCvR3iCyRfK8yhLOrzzf4CDtHDXeWlXVI9leMswsjxwRDZzsnSEoMTM7B-dVkhPt7y5_1DhTjNVONHDUyJbMeR3HEKV3Fns3_koJG57kkZsgo04SD7lyZw_coi9iAfvUysXYsoi3RSqoYGaQyhTDUy8GgAxcxRRbDXJ_bPtdKp21a_4NJBZ0tW5zvPgzgvGV7MN2EdB_T6paV39hSRG8VnrSW_r2rgw1Nww8majnLmL1xVSaQz9bleifqSO3CE1qY6CU7H0SkEheGe9kP25LJ2Y2Fb_Pew2zCpa8rrTWSvwlyTcGJ4JaaiX8_rOqGMKm8aZ7emigt6M6YVrvCLCNrLQv47TVyHbDf_D_B40IiqEYra9Jwku24KrSgrFELzXkqN28VEsxI9pcYx0zNH3z6nYNYavzMmuPcapRz6muUG5iPYWoxmkRPpPH40ta5pLJmBmSAvRkD-ovNm5R4s1Vsd_9y5-dioKelMhnB2IcaZQmq8jrhM4Ywyxil6hWF4ueMIxZJijQEhAcHuG-O-ZaMA4yRAp4NNmxGgzXiUaiFyLeqJjmN9Q.m3u8"})
    startMonitor();
    res.send( req.params.url);
});

app.get('/getdata', (req, res) => {
    res.send( data);
});

app.get('/stop',(req,res)=>{
    if (generator)
        generator.destroy();
    generator = null;
    stopMonitor();
    res.send("ok");
});



app.listen(3000, () => console.log('Example app listening on port 3000!'))
