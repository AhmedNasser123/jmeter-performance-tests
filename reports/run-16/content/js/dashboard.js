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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "http://www.goole.com/"], "isController": false}, {"data": [1.0, 500, 1500, "http://www.goole.com/-4"], "isController": false}, {"data": [0.5, 500, 1500, "http://www.goole.com/-5"], "isController": false}, {"data": [1.0, 500, 1500, "http://www.goole.com/-6"], "isController": false}, {"data": [1.0, 500, 1500, "https://playwright.dev/-9"], "isController": false}, {"data": [1.0, 500, 1500, "http://www.goole.com/-7"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "http://www.goole.com/-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://playwright.dev/-7"], "isController": false}, {"data": [0.5, 500, 1500, "http://www.goole.com/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://playwright.dev/-8"], "isController": false}, {"data": [0.5, 500, 1500, "http://www.goole.com/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://playwright.dev/-5"], "isController": false}, {"data": [1.0, 500, 1500, "http://www.goole.com/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://playwright.dev/-6"], "isController": false}, {"data": [1.0, 500, 1500, "https://playwright.dev/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://playwright.dev/-4"], "isController": false}, {"data": [1.0, 500, 1500, "https://playwright.dev/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://playwright.dev/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://playwright.dev/-0"], "isController": false}, {"data": [0.0, 500, 1500, "Test"], "isController": true}, {"data": [0.5, 500, 1500, "https://www.mojeek.com/search?q=playwright"], "isController": false}, {"data": [1.0, 500, 1500, "https://playwright.dev/"], "isController": false}, {"data": [1.0, 500, 1500, "http://www.goole.com/-8"], "isController": false}, {"data": [0.0, 500, 1500, "http://www.goole.com/-9"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.mojeek.com/search?q=playwright-8"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.mojeek.com/search?q=playwright-7"], "isController": false}, {"data": [1.0, 500, 1500, "https://playwright.dev/-12"], "isController": false}, {"data": [0.5, 500, 1500, "https://www.mojeek.com/search?q=playwright-6"], "isController": false}, {"data": [1.0, 500, 1500, "https://playwright.dev/-13"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.mojeek.com/search?q=playwright-5"], "isController": false}, {"data": [1.0, 500, 1500, "https://playwright.dev/-10"], "isController": false}, {"data": [0.5, 500, 1500, "https://www.mojeek.com/search?q=playwright-4"], "isController": false}, {"data": [1.0, 500, 1500, "https://playwright.dev/-11"], "isController": false}, {"data": [1.0, 500, 1500, "http://www.goole.com/-12"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.mojeek.com/search?q=playwright-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://playwright.dev/-16"], "isController": false}, {"data": [0.0, 500, 1500, "http://www.goole.com/-11"], "isController": false}, {"data": [1.0, 500, 1500, "http://trc.taboola.com/goolecom/trc/3/json?llvl=2&tim=21%3A54%3A44.968&lti=trecs&pubit=i&t=1&data=%7B%22id%22%3A%2276721%22%2C%22sd%22%3A%22%22%2C%22ui%22%3A%22%22%2C%22ii%22%3A%22_homepage_%22%2C%22it%22%3A%22home%22%2C%22vi%22%3A1762199684969%2C%22cv%22%3A%2220251103-4-RELEASE%22%2C%22uiv%22%3A%22default%22%2C%22u%22%3A%22http%3A%2F%2Fwww.goole.com%2F%22%2C%22qs%22%3A%22%22%2C%22bv%22%3A%220%22%2C%22btv%22%3A%220%22%2C%22ul%22%3A%5B%22en-GB%22%2C%22ar-AE%22%2C%22ar%22%2C%22en-US%22%2C%22en%22%5D%2C%22cos%22%3A%224g%22%2C%22bu%22%3A%22http%3A%2F%2Fwww.goole.com%2F%22%2C%22vpi%22%3A%22%2F%22%2C%22bad%22%3A-1%2C%22sw%22%3A1450%2C%22sh%22%3A868%2C%22bw%22%3A1813%2C%22bh%22%3A976%2C%22dw%22%3A1813%2C%22dh%22%3A976%2C%22sde%22%3A%221.060%22%2C%22lt%22%3A%22trecs%22%2C%22r%22%3A%5B%7B%22li%22%3A%22rbox-h2m%22%2C%22uip%22%3A%22Left%20Rail%20Thumbnails%22%2C%22orig_uip%22%3A%22Left%20Rail%20Thumbnails%22%2C%22s%22%3A4%2C%22uim%22%3A%22thumbnails-lr-2-desktop%3Aabp%3D1%22%2C%22cd%22%3A151.98%2C%22mw%22%3A184.01%7D%2C%7B%22li%22%3A%22rbox-h2m%22%2C%22uip%22%3A%22Right%20Rail%20Thumbnails%22%2C%22orig_uip%22%3A%22Right%20Rail%20Thumbnails%22%2C%22s%22%3A4%2C%22uim%22%3A%22thumbnails-rr-desktop%3Aabp%3D1%22%2C%22cd%22%3A0%2C%22mw%22%3A0%2C%22amw%22%3A0%7D%5D%2C%22cacheKey%22%3A%22home%3D_homepage_%2CLeft%20Rail%20Thumbnails%3Dthumbnails-lr-2-desktop%3Aabp%3D1%2CRight%20Rail%20Thumbnails%3Dthumbnails-rr-desktop%3Aabp%3D1%22%2C%22_cn%22%3A%22tions_1%22%2C%22lbt%22%3A1762164968678%2C%22wc%22%3Atrue%7D"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.mojeek.com/search?q=playwright-2"], "isController": false}, {"data": [0.0, 500, 1500, "http://www.goole.com/-14"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.mojeek.com/search?q=playwright-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://playwright.dev/-14"], "isController": false}, {"data": [1.0, 500, 1500, "http://www.goole.com/-13"], "isController": false}, {"data": [0.5, 500, 1500, "https://www.mojeek.com/search?q=playwright-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://playwright.dev/-15"], "isController": false}, {"data": [1.0, 500, 1500, "http://www.goole.com/-10"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 49, 0, 0.0, 474.42857142857144, 19, 3676, 142.0, 2008.0, 2209.5, 3676.0, 2.137777583875049, 304.75081189193315, 2.138416667575586], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["http://www.goole.com/", 1, 0, 0.0, 3676.0, 3676, 3676, 3676.0, 3676.0, 3676.0, 3676.0, 0.2720348204570185, 225.28972771014688, 1.9010558351468987], "isController": false}, {"data": ["http://www.goole.com/-4", 1, 0, 0.0, 239.0, 239, 239, 239.0, 239.0, 239.0, 239.0, 4.184100418410042, 12.830151673640168, 1.9326948221757323], "isController": false}, {"data": ["http://www.goole.com/-5", 1, 0, 0.0, 622.0, 622, 622, 622.0, 622.0, 622.0, 622.0, 1.607717041800643, 141.03163936897107, 0.6531350482315113], "isController": false}, {"data": ["http://www.goole.com/-6", 1, 0, 0.0, 261.0, 261, 261, 261.0, 261.0, 261.0, 261.0, 3.8314176245210727, 43.13712284482759, 1.5864463601532566], "isController": false}, {"data": ["https://playwright.dev/-9", 1, 0, 0.0, 69.0, 69, 69, 69.0, 69.0, 69.0, 69.0, 14.492753623188406, 366.01279438405794, 8.774909420289854], "isController": false}, {"data": ["http://www.goole.com/-7", 1, 0, 0.0, 142.0, 142, 142, 142.0, 142.0, 142.0, 142.0, 7.042253521126761, 54.433043573943664, 3.21165272887324], "isController": false}, {"data": ["http://www.goole.com/-0", 3, 0, 0.0, 348.0, 129, 778, 137.0, 778.0, 778.0, 778.0, 1.8987341772151898, 17.8290644778481, 0.736748417721519], "isController": false}, {"data": ["https://playwright.dev/-7", 1, 0, 0.0, 121.0, 121, 121, 121.0, 121.0, 121.0, 121.0, 8.264462809917356, 3832.281443698347, 5.036157024793389], "isController": false}, {"data": ["http://www.goole.com/-1", 3, 0, 0.0, 903.3333333333334, 50, 2085, 575.0, 2085.0, 2085.0, 2085.0, 1.093693036820999, 204.68757120397376, 0.5778202469923441], "isController": false}, {"data": ["https://playwright.dev/-8", 1, 0, 0.0, 77.0, 77, 77, 77.0, 77.0, 77.0, 77.0, 12.987012987012989, 890.3713474025974, 7.888595779220779], "isController": false}, {"data": ["http://www.goole.com/-2", 1, 0, 0.0, 573.0, 573, 573, 573.0, 573.0, 573.0, 573.0, 1.7452006980802792, 142.68038285340316, 0.7328479493891799], "isController": false}, {"data": ["https://playwright.dev/-5", 1, 0, 0.0, 163.0, 163, 163, 163.0, 163.0, 163.0, 163.0, 6.134969325153374, 4027.2478911042945, 3.7624616564417175], "isController": false}, {"data": ["http://www.goole.com/-3", 1, 0, 0.0, 251.0, 251, 251, 251.0, 251.0, 251.0, 251.0, 3.9840637450199203, 23.351904880478088, 1.8052788844621515], "isController": false}, {"data": ["https://playwright.dev/-6", 1, 0, 0.0, 62.0, 62, 62, 62.0, 62.0, 62.0, 62.0, 16.129032258064516, 90.39503528225806, 9.84438004032258], "isController": false}, {"data": ["https://playwright.dev/-3", 1, 0, 0.0, 106.0, 106, 106, 106.0, 106.0, 106.0, 106.0, 9.433962264150942, 1325.1031839622642, 5.82252358490566], "isController": false}, {"data": ["https://playwright.dev/-4", 1, 0, 0.0, 82.0, 82, 82, 82.0, 82.0, 82.0, 82.0, 12.195121951219512, 228.9086318597561, 7.574314024390244], "isController": false}, {"data": ["https://playwright.dev/-1", 1, 0, 0.0, 76.0, 76, 76, 76.0, 76.0, 76.0, 76.0, 13.157894736842104, 1465.2677837171052, 8.030941611842106], "isController": false}, {"data": ["https://playwright.dev/-2", 1, 0, 0.0, 100.0, 100, 100, 100.0, 100.0, 100.0, 100.0, 10.0, 72.05078125, 6.044921875], "isController": false}, {"data": ["https://playwright.dev/-0", 1, 0, 0.0, 98.0, 98, 98, 98.0, 98.0, 98.0, 98.0, 10.204081632653061, 196.77734375, 5.998883928571428], "isController": false}, {"data": ["Test", 1, 0, 0.0, 5683.0, 5683, 5683, 5683.0, 5683.0, 5683.0, 5683.0, 0.17596339961288052, 565.3733242235616, 4.319695253387295], "isController": true}, {"data": ["https://www.mojeek.com/search?q=playwright", 1, 0, 0.0, 1149.0, 1149, 1149, 1149.0, 1149.0, 1149.0, 1149.0, 0.8703220191470844, 469.64072019147085, 4.802069734551784], "isController": false}, {"data": ["https://playwright.dev/", 1, 0, 0.0, 431.0, 431, 431, 431.0, 431.0, 431.0, 431.0, 2.320185614849188, 4280.425246519721, 24.035672853828306], "isController": false}, {"data": ["http://www.goole.com/-8", 1, 0, 0.0, 129.0, 129, 129, 129.0, 129.0, 129.0, 129.0, 7.751937984496124, 7.903343023255814, 3.376332364341085], "isController": false}, {"data": ["http://www.goole.com/-9", 1, 0, 0.0, 2216.0, 2216, 2216, 2216.0, 2216.0, 2216.0, 2216.0, 0.4512635379061372, 249.52758348375448, 0.36753299864620936], "isController": false}, {"data": ["https://www.mojeek.com/search?q=playwright-8", 1, 0, 0.0, 111.0, 111, 111, 111.0, 111.0, 111.0, 111.0, 9.00900900900901, 11.921100788288289, 5.577843468468468], "isController": false}, {"data": ["https://www.mojeek.com/search?q=playwright-7", 1, 0, 0.0, 119.0, 119, 119, 119.0, 119.0, 119.0, 119.0, 8.403361344537815, 14.246323529411764, 5.293132878151261], "isController": false}, {"data": ["https://playwright.dev/-12", 1, 0, 0.0, 53.0, 53, 53, 53.0, 53.0, 53.0, 53.0, 18.867924528301884, 1383.9917452830189, 11.405512971698114], "isController": false}, {"data": ["https://www.mojeek.com/search?q=playwright-6", 1, 0, 0.0, 546.0, 546, 546, 546.0, 546.0, 546.0, 546.0, 1.8315018315018314, 82.10994734432234, 1.1375343406593406], "isController": false}, {"data": ["https://playwright.dev/-13", 1, 0, 0.0, 21.0, 21, 21, 21.0, 21.0, 21.0, 21.0, 47.61904761904761, 704.3805803571428, 28.78534226190476], "isController": false}, {"data": ["https://www.mojeek.com/search?q=playwright-5", 1, 0, 0.0, 435.0, 435, 435, 435.0, 435.0, 435.0, 435.0, 2.2988505747126435, 57.671066810344826, 1.391882183908046], "isController": false}, {"data": ["https://playwright.dev/-10", 1, 0, 0.0, 58.0, 58, 58, 58.0, 58.0, 58.0, 58.0, 17.241379310344826, 1218.4974407327586, 10.489628232758621], "isController": false}, {"data": ["https://www.mojeek.com/search?q=playwright-4", 1, 0, 0.0, 561.0, 561, 561, 561.0, 561.0, 561.0, 561.0, 1.7825311942959001, 152.108748328877, 1.112341243315508], "isController": false}, {"data": ["https://playwright.dev/-11", 1, 0, 0.0, 119.0, 119, 119, 119.0, 119.0, 119.0, 119.0, 8.403361344537815, 595.4897584033614, 5.120798319327731], "isController": false}, {"data": ["http://www.goole.com/-12", 1, 0, 0.0, 138.0, 138, 138, 138.0, 138.0, 138.0, 138.0, 7.246376811594203, 100.26041666666666, 2.87307518115942], "isController": false}, {"data": ["https://www.mojeek.com/search?q=playwright-3", 1, 0, 0.0, 341.0, 341, 341, 341.0, 341.0, 341.0, 341.0, 2.932551319648094, 14.55106763196481, 1.7727043621700878], "isController": false}, {"data": ["https://playwright.dev/-16", 1, 0, 0.0, 19.0, 19, 19, 19.0, 19.0, 19.0, 19.0, 52.63157894736842, 3210.474917763158, 32.7405427631579], "isController": false}, {"data": ["http://www.goole.com/-11", 1, 0, 0.0, 2203.0, 2203, 2203, 2203.0, 2203.0, 2203.0, 2203.0, 0.45392646391284613, 1.5568259192010896, 0.17598516227871086], "isController": false}, {"data": ["http://trc.taboola.com/goolecom/trc/3/json?llvl=2&tim=21%3A54%3A44.968&lti=trecs&pubit=i&t=1&data=%7B%22id%22%3A%2276721%22%2C%22sd%22%3A%22%22%2C%22ui%22%3A%22%22%2C%22ii%22%3A%22_homepage_%22%2C%22it%22%3A%22home%22%2C%22vi%22%3A1762199684969%2C%22cv%22%3A%2220251103-4-RELEASE%22%2C%22uiv%22%3A%22default%22%2C%22u%22%3A%22http%3A%2F%2Fwww.goole.com%2F%22%2C%22qs%22%3A%22%22%2C%22bv%22%3A%220%22%2C%22btv%22%3A%220%22%2C%22ul%22%3A%5B%22en-GB%22%2C%22ar-AE%22%2C%22ar%22%2C%22en-US%22%2C%22en%22%5D%2C%22cos%22%3A%224g%22%2C%22bu%22%3A%22http%3A%2F%2Fwww.goole.com%2F%22%2C%22vpi%22%3A%22%2F%22%2C%22bad%22%3A-1%2C%22sw%22%3A1450%2C%22sh%22%3A868%2C%22bw%22%3A1813%2C%22bh%22%3A976%2C%22dw%22%3A1813%2C%22dh%22%3A976%2C%22sde%22%3A%221.060%22%2C%22lt%22%3A%22trecs%22%2C%22r%22%3A%5B%7B%22li%22%3A%22rbox-h2m%22%2C%22uip%22%3A%22Left%20Rail%20Thumbnails%22%2C%22orig_uip%22%3A%22Left%20Rail%20Thumbnails%22%2C%22s%22%3A4%2C%22uim%22%3A%22thumbnails-lr-2-desktop%3Aabp%3D1%22%2C%22cd%22%3A151.98%2C%22mw%22%3A184.01%7D%2C%7B%22li%22%3A%22rbox-h2m%22%2C%22uip%22%3A%22Right%20Rail%20Thumbnails%22%2C%22orig_uip%22%3A%22Right%20Rail%20Thumbnails%22%2C%22s%22%3A4%2C%22uim%22%3A%22thumbnails-rr-desktop%3Aabp%3D1%22%2C%22cd%22%3A0%2C%22mw%22%3A0%2C%22amw%22%3A0%7D%5D%2C%22cacheKey%22%3A%22home%3D_homepage_%2CLeft%20Rail%20Thumbnails%3Dthumbnails-lr-2-desktop%3Aabp%3D1%2CRight%20Rail%20Thumbnails%3Dthumbnails-rr-desktop%3Aabp%3D1%22%2C%22_cn%22%3A%22tions_1%22%2C%22lbt%22%3A1762164968678%2C%22wc%22%3Atrue%7D", 1, 0, 0.0, 427.0, 427, 427, 427.0, 427.0, 427.0, 427.0, 2.34192037470726, 0.8690720140515222, 3.942842505854801], "isController": false}, {"data": ["https://www.mojeek.com/search?q=playwright-2", 1, 0, 0.0, 323.0, 323, 323, 323.0, 323.0, 323.0, 323.0, 3.0959752321981426, 15.46173568111455, 1.8533523606811144], "isController": false}, {"data": ["http://www.goole.com/-14", 1, 0, 0.0, 2008.0, 2008, 2008, 2008.0, 2008.0, 2008.0, 2008.0, 0.49800796812749004, 0.22857787599601592, 0.19696604208167331], "isController": false}, {"data": ["https://www.mojeek.com/search?q=playwright-1", 1, 0, 0.0, 409.0, 409, 409, 409.0, 409.0, 409.0, 409.0, 2.444987775061125, 860.7717947738387, 1.4875267420537899], "isController": false}, {"data": ["https://playwright.dev/-14", 1, 0, 0.0, 45.0, 45, 45, 45.0, 45.0, 45.0, 45.0, 22.22222222222222, 381.72743055555554, 13.49826388888889], "isController": false}, {"data": ["http://www.goole.com/-13", 1, 0, 0.0, 149.0, 149, 149, 149.0, 149.0, 149.0, 149.0, 6.7114093959731544, 164.58027474832215, 2.687185402684564], "isController": false}, {"data": ["https://www.mojeek.com/search?q=playwright-0", 1, 0, 0.0, 541.0, 541, 541, 541.0, 541.0, 541.0, 541.0, 1.8484288354898337, 35.739299329944544, 1.1209710027726432], "isController": false}, {"data": ["https://playwright.dev/-15", 1, 0, 0.0, 101.0, 101, 101, 101.0, 101.0, 101.0, 101.0, 9.900990099009901, 201.58763923267327, 6.101098391089108], "isController": false}, {"data": ["http://www.goole.com/-10", 1, 0, 0.0, 123.0, 123, 123, 123.0, 123.0, 123.0, 123.0, 8.130081300813009, 36.220147357723576, 3.239329268292683], "isController": false}]}, function(index, item){
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
