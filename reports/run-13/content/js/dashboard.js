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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.85, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "http://www.goole.com/"], "isController": false}, {"data": [1.0, 500, 1500, "http://www.goole.com/-4"], "isController": false}, {"data": [1.0, 500, 1500, "http://www.goole.com/-5"], "isController": false}, {"data": [1.0, 500, 1500, "http://www.goole.com/-6"], "isController": false}, {"data": [1.0, 500, 1500, "https://playwright.dev/-9"], "isController": false}, {"data": [1.0, 500, 1500, "http://www.goole.com/-7"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "http://www.goole.com/-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://playwright.dev/-7"], "isController": false}, {"data": [0.5, 500, 1500, "http://www.goole.com/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://playwright.dev/-8"], "isController": false}, {"data": [1.0, 500, 1500, "http://www.goole.com/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://playwright.dev/-5"], "isController": false}, {"data": [1.0, 500, 1500, "http://www.goole.com/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://playwright.dev/-6"], "isController": false}, {"data": [1.0, 500, 1500, "https://playwright.dev/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://playwright.dev/-4"], "isController": false}, {"data": [1.0, 500, 1500, "https://playwright.dev/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://playwright.dev/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://playwright.dev/-0"], "isController": false}, {"data": [0.0, 500, 1500, "Test"], "isController": true}, {"data": [0.5, 500, 1500, "https://www.mojeek.com/search?q=playwright"], "isController": false}, {"data": [1.0, 500, 1500, "https://playwright.dev/"], "isController": false}, {"data": [1.0, 500, 1500, "http://www.goole.com/-8"], "isController": false}, {"data": [0.0, 500, 1500, "http://www.goole.com/-9"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.mojeek.com/search?q=playwright-8"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.mojeek.com/search?q=playwright-7"], "isController": false}, {"data": [1.0, 500, 1500, "https://playwright.dev/-12"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.mojeek.com/search?q=playwright-6"], "isController": false}, {"data": [1.0, 500, 1500, "https://playwright.dev/-13"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.mojeek.com/search?q=playwright-5"], "isController": false}, {"data": [1.0, 500, 1500, "https://playwright.dev/-10"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.mojeek.com/search?q=playwright-4"], "isController": false}, {"data": [1.0, 500, 1500, "https://playwright.dev/-11"], "isController": false}, {"data": [1.0, 500, 1500, "http://www.goole.com/-12"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.mojeek.com/search?q=playwright-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://playwright.dev/-16"], "isController": false}, {"data": [0.0, 500, 1500, "http://www.goole.com/-11"], "isController": false}, {"data": [1.0, 500, 1500, "http://trc.taboola.com/goolecom/trc/3/json?llvl=2&tim=21%3A54%3A44.968&lti=trecs&pubit=i&t=1&data=%7B%22id%22%3A%2276721%22%2C%22sd%22%3A%22%22%2C%22ui%22%3A%22%22%2C%22ii%22%3A%22_homepage_%22%2C%22it%22%3A%22home%22%2C%22vi%22%3A1762199684969%2C%22cv%22%3A%2220251103-4-RELEASE%22%2C%22uiv%22%3A%22default%22%2C%22u%22%3A%22http%3A%2F%2Fwww.goole.com%2F%22%2C%22qs%22%3A%22%22%2C%22bv%22%3A%220%22%2C%22btv%22%3A%220%22%2C%22ul%22%3A%5B%22en-GB%22%2C%22ar-AE%22%2C%22ar%22%2C%22en-US%22%2C%22en%22%5D%2C%22cos%22%3A%224g%22%2C%22bu%22%3A%22http%3A%2F%2Fwww.goole.com%2F%22%2C%22vpi%22%3A%22%2F%22%2C%22bad%22%3A-1%2C%22sw%22%3A1450%2C%22sh%22%3A868%2C%22bw%22%3A1813%2C%22bh%22%3A976%2C%22dw%22%3A1813%2C%22dh%22%3A976%2C%22sde%22%3A%221.060%22%2C%22lt%22%3A%22trecs%22%2C%22r%22%3A%5B%7B%22li%22%3A%22rbox-h2m%22%2C%22uip%22%3A%22Left%20Rail%20Thumbnails%22%2C%22orig_uip%22%3A%22Left%20Rail%20Thumbnails%22%2C%22s%22%3A4%2C%22uim%22%3A%22thumbnails-lr-2-desktop%3Aabp%3D1%22%2C%22cd%22%3A151.98%2C%22mw%22%3A184.01%7D%2C%7B%22li%22%3A%22rbox-h2m%22%2C%22uip%22%3A%22Right%20Rail%20Thumbnails%22%2C%22orig_uip%22%3A%22Right%20Rail%20Thumbnails%22%2C%22s%22%3A4%2C%22uim%22%3A%22thumbnails-rr-desktop%3Aabp%3D1%22%2C%22cd%22%3A0%2C%22mw%22%3A0%2C%22amw%22%3A0%7D%5D%2C%22cacheKey%22%3A%22home%3D_homepage_%2CLeft%20Rail%20Thumbnails%3Dthumbnails-lr-2-desktop%3Aabp%3D1%2CRight%20Rail%20Thumbnails%3Dthumbnails-rr-desktop%3Aabp%3D1%22%2C%22_cn%22%3A%22tions_1%22%2C%22lbt%22%3A1762164968678%2C%22wc%22%3Atrue%7D"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.mojeek.com/search?q=playwright-2"], "isController": false}, {"data": [0.0, 500, 1500, "http://www.goole.com/-14"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.mojeek.com/search?q=playwright-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://playwright.dev/-14"], "isController": false}, {"data": [1.0, 500, 1500, "http://www.goole.com/-13"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.mojeek.com/search?q=playwright-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://playwright.dev/-15"], "isController": false}, {"data": [1.0, 500, 1500, "http://www.goole.com/-10"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 49, 0, 0.0, 625.1632653061224, 17, 5439, 151.0, 3698.0, 3967.5, 5439.0, 1.9791582518781805, 282.1417572097908, 1.9797499166935941], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["http://www.goole.com/", 1, 0, 0.0, 5439.0, 5439, 5439, 5439.0, 5439.0, 5439.0, 5439.0, 0.18385732671446958, 152.27354666528774, 1.2848467089538518], "isController": false}, {"data": ["http://www.goole.com/-4", 1, 0, 0.0, 202.0, 202, 202, 202.0, 202.0, 202.0, 202.0, 4.9504950495049505, 15.180228960396038, 2.2867032797029703], "isController": false}, {"data": ["http://www.goole.com/-5", 1, 0, 0.0, 488.0, 488, 488, 488.0, 488.0, 488.0, 488.0, 2.0491803278688527, 179.7575403432377, 0.8324795081967213], "isController": false}, {"data": ["http://www.goole.com/-6", 1, 0, 0.0, 199.0, 199, 199, 199.0, 199.0, 199.0, 199.0, 5.025125628140704, 56.576829459798994, 2.0807160804020097], "isController": false}, {"data": ["https://playwright.dev/-9", 1, 0, 0.0, 91.0, 91, 91, 91.0, 91.0, 91.0, 91.0, 10.989010989010989, 277.52618475274727, 6.653502747252747], "isController": false}, {"data": ["http://www.goole.com/-7", 1, 0, 0.0, 104.0, 104, 104, 104.0, 104.0, 104.0, 104.0, 9.615384615384617, 74.32204026442308, 4.385141225961538], "isController": false}, {"data": ["http://www.goole.com/-0", 3, 0, 0.0, 321.6666666666667, 70, 791, 104.0, 791.0, 791.0, 791.0, 1.9920318725099602, 18.738846696547146, 0.7729498671978752], "isController": false}, {"data": ["https://playwright.dev/-7", 1, 0, 0.0, 88.0, 88, 88, 88.0, 88.0, 88.0, 88.0, 11.363636363636363, 5269.153941761364, 6.924715909090909], "isController": false}, {"data": ["http://www.goole.com/-1", 3, 0, 0.0, 1568.0, 37, 3932, 735.0, 3932.0, 3932.0, 3932.0, 0.6687472135532768, 125.15782608392779, 0.3533127368479715], "isController": false}, {"data": ["https://playwright.dev/-8", 1, 0, 0.0, 55.0, 55, 55, 55.0, 55.0, 55.0, 55.0, 18.18181818181818, 1246.5021306818182, 11.044034090909092], "isController": false}, {"data": ["http://www.goole.com/-2", 1, 0, 0.0, 479.0, 479, 479, 479.0, 479.0, 479.0, 479.0, 2.08768267223382, 170.68029097077246, 0.8766636221294364], "isController": false}, {"data": ["https://playwright.dev/-5", 1, 0, 0.0, 94.0, 94, 94, 94.0, 94.0, 94.0, 94.0, 10.638297872340425, 6983.647772606383, 6.524268617021277], "isController": false}, {"data": ["http://www.goole.com/-3", 1, 0, 0.0, 206.0, 206, 206, 206.0, 206.0, 206.0, 206.0, 4.854368932038835, 28.453049150485437, 2.1996359223300974], "isController": false}, {"data": ["https://playwright.dev/-6", 1, 0, 0.0, 49.0, 49, 49, 49.0, 49.0, 49.0, 49.0, 20.408163265306122, 113.95886479591836, 12.456154336734693], "isController": false}, {"data": ["https://playwright.dev/-3", 1, 0, 0.0, 164.0, 164, 164, 164.0, 164.0, 164.0, 164.0, 6.097560975609756, 856.4750857469512, 3.763338414634146], "isController": false}, {"data": ["https://playwright.dev/-4", 1, 0, 0.0, 71.0, 71, 71, 71.0, 71.0, 71.0, 71.0, 14.084507042253522, 264.37334947183103, 8.747799295774648], "isController": false}, {"data": ["https://playwright.dev/-1", 1, 0, 0.0, 128.0, 128, 128, 128.0, 128.0, 128.0, 128.0, 7.8125, 870.025634765625, 4.76837158203125], "isController": false}, {"data": ["https://playwright.dev/-2", 1, 0, 0.0, 67.0, 67, 67, 67.0, 67.0, 67.0, 67.0, 14.925373134328359, 107.2178171641791, 9.02227145522388], "isController": false}, {"data": ["https://playwright.dev/-0", 1, 0, 0.0, 42.0, 42, 42, 42.0, 42.0, 42.0, 42.0, 23.809523809523807, 459.70517113095235, 13.997395833333332], "isController": false}, {"data": ["Test", 1, 0, 0.0, 7127.0, 7127, 7127, 7127.0, 7127.0, 7127.0, 7127.0, 0.14031149151115474, 450.82822146415043, 3.444482689069735], "isController": true}, {"data": ["https://www.mojeek.com/search?q=playwright", 1, 0, 0.0, 980.0, 980, 980, 980.0, 980.0, 980.0, 980.0, 1.0204081632653061, 550.6297831632653, 5.630181760204081], "isController": false}, {"data": ["https://playwright.dev/", 1, 0, 0.0, 333.0, 333, 333, 333.0, 333.0, 333.0, 333.0, 3.003003003003003, 5540.085984421921, 31.109234234234233], "isController": false}, {"data": ["http://www.goole.com/-8", 1, 0, 0.0, 116.0, 116, 116, 116.0, 116.0, 116.0, 116.0, 8.620689655172413, 8.7890625, 3.754714439655172], "isController": false}, {"data": ["http://www.goole.com/-9", 1, 0, 0.0, 4003.0, 4003, 4003, 4003.0, 4003.0, 4003.0, 4003.0, 0.2498126405196103, 138.13468023982014, 0.20346068573569823], "isController": false}, {"data": ["https://www.mojeek.com/search?q=playwright-8", 1, 0, 0.0, 95.0, 95, 95, 95.0, 95.0, 95.0, 95.0, 10.526315789473683, 13.928865131578947, 6.517269736842105], "isController": false}, {"data": ["https://www.mojeek.com/search?q=playwright-7", 1, 0, 0.0, 94.0, 94, 94, 94.0, 94.0, 94.0, 94.0, 10.638297872340425, 18.03523936170213, 6.700880984042553], "isController": false}, {"data": ["https://playwright.dev/-12", 1, 0, 0.0, 41.0, 41, 41, 41.0, 41.0, 41.0, 41.0, 24.390243902439025, 1789.0625, 14.743711890243901], "isController": false}, {"data": ["https://www.mojeek.com/search?q=playwright-6", 1, 0, 0.0, 456.0, 456, 456, 456.0, 456.0, 456.0, 456.0, 2.1929824561403506, 98.31585800438596, 1.362047697368421], "isController": false}, {"data": ["https://playwright.dev/-13", 1, 0, 0.0, 70.0, 70, 70, 70.0, 70.0, 70.0, 70.0, 14.285714285714285, 211.31417410714283, 8.635602678571427], "isController": false}, {"data": ["https://www.mojeek.com/search?q=playwright-5", 1, 0, 0.0, 365.0, 365, 365, 365.0, 365.0, 365.0, 365.0, 2.73972602739726, 68.73127140410959, 1.658818493150685], "isController": false}, {"data": ["https://playwright.dev/-10", 1, 0, 0.0, 17.0, 17, 17, 17.0, 17.0, 17.0, 17.0, 58.8235294117647, 4157.111672794117, 35.78814338235294], "isController": false}, {"data": ["https://www.mojeek.com/search?q=playwright-4", 1, 0, 0.0, 458.0, 458, 458, 458.0, 458.0, 458.0, 458.0, 2.1834061135371177, 186.31661094432314, 1.3624965884279476], "isController": false}, {"data": ["https://playwright.dev/-11", 1, 0, 0.0, 38.0, 38, 38, 38.0, 38.0, 38.0, 38.0, 26.31578947368421, 1864.7974917763158, 16.036184210526315], "isController": false}, {"data": ["http://www.goole.com/-12", 1, 0, 0.0, 151.0, 151, 151, 151.0, 151.0, 151.0, 151.0, 6.622516556291391, 91.62872516556291, 2.6257243377483444], "isController": false}, {"data": ["https://www.mojeek.com/search?q=playwright-3", 1, 0, 0.0, 267.0, 267, 267, 267.0, 267.0, 267.0, 267.0, 3.745318352059925, 18.583947799625467, 2.2640156835205993], "isController": false}, {"data": ["https://playwright.dev/-16", 1, 0, 0.0, 35.0, 35, 35, 35.0, 35.0, 35.0, 35.0, 28.57142857142857, 1742.8850446428569, 17.7734375], "isController": false}, {"data": ["http://www.goole.com/-11", 1, 0, 0.0, 3843.0, 3843, 3843, 3843.0, 3843.0, 3843.0, 3843.0, 0.2602133749674733, 0.8924505594587562, 0.10088350572469425], "isController": false}, {"data": ["http://trc.taboola.com/goolecom/trc/3/json?llvl=2&tim=21%3A54%3A44.968&lti=trecs&pubit=i&t=1&data=%7B%22id%22%3A%2276721%22%2C%22sd%22%3A%22%22%2C%22ui%22%3A%22%22%2C%22ii%22%3A%22_homepage_%22%2C%22it%22%3A%22home%22%2C%22vi%22%3A1762199684969%2C%22cv%22%3A%2220251103-4-RELEASE%22%2C%22uiv%22%3A%22default%22%2C%22u%22%3A%22http%3A%2F%2Fwww.goole.com%2F%22%2C%22qs%22%3A%22%22%2C%22bv%22%3A%220%22%2C%22btv%22%3A%220%22%2C%22ul%22%3A%5B%22en-GB%22%2C%22ar-AE%22%2C%22ar%22%2C%22en-US%22%2C%22en%22%5D%2C%22cos%22%3A%224g%22%2C%22bu%22%3A%22http%3A%2F%2Fwww.goole.com%2F%22%2C%22vpi%22%3A%22%2F%22%2C%22bad%22%3A-1%2C%22sw%22%3A1450%2C%22sh%22%3A868%2C%22bw%22%3A1813%2C%22bh%22%3A976%2C%22dw%22%3A1813%2C%22dh%22%3A976%2C%22sde%22%3A%221.060%22%2C%22lt%22%3A%22trecs%22%2C%22r%22%3A%5B%7B%22li%22%3A%22rbox-h2m%22%2C%22uip%22%3A%22Left%20Rail%20Thumbnails%22%2C%22orig_uip%22%3A%22Left%20Rail%20Thumbnails%22%2C%22s%22%3A4%2C%22uim%22%3A%22thumbnails-lr-2-desktop%3Aabp%3D1%22%2C%22cd%22%3A151.98%2C%22mw%22%3A184.01%7D%2C%7B%22li%22%3A%22rbox-h2m%22%2C%22uip%22%3A%22Right%20Rail%20Thumbnails%22%2C%22orig_uip%22%3A%22Right%20Rail%20Thumbnails%22%2C%22s%22%3A4%2C%22uim%22%3A%22thumbnails-rr-desktop%3Aabp%3D1%22%2C%22cd%22%3A0%2C%22mw%22%3A0%2C%22amw%22%3A0%7D%5D%2C%22cacheKey%22%3A%22home%3D_homepage_%2CLeft%20Rail%20Thumbnails%3Dthumbnails-lr-2-desktop%3Aabp%3D1%2CRight%20Rail%20Thumbnails%3Dthumbnails-rr-desktop%3Aabp%3D1%22%2C%22_cn%22%3A%22tions_1%22%2C%22lbt%22%3A1762164968678%2C%22wc%22%3Atrue%7D", 1, 0, 0.0, 375.0, 375, 375, 375.0, 375.0, 375.0, 375.0, 2.6666666666666665, 0.9895833333333334, 4.489583333333333], "isController": false}, {"data": ["https://www.mojeek.com/search?q=playwright-2", 1, 0, 0.0, 294.0, 294, 294, 294.0, 294.0, 294.0, 294.0, 3.401360544217687, 16.98687287414966, 2.036166028911565], "isController": false}, {"data": ["http://www.goole.com/-14", 1, 0, 0.0, 3698.0, 3698, 3698, 3698.0, 3698.0, 3698.0, 3698.0, 0.2704164413196323, 0.12411692130881558, 0.10695181517036235], "isController": false}, {"data": ["https://www.mojeek.com/search?q=playwright-1", 1, 0, 0.0, 334.0, 334, 334, 334.0, 334.0, 334.0, 334.0, 2.9940119760479043, 1054.0588744386228, 1.8215522080838322], "isController": false}, {"data": ["https://playwright.dev/-14", 1, 0, 0.0, 32.0, 32, 32, 32.0, 32.0, 32.0, 32.0, 31.25, 536.80419921875, 18.98193359375], "isController": false}, {"data": ["http://www.goole.com/-13", 1, 0, 0.0, 311.0, 311, 311, 311.0, 311.0, 311.0, 311.0, 3.215434083601286, 78.85035671221866, 1.2874296623794212], "isController": false}, {"data": ["https://www.mojeek.com/search?q=playwright-0", 1, 0, 0.0, 473.0, 473, 473, 473.0, 473.0, 473.0, 473.0, 2.1141649048625792, 40.87729585095138, 1.2821253964059198], "isController": false}, {"data": ["https://playwright.dev/-15", 1, 0, 0.0, 17.0, 17, 17, 17.0, 17.0, 17.0, 17.0, 58.8235294117647, 1197.7251838235293, 36.24770220588235], "isController": false}, {"data": ["http://www.goole.com/-10", 1, 0, 0.0, 102.0, 102, 102, 102.0, 102.0, 102.0, 102.0, 9.803921568627452, 43.677236519607845, 3.9062500000000004], "isController": false}]}, function(index, item){
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
