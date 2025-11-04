/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.76, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "http://www.goole.com/"], "isController": false}, {"data": [1.0, 500, 1500, "http://www.goole.com/-4"], "isController": false}, {"data": [0.5, 500, 1500, "http://www.goole.com/-5"], "isController": false}, {"data": [1.0, 500, 1500, "http://www.goole.com/-6"], "isController": false}, {"data": [1.0, 500, 1500, "https://playwright.dev/-9"], "isController": false}, {"data": [1.0, 500, 1500, "http://www.goole.com/-7"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "http://www.goole.com/-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://playwright.dev/-7"], "isController": false}, {"data": [0.5, 500, 1500, "http://www.goole.com/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://playwright.dev/-8"], "isController": false}, {"data": [0.5, 500, 1500, "http://www.goole.com/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://playwright.dev/-5"], "isController": false}, {"data": [1.0, 500, 1500, "http://www.goole.com/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://playwright.dev/-6"], "isController": false}, {"data": [1.0, 500, 1500, "https://playwright.dev/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://playwright.dev/-4"], "isController": false}, {"data": [1.0, 500, 1500, "https://playwright.dev/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://playwright.dev/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://playwright.dev/-0"], "isController": false}, {"data": [0.0, 500, 1500, "Test"], "isController": true}, {"data": [0.0, 500, 1500, "https://www.mojeek.com/search?q=playwright"], "isController": false}, {"data": [0.5, 500, 1500, "https://playwright.dev/"], "isController": false}, {"data": [1.0, 500, 1500, "http://www.goole.com/-8"], "isController": false}, {"data": [0.0, 500, 1500, "http://www.goole.com/-9"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.mojeek.com/search?q=playwright-8"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.mojeek.com/search?q=playwright-7"], "isController": false}, {"data": [1.0, 500, 1500, "https://playwright.dev/-12"], "isController": false}, {"data": [0.5, 500, 1500, "https://www.mojeek.com/search?q=playwright-6"], "isController": false}, {"data": [1.0, 500, 1500, "https://playwright.dev/-13"], "isController": false}, {"data": [0.5, 500, 1500, "https://www.mojeek.com/search?q=playwright-5"], "isController": false}, {"data": [1.0, 500, 1500, "https://playwright.dev/-10"], "isController": false}, {"data": [0.5, 500, 1500, "https://www.mojeek.com/search?q=playwright-4"], "isController": false}, {"data": [1.0, 500, 1500, "https://playwright.dev/-11"], "isController": false}, {"data": [1.0, 500, 1500, "http://www.goole.com/-12"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.mojeek.com/search?q=playwright-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://playwright.dev/-16"], "isController": false}, {"data": [0.0, 500, 1500, "http://www.goole.com/-11"], "isController": false}, {"data": [1.0, 500, 1500, "http://trc.taboola.com/goolecom/trc/3/json?llvl=2&tim=21%3A54%3A44.968&lti=trecs&pubit=i&t=1&data=%7B%22id%22%3A%2276721%22%2C%22sd%22%3A%22%22%2C%22ui%22%3A%22%22%2C%22ii%22%3A%22_homepage_%22%2C%22it%22%3A%22home%22%2C%22vi%22%3A1762199684969%2C%22cv%22%3A%2220251103-4-RELEASE%22%2C%22uiv%22%3A%22default%22%2C%22u%22%3A%22http%3A%2F%2Fwww.goole.com%2F%22%2C%22qs%22%3A%22%22%2C%22bv%22%3A%220%22%2C%22btv%22%3A%220%22%2C%22ul%22%3A%5B%22en-GB%22%2C%22ar-AE%22%2C%22ar%22%2C%22en-US%22%2C%22en%22%5D%2C%22cos%22%3A%224g%22%2C%22bu%22%3A%22http%3A%2F%2Fwww.goole.com%2F%22%2C%22vpi%22%3A%22%2F%22%2C%22bad%22%3A-1%2C%22sw%22%3A1450%2C%22sh%22%3A868%2C%22bw%22%3A1813%2C%22bh%22%3A976%2C%22dw%22%3A1813%2C%22dh%22%3A976%2C%22sde%22%3A%221.060%22%2C%22lt%22%3A%22trecs%22%2C%22r%22%3A%5B%7B%22li%22%3A%22rbox-h2m%22%2C%22uip%22%3A%22Left%20Rail%20Thumbnails%22%2C%22orig_uip%22%3A%22Left%20Rail%20Thumbnails%22%2C%22s%22%3A4%2C%22uim%22%3A%22thumbnails-lr-2-desktop%3Aabp%3D1%22%2C%22cd%22%3A151.98%2C%22mw%22%3A184.01%7D%2C%7B%22li%22%3A%22rbox-h2m%22%2C%22uip%22%3A%22Right%20Rail%20Thumbnails%22%2C%22orig_uip%22%3A%22Right%20Rail%20Thumbnails%22%2C%22s%22%3A4%2C%22uim%22%3A%22thumbnails-rr-desktop%3Aabp%3D1%22%2C%22cd%22%3A0%2C%22mw%22%3A0%2C%22amw%22%3A0%7D%5D%2C%22cacheKey%22%3A%22home%3D_homepage_%2CLeft%20Rail%20Thumbnails%3Dthumbnails-lr-2-desktop%3Aabp%3D1%2CRight%20Rail%20Thumbnails%3Dthumbnails-rr-desktop%3Aabp%3D1%22%2C%22_cn%22%3A%22tions_1%22%2C%22lbt%22%3A1762164968678%2C%22wc%22%3Atrue%7D"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.mojeek.com/search?q=playwright-2"], "isController": false}, {"data": [0.0, 500, 1500, "http://www.goole.com/-14"], "isController": false}, {"data": [0.5, 500, 1500, "https://www.mojeek.com/search?q=playwright-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://playwright.dev/-14"], "isController": false}, {"data": [1.0, 500, 1500, "http://www.goole.com/-13"], "isController": false}, {"data": [0.5, 500, 1500, "https://www.mojeek.com/search?q=playwright-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://playwright.dev/-15"], "isController": false}, {"data": [1.0, 500, 1500, "http://www.goole.com/-10"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 49, 0, 0.0, 675.1632653061225, 23, 5135, 193.0, 3080.0, 3362.0, 5135.0, 2.802722644855002, 399.5327045379797, 2.803560512354859], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["http://www.goole.com/", 1, 0, 0.0, 5135.0, 5135, 5135, 5135.0, 5135.0, 5135.0, 5135.0, 0.19474196689386564, 161.2792493305745, 1.360911635832522], "isController": false}, {"data": ["http://www.goole.com/-4", 1, 0, 0.0, 331.0, 331, 331, 331.0, 331.0, 331.0, 331.0, 3.0211480362537766, 9.264067220543806, 1.395510762839879], "isController": false}, {"data": ["http://www.goole.com/-5", 1, 0, 0.0, 766.0, 766, 766, 766.0, 766.0, 766.0, 766.0, 1.3054830287206267, 114.51916408289817, 0.5303524804177545], "isController": false}, {"data": ["http://www.goole.com/-6", 1, 0, 0.0, 330.0, 330, 330, 330.0, 330.0, 330.0, 330.0, 3.0303030303030303, 34.11754261363636, 1.2547348484848484], "isController": false}, {"data": ["https://playwright.dev/-9", 1, 0, 0.0, 111.0, 111, 111, 111.0, 111.0, 111.0, 111.0, 9.00900900900901, 227.48627533783784, 5.454673423423423], "isController": false}, {"data": ["http://www.goole.com/-7", 1, 0, 0.0, 179.0, 179, 179, 179.0, 179.0, 179.0, 179.0, 5.58659217877095, 43.18152060055866, 2.54779155027933], "isController": false}, {"data": ["http://www.goole.com/-0", 3, 0, 0.0, 389.33333333333337, 29, 965, 174.0, 965.0, 965.0, 965.0, 1.7016449234259785, 15.99501914350539, 0.6602736812251844], "isController": false}, {"data": ["https://playwright.dev/-7", 1, 0, 0.0, 202.0, 202, 202, 202.0, 202.0, 202.0, 202.0, 4.9504950495049505, 2295.5551902846532, 3.016707920792079], "isController": false}, {"data": ["http://www.goole.com/-1", 3, 0, 0.0, 1344.3333333333335, 33, 3344, 656.0, 3344.0, 3344.0, 3344.0, 0.7501875468867217, 140.3932526100275, 0.3963393192048012], "isController": false}, {"data": ["https://playwright.dev/-8", 1, 0, 0.0, 103.0, 103, 103, 103.0, 103.0, 103.0, 103.0, 9.70873786407767, 665.3709041262136, 5.897299757281553], "isController": false}, {"data": ["http://www.goole.com/-2", 1, 0, 0.0, 782.0, 782, 782, 782.0, 782.0, 782.0, 782.0, 1.278772378516624, 104.54713475063939, 0.5369844948849105], "isController": false}, {"data": ["https://playwright.dev/-5", 1, 0, 0.0, 148.0, 148, 148, 148.0, 148.0, 148.0, 148.0, 6.756756756756757, 4435.527079814189, 4.14379222972973], "isController": false}, {"data": ["http://www.goole.com/-3", 1, 0, 0.0, 324.0, 324, 324, 324.0, 324.0, 324.0, 324.0, 3.0864197530864197, 18.090518904320987, 1.3985339506172838], "isController": false}, {"data": ["https://playwright.dev/-6", 1, 0, 0.0, 23.0, 23, 23, 23.0, 23.0, 23.0, 23.0, 43.47826086956522, 243.50373641304347, 26.53702445652174], "isController": false}, {"data": ["https://playwright.dev/-3", 1, 0, 0.0, 185.0, 185, 185, 185.0, 185.0, 185.0, 185.0, 5.405405405405405, 759.2535895270271, 3.3361486486486487], "isController": false}, {"data": ["https://playwright.dev/-4", 1, 0, 0.0, 110.0, 110, 110, 110.0, 110.0, 110.0, 110.0, 9.09090909090909, 170.5965909090909, 5.646306818181818], "isController": false}, {"data": ["https://playwright.dev/-1", 1, 0, 0.0, 186.0, 186, 186, 186.0, 186.0, 186.0, 186.0, 5.376344086021506, 598.7273185483871, 3.28146001344086], "isController": false}, {"data": ["https://playwright.dev/-2", 1, 0, 0.0, 114.0, 114, 114, 114.0, 114.0, 114.0, 114.0, 8.771929824561402, 62.98828125, 5.302563048245614], "isController": false}, {"data": ["https://playwright.dev/-0", 1, 0, 0.0, 133.0, 133, 133, 133.0, 133.0, 133.0, 133.0, 7.518796992481203, 144.9938322368421, 4.420230263157895], "isController": false}, {"data": ["Test", 1, 0, 0.0, 7686.0, 7686, 7686, 7686.0, 7686.0, 7686.0, 7686.0, 0.13010668748373666, 418.02554461846216, 3.19396670895134], "isController": true}, {"data": ["https://www.mojeek.com/search?q=playwright", 1, 0, 0.0, 1665.0, 1665, 1665, 1665.0, 1665.0, 1665.0, 1665.0, 0.6006006006006006, 324.0944069069069, 3.3138607357357355], "isController": false}, {"data": ["https://playwright.dev/", 1, 0, 0.0, 603.0, 603, 603, 603.0, 603.0, 603.0, 603.0, 1.658374792703151, 3059.359776637645, 17.179726368159205], "isController": false}, {"data": ["http://www.goole.com/-8", 1, 0, 0.0, 162.0, 162, 162, 162.0, 162.0, 162.0, 162.0, 6.172839506172839, 6.293402777777778, 2.6885609567901234], "isController": false}, {"data": ["http://www.goole.com/-9", 1, 0, 0.0, 3374.0, 3374, 3374, 3374.0, 3374.0, 3374.0, 3374.0, 0.2963841138114997, 163.87899655453467, 0.2413909676941316], "isController": false}, {"data": ["https://www.mojeek.com/search?q=playwright-8", 1, 0, 0.0, 154.0, 154, 154, 154.0, 154.0, 154.0, 154.0, 6.493506493506494, 8.592481737012987, 4.0203936688311686], "isController": false}, {"data": ["https://www.mojeek.com/search?q=playwright-7", 1, 0, 0.0, 164.0, 164, 164, 164.0, 164.0, 164.0, 164.0, 6.097560975609756, 10.337271341463413, 3.8407488567073167], "isController": false}, {"data": ["https://playwright.dev/-12", 1, 0, 0.0, 107.0, 107, 107, 107.0, 107.0, 107.0, 107.0, 9.345794392523365, 685.4921144859813, 5.649459696261682], "isController": false}, {"data": ["https://www.mojeek.com/search?q=playwright-6", 1, 0, 0.0, 721.0, 721, 721, 721.0, 721.0, 721.0, 721.0, 1.3869625520110958, 62.180348474341194, 0.8614337725381415], "isController": false}, {"data": ["https://playwright.dev/-13", 1, 0, 0.0, 91.0, 91, 91, 91.0, 91.0, 91.0, 91.0, 10.989010989010989, 162.50643887362637, 6.642771291208791], "isController": false}, {"data": ["https://www.mojeek.com/search?q=playwright-5", 1, 0, 0.0, 625.0, 625, 625, 625.0, 625.0, 625.0, 625.0, 1.6, 40.1390625, 0.96875], "isController": false}, {"data": ["https://playwright.dev/-10", 1, 0, 0.0, 136.0, 136, 136, 136.0, 136.0, 136.0, 136.0, 7.352941176470588, 519.6676815257352, 4.473517922794118], "isController": false}, {"data": ["https://www.mojeek.com/search?q=playwright-4", 1, 0, 0.0, 748.0, 748, 748, 748.0, 748.0, 748.0, 748.0, 1.3368983957219251, 114.08156124665776, 0.834255932486631], "isController": false}, {"data": ["https://playwright.dev/-11", 1, 0, 0.0, 115.0, 115, 115, 115.0, 115.0, 115.0, 115.0, 8.695652173913043, 616.2024456521739, 5.298913043478261], "isController": false}, {"data": ["http://www.goole.com/-12", 1, 0, 0.0, 199.0, 199, 199, 199.0, 199.0, 199.0, 199.0, 5.025125628140704, 69.52732412060301, 1.9923837939698492], "isController": false}, {"data": ["https://www.mojeek.com/search?q=playwright-3", 1, 0, 0.0, 469.0, 469, 469, 469.0, 469.0, 469.0, 469.0, 2.1321961620469083, 10.579774120469084, 1.2888959221748402], "isController": false}, {"data": ["https://playwright.dev/-16", 1, 0, 0.0, 117.0, 117, 117, 117.0, 117.0, 117.0, 117.0, 8.547008547008549, 521.3842147435897, 5.316840277777778], "isController": false}, {"data": ["http://www.goole.com/-11", 1, 0, 0.0, 3350.0, 3350, 3350, 3350.0, 3350.0, 3350.0, 3350.0, 0.2985074626865672, 1.0237873134328357, 0.11572994402985075], "isController": false}, {"data": ["http://trc.taboola.com/goolecom/trc/3/json?llvl=2&tim=21%3A54%3A44.968&lti=trecs&pubit=i&t=1&data=%7B%22id%22%3A%2276721%22%2C%22sd%22%3A%22%22%2C%22ui%22%3A%22%22%2C%22ii%22%3A%22_homepage_%22%2C%22it%22%3A%22home%22%2C%22vi%22%3A1762199684969%2C%22cv%22%3A%2220251103-4-RELEASE%22%2C%22uiv%22%3A%22default%22%2C%22u%22%3A%22http%3A%2F%2Fwww.goole.com%2F%22%2C%22qs%22%3A%22%22%2C%22bv%22%3A%220%22%2C%22btv%22%3A%220%22%2C%22ul%22%3A%5B%22en-GB%22%2C%22ar-AE%22%2C%22ar%22%2C%22en-US%22%2C%22en%22%5D%2C%22cos%22%3A%224g%22%2C%22bu%22%3A%22http%3A%2F%2Fwww.goole.com%2F%22%2C%22vpi%22%3A%22%2F%22%2C%22bad%22%3A-1%2C%22sw%22%3A1450%2C%22sh%22%3A868%2C%22bw%22%3A1813%2C%22bh%22%3A976%2C%22dw%22%3A1813%2C%22dh%22%3A976%2C%22sde%22%3A%221.060%22%2C%22lt%22%3A%22trecs%22%2C%22r%22%3A%5B%7B%22li%22%3A%22rbox-h2m%22%2C%22uip%22%3A%22Left%20Rail%20Thumbnails%22%2C%22orig_uip%22%3A%22Left%20Rail%20Thumbnails%22%2C%22s%22%3A4%2C%22uim%22%3A%22thumbnails-lr-2-desktop%3Aabp%3D1%22%2C%22cd%22%3A151.98%2C%22mw%22%3A184.01%7D%2C%7B%22li%22%3A%22rbox-h2m%22%2C%22uip%22%3A%22Right%20Rail%20Thumbnails%22%2C%22orig_uip%22%3A%22Right%20Rail%20Thumbnails%22%2C%22s%22%3A4%2C%22uim%22%3A%22thumbnails-rr-desktop%3Aabp%3D1%22%2C%22cd%22%3A0%2C%22mw%22%3A0%2C%22amw%22%3A0%7D%5D%2C%22cacheKey%22%3A%22home%3D_homepage_%2CLeft%20Rail%20Thumbnails%3Dthumbnails-lr-2-desktop%3Aabp%3D1%2CRight%20Rail%20Thumbnails%3Dthumbnails-rr-desktop%3Aabp%3D1%22%2C%22_cn%22%3A%22tions_1%22%2C%22lbt%22%3A1762164968678%2C%22wc%22%3Atrue%7D", 1, 0, 0.0, 283.0, 283, 283, 283.0, 283.0, 283.0, 283.0, 3.5335689045936394, 1.2871300795053005, 5.949094522968198], "isController": false}, {"data": ["https://www.mojeek.com/search?q=playwright-2", 1, 0, 0.0, 456.0, 456, 456, 456.0, 456.0, 456.0, 456.0, 2.1929824561403506, 10.952062774122806, 1.3127912554824561], "isController": false}, {"data": ["http://www.goole.com/-14", 1, 0, 0.0, 3080.0, 3080, 3080, 3080.0, 3080.0, 3080.0, 3080.0, 0.3246753246753247, 0.14902090097402598, 0.12841162743506493], "isController": false}, {"data": ["https://www.mojeek.com/search?q=playwright-1", 1, 0, 0.0, 602.0, 602, 602, 602.0, 602.0, 602.0, 602.0, 1.6611295681063123, 584.8100731935216, 1.0106286337209303], "isController": false}, {"data": ["https://playwright.dev/-14", 1, 0, 0.0, 123.0, 123, 123, 123.0, 123.0, 123.0, 123.0, 8.130081300813009, 139.4578887195122, 4.9383892276422765], "isController": false}, {"data": ["http://www.goole.com/-13", 1, 0, 0.0, 193.0, 193, 193, 193.0, 193.0, 193.0, 193.0, 5.181347150259067, 127.05938309585491, 2.0745628238341967], "isController": false}, {"data": ["https://www.mojeek.com/search?q=playwright-0", 1, 0, 0.0, 868.0, 868, 868, 868.0, 868.0, 868.0, 868.0, 1.152073732718894, 22.27530061923963, 0.6986697148617511], "isController": false}, {"data": ["https://playwright.dev/-15", 1, 0, 0.0, 127.0, 127, 127, 127.0, 127.0, 127.0, 127.0, 7.874015748031496, 160.34848671259843, 4.852054625984252], "isController": false}, {"data": ["http://www.goole.com/-10", 1, 0, 0.0, 188.0, 188, 188, 188.0, 188.0, 188.0, 188.0, 5.319148936170213, 23.697224069148938, 2.119348404255319], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 49, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
