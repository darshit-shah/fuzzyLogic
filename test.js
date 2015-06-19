if (FuzzyLogic == undefined) {
    FuzzyLogic = require('./FuzzyLogic').FuzzyLogic;
}
var f = new FuzzyLogic.FuzzyLogic();

var dimensions = ["Plant", "Sales Units", "Area Office", "District", "Dchl", "IncoT"];
var measures = ["Volume", "Distance", "Freight"];
var singleAggregations = ["total", "average", "minimum", "maximum"];
var doubleAggregations = ["weighted average"];
var singleOperators = [">=", "<=", "=", ">", "<", "more than", "less than", "is same as", "like"];
var doubleOperators = ["between"];
var betweenAnd = ["and"];
var fieldAnd = [","];
var conditionAndOr = ["and", "or"];
var filters = ["having", "where"];

f.createRule('dimensionsStart', dimensions);
f.createRule('measuresStart', measures);
f.createRule('dimensions', dimensions);
f.createRule('measures', measures);
f.createRule('singleAggregations', singleAggregations);
f.createRule('doubleAggregations', doubleAggregations);
f.createRule('singleOperators', singleOperators);
f.createRule('doubleOperators', doubleOperators);
f.createRule('betweenAnd', betweenAnd);
f.createRule('fieldAnd', fieldAnd);
f.createRule('conditionAndOr', conditionAndOr);
f.createRule('filters', filters);
f.createRule('staticValue', ['\\d+', '\\"(.*?)\\"']);

//base
f.addSequance([['dimensions', 'measures', 'singleAggregations']]);

f.addSequance([['singleAggregations'], ['measures']]);

//fieldAnd
f.addSequance([['dimensions', 'measures'], ['fieldAnd'], ['dimensions', 'measures', 'singleAggregations']]);

//filters
f.addSequance([['dimensions', 'measures'], ['filters']]);

//filter with next and/or
f.addSequance([['filters', 'conditionAndOr'], ['dimensions', 'measures'], ['singleOperators'], ['dimensions', 'measures', 'staticValue'], ['conditionAndOr']]);

//filter conditions
f.addSequance([['filters', 'conditionAndOr'], ['dimensions', 'measures'], ['singleOperators'], ['dimensions', 'measures', 'staticValue']]);

//filter with next and/or
f.addSequance([['filters', 'conditionAndOr'], ['measures'], ['doubleOperators'], ['staticValue'], ['betweenAnd'], ['staticValue'], ['conditionAndOr']]);

//filter conditions
f.addSequance([['filters', 'conditionAndOr'], ['measures'], ['doubleOperators'], ['staticValue'], ['betweenAnd'], ['staticValue']]);

//filter with next and/or
f.addSequance([['filters', 'conditionAndOr'], 'singleAggregations', ['measures'], ['singleOperators'], ['staticValue'], ['conditionAndOr']]);

//filter conditions
f.addSequance([['filters', 'conditionAndOr'], 'singleAggregations', ['measures'], ['singleOperators'], ['staticValue']]);

//filter with next and/or
f.addSequance([['filters', 'conditionAndOr'], 'singleAggregations', ['measures'], ['doubleOperators'], ['staticValue'], ['betweenAnd'], ['staticValue'], ['conditionAndOr']]);

//filter conditions
f.addSequance([['filters', 'conditionAndOr'], 'singleAggregations', ['measures'], ['doubleOperators'], ['staticValue'], ['betweenAnd'], ['staticValue']]);

//f.checkFuzzyLogic("S");