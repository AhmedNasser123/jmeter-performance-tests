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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.74, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "http://www.goole.com/"], "isController": false}, {"data": [1.0, 500, 1500, "http://www.goole.com/-4"], "isController": false}, {"data": [0.5, 500, 1500, "http://www.goole.com/-5"], "isController": false}, {"data": [1.0, 500, 1500, "http://www.goole.com/-6"], "isController": false}, {"data": [1.0, 500, 1500, "https://playwright.dev/-9"], "isController": false}, {"data": [1.0, 500, 1500, "http://www.goole.com/-7"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "http://www.goole.com/-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://playwright.dev/-7"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "http://www.goole.com/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://playwright.dev/-8"], "isController": false}, {"data": [1.0, 500, 1500, "http://www.goole.com/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://playwright.dev/-5"], "isController": false}, {"data": [1.0, 500, 1500, "http://www.goole.com/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://playwright.dev/-6"], "isController": false}, {"data": [1.0, 500, 1500, "https://playwright.dev/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://playwright.dev/-4"], "isController": false}, {"data": [1.0, 500, 1500, "https://playwright.dev/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://playwright.dev/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://playwright.dev/-0"], "isController": false}, {"data": [0.0, 500, 1500, "Test"], "isController": true}, {"data": [0.5, 500, 1500, "https://www.mojeek.com/search?q=playwright"], "isController": false}, {"data": [0.5, 500, 1500, "https://playwright.dev/"], "isController": false}, {"data": [1.0, 500, 1500, "http://www.goole.com/-8"], "isController": false}, {"data": [0.0, 500, 1500, "http://www.goole.com/-9"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.mojeek.com/search?q=playwright-8"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.mojeek.com/search?q=playwright-7"], "isController": false}, {"data": [1.0, 500, 1500, "https://playwright.dev/-12"], "isController": false}, {"data": [0.5, 500, 1500, "https://www.mojeek.com/search?q=playwright-6"], "isController": false}, {"data": [0.5, 500, 1500, "https://playwright.dev/-13"], "isController": false}, {"data": [0.5, 500, 1500, "https://www.mojeek.com/search?q=playwright-5"], "isController": false}, {"data": [1.0, 500, 1500, "https://playwright.dev/-10"], "isController": false}, {"data": [0.5, 500, 1500, "https://www.mojeek.com/search?q=playwright-4"], "isController": false}, {"data": [0.5, 500, 1500, "https://playwright.dev/-11"], "isController": false}, {"data": [1.0, 500, 1500, "http://www.goole.com/-12"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.mojeek.com/search?q=playwright-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://playwright.dev/-16"], "isController": false}, {"data": [0.0, 500, 1500, "http://www.goole.com/-11"], "isController": false}, {"data": [0.5, 500, 1500, "http://trc.taboola.com/goolecom/trc/3/json?llvl=2&tim=21%3A54%3A44.968&lti=trecs&pubit=i&t=1&data=%7B%22id%22%3A%2276721%22%2C%22sd%22%3A%22%22%2C%22ui%22%3A%22%22%2C%22ii%22%3A%22_homepage_%22%2C%22it%22%3A%22home%22%2C%22vi%22%3A1762199684969%2C%22cv%22%3A%2220251103-4-RELEASE%22%2C%22uiv%22%3A%22default%22%2C%22u%22%3A%22http%3A%2F%2Fwww.goole.com%2F%22%2C%22qs%22%3A%22%22%2C%22bv%22%3A%220%22%2C%22btv%22%3A%220%22%2C%22ul%22%3A%5B%22en-GB%22%2C%22ar-AE%22%2C%22ar%22%2C%22en-US%22%2C%22en%22%5D%2C%22cos%22%3A%224g%22%2C%22bu%22%3A%22http%3A%2F%2Fwww.goole.com%2F%22%2C%22vpi%22%3A%22%2F%22%2C%22bad%22%3A-1%2C%22sw%22%3A1450%2C%22sh%22%3A868%2C%22bw%22%3A1813%2C%22bh%22%3A976%2C%22dw%22%3A1813%2C%22dh%22%3A976%2C%22sde%22%3A%221.060%22%2C%22lt%22%3A%22trecs%22%2C%22r%22%3A%5B%7B%22li%22%3A%22rbox-h2m%22%2C%22uip%22%3A%22Left%20Rail%20Thumbnails%22%2C%22orig_uip%22%3A%22Left%20Rail%20Thumbnails%22%2C%22s%22%3A4%2C%22uim%22%3A%22thumbnails-lr-2-desktop%3Aabp%3D1%22%2C%22cd%22%3A151.98%2C%22mw%22%3A184.01%7D%2C%7B%22li%22%3A%22rbox-h2m%22%2C%22uip%22%3A%22Right%20Rail%20Thumbnails%22%2C%22orig_uip%22%3A%22Right%20Rail%20Thumbnails%22%2C%22s%22%3A4%2C%22uim%22%3A%22thumbnails-rr-desktop%3Aabp%3D1%22%2C%22cd%22%3A0%2C%22mw%22%3A0%2C%22amw%22%3A0%7D%5D%2C%22cacheKey%22%3A%22home%3D_homepage_%2CLeft%20Rail%20Thumbnails%3Dthumbnails-lr-2-desktop%3Aabp%3D1%2CRight%20Rail%20Thumbnails%3Dthumbnails-rr-desktop%3Aabp%3D1%22%2C%22_cn%22%3A%22tions_1%22%2C%22lbt%22%3A1762164968678%2C%22wc%22%3Atrue%7D"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.mojeek.com/search?q=playwright-2"], "isController": false}, {"data": [0.0, 500, 1500, "http://www.goole.com/-14"], "isController": false}, {"data": [0.5, 500, 1500, "https://www.mojeek.com/search?q=playwright-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://playwright.dev/-14"], "isController": false}, {"data": [1.0, 500, 1500, "http://www.goole.com/-13"], "isController": false}, {"data": [0.5, 500, 1500, "https://www.mojeek.com/search?q=playwright-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://playwright.dev/-15"], "isController": false}, {"data": [1.0, 500, 1500, "http://www.goole.com/-10"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 49, 0, 0.0, 627.2448979591836, 24, 4910, 286.0, 1859.0, 2686.0, 4910.0, 1.6527253103076094, 235.6040036427415, 1.6532193887446034], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["http://www.goole.com/", 1, 0, 0.0, 4910.0, 4910, 4910, 4910.0, 4910.0, 4910.0, 4910.0, 0.20366598778004075, 168.66308394857433, 1.4232752036659877], "isController": false}, {"data": ["http://www.goole.com/-4", 1, 0, 0.0, 280.0, 280, 280, 280.0, 280.0, 280.0, 280.0, 3.571428571428571, 10.951450892857142, 1.6496930803571428], "isController": false}, {"data": ["http://www.goole.com/-5", 1, 0, 0.0, 731.0, 731, 731, 731.0, 731.0, 731.0, 731.0, 1.3679890560875512, 120.00229779411765, 0.5557455540355677], "isController": false}, {"data": ["http://www.goole.com/-6", 1, 0, 0.0, 282.0, 282, 282, 282.0, 282.0, 282.0, 282.0, 3.5460992907801416, 39.92478390957447, 1.4683067375886527], "isController": false}, {"data": ["https://playwright.dev/-9", 1, 0, 0.0, 77.0, 77, 77, 77.0, 77.0, 77.0, 77.0, 12.987012987012989, 327.9474431818182, 7.86323051948052], "isController": false}, {"data": ["http://www.goole.com/-7", 1, 0, 0.0, 143.0, 143, 143, 143.0, 143.0, 143.0, 143.0, 6.993006993006993, 54.05239291958043, 3.189193618881119], "isController": false}, {"data": ["http://www.goole.com/-0", 3, 0, 0.0, 432.66666666666663, 135, 881, 282.0, 881.0, 881.0, 881.0, 1.3094718463553032, 12.289938891313836, 0.5081023570493235], "isController": false}, {"data": ["https://playwright.dev/-7", 1, 0, 0.0, 150.0, 150, 150, 150.0, 150.0, 150.0, 150.0, 6.666666666666667, 3091.3671875, 4.0625], "isController": false}, {"data": ["http://www.goole.com/-1", 3, 0, 0.0, 1508.3333333333335, 48, 2618, 1859.0, 2618.0, 2618.0, 2618.0, 0.8431703204047217, 157.79718460160203, 0.44546400716694773], "isController": false}, {"data": ["https://playwright.dev/-8", 1, 0, 0.0, 24.0, 24, 24, 24.0, 24.0, 24.0, 24.0, 41.666666666666664, 2856.5673828125, 25.309244791666668], "isController": false}, {"data": ["http://www.goole.com/-2", 1, 0, 0.0, 390.0, 390, 390, 390.0, 390.0, 390.0, 390.0, 2.5641025641025643, 209.63040865384616, 1.0767227564102564], "isController": false}, {"data": ["https://playwright.dev/-5", 1, 0, 0.0, 231.0, 231, 231, 231.0, 231.0, 231.0, 231.0, 4.329004329004329, 2841.8222402597403, 2.654897186147186], "isController": false}, {"data": ["http://www.goole.com/-3", 1, 0, 0.0, 296.0, 296, 296, 296.0, 296.0, 296.0, 296.0, 3.3783783783783785, 19.80178420608108, 1.5308277027027029], "isController": false}, {"data": ["https://playwright.dev/-6", 1, 0, 0.0, 286.0, 286, 286, 286.0, 286.0, 286.0, 286.0, 3.4965034965034967, 19.59612652972028, 2.1340963723776225], "isController": false}, {"data": ["https://playwright.dev/-3", 1, 0, 0.0, 146.0, 146, 146, 146.0, 146.0, 146.0, 146.0, 6.8493150684931505, 962.0612157534247, 4.227311643835617], "isController": false}, {"data": ["https://playwright.dev/-4", 1, 0, 0.0, 84.0, 84, 84, 84.0, 84.0, 84.0, 84.0, 11.904761904761903, 223.48167782738093, 7.3939732142857135], "isController": false}, {"data": ["https://playwright.dev/-1", 1, 0, 0.0, 96.0, 96, 96, 96.0, 96.0, 96.0, 96.0, 10.416666666666666, 1160.0443522135417, 6.357828776041667], "isController": false}, {"data": ["https://playwright.dev/-2", 1, 0, 0.0, 147.0, 147, 147, 147.0, 147.0, 147.0, 147.0, 6.802721088435374, 49.027423469387756, 4.1121917517006805], "isController": false}, {"data": ["https://playwright.dev/-0", 1, 0, 0.0, 88.0, 88, 88, 88.0, 88.0, 88.0, 88.0, 11.363636363636363, 219.3603515625, 6.680575284090909], "isController": false}, {"data": ["Test", 1, 0, 0.0, 7898.0, 7898, 7898, 7898.0, 7898.0, 7898.0, 7898.0, 0.12661433274246645, 406.8145713313497, 3.108233492656369], "isController": true}, {"data": ["https://www.mojeek.com/search?q=playwright", 1, 0, 0.0, 1479.0, 1479, 1479, 1479.0, 1479.0, 1479.0, 1479.0, 0.676132521974307, 364.85272988505744, 3.7306140128465177], "isController": false}, {"data": ["https://playwright.dev/", 1, 0, 0.0, 959.0, 959, 959, 959.0, 959.0, 959.0, 959.0, 1.0427528675703859, 1923.772117765902, 10.802267987486966], "isController": false}, {"data": ["http://www.goole.com/-8", 1, 0, 0.0, 142.0, 142, 142, 142.0, 142.0, 142.0, 142.0, 7.042253521126761, 7.179797535211268, 3.0672315140845074], "isController": false}, {"data": ["http://www.goole.com/-9", 1, 0, 0.0, 2754.0, 2754, 2754, 2754.0, 2754.0, 2754.0, 2754.0, 0.36310820624546114, 200.77614379084966, 0.29573461328976036], "isController": false}, {"data": ["https://www.mojeek.com/search?q=playwright-8", 1, 0, 0.0, 122.0, 122, 122, 122.0, 122.0, 122.0, 122.0, 8.196721311475411, 10.84624743852459, 5.0749231557377055], "isController": false}, {"data": ["https://www.mojeek.com/search?q=playwright-7", 1, 0, 0.0, 119.0, 119, 119, 119.0, 119.0, 119.0, 119.0, 8.403361344537815, 14.246323529411764, 5.293132878151261], "isController": false}, {"data": ["https://playwright.dev/-12", 1, 0, 0.0, 494.0, 494, 494, 494.0, 494.0, 494.0, 494.0, 2.0242914979757085, 148.47901379048582, 1.2236683957489878], "isController": false}, {"data": ["https://www.mojeek.com/search?q=playwright-6", 1, 0, 0.0, 678.0, 678, 678, 678.0, 678.0, 678.0, 678.0, 1.4749262536873156, 66.12393989675516, 0.9160674778761061], "isController": false}, {"data": ["https://playwright.dev/-13", 1, 0, 0.0, 576.0, 576, 576, 576.0, 576.0, 576.0, 576.0, 1.736111111111111, 25.680541992187504, 1.0494656032986112], "isController": false}, {"data": ["https://www.mojeek.com/search?q=playwright-5", 1, 0, 0.0, 503.0, 503, 503, 503.0, 503.0, 503.0, 503.0, 1.9880715705765406, 49.87458064115308, 1.203715208747515], "isController": false}, {"data": ["https://playwright.dev/-10", 1, 0, 0.0, 266.0, 266, 266, 266.0, 266.0, 266.0, 266.0, 3.7593984962406015, 265.68741188909775, 2.2872121710526314], "isController": false}, {"data": ["https://www.mojeek.com/search?q=playwright-4", 1, 0, 0.0, 679.0, 679, 679, 679.0, 679.0, 679.0, 679.0, 1.4727540500736376, 125.67453286082473, 0.9190330449189985], "isController": false}, {"data": ["https://playwright.dev/-11", 1, 0, 0.0, 518.0, 518, 518, 518.0, 518.0, 518.0, 518.0, 1.9305019305019306, 136.79604548745172, 1.1763996138996138], "isController": false}, {"data": ["http://www.goole.com/-12", 1, 0, 0.0, 154.0, 154, 154, 154.0, 154.0, 154.0, 154.0, 6.493506493506494, 89.84375, 2.5745738636363638], "isController": false}, {"data": ["https://www.mojeek.com/search?q=playwright-3", 1, 0, 0.0, 363.0, 363, 363, 363.0, 363.0, 363.0, 363.0, 2.7548209366391188, 13.669184745179063, 1.6652677341597797], "isController": false}, {"data": ["https://playwright.dev/-16", 1, 0, 0.0, 106.0, 106, 106, 106.0, 106.0, 106.0, 106.0, 9.433962264150942, 575.4532724056604, 5.868587853773585], "isController": false}, {"data": ["http://www.goole.com/-11", 1, 0, 0.0, 2172.0, 2172, 2172, 2172.0, 2172.0, 2172.0, 2172.0, 0.4604051565377532, 1.5790458103130753, 0.17849692104051565], "isController": false}, {"data": ["http://trc.taboola.com/goolecom/trc/3/json?llvl=2&tim=21%3A54%3A44.968&lti=trecs&pubit=i&t=1&data=%7B%22id%22%3A%2276721%22%2C%22sd%22%3A%22%22%2C%22ui%22%3A%22%22%2C%22ii%22%3A%22_homepage_%22%2C%22it%22%3A%22home%22%2C%22vi%22%3A1762199684969%2C%22cv%22%3A%2220251103-4-RELEASE%22%2C%22uiv%22%3A%22default%22%2C%22u%22%3A%22http%3A%2F%2Fwww.goole.com%2F%22%2C%22qs%22%3A%22%22%2C%22bv%22%3A%220%22%2C%22btv%22%3A%220%22%2C%22ul%22%3A%5B%22en-GB%22%2C%22ar-AE%22%2C%22ar%22%2C%22en-US%22%2C%22en%22%5D%2C%22cos%22%3A%224g%22%2C%22bu%22%3A%22http%3A%2F%2Fwww.goole.com%2F%22%2C%22vpi%22%3A%22%2F%22%2C%22bad%22%3A-1%2C%22sw%22%3A1450%2C%22sh%22%3A868%2C%22bw%22%3A1813%2C%22bh%22%3A976%2C%22dw%22%3A1813%2C%22dh%22%3A976%2C%22sde%22%3A%221.060%22%2C%22lt%22%3A%22trecs%22%2C%22r%22%3A%5B%7B%22li%22%3A%22rbox-h2m%22%2C%22uip%22%3A%22Left%20Rail%20Thumbnails%22%2C%22orig_uip%22%3A%22Left%20Rail%20Thumbnails%22%2C%22s%22%3A4%2C%22uim%22%3A%22thumbnails-lr-2-desktop%3Aabp%3D1%22%2C%22cd%22%3A151.98%2C%22mw%22%3A184.01%7D%2C%7B%22li%22%3A%22rbox-h2m%22%2C%22uip%22%3A%22Right%20Rail%20Thumbnails%22%2C%22orig_uip%22%3A%22Right%20Rail%20Thumbnails%22%2C%22s%22%3A4%2C%22uim%22%3A%22thumbnails-rr-desktop%3Aabp%3D1%22%2C%22cd%22%3A0%2C%22mw%22%3A0%2C%22amw%22%3A0%7D%5D%2C%22cacheKey%22%3A%22home%3D_homepage_%2CLeft%20Rail%20Thumbnails%3Dthumbnails-lr-2-desktop%3Aabp%3D1%2CRight%20Rail%20Thumbnails%3Dthumbnails-rr-desktop%3Aabp%3D1%22%2C%22_cn%22%3A%22tions_1%22%2C%22lbt%22%3A1762164968678%2C%22wc%22%3Atrue%7D", 1, 0, 0.0, 550.0, 550, 550, 550.0, 550.0, 550.0, 550.0, 1.8181818181818181, 0.6747159090909091, 3.0610795454545454], "isController": false}, {"data": ["https://www.mojeek.com/search?q=playwright-2", 1, 0, 0.0, 394.0, 394, 394, 394.0, 394.0, 394.0, 394.0, 2.5380710659898473, 12.675483819796954, 1.5193726205583755], "isController": false}, {"data": ["http://www.goole.com/-14", 1, 0, 0.0, 1602.0, 1602, 1602, 1602.0, 1602.0, 1602.0, 1602.0, 0.6242197253433208, 0.2865071004993758, 0.24688377808988762], "isController": false}, {"data": ["https://www.mojeek.com/search?q=playwright-1", 1, 0, 0.0, 537.0, 537, 537, 537.0, 537.0, 537.0, 537.0, 1.86219739292365, 655.5971397811918, 1.132957984171322], "isController": false}, {"data": ["https://playwright.dev/-14", 1, 0, 0.0, 69.0, 69, 69, 69.0, 69.0, 69.0, 69.0, 14.492753623188406, 248.92436594202897, 8.803215579710145], "isController": false}, {"data": ["http://www.goole.com/-13", 1, 0, 0.0, 216.0, 216, 216, 216.0, 216.0, 216.0, 216.0, 4.62962962962963, 113.52991174768519, 1.853660300925926], "isController": false}, {"data": ["https://www.mojeek.com/search?q=playwright-0", 1, 0, 0.0, 748.0, 748, 748, 748.0, 748.0, 748.0, 748.0, 1.3368983957219251, 25.84887825868984, 0.8107557653743316], "isController": false}, {"data": ["https://playwright.dev/-15", 1, 0, 0.0, 37.0, 37, 37, 37.0, 37.0, 37.0, 37.0, 27.027027027027028, 550.3061655405405, 16.65434966216216], "isController": false}, {"data": ["http://www.goole.com/-10", 1, 0, 0.0, 314.0, 314, 314, 314.0, 314.0, 314.0, 314.0, 3.1847133757961785, 14.188146894904458, 1.2689092356687899], "isController": false}]}, function(index, item){
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
