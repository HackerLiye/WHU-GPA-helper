function convertScoretoGPA(score){
    if(90 <= score && score <= 100){
        return 4.0;
    }else if(85 <= score && score < 90){
        return 3.7;
    }else if(82 <= score && score < 85){
        return 3.3;
    }else if(78 <= score && score < 82){
        return 3.0;
    }else if(75 <= score && score < 78){
        return 2.7;
    }else if(72 <= score && score < 75){
        return 2.3;
    }else if(68 <= score && score < 72){
        return 2.0;
    }else if(64 <= score && score < 68){
        return 1.5;
    }else if(60 <= score && score < 64){
        return 1.0;
    }else if(0 <= score && score < 60){
        return 0.0;
    }else{
        return 0.0;
    }
}

function calcGPA(scores){
    total_score = 0.0;
    total_credits = 0.0;
    total_GPA = 0.0;
    $(scores).each(function(){
        score = parseFloat($(this)[3]);
        credit = parseFloat($(this)[2]);
        GPA = convertScoretoGPA(score);
        if(score){
            total_score += score * credit;
            total_credits += credit;
            total_GPA += GPA * credit;
        }else{
            total_credits += credit;
        }
    })
    return [total_score/total_credits, total_GPA/total_credits, total_credits];
}

function calSemGPA(year, sem){
    var scores = [];
    $(".table tr:gt(0)").each(function(){
        if(parseInt($(this).find("td:eq(9)").text()) == year && parseInt($(this).find("td:eq(10)").text()) == sem){
            var row = [];
            if($(this).find('#course_select').is(':checked')){
                $(this).find('td:eq(1),td:eq(2),td:eq(5),td:eq(11)').each(function(){
                    row.push($.trim($(this).text()));
                });
                scores.push(row);
            }
        }
    });
    total_score = 0.0;
    total_credits = 0.0;
    total_GPA = 0.0;
    $(scores).each(function(){
        score = parseFloat($(this)[3]);
        credit = parseFloat($(this)[2]);
        GPA = convertScoretoGPA(score);
        if(score){
            total_score += score * credit;
            total_credits += credit;
            total_GPA += GPA * credit;
        }else{
            total_credits += credit;
        }
    })
    return [total_score/total_credits, total_GPA/total_credits, total_credits];
}

function showScores(){
    var scores = [];
    $(".table tr:gt(0)").each(function(){
        var row = [];
        if($(this).find('#course_select').is(':checked')){
            $(this).find('td:eq(1),td:eq(2),td:eq(5),td:eq(11)').each(function(){
                row.push($.trim($(this).text()));
            });
            scores.push(row);
        }
    });
    
    res = calcGPA(scores)
    $('#score').text('平均分：'+res[0].toFixed(3));
    $('#GPA').text('GPA：'+res[1].toFixed(3));
    $('#credits').text('已选学分：'+res[2]);
}

function showSemScores(){
    time = [0, 0];
    $(".table").find('tr:gt(0)').each(function(){

        year = parseInt($(this).find("td:eq(9)").text());
        sem = parseInt($(this).find("td:eq(10)").text());
        if(year && (time[0]!=year || time[1]!=sem)){
            semGPA = calSemGPA(year, sem);
            if($(this).index() != 1){
                $(this).prev().remove();
            }
            
            $(this).before("<tr><td colspan='13'><b>" +
            // "<button class='select_all_sem' year="+year+" sem="+sem+">全选</button>" + 
            // "<button id='select_none_sem'>反选</button>" + 
            year + "-" + (year+1) + "学年 第" + sem + "学期&nbsp;&nbsp;&nbsp;&nbsp;平均分：<font color='#336699'>" + 
            semGPA[0].toFixed(3) + "</font>&nbsp;&nbsp;&nbsp;&nbsp;GPA：<font color='#336699'>" + 
            semGPA[1].toFixed(3) + "</font>&nbsp;&nbsp;&nbsp;&nbsp;总学分：<font color='#336699'>" + 
            semGPA[2] + "</font></b></td></tr>");
        }
        time = [year, sem];
    })
}
function showAllScores(){
    showScores();
    showSemScores();
}
function comparer(index) {
    return function(a, b) {
        var valA = getCellValue(a, index), valB = getCellValue(b, index);
        return $.isNumeric(valA) && $.isNumeric(valB) ?
            valA - valB : valA.localeCompare(valB);
    };
}

function getCellValue(row, index){
    return $(row).children('td').eq(index).text();
}

//初始化标题左边的“选择”
$(".table tr").find("th:eq(0)").each(function(){
    $(this).before('<th style="width: 3%;">选择</th>');
})

//初始化每个成绩条左边的复选框
$(".table tr").each(function(){
    if(parseFloat($(this).find("td:eq(10)").text()) >= 60.0){
        $(this).find("td:eq(0)").before('<td><input type="checkbox" id="course_select" checked="checked" /></td>');
    }else{
        $(this).find("td:eq(0)").before('<td><input type="checkbox" id="course_select" /></td>');
    }
})

//初始化上方的控制栏
$(".table").before(
    "<div style='height:40px' >\
    <button id='select_all'>全选</button>\
    <button id='select_none'>反选</button>\
    <button id='select_reverse'>复原</button>\
    <button id='remove_zb'>去除专必</button>\
    <button id='remove_zx'>去除专选</button>\
    <button id='remove_fx'>去除辅修</button>\
    <button id='remove_fx'>去除重修</button>\
    <button id='remove_gb'>去除公必</button>\
    <button id='remove_gx'>去除公选</button>\
    <button id='score'></button>\
    <button id='GPA'></button>\
    <button id='credits'></button><div>"
);

$('#select_all').click(function(){
    $("input[type='checkbox']").prop('checked', true);
    showAllScores();
})

$('#select_none').click(function(){
    $("input[type='checkbox']").prop('checked', false);
    showAllScores();
})

$('#select_reverse').click(function(){
    $(".table tr").each(function(){
        if(parseFloat($(this).find("td:eq(11)").text()) >= 60.0){
            $(this).find("input[type='checkbox']").prop('checked', true);
        }else{
            $(this).find("input[type='checkbox']").prop('checked', false);
        }
    })
    showAllScores();
})

$('#remove_zb').click(function(){
    $(".table tr").each(function(){
        if($.trim($(this).find("td:eq(2)").text()) == '专业必修'){
            $(this).find("input[type='checkbox']").prop('checked', false);
        }
    })
    showAllScores();
})

$('#remove_zx').click(function(){
    $(".table tr").each(function(){
        if($.trim($(this).find("td:eq(2)").text()) == '专业选修'){
            $(this).find("input[type='checkbox']").prop('checked', false);
        }
    })
    showAllScores();
})

$('#remove_fx').click(function(){
    $(".table tr").each(function(){
        if($.trim($(this).find("td:eq(8)").text()) == '辅修'){
            $(this).find("input[type='checkbox']").prop('checked', false);
        }
    })
    showAllScores();
})

$('#remove_cx').click(function(){
    $(".table tr").each(function(){
        if($.trim($(this).find("td:eq(8)").text()) == '重修'){
            $(this).find("input[type='checkbox']").prop('checked', false);
        }
    })
    showAllScores();
})

$('#remove_gb').click(function(){
    $(".table tr").each(function(){
        if($.trim($(this).find("td:eq(2)").text()) == '公共必修'){
            $(this).find("input[type='checkbox']").prop('checked', false);
        }
    })
    showAllScores();
})

$('#remove_gx').click(function(){
    $(".table tr").each(function(){
        if($.trim($(this).find("td:eq(2)").text()) == '公共选修'){
            $(this).find("input[type='checkbox']").prop('checked', false);
        }
    })
    showAllScores();
})

$(function() {
    $("button").button()
});

$(function(){
    //给成绩单排序
    var rows = $(".table").find('tr:gt(0)').toArray().sort(comparer(2)).sort(comparer(10)).sort(comparer(9));
    $(rows).each(function(){
        $(this).removeClass("alt");
    })
    rows.splice(0, 0, $(".table").find('tr:eq(0)'));
    $(".table").children('tbody').empty().html(rows);

    //给每个checkbox动作一个函数，计算所有被选中的box对应成绩
    $("input[type='checkbox']").change(function(){
        showAllScores();
    })

    
    time = [0, 0];
    $(".table").find('tr:gt(0)').each(function(){

        year = parseInt($(this).find("td:eq(9)").text());
        sem = parseInt($(this).find("td:eq(10)").text());
        if(time[0]!=year || time[1]!=sem){
            semGPA = calSemGPA(year, sem);
            $(this).before("<tr><td colspan='13'><b>" +
            // "<button class='select_all_sem' year="+year+" sem="+sem+">全选</button>" + 
            // "<button id='select_none_sem'>反选</button>" + 
            year + "-" + (year+1) + "学年 第" + sem + "学期&nbsp;&nbsp;&nbsp;&nbsp;平均分：<font color='#336699'>" + 
            semGPA[0].toFixed(3) + "</font>&nbsp;&nbsp;&nbsp;&nbsp;GPA：<font color='#336699'>" + 
            semGPA[1].toFixed(3) + "</font>&nbsp;&nbsp;&nbsp;&nbsp;总学分：<font color='#336699'>" + 
            semGPA[2] + "</font></b></td></tr>");
        }

        time = [year, sem];
        if($(this).index() % 2 == 0){
            $(this).addClass("alt");
        }
    })
    showAllScores();
})