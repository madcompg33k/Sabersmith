$(function ()
{
    var $adminMenuItem = $("#adminMenu nav ul li a");

    $adminMenuItem.mouseover(function ()
    {
        $(this).animate({ backgroundColor: '#B00' }, 200);
    });
    $adminMenuItem.mouseout(function ()
    {
        $(this).animate({ backgroundColor: '#600' }, 200);
    });

    $(document).tooltip();

    $("#adminMenu").hover(function ()
    {
        $(this).find("nav").slideToggle(300);
        $(this).find("#upArrow, #downArrow").toggle();
    });


    $("#accordion")
        .accordion({
            collapsible: true,
            heightStyle: "content",
            header: "> div > h2"
        })
        .sortable({
            axis: "y",
            handle: "h2",
            stop: function (event, ui)
            {
                ui.item.children("h2").triggerHandler("focusout");
            }
        });

    /* Allow links within the accordion header to function properly */
    $("#accordion h2 a").click(function ()
    {
        //Check to see if user is already in the section they're editing
        if (!$(this).parent("h2").hasClass('ui-state-active'))
        {
            $(this).parent().click();
        }

        window.location = $(this).attr('href');
        return false;
    });


    /* Toggle modes */
    $(".edit-mode").hide();
    $("table").delegate('td button.edit-product, td button.edit-category, td button.edit-sub-category, td button.cancel-edit', 'click', function ()
    {
        var tr = $(this).parents('tr:first');
        tr.find(".edit-mode, .display-mode").toggle();
    });

    /* Save inline changes made to a product */
    $(".save-product").on('click', function ()
    {
        var tr = $(this).parents('tr:first');
        var productId = $(this).prop('id');
        var productName = tr.find("#ProductName").val();
        var categoryId = tr.find("#CategoryId").val();
        var subCategoryId = tr.find("#SubCategoryId").val();
        var price = tr.find("#UnitPrice").val();
        var unitsOnOrder = tr.find("#UnitsOnOrder").val();
        var discontinued = tr.find("#Discontinued").is(':checked');
        $.post(
            '/admin/EditItem/Product',
            { ProductId: productId, ProductName: productName, CategoryId: categoryId, SubCategoryId: subCategoryId, Price: price, OnOrder: unitsOnOrder, Discontinued: discontinued },
            function (product)
            {
                tr.find("#product-name").text(product.ProductName);
                tr.find("#category").text(product.CategoryName);
                tr.find("#sub-category").text(product.SubCategoryName);
                tr.find("#price").text(product.UnitPrice);
                tr.find("#on-order").text(product.UnitsOnOrder);
                tr.find("#discontinued").prop('checked', product.Discontinued);
            }, "json");
        tr.find(".edit-mode, .display-mode").toggle();
    });

    /* Save inline changes made to a category */
    //$(".save-category").on('click', function ()
    $("table").delegate('td button.save-category', 'click', function ()
    {
        var tr = $(this).parents('tr:first');
        var categoryId = $(this).prop('id');
        var categoryName = tr.find("#CategoryName").val();
        var categoryDesc = tr.find("#CategoryDesc").val();
        $.post(
            '/admin/EditItem/Category',
            { CategoryId: categoryId, CategoryName: categoryName, CategoryDesc: categoryDesc },
            function (category)
            {
                tr.find("#category-name").text(category.CategoryName);
                tr.find("#category-desc").text(category.CategoryDesc);
            }, "json");
        tr.find(".edit-mode, .display-mode").toggle();
    });

    /* Save inline changes made to a sub-category */
    $(".save-sub-category").on('click', function ()
    {
        var tr = $(this).parents('tr:first');
        var subCategoryId = $(this).prop('id');
        var subCategoryName = tr.find("#SubCategoryName").val();
        var subCategoryGroup = tr.find("#SubCategoryGroup").val();
        var subCategoryDesc = tr.find("#SubCategoryDesc").val();
        $.post(
            '/admin/EditItem/Sub-Category',
            { SubCategoryId: subCategoryId, SubCategoryName: subCategoryName, SubCategoryGroup: subCategoryGroup, SubCategoryDesc: subCategoryDesc },
            function (subCategory)
            {
                tr.find("#sub-category-name").text(subCategory.SubCategoryName);
                tr.find("#sub-category-group").text(subCategory.CategoryName);
                tr.find("#sub-category-desc").text(subCategory.SubCategoryDesc);
            }, "json");
        tr.find(".edit-mode, .display-mode").toggle();
    });




});



$(function addNewProductOption()
{
    var optionName = $("#optionName"),
        optionCategory = $("#optionCategory")
        optionDesc = $("#optionDesc"),
        allFields = $([]).add(optionName).add(optionDesc),
        tips = $(".subCatValidateTips");


    var categoryId = $("input#optionCategoryId").val();

    function updateTips( t ) {
        tips
            .text( t )
            .addClass( "ui-state-highlight" );
        setTimeout(function() {
            tips.removeClass( "ui-state-highlight", 1500 );
        }, 500 );
    }
    function checkLength( o, n, min, max ) {
        if ( o.val().length > max || o.val().length < min ) {
            o.addClass( "ui-state-error" );
            updateTips( "Length of " + n + " must be between " +
            min + " and " + max + "." );
            return false;
        } else {
            return true;
        }
    }
    function checkRegexp( o, regexp, n ) {
        if ( !( regexp.test( o.val() ) ) ) {
            o.addClass( "ui-state-error" );
            updateTips( n );
            return false;
        } else {
            return true;
        }
    }

    $("#optionDialog").dialog({
        autoOpen: false,
        height: 550,
        width: 600,
        modal: true,
        buttons: {
            "Add Product Option": function ()
            {
                var bValid = true;
                allFields.removeClass("ui-state-error");
                bValid = bValid && checkLength(optionName, "name", 3, 16);
                bValid = bValid && checkLength(optionDesc, "description", 3, 200);
                bValid = bValid && checkRegexp(optionName, /^[a-z]+$/i, "Name name may consist of only letters.");
                bValid = bValid && checkRegexp(optionDesc, /^[a-z]([0-9a-z_])+$/i, "Description may consist of a-z, 0-9, underscores, begin with a letter.");

                if (bValid)
                {
                    $("#productOptions tbody").append("<tr>" +
                        "<td><span id='option-name' class='display-mode'>" +
                            optionName.val() + "</span>" +
                            "<input id='OptionName' class='edit-mode' type='text' value='Other' size='20' name='OptionName' style='display: none;'>" +
                        "</td>" +
                        "<td><span id='option-category' class='display-mode'>" +
                            optionCategory.val() + "</span>" +
                            "<input id='OptionCategory' class='edit-mode' type='text' value='Other' size='20' name='OptionCategory' style='display: none;'>" +
                        "</td>" +
                        "<td><span id='option-desc' class='display-mode'>" +
                            optionDesc.val() + "</span>" +
                            "<input id='SubCategoryDesc' class='edit-mode' type='text' value='Other' size='50' name='SubCategoryDesc' style='display: none;'>" +
                        "</td>" +
                        "<td>" +
                        "<button class='edit-product-option display-mode' id='" + categoryId + "'>Edit</button>" +
                        "<button class='cancel-edit edit-mode' style='display: none;'>Cancel</button>" +
                        "<button class='save-product-option edit-mode' id='" + categoryId + "' style='display: none;'>Save</button>" +
                        "</td>" +
                        "</tr>");
                    $("tr:last-of-type #OptionName:last-of-type").val(optionName.val());
                    $("tr:last-of-type #OptionDesc").val(optionDesc.val());


                    //var tr = $("#subCategories tr:last-of-type");
                    //var categoryName = tr.find("#SubCategoryName").val();
                    //var categoryGroup = tr.find("#SubCategoryGroup").val();
                    //var categoryDesc = tr.find("#SubCategoryDesc").val();
                    //alert("categoryId: " + categoryId + "\ncategoryName: " + catName.val() + "\ncategoryGroup: " + catGroup.val() + "\ncategoryDesc: " + catDesc.val());
                    $.post(
                        '/admin/AddItem/SubCategory',
                        { CategoryId: categoryId, OptionName: optionName.val(), OptionCategory: OptionCategory.val(), OptionDesc: optionDesc.val() },
                        function (option)
                        {
                            tr.find("#option-name").text(option.OptionName);
                            tr.find("#option-desc").text(option.OptionDesc);
                        }, "json");


                    $(this).dialog("close");
                }
            },
            Cancel: function ()
            {
                $(this).dialog("close");
            }
        },
        close: function ()
        {
            allFields.val("").removeClass("ui-state-error");
        }
    });

    $( "#addProductOption" )
        .click(function() {
            $( "#optionDialog" ).dialog( "open" );
    });

});



$(function addNewCategory()
{
    var catName = $("#catName"),
        catDesc = $("#catDesc"),
        allFields = $([]).add(catName).add(catDesc),
        tips = $(".catValidateTips");


    var categoryId = $("input#categoryId").val();

    function updateTips( t ) {
        tips
            .text( t )
            .addClass( "ui-state-highlight" );
        setTimeout(function() {
            tips.removeClass( "ui-state-highlight", 1500 );
        }, 500 );
    }
    function checkLength( o, n, min, max ) {
        if ( o.val().length > max || o.val().length < min ) {
            o.addClass( "ui-state-error" );
            updateTips( "Length of " + n + " must be between " +
            min + " and " + max + "." );
            return false;
        } else {
            return true;
        }
    }
    function checkRegexp( o, regexp, n ) {
        if ( !( regexp.test( o.val() ) ) ) {
            o.addClass( "ui-state-error" );
            updateTips( n );
            return false;
        } else {
            return true;
        }
    }

    $("#categoryDialog").dialog({
        autoOpen: false,
        height: 300,
        width: 350,
        modal: true,
        buttons: {
            "Add Category": function ()
            {
                var bValid = true;
                allFields.removeClass("ui-state-error");
                bValid = bValid && checkLength(catName, "name", 3, 16);
                bValid = bValid && checkLength(catDesc, "description", 3, 200);
                bValid = bValid && checkRegexp(catName, /^[a-z]+$/i, "Category name may consist of only letters.");
                bValid = bValid && checkRegexp(catDesc, /^[a-z]([0-9a-z_])+$/i, "Category description may consist of a-z, 0-9, underscores, begin with a letter.");

                if (bValid)
                {
                    $("#categories tbody").append("<tr>" +
                        "<td><span id='category-name' class='display-mode'>" +
                            catName.val() + "</span>" +
                            "<input id='CategoryName' class='edit-mode' type='text' value='Other' size='20' name='CategoryName' style='display: none;'>" +
                        "</td>" +
                        "<td><span id='category-desc' class='display-mode'>" +
                            catDesc.val() + "</span>" +
                            "<input id='CategoryDesc' class='edit-mode' type='text' value='Other' size='50' name='CategoryDesc' style='display: none;'>" +
                        "</td>" +
                        "<td>" +
                        "<button class='edit-category display-mode' id='" + categoryId + "'>Edit</button>" +
                        "<button class='cancel-edit edit-mode' style='display: none;'>Cancel</button>" +
                        "<button class='save-category edit-mode' id='" + categoryId + "' style='display: none;'>Save</button>" +
                        "</td>" +
                        "</tr>");
                    $("tr:last-of-type #CategoryName:last-of-type").val(catName.val());
                    $("tr:last-of-type #CategoryDesc").val(catDesc.val());


                    //var tr = $("#categories tr:last-of-type");
                    //var categoryName = tr.find("#CategoryName").val();
                    //var categoryDesc = tr.find("#CategoryDesc").val();
                    //alert("categoryId: " + categoryId);
                    $.post(
                        '/admin/AddItem/Category',
                        { CategoryId: categoryId, CategoryName: catName.val(), CategoryDesc: catDesc.val() },
                        function (category)
                        {
                            alert("category.CategoryId: " + category.pk_CategoryID);
                            tr.find("#category-name").text(category.CategoryName);
                            tr.find("#category-desc").text(category.CategoryDesc);
                        }, "json");


                    $(this).dialog("close");
                }
            },
            Cancel: function ()
            {
                $(this).dialog("close");
            }
        },
        close: function ()
        {
            allFields.val("").removeClass("ui-state-error");
        }
    });

    $( "#addCategory" )
        .click(function() {
            $( "#categoryDialog" ).dialog( "open" );
    });

});


$(function addNewSubCategory()
{
    var catName = $("#subCatName"),
        catGroup = $("#subCatGroup")
        catDesc = $("#subCatDesc"),
        allFields = $([]).add(catName).add(catDesc),
        tips = $(".subCatValidateTips");


    var categoryId = $("input#subCategoryId").val();

    function updateTips( t ) {
        tips
            .text( t )
            .addClass( "ui-state-highlight" );
        setTimeout(function() {
            tips.removeClass( "ui-state-highlight", 1500 );
        }, 500 );
    }
    function checkLength( o, n, min, max ) {
        if ( o.val().length > max || o.val().length < min ) {
            o.addClass( "ui-state-error" );
            updateTips( "Length of " + n + " must be between " +
            min + " and " + max + "." );
            return false;
        } else {
            return true;
        }
    }
    function checkRegexp( o, regexp, n ) {
        if ( !( regexp.test( o.val() ) ) ) {
            o.addClass( "ui-state-error" );
            updateTips( n );
            return false;
        } else {
            return true;
        }
    }

    $("#subCategoryDialog").dialog({
        autoOpen: false,
        height: 300,
        width: 350,
        modal: true,
        buttons: {
            "Add Sub-Category": function ()
            {
                var bValid = true;
                allFields.removeClass("ui-state-error");
                bValid = bValid && checkLength(catName, "name", 3, 16);
                bValid = bValid && checkLength(catDesc, "description", 3, 200);
                bValid = bValid && checkRegexp(catName, /^[a-z]+$/i, "Category name may consist of only letters.");
                bValid = bValid && checkRegexp(catDesc, /^[a-z]([0-9a-z_])+$/i, "Category description may consist of a-z, 0-9, underscores, begin with a letter.");

                if (bValid)
                {
                    $("#subCategories tbody").append("<tr>" +
                        "<td><span id='sub-category-name' class='display-mode'>" +
                            catName.val() + "</span>" +
                            "<input id='SubCategoryName' class='edit-mode' type='text' value='Other' size='20' name='SubCategoryName' style='display: none;'>" +
                        "</td>" +
                        "<td><span id='sub-category-group' class='display-mode'>" +
                            catGroup.val() + "</span>" +
                            "<input id='SubCategoryGroup' class='edit-mode' type='text' value='Other' size='20' name='SubCategoryGroup' style='display: none;'>" +
                        "</td>" +
                        "<td><span id='sub-category-desc' class='display-mode'>" +
                            catDesc.val() + "</span>" +
                            "<input id='SubCategoryDesc' class='edit-mode' type='text' value='Other' size='50' name='SubCategoryDesc' style='display: none;'>" +
                        "</td>" +
                        "<td>" +
                        "<button class='edit-category display-mode' id='" + categoryId + "'>Edit</button>" +
                        "<button class='cancel-edit edit-mode' style='display: none;'>Cancel</button>" +
                        "<button class='save-category edit-mode' id='" + categoryId + "' style='display: none;'>Save</button>" +
                        "</td>" +
                        "</tr>");
                    $("tr:last-of-type #CategoryName:last-of-type").val(catName.val());
                    $("tr:last-of-type #CategoryDesc").val(catDesc.val());


                    //var tr = $("#subCategories tr:last-of-type");
                    //var categoryName = tr.find("#SubCategoryName").val();
                    //var categoryGroup = tr.find("#SubCategoryGroup").val();
                    //var categoryDesc = tr.find("#SubCategoryDesc").val();
                    //alert("categoryId: " + categoryId + "\ncategoryName: " + catName.val() + "\ncategoryGroup: " + catGroup.val() + "\ncategoryDesc: " + catDesc.val());
                    $.post(
                        '/admin/AddItem/SubCategory',
                        { CategoryId: categoryId, CategoryName: catName.val(), CategoryGroup: catGroup.val(), CategoryDesc: catDesc.val() },
                        function (category)
                        {
                            tr.find("#category-name").text(category.SubCategoryName);
                            tr.find("#category-desc").text(category.SubCategoryDesc);
                        }, "json");


                    $(this).dialog("close");
                }
            },
            Cancel: function ()
            {
                $(this).dialog("close");
            }
        },
        close: function ()
        {
            allFields.val("").removeClass("ui-state-error");
        }
    });

    $( "#addSubCategory" )
        .click(function() {
            $( "#subCategoryDialog" ).dialog( "open" );
    });

});

/*
$(function addNewItem(categoryList)
{

    $("a.addNew").click(function ()
    {
        var div = $(this).parents("div.group:first");
        var h2 = $(div).children("h2");
        var subDiv = $(div).children("div");
        var table = $(subDiv).children("table");
        var tbody = $(table).children("tbody");
        var tr = $(tbody).children("tr:first");

        var isSubCategory = $(div).attr("id") == "sub-categories" ? true : false;

        var subText = isSubCategory ? "Sub" : "";
        var parentCatRow = isSubCategory ? "<td><input id='ParentCategoryId' type='text' size='20' /></td>" : "";
        //var parentCatRow = isSubCategory ? "<td>" + (at)Html.DropDownList("ParentCategoryId", null, categoriesList, -1) + "</td>": "";

        var newRow = "<tr id='new" + subText + "CategoryTR'>";
        var newRow = newRow + "<td><input id='" + subText + "CategoryName' type='text' size='20' /></td>";
        var newRow = newRow + parentCatRow;
        var newRow = newRow + "<td><input id='" + subText + "CategoryDesc' type=text' size='50' /></td>";
        var newRow = newRow + "<td>";
        var newRow = newRow + "<button class='add-category'>Save</button>";
        var newRow = newRow + "<button class='cancel-add' onclick=removeTR('new" + subText + "CategoryTR')>Cancel</button>";
        var newRow = newRow + "</td></tr>";

        //Check to see if user is already in the section they're editing
        if (!$(h2).hasClass('ui-state-active'))
        {
            $(this).parent().click();
        }

        //Add input to a new row
        $(tr).before(newRow);
    });

});

function removeTR(trId)
{
    $("#" + trId).remove();
}
*/