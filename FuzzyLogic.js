(function (exports) {
    "use strict";
    exports.FuzzyLogic = function () {
        var rules = {};
        var sequance = [];
        var baseLink = [];
        function createRule(name, values) {
            if (typeof name != "string") throw Error("name should be string");
            else if (values == undefined) throw Error("values are required");
            rules[name] = values;
        }
        function deleteRule(name) {
            if (typeof name != "string") throw Error("name should be string");
            delete rules[name];
        }
        function addSequance(seq) {
            if (seq == undefined) throw Error("Sequance is not provided");
            if (checkRule(seq)) {
                sequance.push(JSON.stringify(seq));
            }
        }
        function removeSequance(seq) {
            var index = sequance.indexOf(JSON.stringify(seq));
            if (index != -1) {
                sequance.splice(index, 1);
            }
        }
        function checkRule(seq) {
            if (typeof seq == "string") {
                if (rules[seq] != undefined)
                    return true;
                else
                    throw Error("Invalid rule (" + seq + ")");
            }
            else {
                var check = true;
                for (var i = 0; i < seq.length && check; i++) {
                    check = checkRule(seq[i]);
                }
                return check;
            }
        }
        var globalSelection = [];
        function testSequance(previousSeq, seq, question) {
            var originalQuestion = question;
            var originalPreviousSeq = previousSeq;
            var seqUpdated = false;
            if (typeof seq == "string") {
                alert(1);
                var test = testRule(question, seq);
                if (test.status == true) {
                    console.log(question, seq, test);
                }
            }
            else {
                var andCheck = true;
                var seqMatchStart = 0;
                if (seq.length > 1) {
                    if (previousSeq == null) return { previousSeq: previousSeq, list: [], nextPart: question, seqUpdated: seqUpdated };
                    if (typeof seq[0] == "string") {
                        if (seq[0] != previousSeq) return { previousSeq: previousSeq, list: [], nextPart: question, seqUpdated: seqUpdated };
                    }
                    else {
                        var index = seq[0].indexOf(previousSeq);
                        if (index == -1) return { previousSeq: previousSeq, list: [], nextPart: question, seqUpdated: seqUpdated };
                    }
                    seqMatchStart = 1;
                }
                else if (seq.length == 1 && previousSeq != null) {
                    return { previousSeq: previousSeq, list: [], nextPart: question, seqUpdated: seqUpdated };
                }
                var localRules = [];
                for (var i = seqMatchStart; i < seq.length && andCheck; i++) {
                    var test = testRule(question, seq[i]);
                    if (test.status == true) {
                        if (test.previousSeq != null)
                            localRules.push({ part: test.part, rule: test.previousSeq });
                        question = test.nextPart;
                        if (test.previousSeq != null)
                            previousSeq = test.previousSeq;
                        if (test.seqUpdated == true) {
                            seqUpdated = true;
                        }
                        if (question == null) {
                            //globalSelection = globalSelection.concat(localRules);
                            return { previousSeq: previousSeq, list: test.list, nextPart: question, seqUpdated: seqUpdated,  };
                        }
                    }
                    else {
                        andCheck = false;
                    }
                }
                if (andCheck == true)
                    globalSelection = globalSelection.concat(localRules);
                return { previousSeq: previousSeq, list: [], nextPart: question, seqUpdated: seqUpdated };
            }
        }

        function testRule(question, ruleList) {
            var suggestions = [];
            var ruleMatched = "";
            if (typeof ruleList == "string") {
                ruleList = [ruleList];
            }
            for (var j = 0; j < ruleList.length; j++) {
                var ruleName = ruleList[j];
                var regEx = new RegExp("^" + question, "i");
                for (var i = 0; i < rules[ruleName].length; i++) {
                    if (true || question.length <= rules[ruleName][i].length) {
                        if (regEx.test(rules[ruleName][i])) {
                            suggestions.push(rules[ruleName][i]);
                            ruleMatched = ruleName;
                        }
                    }
                }
            }

            if (suggestions.length > 0) {
                if (suggestions.length == 1 && suggestions[0].toLowerCase().trim() == question.trim().toLowerCase())
                    return { status: true, list: [], nextPart: "", previousSeq: ruleMatched, seqUpdated: true, part: suggestions[0] };
                else
                    return { status: true, list: suggestions, nextPart: null, previousSeq: null, seqUpdated: false };
            }
            //else
            //    return { status: false, list: [], nextPart: "" };
            for (var j = 0; j < ruleList.length; j++) {
                var ruleName = ruleList[j];
                for (var i = 0; i < rules[ruleName].length; i++) {
                    if (true || question.length >= rules[ruleName][i].length) {
                        var regEx = new RegExp("^" + rules[ruleName][i], "i");
                        if (regEx.test(question)) {
                            var part = question.match(regEx)[0];
                            var nextPart = question.replace(regEx, "").trim();
                            return { status: true, list: [], nextPart: nextPart, previousSeq: ruleName, seqUpdated: true, part: part };
                        }
                    }
                }
            }
            return { status: false, list: [], nextPart: "", previousSeq: null, seqUpdated: false };
        }

        function mapRules(question) {
            var lastSuggestions = [];
            var finalSuggestions = [];
            globalSelection = [];
            var previousSeq = null;
            var foundAtleastOne = false;
            for (var i = 0; i < sequance.length; i++) {
                var result = testSequance(previousSeq, JSON.parse(sequance[i]), question);
                if (result.list.length > 0) {
                    foundAtleastOne = true;
                    //return result.list;
                    for (var j = 0; j < result.list.length; j++) {
                        var index = finalSuggestions.indexOf(result.list[j]);
                        if (index == -1)
                            finalSuggestions.push(result.list[j]);

                    }
                    //console.log(question, JSON.parse(sequance[i]), result);
                }

                if (result.seqUpdated == true && result.nextPart != null) {
                    i = -1;
                    foundAtleastOne = false;
                    lastSuggestions = finalSuggestions;
                    finalSuggestions = [];
                    previousSeq = result.previousSeq;
                    if (result.nextPart != null && result.nextPart != "") {
                        question = result.nextPart.trim();
                    }
                    else {
                        question = "";
                    }
                }

            }
            console.log(globalSelection);
            if (foundAtleastOne)
                return finalSuggestions;
            else
                return lastSuggestions
        }

        var FuzzyLogic = {
            //            questions: [],
            //            findQuestion: function (question) {
            //                for (var i = 0; i < this.questions.length; i++) {
            //                    var regex = new RegExp(this.questions[i].regex.join(''));
            //                    if (question == undefined) {
            //                        var result = regex.test(this.questions[i].value);
            //                        if (result == true) {
            //                            return this.questions[i];
            //                            //console.log(this.questions[i].value, result, this.Answer(this.questions[i].value, this.questions[i]).length + "/" + this.masterData.length);
            //                        }
            //                        else {
            //                            //console.log(this.questions[i].value, result, "Not Applicable");
            //                        }
            //                    }
            //                    else {
            //                        var result = regex.test(question);
            //                        if (result == true) {
            //                            return this.questions[i];
            //                            //console.log(question, result, this.Answer(question, this.questions[i]).length + "/" + this.masterData.length);
            //                        }
            //                        else {
            //                            //console.log(question, result, "Not Applicable");
            //                        }
            //                    }
            //                }
            //            },
            //            TestQuestions: function (question, obj) {
            //                var regex = new RegExp(obj.regex.join(''));
            //                var result = regex.test(question);
            //                return result;
            //            },
            //            parse: function (question, obj) {
            //                var parts = [];
            //                for (var i = 0; i < obj.regex.length; i++) {
            //                    var regex = new RegExp(obj.regex[i]);
            //                    parts.push(question.match(regex)[0]);
            //                    question = question.replace(regex, '');
            //                }
            //                return parts;
            //            },
            createRule: function (name, values) {
                return createRule(name, values);
            },
            deleteRule: function (name) {
                return deleteRule(name);
            },
            addSequance: function (seq) {
                return addSequance(seq);
            },
            removeSequance: function (seq) {
                return removeSequance(seq);
            },
            checkFuzzyLogic: function (question) {
                //console.log(this.dbField(question));
                return mapRules(question);
            },
            print: function () {
                console.log({ rules: rules, sequance: sequance });
            }
            //            dbField: function (question) {
            //                var selection = '';
            //                var startField = new RegExp('\\[(.*?)');
            //                if (startField.test(question)) {
            //                    var finishField = new RegExp('\\[(.*?)\\]');
            //                    if (finishField.test(question)) {
            //                        selection = question.match(finishField)[0];
            //                        question = question.replace(finishField, '');
            //                        return { status: true, completed: true, selection: selection, nextvalue: question };
            //                    }
            //                    else {
            //                        selection = question.match(startField)[0];
            //                        question = question.replace(startField, '');
            //                        return { status: true, completed: false, selection: selection, nextvalue: question };
            //                    }
            //                }
            //                else {
            //                    //console.log("Not Field");
            //                    return { status: false, selection: selection, nextvalue: question };
            //                }
            //            }
        }
        return new function () {
            return FuzzyLogic;
        };
    }
})(typeof exports === 'undefined' ? this['FuzzyLogic'] = {} : exports);