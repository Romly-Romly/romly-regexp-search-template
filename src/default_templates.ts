const default_templates =
[
	{
		"label": "C#",
		"extensions": [".cs"],
		"templates":
		[
			{
				"name": "C# class name",
				"label": "$(symbol-class) $1",
				"pattern": "^\\s*(?:private|public)\\sclass\\s([\\w]+)\\s\\:",
				"label_index": 1
			},
			{
				"name": "C# default method",
				"label": "    $(symbol-method) $1$3",
				"pattern": "^\\s*(private\\s|public\\s|)([\\w]+)\\s([\\w]+)\\(",
				"label_index": 3
			},
			{
				"name": "C# public property",
				"label": "    $(symbol-field) public $2",
				"pattern": "^\\s*public\\s([\\w]+)\\s([\\w]+)$",
				"label_index": 2
			}
		]
	},
	{
		"label": "Delphi",
		"extensions": [".pas"],
		"templates":
		[
			{
				"name": "Delphi procedure",
				"pattern": "^procedure\\s(\\w+)\\.(?!FormCreate)(\\w+)",
				"label": "$(symbol-method) $1    $2"
			},
			{
				"name": "Delphi function",
				"pattern": "^function\\s(\\w+)\\.(\\w+)",
				"label": "$(symbol-function) $1    $2"
			},
			{
				"name": "Delphi FormCreate",
				"pattern": "^procedure\\s(\\w+)\\.FormCreate",
				"label": "$(window) $1    FormCreate"
			},
			{
				"name": "Delphi constructor",
				"pattern": "^constructor\\s(\\w+)\\.(\\w+)",
				"label": "$(symbol-constructor) $1    $2"
			},
			{
				"name": "Delphi destructor",
				"pattern": "^destructor\\s(\\w+)\\.(\\w+)",
				"label": "$(x) $1    $2"
			},
			{
				"name": "Delphi sub method",
				"pattern": "^((?:[ ]{2})*)(?:procedure|function)\\s([\\w]+)[;\\(]",
				"label": "$(symbol-method) $1$1$1$1$2"
			}
		]
	},
	{
		"label": "Python",
		"extensions": [".py"],
		"templates":
		[
			{
				"name": "Python def with doc",
				"pattern": "(?<indent>\\t*)def\\s(?<funcName>\\w+)(?:[^\\r\\n]*)((?:\\r\\n)|\\r|\\n)([^\\r\\n]*?\"\"\"[\\r\\n\\s]*(?<description>[^\\r\\n]+))?",
				"flag": "gms",
				"label": "$(symbol-method) ${indent}${funcName}",
				"description": "${description}"
			},
			{
				"name": "Python class",
				"pattern": "class\\s(\\w+)",
				"label": "$(symbol-class) $1"
			}
		]
	},
	{
		"label": "Python const",
		"extensions": [".py"],
		"templates":
		[
			{
				"name": "Python const",
				"pattern": "^([A-Z_]+)\\s=\\s[^'\\d\\[]",
				"label": "$(symbol-constant) $1"
			},
			{
				"name": "Python const int",
				"pattern": "^([A-Z_]+)\\s=\\s[\\d.]+",
				"label": "$(symbol-number) $1"
			},
			{
				"name": "Python const str",
				"pattern": "^([A-Z_]+)\\s=\\s'(.*)'",
				"label": "$(symbol-string) $1"
			},
			{
				"name": "Python const array",
				"pattern": "^([A-Z_]+)\\s=\\s\\[",
				"label": "$(symbol-array) $1"
			}
		]
	},
	{
		"label": "Processing",
		"extensions": [".pde"],
		"templates":
		{
			"name": "Processing Method",
			"pattern": "^\\w+\\s(\\w+)\\(",
			"label": "$(symbol-method) $1"
		}
	},
	{
		"label": "CPP",
		"extensions": [".cpp", ".ino"],
		"templates":
		[
			{
				"label": "$(symbol-constructor) ${className} constructor",
				"pattern": "^(?<className>\\w+)::\\k<className>",
				"label_index": 1
			},
			{
				"label": "$(symbol-constructor) ${className} destructor",
				"pattern": "^(?<className>\\w+)::~\\k<className>",
				"label_index": 1
			},
			{
				"label": "$(symbol-class) $2 :: $3",
				"pattern": "^(?:static\\s+)?(?<type>[\\w+\\_]+\\*?)\\s\\*?(?<class>\\w+)\\:\\:(\\w+)\\(",
				"label_index": 1
			},
			{
				"label": "$(symbol-method) ${funcName}",
				"pattern": "^(?<static>static\\s|)(?<inline>inline\\s|)\\w+\\s\\*?(?<funcName>\\w+)\\(.*$",
				"label_index": 2
			},
			{
				"label": "前方宣言 $1",
				"pattern": "^\\w+\\s\\*?(\\w+)\\(.+\\;$",
				"label_index": 1
			}
		]
	},
	{
		"label": "C",
		"extensions": [".c"],
		"templates":
		[
			{
				"label": "$(symbol-method) ${funcName}",
				"pattern": "^(?<static>static\\s|)(?<inline>inline\\s|)\\w+\\s\\*?(?<funcName>\\w+)\\(.*$",
				"label_index": 2
			}
		]
	},
	{
		"label": "HTML",
		"extensions": [".html"],
		"templates":
		[
			{
				"label": "$1",
				"pattern": "<h1[^>]*>(.*)<\\/h1>",
				"label_index": 1
			},
			{
				"label": "    $1",
				"pattern": "<h2[^>]*>(.*)<\\/h2>",
				"label_index": 1
			},
			{
				"label": "        $1",
				"pattern": "<h3[^>]*>(.*)<\\/h3>",
				"label_index": 1
			},
			{
				"label": "            $1",
				"pattern": "<h4[^>]*>(.*)<\\/h4>",
				"label_index": 1
			}
		]
	},
	{
		"label": "Markdown",
		"extensions": [".md"],
		"templates":
		[
			{
				"label": "${title}",
				"pattern" : "^(?<indent>[^\\S\\n\\r]*)#(?:\\s+)(?<title>.*)$",
			},
			{
				"label": "    ${title}",
				"pattern" : "^(?<indent>[^\\S\\n\\r]*)##(?:\\s+)(?<title>.*)$",
			},
			{
				"label": "        ${title}",
				"pattern" : "^(?<indent>[^\\S\\n\\r]*)###(?:\\s+)(?<title>.*)$",
			},
			{
				"label": "            ${title}",
				"pattern" : "^(?<indent>[^\\S\\n\\r]*)####(?:\\s+)(?<title>.*)$",
			},
			{
				"label": "                ${title}",
				"pattern" : "^(?<indent>[^\\S\\n\\r]*)#####(?:\\s+)(?<title>.*)$",
			},
			{
				"label": "                    ${title}",
				"pattern" : "^(?<indent>[^\\S\\n\\r]*)######(?:\\s+)(?<title>.*)$",
			},
		]
	},
	{
		"label": "TypeScript",
		"extensions": [".ts"],
		"templates":
		[
			{
				// 関数
				"label": "${indent}$(symbol-method) ${funcName}",
				"pattern": "(?:(?:(?:\\/\\*\\*(?:(?:\\r\\n)|\\r|\\n)\\s\\*\\s)|(?:^\\/\\/\\s*))(?<description>[^\\n\\r]+)(?:(?:\\r\\n)|\\r|\\n)(?:(?:(?:^\\/\\/[^\\n\\r]+)|(?:^(?:(?:\\s\\*\\s)|(?:\\s\\*\\/))[^\\n\\r]*))(?:(?:\\r\\n)|\\r|\\n))*)?^(?<indent>\\t*)(?<export>(?:export\\s+)?)(?<async>(?:async\\s+)?)function (?<funcName>\\w+)\\(",
				"flag": "gms",
				"description": "${description}"
			},
			{
				// インターフェース
				"label": "$(symbol-interface) ${interface}",
				"pattern": "^(?:export\\s+)?interface (?<interface>\\w+)",
				"label_index": 1
			},
			{
				// クラス名
				"label": "$(symbol-class) ${className}",
				"pattern": "(?:(?:(?:\\/\\*\\*(?:(?:\\r\\n)|\\r|\\n)\\s\\*\\s)|(?:^\\/\\/\\s*))(?<description>[^\\n\\r]+)(?:(?:\\r\\n)|\\r|\\n)(?:(?:(?:^\\/\\/[^\\n]+)|(^(?:(?:\\s\\*\\s)|(?:\\s\\*\\/))[^\\n\\r]*))(?:(?:\\r\\n)|\\r|\\n))*)?(abstract\\s)?class\\s(?<className>\\w+)",
				"flag": "gms",
				"description": "${description}",
				"searchText": "${className}"
			},
			{
				// クラスのメソッド
				"label": "$1$(symbol-method) $2 $3",
				"pattern": "^(\\t*)(public|private) (\\w+)\\(",
				"label_index": 1
			}
		]
	},
	{
		"label": "CSS",
		"extensions": [".css", ".scss"],
		"templates":
		[
			{
				"label": "$0",
				"pattern": "^(\\t?[\\.#\\w\\[\\]\\-\\=\\(\\)\\: ]+)[ \\t]*{?\\n",
				"label_index": 0
			},
			{
				"label": "$0",
				"pattern": "^\\t+\\&[\\w\\-]+",
				"label_index": 0
			},
			{
				"label": "@mixin $1",
				"pattern": "@mixin\\s+(\\w+)\\(.*\\)",
				"label_index": 0
			}
		]
	}
];

export default default_templates;