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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.82, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "http://www.goole.com/"], "isController": false}, {"data": [1.0, 500, 1500, "http://www.goole.com/-4"], "isController": false}, {"data": [0.5, 500, 1500, "http://www.goole.com/-5"], "isController": false}, {"data": [1.0, 500, 1500, "http://www.goole.com/-6"], "isController": false}, {"data": [1.0, 500, 1500, "https://playwright.dev/-9"], "isController": false}, {"data": [1.0, 500, 1500, "http://www.goole.com/-7"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "http://www.goole.com/-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://playwright.dev/-7"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "http://www.goole.com/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://playwright.dev/-8"], "isController": false}, {"data": [0.5, 500, 1500, "http://www.goole.com/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://playwright.dev/-5"], "isController": false}, {"data": [1.0, 500, 1500, "http://www.goole.com/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://playwright.dev/-6"], "isController": false}, {"data": [1.0, 500, 1500, "https://playwright.dev/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://playwright.dev/-4"], "isController": false}, {"data": [1.0, 500, 1500, "https://playwright.dev/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://playwright.dev/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://playwright.dev/-0"], "isController": false}, {"data": [0.0, 500, 1500, "Test"], "isController": true}, {"data": [0.0, 500, 1500, "https://www.mojeek.com/search?q=playwright"], "isController": false}, {"data": [1.0, 500, 1500, "https://playwright.dev/"], "isController": false}, {"data": [1.0, 500, 1500, "http://www.goole.com/-8"], "isController": false}, {"data": [0.0, 500, 1500, "http://www.goole.com/-9"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.mojeek.com/search?q=playwright-8"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.mojeek.com/search?q=playwright-7"], "isController": false}, {"data": [1.0, 500, 1500, "https://playwright.dev/-12"], "isController": false}, {"data": [0.5, 500, 1500, "https://www.mojeek.com/search?q=playwright-6"], "isController": false}, {"data": [1.0, 500, 1500, "https://playwright.dev/-13"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.mojeek.com/search?q=playwright-5"], "isController": false}, {"data": [1.0, 500, 1500, "https://playwright.dev/-10"], "isController": false}, {"data": [0.5, 500, 1500, "https://www.mojeek.com/search?q=playwright-4"], "isController": false}, {"data": [1.0, 500, 1500, "https://playwright.dev/-11"], "isController": false}, {"data": [1.0, 500, 1500, "http://www.goole.com/-12"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.mojeek.com/search?q=playwright-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://playwright.dev/-16"], "isController": false}, {"data": [0.5, 500, 1500, "http://www.goole.com/-11"], "isController": false}, {"data": [1.0, 500, 1500, "http://trc.taboola.com/goolecom/trc/3/json?llvl=2&tim=21%3A54%3A44.968&lti=trecs&pubit=i&t=1&data=%7B%22id%22%3A%2276721%22%2C%22sd%22%3A%22%22%2C%22ui%22%3A%22%22%2C%22ii%22%3A%22_homepage_%22%2C%22it%22%3A%22home%22%2C%22vi%22%3A1762199684969%2C%22cv%22%3A%2220251103-4-RELEASE%22%2C%22uiv%22%3A%22default%22%2C%22u%22%3A%22http%3A%2F%2Fwww.goole.com%2F%22%2C%22qs%22%3A%22%22%2C%22bv%22%3A%220%22%2C%22btv%22%3A%220%22%2C%22ul%22%3A%5B%22en-GB%22%2C%22ar-AE%22%2C%22ar%22%2C%22en-US%22%2C%22en%22%5D%2C%22cos%22%3A%224g%22%2C%22bu%22%3A%22http%3A%2F%2Fwww.goole.com%2F%22%2C%22vpi%22%3A%22%2F%22%2C%22bad%22%3A-1%2C%22sw%22%3A1450%2C%22sh%22%3A868%2C%22bw%22%3A1813%2C%22bh%22%3A976%2C%22dw%22%3A1813%2C%22dh%22%3A976%2C%22sde%22%3A%221.060%22%2C%22lt%22%3A%22trecs%22%2C%22r%22%3A%5B%7B%22li%22%3A%22rbox-h2m%22%2C%22uip%22%3A%22Left%20Rail%20Thumbnails%22%2C%22orig_uip%22%3A%22Left%20Rail%20Thumbnails%22%2C%22s%22%3A4%2C%22uim%22%3A%22thumbnails-lr-2-desktop%3Aabp%3D1%22%2C%22cd%22%3A151.98%2C%22mw%22%3A184.01%7D%2C%7B%22li%22%3A%22rbox-h2m%22%2C%22uip%22%3A%22Right%20Rail%20Thumbnails%22%2C%22orig_uip%22%3A%22Right%20Rail%20Thumbnails%22%2C%22s%22%3A4%2C%22uim%22%3A%22thumbnails-rr-desktop%3Aabp%3D1%22%2C%22cd%22%3A0%2C%22mw%22%3A0%2C%22amw%22%3A0%7D%5D%2C%22cacheKey%22%3A%22home%3D_homepage_%2CLeft%20Rail%20Thumbnails%3Dthumbnails-lr-2-desktop%3Aabp%3D1%2CRight%20Rail%20Thumbnails%3Dthumbnails-rr-desktop%3Aabp%3D1%22%2C%22_cn%22%3A%22tions_1%22%2C%22lbt%22%3A1762164968678%2C%22wc%22%3Atrue%7D"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.mojeek.com/search?q=playwright-2"], "isController": false}, {"data": [0.5, 500, 1500, "http://www.goole.com/-14"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.mojeek.com/search?q=playwright-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://playwright.dev/-14"], "isController": false}, {"data": [1.0, 500, 1500, "http://www.goole.com/-13"], "isController": false}, {"data": [0.5, 500, 1500, "https://www.mojeek.com/search?q=playwright-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://playwright.dev/-15"], "isController": false}, {"data": [1.0, 500, 1500, "http://www.goole.com/-10"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 49, 0, 0.0, 443.0204081632653, 46, 2859, 151.0, 1454.0, 1795.0, 2859.0, 2.63724434876211, 375.9808724098493, 2.638032746905275], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["http://www.goole.com/", 1, 0, 0.0, 2859.0, 2859, 2859, 2859.0, 2859.0, 2859.0, 2859.0, 0.3497726477789437, 289.6681122114376, 2.4443096362364463], "isController": false}, {"data": ["http://www.goole.com/-4", 1, 0, 0.0, 260.0, 260, 260, 260.0, 260.0, 260.0, 260.0, 3.8461538461538463, 11.793870192307692, 1.776592548076923], "isController": false}, {"data": ["http://www.goole.com/-5", 1, 0, 0.0, 582.0, 582, 582, 582.0, 582.0, 582.0, 582.0, 1.7182130584192439, 150.72453554553266, 0.6980240549828179], "isController": false}, {"data": ["http://www.goole.com/-6", 1, 0, 0.0, 237.0, 237, 237, 237.0, 237.0, 237.0, 237.0, 4.219409282700422, 47.505439082278485, 1.7470991561181435], "isController": false}, {"data": ["https://playwright.dev/-9", 1, 0, 0.0, 53.0, 53, 53, 53.0, 53.0, 53.0, 53.0, 18.867924528301884, 476.5072228773585, 11.423938679245284], "isController": false}, {"data": ["http://www.goole.com/-7", 1, 0, 0.0, 136.0, 136, 136, 136.0, 136.0, 136.0, 136.0, 7.352941176470588, 56.834501378676464, 3.353343290441176], "isController": false}, {"data": ["http://www.goole.com/-0", 3, 0, 0.0, 299.3333333333333, 55, 717, 126.0, 717.0, 717.0, 717.0, 2.136752136752137, 20.068220263532766, 0.8291043447293448], "isController": false}, {"data": ["https://playwright.dev/-7", 1, 0, 0.0, 98.0, 98, 98, 98.0, 98.0, 98.0, 98.0, 10.204081632653061, 4731.6944355867345, 6.218112244897959], "isController": false}, {"data": ["http://www.goole.com/-1", 3, 0, 0.0, 710.3333333333333, 60, 1454, 617.0, 1454.0, 1454.0, 1454.0, 1.4858841010401187, 278.08233887444277, 0.7850227526002971], "isController": false}, {"data": ["https://playwright.dev/-8", 1, 0, 0.0, 96.0, 96, 96, 96.0, 96.0, 96.0, 96.0, 10.416666666666666, 714.1316731770834, 6.327311197916667], "isController": false}, {"data": ["http://www.goole.com/-2", 1, 0, 0.0, 625.0, 625, 625, 625.0, 625.0, 625.0, 625.0, 1.6, 130.809375, 0.671875], "isController": false}, {"data": ["https://playwright.dev/-5", 1, 0, 0.0, 137.0, 137, 137, 137.0, 137.0, 137.0, 137.0, 7.299270072992701, 4791.550239507299, 4.476505474452554], "isController": false}, {"data": ["http://www.goole.com/-3", 1, 0, 0.0, 239.0, 239, 239, 239.0, 239.0, 239.0, 239.0, 4.184100418410042, 24.524385460251047, 1.8959205020920502], "isController": false}, {"data": ["https://playwright.dev/-6", 1, 0, 0.0, 104.0, 104, 104, 104.0, 104.0, 104.0, 104.0, 9.615384615384617, 53.879957932692314, 5.868765024038462], "isController": false}, {"data": ["https://playwright.dev/-3", 1, 0, 0.0, 122.0, 122, 122, 122.0, 122.0, 122.0, 122.0, 8.196721311475411, 1151.3271644467213, 5.058913934426229], "isController": false}, {"data": ["https://playwright.dev/-4", 1, 0, 0.0, 108.0, 108, 108, 108.0, 108.0, 108.0, 108.0, 9.25925925925926, 173.81004050925927, 5.750868055555555], "isController": false}, {"data": ["https://playwright.dev/-1", 1, 0, 0.0, 71.0, 71, 71, 71.0, 71.0, 71.0, 71.0, 14.084507042253522, 1568.4556558098593, 8.596500880281692], "isController": false}, {"data": ["https://playwright.dev/-2", 1, 0, 0.0, 108.0, 108, 108, 108.0, 108.0, 108.0, 108.0, 9.25925925925926, 66.7136863425926, 5.5971498842592595], "isController": false}, {"data": ["https://playwright.dev/-0", 1, 0, 0.0, 87.0, 87, 87, 87.0, 87.0, 87.0, 87.0, 11.494252873563218, 221.65723778735634, 6.757363505747127], "isController": false}, {"data": ["Test", 1, 0, 0.0, 5823.0, 5823, 5823, 5823.0, 5823.0, 5823.0, 5823.0, 0.17173278378842521, 551.8267404044307, 4.2158385926498365], "isController": true}, {"data": ["https://www.mojeek.com/search?q=playwright", 1, 0, 0.0, 2080.0, 2080, 2080, 2080.0, 2080.0, 2080.0, 2080.0, 0.4807692307692308, 259.56092247596155, 2.6526817908653846], "isController": false}, {"data": ["https://playwright.dev/", 1, 0, 0.0, 469.0, 469, 469, 469.0, 469.0, 469.0, 469.0, 2.1321961620469083, 3933.620818896589, 22.088219616204693], "isController": false}, {"data": ["http://www.goole.com/-8", 1, 0, 0.0, 119.0, 119, 119, 119.0, 119.0, 119.0, 119.0, 8.403361344537815, 8.56748949579832, 3.660057773109244], "isController": false}, {"data": ["http://www.goole.com/-9", 1, 0, 0.0, 1510.0, 1510, 1510, 1510.0, 1510.0, 1510.0, 1510.0, 0.6622516556291391, 366.1876552152318, 0.5393729304635762], "isController": false}, {"data": ["https://www.mojeek.com/search?q=playwright-8", 1, 0, 0.0, 109.0, 109, 109, 109.0, 109.0, 109.0, 109.0, 9.174311926605505, 12.139836582568808, 5.680189220183486], "isController": false}, {"data": ["https://www.mojeek.com/search?q=playwright-7", 1, 0, 0.0, 127.0, 127, 127, 127.0, 127.0, 127.0, 127.0, 7.874015748031496, 13.348917322834646, 4.95970718503937], "isController": false}, {"data": ["https://playwright.dev/-12", 1, 0, 0.0, 46.0, 46, 46, 46.0, 46.0, 46.0, 46.0, 21.73913043478261, 1594.5991847826087, 13.141134510869566], "isController": false}, {"data": ["https://www.mojeek.com/search?q=playwright-6", 1, 0, 0.0, 561.0, 561, 561, 561.0, 561.0, 561.0, 561.0, 1.7825311942959001, 79.91449420677361, 1.107118983957219], "isController": false}, {"data": ["https://playwright.dev/-13", 1, 0, 0.0, 108.0, 108, 108, 108.0, 108.0, 108.0, 108.0, 9.25925925925926, 136.97193287037038, 5.5971498842592595], "isController": false}, {"data": ["https://www.mojeek.com/search?q=playwright-5", 1, 0, 0.0, 469.0, 469, 469, 469.0, 469.0, 469.0, 469.0, 2.1321961620469083, 53.49022188166312, 1.2909781449893392], "isController": false}, {"data": ["https://playwright.dev/-10", 1, 0, 0.0, 87.0, 87, 87, 87.0, 87.0, 87.0, 87.0, 11.494252873563218, 812.3428520114943, 6.993085488505748], "isController": false}, {"data": ["https://www.mojeek.com/search?q=playwright-4", 1, 0, 0.0, 558.0, 558, 558, 558.0, 558.0, 558.0, 558.0, 1.7921146953405018, 152.92653729838707, 1.118321572580645], "isController": false}, {"data": ["https://playwright.dev/-11", 1, 0, 0.0, 172.0, 172, 172, 172.0, 172.0, 172.0, 172.0, 5.813953488372093, 411.9901435319768, 3.5428779069767447], "isController": false}, {"data": ["http://www.goole.com/-12", 1, 0, 0.0, 129.0, 129, 129, 129.0, 129.0, 129.0, 129.0, 7.751937984496124, 107.25532945736434, 3.073522286821705], "isController": false}, {"data": ["https://www.mojeek.com/search?q=playwright-3", 1, 0, 0.0, 325.0, 325, 325, 325.0, 325.0, 325.0, 325.0, 3.076923076923077, 15.267427884615383, 1.8599759615384615], "isController": false}, {"data": ["https://playwright.dev/-16", 1, 0, 0.0, 86.0, 86, 86, 86.0, 86.0, 86.0, 86.0, 11.627906976744185, 709.3250363372093, 7.233375726744186], "isController": false}, {"data": ["http://www.goole.com/-11", 1, 0, 0.0, 1350.0, 1350, 1350, 1350.0, 1350.0, 1350.0, 1350.0, 0.7407407407407407, 2.540509259259259, 0.28718171296296297], "isController": false}, {"data": ["http://trc.taboola.com/goolecom/trc/3/json?llvl=2&tim=21%3A54%3A44.968&lti=trecs&pubit=i&t=1&data=%7B%22id%22%3A%2276721%22%2C%22sd%22%3A%22%22%2C%22ui%22%3A%22%22%2C%22ii%22%3A%22_homepage_%22%2C%22it%22%3A%22home%22%2C%22vi%22%3A1762199684969%2C%22cv%22%3A%2220251103-4-RELEASE%22%2C%22uiv%22%3A%22default%22%2C%22u%22%3A%22http%3A%2F%2Fwww.goole.com%2F%22%2C%22qs%22%3A%22%22%2C%22bv%22%3A%220%22%2C%22btv%22%3A%220%22%2C%22ul%22%3A%5B%22en-GB%22%2C%22ar-AE%22%2C%22ar%22%2C%22en-US%22%2C%22en%22%5D%2C%22cos%22%3A%224g%22%2C%22bu%22%3A%22http%3A%2F%2Fwww.goole.com%2F%22%2C%22vpi%22%3A%22%2F%22%2C%22bad%22%3A-1%2C%22sw%22%3A1450%2C%22sh%22%3A868%2C%22bw%22%3A1813%2C%22bh%22%3A976%2C%22dw%22%3A1813%2C%22dh%22%3A976%2C%22sde%22%3A%221.060%22%2C%22lt%22%3A%22trecs%22%2C%22r%22%3A%5B%7B%22li%22%3A%22rbox-h2m%22%2C%22uip%22%3A%22Left%20Rail%20Thumbnails%22%2C%22orig_uip%22%3A%22Left%20Rail%20Thumbnails%22%2C%22s%22%3A4%2C%22uim%22%3A%22thumbnails-lr-2-desktop%3Aabp%3D1%22%2C%22cd%22%3A151.98%2C%22mw%22%3A184.01%7D%2C%7B%22li%22%3A%22rbox-h2m%22%2C%22uip%22%3A%22Right%20Rail%20Thumbnails%22%2C%22orig_uip%22%3A%22Right%20Rail%20Thumbnails%22%2C%22s%22%3A4%2C%22uim%22%3A%22thumbnails-rr-desktop%3Aabp%3D1%22%2C%22cd%22%3A0%2C%22mw%22%3A0%2C%22amw%22%3A0%7D%5D%2C%22cacheKey%22%3A%22home%3D_homepage_%2CLeft%20Rail%20Thumbnails%3Dthumbnails-lr-2-desktop%3Aabp%3D1%2CRight%20Rail%20Thumbnails%3Dthumbnails-rr-desktop%3Aabp%3D1%22%2C%22_cn%22%3A%22tions_1%22%2C%22lbt%22%3A1762164968678%2C%22wc%22%3Atrue%7D", 1, 0, 0.0, 415.0, 415, 415, 415.0, 415.0, 415.0, 415.0, 2.4096385542168677, 0.8942018072289157, 4.056852409638554], "isController": false}, {"data": ["https://www.mojeek.com/search?q=playwright-2", 1, 0, 0.0, 346.0, 346, 346, 346.0, 346.0, 346.0, 346.0, 2.890173410404624, 14.433932442196532, 1.7301526372832372], "isController": false}, {"data": ["http://www.goole.com/-14", 1, 0, 0.0, 1194.0, 1194, 1194, 1194.0, 1194.0, 1194.0, 1194.0, 0.8375209380234506, 0.3844090242881072, 0.33124607412060303], "isController": false}, {"data": ["https://www.mojeek.com/search?q=playwright-1", 1, 0, 0.0, 432.0, 432, 432, 432.0, 432.0, 432.0, 432.0, 2.314814814814815, 814.9436668113426, 1.4083297164351851], "isController": false}, {"data": ["https://playwright.dev/-14", 1, 0, 0.0, 137.0, 137, 137, 137.0, 137.0, 137.0, 137.0, 7.299270072992701, 125.39205063868611, 4.4337363138686126], "isController": false}, {"data": ["http://www.goole.com/-13", 1, 0, 0.0, 177.0, 177, 177, 177.0, 177.0, 177.0, 177.0, 5.649717514124294, 138.54497704802262, 2.2620939265536726], "isController": false}, {"data": ["https://www.mojeek.com/search?q=playwright-0", 1, 0, 0.0, 1476.0, 1476, 1476, 1476.0, 1476.0, 1476.0, 1476.0, 0.6775067750677507, 13.282176278794038, 0.4108708079268293], "isController": false}, {"data": ["https://playwright.dev/-15", 1, 0, 0.0, 151.0, 151, 151, 151.0, 151.0, 151.0, 151.0, 6.622516556291391, 134.83676531456953, 4.080867135761589], "isController": false}, {"data": ["http://www.goole.com/-10", 1, 0, 0.0, 124.0, 124, 124, 124.0, 124.0, 124.0, 124.0, 8.064516129032258, 35.92804939516129, 3.2132056451612905], "isController": false}]}, function(index, item){
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
