/* generated - don't edit */export default{title:"dependency-cruiser output format",$schema:"http://json-schema.org/draft-07/schema#",$id:"https://dependency-cruiser.js.org/schema/cruise-result.schema.json",type:"object",required:["summary","modules"],additionalProperties:false,properties:{modules:{$ref:"#/definitions/ModulesType"},folders:{$ref:"#/definitions/FoldersType"},summary:{$ref:"#/definitions/SummaryType"},revisionData:{$ref:"#/definitions/RevisionDataType"}},definitions:{ModulesType:{type:"array",items:{$ref:"#/definitions/ModuleType"}},ModuleType:{type:"object",required:["source","dependencies","valid"],additionalProperties:false,properties:{source:{type:"string"},valid:{type:"boolean"},dependencies:{$ref:"#/definitions/DependenciesType"},dependents:{type:"array",items:{type:"string"}},followable:{type:"boolean"},matchesDoNotFollow:{type:"boolean"},matchesFocus:{type:"boolean"},matchesReaches:{type:"boolean"},matchesHighlight:{type:"boolean"},coreModule:{type:"boolean"},couldNotResolve:{type:"boolean"},dependencyTypes:{type:"array",items:{$ref:"#/definitions/DependencyTypeType"}},license:{type:"string"},orphan:{type:"boolean"},reachable:{type:"array",items:{$ref:"#/definitions/ReachableType"}},reaches:{type:"array",items:{$ref:"#/definitions/ReachesType"}},rules:{type:"array",items:{$ref:"#/definitions/RuleSummaryType"}},consolidated:{type:"boolean"},instability:{type:"number"},experimentalStats:{$ref:"#/definitions/ExperimentalStatsType"},checksum:{type:"string"}}},ReachableType:{type:"object",required:["value","asDefinedInRule","matchedFrom"],additionalProperties:false,properties:{value:{type:"boolean"},asDefinedInRule:{type:"string"},matchedFrom:{type:"string"}}},ReachesType:{type:"object",required:["modules","asDefinedInRule"],additionalProperties:false,properties:{modules:{type:"array",items:{type:"object",required:["source","via"],additionalProperties:false,properties:{source:{type:"string"},via:{type:"array",items:{$ref:"#/definitions/MiniDependency"}}}}},asDefinedInRule:{type:"string"}}},DependenciesType:{type:"array",items:{$ref:"#/definitions/DependencyType"}},DependencyType:{type:"object",required:["circular","coreModule","couldNotResolve","dependencyTypes","exoticallyRequired","dynamic","followable","module","moduleSystem","resolved","valid"],additionalProperties:false,properties:{module:{type:"string"},protocol:{type:"string",enum:["data:","file:","node:"]},mimeType:{type:"string"},resolved:{type:"string"},coreModule:{type:"boolean"},dependencyTypes:{type:"array",items:{$ref:"#/definitions/DependencyTypeType"}},license:{type:"string"},followable:{type:"boolean"},dynamic:{type:"boolean"},exoticallyRequired:{type:"boolean"},exoticRequire:{type:"string"},matchesDoNotFollow:{type:"boolean"},couldNotResolve:{type:"boolean"},preCompilationOnly:{type:"boolean"},typeOnly:{type:"boolean"},circular:{type:"boolean"},cycle:{type:"array",items:{$ref:"#/definitions/MiniDependency"}},moduleSystem:{$ref:"#/definitions/ModuleSystemType"},valid:{type:"boolean"},rules:{type:"array",items:{$ref:"#/definitions/RuleSummaryType"}},instability:{type:"number"}}},DependencyTypeType:{type:"string",enum:["aliased-subpath-import","aliased-tsconfig-base-url","aliased-tsconfig-paths","aliased-tsconfig","aliased-webpack","aliased-workspace","aliased","amd-define","amd-require","amd-exotic-require","core","deprecated","dynamic-import","exotic-require","export","import-equals","import","jsdoc","jsdoc-bracket-import","jsdoc-import-tag","local","localmodule","npm-bundled","npm-dev","npm-no-pkg","npm-optional","npm-peer","npm-unknown","npm","pre-compilation-only","require","triple-slash-amd-dependency","triple-slash-directive","triple-slash-file-reference","triple-slash-type-reference","type-import","type-only","undetermined","unknown"]},ModuleSystemType:{type:"string",enum:["cjs","es6","amd","tsd"]},RuleSummaryType:{type:"object",required:["name","severity"],additionalProperties:false,properties:{name:{type:"string"},severity:{$ref:"#/definitions/SeverityType"}}},SeverityType:{type:"string",enum:["error","warn","info","ignore"]},MiniDependency:{type:"object",required:["name","dependencyTypes"],additionalProperties:false,properties:{name:{type:"string"},dependencyTypes:{type:"array",items:{$ref:"#/definitions/DependencyTypeType"}}}},ExperimentalStatsType:{type:"object",required:["size","topLevelStatementCount"],additionalProperties:false,properties:{topLevelStatementCount:{type:"number"},size:{type:"number"}}},FoldersType:{type:"array",items:{$ref:"#/definitions/FolderType"}},FolderType:{type:"object",required:["name","moduleCount"],additionalProperties:false,properties:{name:{type:"string"},dependents:{type:"array",items:{type:"object",required:["name"],additionalProperties:false,properties:{name:{type:"string"}}}},dependencies:{type:"array",items:{type:"object",required:["name","valid","circular"],additionalProperties:false,properties:{name:{type:"string"},instability:{type:"number"},valid:{type:"boolean"},circular:{type:"boolean"},cycle:{type:"array",items:{$ref:"#/definitions/MiniDependency"}},rules:{type:"array",items:{$ref:"#/definitions/RuleSummaryType"}}}}},moduleCount:{type:"number"},afferentCouplings:{type:"number"},efferentCouplings:{type:"number"},instability:{type:"number"},experimentalStats:{$ref:"#/definitions/ExperimentalStatsType"}}},SummaryType:{type:"object",required:["violations","error","warn","info","totalCruised","optionsUsed"],additionalProperties:false,properties:{violations:{$ref:"#/definitions/ViolationsType"},error:{type:"number"},warn:{type:"number"},info:{type:"number"},ignore:{type:"number"},totalCruised:{type:"number"},totalDependenciesCruised:{type:"number"},ruleSetUsed:{$ref:"#/definitions/RuleSetType"},optionsUsed:{$ref:"#/definitions/OptionsUsedType"}}},ViolationsType:{type:"array",items:{$ref:"#/definitions/ViolationType"}},ViolationType:{type:"object",required:["from","to","rule"],additionalProperties:false,properties:{from:{type:"string"},to:{type:"string"},type:{$ref:"#/definitions/ViolationTypeType"},rule:{$ref:"#/definitions/RuleSummaryType"},cycle:{type:"array",items:{$ref:"#/definitions/MiniDependency"}},via:{type:"array",items:{$ref:"#/definitions/MiniDependency"}},metrics:{type:"object",required:["from","to"],additionalProperties:false,properties:{from:{type:"object",required:["instability"],additionalProperties:false,properties:{instability:{type:"number"}}},to:{type:"object",required:["instability"],additionalProperties:false,properties:{instability:{type:"number"}}}}},comment:{type:"string"}}},ViolationTypeType:{type:"string",enum:["dependency","module","reachability","cycle","instability","folder"]},RuleSetType:{type:"object",additionalProperties:false,properties:{forbidden:{type:"array",items:{$ref:"#/definitions/ForbiddenRuleType"}},allowed:{type:"array",items:{$ref:"#/definitions/AllowedRuleType"}},allowedSeverity:{$ref:"#/definitions/SeverityType"},required:{type:"array",items:{$ref:"#/definitions/RequiredRuleType"}}}},AllowedRuleType:{oneOf:[{$ref:"#/definitions/RegularAllowedRuleType"},{$ref:"#/definitions/ReachabilityAllowedRuleType"}]},RegularAllowedRuleType:{type:"object",required:["from","to"],additionalProperties:false,properties:{comment:{type:"string"},scope:{type:"string",enum:["module","folder"]},from:{$ref:"#/definitions/FromRestrictionType"},to:{$ref:"#/definitions/ToRestrictionType"}}},ReachabilityAllowedRuleType:{type:"object",required:["from","to"],additionalProperties:false,properties:{comment:{type:"string"},scope:{type:"string",enum:["module","folder"]},from:{$ref:"#/definitions/ReachabilityFromRestrictionType"},to:{$ref:"#/definitions/ReachabilityToRestrictionType"}}},ForbiddenRuleType:{oneOf:[{$ref:"#/definitions/RegularForbiddenRuleType"},{$ref:"#/definitions/ReachabilityForbiddenRuleType"},{$ref:"#/definitions/DependentsForbiddenRuleType"}]},RegularForbiddenRuleType:{type:"object",required:["from","to"],additionalProperties:false,properties:{name:{type:"string"},severity:{$ref:"#/definitions/SeverityType"},scope:{type:"string",enum:["module","folder"]},comment:{type:"string"},from:{$ref:"#/definitions/FromRestrictionType"},to:{$ref:"#/definitions/ToRestrictionType"}}},DependentsForbiddenRuleType:{type:"object",required:["module","from"],additionalProperties:false,properties:{name:{type:"string"},severity:{$ref:"#/definitions/SeverityType"},scope:{type:"string",enum:["module","folder"]},comment:{type:"string"},module:{$ref:"#/definitions/DependentsModuleRestrictionType"},from:{$ref:"#/definitions/DependentsFromRestrictionType"}}},ReachabilityForbiddenRuleType:{type:"object",required:["from","to"],additionalProperties:false,properties:{name:{type:"string"},severity:{$ref:"#/definitions/SeverityType"},scope:{type:"string",enum:["module","folder"]},comment:{type:"string"},from:{$ref:"#/definitions/ReachabilityFromRestrictionType"},to:{$ref:"#/definitions/ReachabilityToRestrictionType"}}},RequiredRuleType:{type:"object",required:["module","to"],additionalProperties:false,properties:{name:{type:"string"},severity:{$ref:"#/definitions/SeverityType"},scope:{type:"string",enum:["module","folder"]},comment:{type:"string"},module:{$ref:"#/definitions/RequiredModuleRestrictionType"},to:{$ref:"#/definitions/RequiredToRestrictionType"}}},MiniDependencyRestrictionType:{oneOf:[{$ref:"#/definitions/REAsStringsType"},{type:"object",additionalProperties:false,properties:{path:{$ref:"#/definitions/REAsStringsType"},pathNot:{$ref:"#/definitions/REAsStringsType"},dependencyTypes:{type:"array",items:{$ref:"#/definitions/DependencyTypeType"}},dependencyTypesNot:{type:"array",items:{$ref:"#/definitions/DependencyTypeType"}}}}]},FromRestrictionType:{type:"object",additionalProperties:false,properties:{path:{$ref:"#/definitions/REAsStringsType"},pathNot:{$ref:"#/definitions/REAsStringsType"},orphan:{type:"boolean"}}},ReachabilityFromRestrictionType:{type:"object",additionalProperties:false,properties:{path:{$ref:"#/definitions/REAsStringsType"},pathNot:{$ref:"#/definitions/REAsStringsType"}}},ToRestrictionType:{type:"object",additionalProperties:false,properties:{path:{$ref:"#/definitions/REAsStringsType"},pathNot:{$ref:"#/definitions/REAsStringsType"},couldNotResolve:{type:"boolean"},circular:{type:"boolean"},dynamic:{type:"boolean"},exoticallyRequired:{type:"boolean"},exoticRequire:{$ref:"#/definitions/REAsStringsType"},exoticRequireNot:{$ref:"#/definitions/REAsStringsType"},preCompilationOnly:{type:"boolean"},dependencyTypes:{type:"array",items:{$ref:"#/definitions/DependencyTypeType"}},dependencyTypesNot:{type:"array",items:{$ref:"#/definitions/DependencyTypeType"}},moreThanOneDependencyType:{type:"boolean"},license:{$ref:"#/definitions/REAsStringsType"},licenseNot:{$ref:"#/definitions/REAsStringsType"},via:{$ref:"#/definitions/MiniDependencyRestrictionType"},viaOnly:{$ref:"#/definitions/MiniDependencyRestrictionType"},viaNot:{deprecated:true,$ref:"#/definitions/REAsStringsType"},viaSomeNot:{deprecated:true,$ref:"#/definitions/REAsStringsType"},moreUnstable:{type:"boolean"},ancestor:{type:"boolean"}}},DependentsModuleRestrictionType:{required:[],type:"object",additionalProperties:false,properties:{path:{$ref:"#/definitions/REAsStringsType"},pathNot:{$ref:"#/definitions/REAsStringsType"},numberOfDependentsLessThan:{type:"integer",minimum:0,maximum:100},numberOfDependentsMoreThan:{type:"integer",minimum:0,maximum:100}}},DependentsFromRestrictionType:{required:[],type:"object",additionalProperties:false,properties:{path:{$ref:"#/definitions/REAsStringsType"},pathNot:{$ref:"#/definitions/REAsStringsType"}}},ReachabilityToRestrictionType:{required:["reachable"],type:"object",additionalProperties:false,properties:{path:{$ref:"#/definitions/REAsStringsType"},pathNot:{$ref:"#/definitions/REAsStringsType"},reachable:{type:"boolean"}}},RequiredModuleRestrictionType:{required:[],type:"object",additionalProperties:false,properties:{path:{$ref:"#/definitions/REAsStringsType"},pathNot:{$ref:"#/definitions/REAsStringsType"}}},RequiredToRestrictionType:{required:[],type:"object",additionalProperties:false,properties:{path:{$ref:"#/definitions/REAsStringsType"},reachable:{type:"boolean"}}},REAsStringsType:{oneOf:[{type:"string"},{type:"array",items:{type:"string"}}]},OptionsUsedType:{type:"object",additionalProperties:false,properties:{doNotFollow:{$ref:"#/definitions/CompoundDoNotFollowType"},exclude:{$ref:"#/definitions/CompoundExcludeType"},includeOnly:{oneOf:[{$ref:"#/definitions/REAsStringsType"},{$ref:"#/definitions/CompoundIncludeOnlyType"}]},focus:{$ref:"#/definitions/CompoundFocusType"},reaches:{$ref:"#/definitions/CompoundReachesType"},affected:{oneOf:[{type:"string"},{type:"boolean"}]},highlight:{$ref:"#/definitions/CompoundHighlightType"},knownViolations:{$ref:"#/definitions/ViolationsType"},collapse:{type:"string"},maxDepth:{type:"integer",minimum:0,maximum:99},moduleSystems:{$ref:"#/definitions/ModuleSystemsType"},detectJSDocImports:{type:"boolean"},prefix:{type:"string"},preserveSymlinks:{type:"boolean"},combinedDependencies:{type:"boolean"},tsConfig:{type:"object",additionalProperties:false,properties:{fileName:{type:"string"}}},tsPreCompilationDeps:{oneOf:[{type:"boolean"},{type:"string",enum:["specify"]}]},extraExtensionsToScan:{type:"array",items:{type:"string"}},externalModuleResolutionStrategy:{type:"string",enum:["node_modules","yarn-pnp"]},builtInModules:{type:"object",additionalProperties:false,properties:{override:{type:"array",items:{type:"string"}},add:{type:"array",items:{type:"string"}}}},forceDeriveDependents:{type:"boolean",deprecated:true},webpackConfig:{type:"object",additionalProperties:false,properties:{fileName:{type:"string"},env:{oneOf:[{type:"object"},{type:"string"}]},arguments:{type:"object"}}},enhancedResolveOptions:{type:"object",additionalProperties:false,properties:{exportsFields:{type:"array",items:{type:"string"}},conditionNames:{type:"array",items:{type:"string"}},extensions:{type:"array",items:{type:"string"}},mainFields:{type:"array",items:{type:"string"}},mainFiles:{type:"array"},aliasFields:{type:"array",items:{type:"string"}},cachedInputFileSystem:{type:"object",additionalProperties:false,properties:{cacheDuration:{type:"integer",minimum:0,maximum:1800000}}}}},babelConfig:{type:"object",additionalProperties:false,properties:{fileName:{type:"string"}}},parser:{type:"string",enum:["acorn","tsc","swc"]},exoticRequireStrings:{type:"array",items:{type:"string"}},reporterOptions:{$ref:"#/definitions/ReporterOptionsType"},progress:{type:"object",additionalProperties:false,properties:{type:{type:"string",enum:["cli-feedback","performance-log","ndjson","none"]},maximumLevel:{type:"number",enum:[-1,40,50,60,70,80,99]}}},metrics:{type:"boolean"},experimentalStats:{type:"boolean"},skipAnalysisNotInRules:{type:"boolean"},baseDir:{type:"string"},cache:{oneOf:[{type:"boolean",enum:[false]},{$ref:"#/definitions/CacheOptionsType"}]},args:{type:"string"},rulesFile:{type:"string"},outputTo:{type:"string"},outputType:{$ref:"#/definitions/OutputType"}}},ModuleSystemsType:{type:"array",items:{$ref:"#/definitions/ModuleSystemType"}},OutputType:{oneOf:[{type:"string",enum:["json","html","dot","ddot","cdot","archi","fdot","flat","csv","err","err-long","err-html","teamcity","anon","text","metrics","markdown","mermaid","d2","null"]},{type:"string",pattern:"^plugin:[^:]+$"}]},CompoundExcludeType:{type:"object",additionalProperties:false,properties:{path:{$ref:"#/definitions/REAsStringsType"},dynamic:{type:"boolean"}}},CompoundDoNotFollowType:{type:"object",additionalProperties:false,properties:{path:{$ref:"#/definitions/REAsStringsType"},dependencyTypes:{type:"array",items:{$ref:"#/definitions/DependencyTypeType"}}}},CompoundIncludeOnlyType:{type:"object",additionalProperties:false,properties:{path:{$ref:"#/definitions/REAsStringsType"}}},CompoundFocusType:{type:"object",additionalProperties:false,properties:{path:{$ref:"#/definitions/REAsStringsType"},depth:{type:"number",minimum:1,maximum:4}}},CompoundReachesType:{type:"object",additionalProperties:false,properties:{path:{$ref:"#/definitions/REAsStringsType"}}},CompoundHighlightType:{type:"object",additionalProperties:false,properties:{path:{$ref:"#/definitions/REAsStringsType"}}},ReporterOptionsType:{type:"object",additionalProperties:false,properties:{anon:{$ref:"#/definitions/AnonReporterOptionsType"},archi:{$ref:"#/definitions/DotReporterOptionsType"},dot:{$ref:"#/definitions/DotReporterOptionsType"},ddot:{$ref:"#/definitions/DotReporterOptionsType"},flat:{$ref:"#/definitions/DotReporterOptionsType"},markdown:{$ref:"#/definitions/MarkdownReporterOptionsType"},metrics:{$ref:"#/definitions/MetricsReporterOptionsType"},mermaid:{$ref:"#/definitions/MermaidReporterOptionsType"},text:{$ref:"#/definitions/TextReporterOptionsType"}}},AnonReporterOptionsType:{type:"object",additionalProperties:false,properties:{wordlist:{type:"array",items:{type:"string"}}}},MetricsReporterOptionsType:{type:"object",additionalProperties:false,properties:{orderBy:{type:"string",enum:["instability","moduleCount","afferentCouplings","efferentCouplings","name","size","topLevelStatementCount"]},hideModules:{type:"boolean"},hideFolders:{type:"boolean"}}},MarkdownReporterOptionsType:{type:"object",additionalProperties:false,properties:{showTitle:{type:"boolean"},title:{type:"string"},showSummary:{type:"boolean"},showSummaryHeader:{type:"boolean"},summaryHeader:{type:"string"},showStatsSummary:{type:"boolean"},showRulesSummary:{type:"boolean"},includeIgnoredInSummary:{type:"boolean"},showDetails:{type:"boolean"},includeIgnoredInDetails:{type:"boolean"},showDetailsHeader:{type:"boolean"},detailsHeader:{type:"string"},collapseDetails:{type:"boolean"},collapsedMessage:{type:"string"},noViolationsMessage:{type:"string"},showFooter:{type:"boolean"}}},MermaidReporterOptionsType:{type:"object",additionalProperties:false,properties:{minify:{type:"boolean"}}},TextReporterOptionsType:{type:"object",additionalProperties:false,properties:{highlightFocused:{type:"boolean"}}},DotReporterOptionsType:{type:"object",additionalProperties:false,properties:{collapsePattern:{$ref:"#/definitions/REAsStringsType"},filters:{$ref:"#/definitions/ReporterFiltersType"},showMetrics:{type:"boolean"},theme:{$ref:"#/definitions/DotThemeType"}}},DotThemeType:{type:"object",additionalProperties:false,properties:{replace:{type:"boolean"},graph:{type:"object"},node:{type:"object"},edge:{type:"object"},modules:{$ref:"#/definitions/DotThemeArrayType"},dependencies:{$ref:"#/definitions/DotThemeArrayType"}}},DotThemeArrayType:{type:"array",items:{$ref:"#/definitions/DotThemeEntryType"}},DotThemeEntryType:{type:"object",additionalProperties:false,properties:{criteria:{type:"object"},attributes:{type:"object"}}},ReporterFiltersType:{type:"object",additionalProperties:false,properties:{exclude:{$ref:"#/definitions/CompoundExcludeType"},includeOnly:{$ref:"#/definitions/CompoundIncludeOnlyType"},focus:{$ref:"#/definitions/CompoundFocusType"},reaches:{$ref:"#/definitions/CompoundReachesType"}}},CacheOptionsType:{type:"object",additionalProperties:false,properties:{folder:{type:"string"},strategy:{$ref:"#/definitions/CacheStrategyType"},compress:{type:"boolean",default:false}}},CacheStrategyType:{type:"string",enum:["metadata","content"]},RevisionDataType:{type:"object",required:["SHA1","changes"],properties:{cacheFormatVersion:{type:"number"},SHA1:{type:"string"},changes:{type:"array",items:{type:"object",required:["name","type"],properties:{name:{type:"string"},type:{type:"string",enum:["added","copied","deleted","modified","renamed","type changed","unmerged","pairing broken","unknown","unmodified","untracked","ignored"]},oldName:{type:"string"},checksum:{type:"string"},args:{type:"array",items:{type:"string"}},rulesFile:{type:"string"}}}}}}}};