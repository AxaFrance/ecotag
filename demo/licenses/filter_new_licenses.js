function getValue(data) {
    if(!data){
        return null;
    } else{
        return data.value;
    }
}

function formatValue(value) {
    if(!value){
        return null;
    } else{
        return value.toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "");
    }
}


try {
    var dataBody = JSON.parse(rawBodyInput);
    const new_data = {firstname : null,lastname: null,birthdate: null,license_validity_date: null, categoryB:null};
    dataBody.analysis.forEach(anal => {
        anal.elements.forEach(el => {
            if(el.document_type === "nouveau_permis_recto") {
                if(new_data.firstname !== null) { return null;}
                new_data.firstname = getValue(el.firstname);
                new_data.lastname= getValue(el.lastname);
                new_data.birthdate= getValue(el.birthdate);
                new_data.license_validity_date= getValue(el.license_validity_date);
            }
            if(el.document_type === "nouveau_permis_verso") {
                if(new_data.categoryB !== null) { return null;}
                if(el.category_table) {
                    el.category_table.forEach(ct => {
                        if (ct.category === "B" && ct.license_procurement_date) {
                            new_data.categoryB = getValue(ct.license_procurement_date);
                        }
                    });
                }
            }
            if(el.document_type === "ancien_permis_recto") {
                if(new_data.firstname !== null) { return null;}
                new_data.firstname = formatValue(getValue(el.firstname));
                new_data.lastname= formatValue(getValue(el.lastname));
                new_data.birthdate= getValue(el.birthdate);
                if(el.category_table) {
                    el.category_table.forEach(ct => {
                        if (ct.category === "B" && ct.license_procurement_date) {
                            new_data.categoryB = getValue(ct.license_procurement_date);
                        }
                    });
                }
            };
        });
    });
    rawBodyOutput = JSON.stringify(new_data);
} catch(ex) {
    console.log("Plantage parsing right");
    console.log(ex.toString());
    rawBodyOutput = rawBodyInput;
}
