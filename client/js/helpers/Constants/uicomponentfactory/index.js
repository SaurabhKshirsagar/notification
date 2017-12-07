//Runtime
let UIState = {
    "UI": {
        "Header": {
            "type": "Header"
        },
        "Footer": {
            "type": "Footer"
        },
        "Tiles": [
            {
                "type": "Tile",
                "$ParentDataContext": "",	//Ref to appContext variable,
                "$DataContext": "",         //self appContext variable,  // must to have parent data context
                "General": {
                    "Caption": "Human Resources",
                    "Description": "Human Resources",
                    "Name": "Human Resources"
                },
                "UI": {
                    "Icon": "fa fa-male",
                    "Image": "hr.png",
                    "Order": 1
                },
                "Action": []
            },
            {
                "type": "Tile",
                "$ParentDataContext": "",
                "$DataContext": "",
                "General": {
                    "Caption": "Administration",
                    "Description": "Administration",
                    "Name": "Administration"
                },
                "UI": {
                    "Icon": "fa fa-cogs",
                    "Image": "setup.png",
                    "Order": 10
                },
                "Action": []
            },
            {
                "type": "Tile",
                "$ParentDataContext": "",
                "$DataContext": "",
                "General": {
                    "Caption": "Assets Management",
                    "Description": "Assets management",
                    "Name": "Assets Management"
                },
                "UI": {
                    "Icon": "fa fa-desktop",
                    "Image": "assets.png",
                    "Order": 8
                },
                "Action": []
            },
            {
                "type": "Tile",
                "$ParentDataContext": "",
                "$DataContext": "",
                "General": {
                    "Caption": "Compliance and Security",
                    "Description": "Compliance and Security",
                    "Name": "Compliance and Security"
                },
                "UI": {
                    "Icon": "fa fa-check-square-o",
                    "Image": "complience.png",
                    "Order": 4
                },
                "Action": []
            },
            {
                "type": "Tile",
                "$ParentDataContext": "",
                "$DataContext": "",
                "General": {
                    "Caption": "Customize",
                    "Description": "Customize",
                    "Name": "Customize"
                },
                "UI": {
                    "Icon": "fa fa-gavel",
                    "Image": "admin.png",
                    "Order": 11
                },
                "Action": []
            },
            {
                "type": "Tile",
                "$ParentDataContext": "",
                "$DataContext": "",
                "General": {
                    "Caption": "Employee Self Services",
                    "Description": "Employee Self Services",
                    "Name": "Employee Self Services"
                },
                "UI": {
                    "Color": "",
                    "Icon": "fa fa-medkit",
                    "Image": "assets.png",
                    "Order": 5
                },
                "Action": []
            },
            {
                "type": "Tile",
                "$ParentDataContext": "",
                "$DataContext": "",
                "General": {
                    "Caption": "Excel OR CSV Import",
                    "Description": "Excel OR CSV Import",
                    "Name": "Excel OR CSV Import"
                },
                "UI": {
                    "Icon": "fa fa-file-excel-o",
                    "Image": "excel.png",
                    "Order": 9
                },
                "Action": []
            },
            {
                "type": "Tile",
                "$ParentDataContext": "",
                "$DataContext": "",
                "General": {
                    "Caption": "Human Resources",
                    "Description": "Human Resources",
                    "Name": "Human Resources"
                },
                "UI": {
                    "Icon": "fa fa-male",
                    "Image": "hr.png",
                    "Order": 1
                },
                "Action": []
            },
            {
                "type": "Tile",
                "$ParentDataContext": "",
                "$DataContext": "",
                "General": {
                    "Caption": "Performance Reviews",
                    "Description": "Performance Reviews",
                    "Name": "Performance Reviews"
                },
                "UI": {
                    "Icon": "fa fa-line-chart",
                    "Image": "performance.png",
                    "Order": 3
                },
                "Action": []
            },
            {
                "type": "Tile",
                "$ParentDataContext": "",
                "$DataContext": "",
                "General": {
                    "Caption": "Project Tracker",
                    "Description": "Project Tracker",
                    "Name": "Project Tracker"
                },
                "UI": {
                    "Icon": "fa fa-clock-o",
                    "Image": "projectManagement.png",
                    "Order": 7
                },
                "Action": []
            },
            {
                "type": "Tile",
                "$ParentDataContext": "",
                "$DataContext": "",
                "General": {
                    "Caption": "Recruitment",
                    "Description": "Recruitment",
                    "Name": "Recruitment"
                },
                "UI": {
                    "Icon": "fa fa-users",
                    "Image": "recruitment.png",
                    "Order": 2
                },
                "Action": []
            },
            {
                "type": "Tile",
                "$ParentDataContext": "",
                "$DataContext": "",
                "General": {
                    "Caption": "Trainings",
                    "Description": "Trainings",
                    "Name": "Trainings"
                },
                "UI": {
                    "Icon": "fa fa-book",
                    "Image": "training.png",
                    "Order": 6
                },
                "Action": []
            }
        ],
        "Module": {
            "LeftNav": [
                {
                    "type": "LeftNavLinks",
                    "$ParentDataContext": "",
                    "$DataContext": "",
                    "Content": {
                        "Contents": "AssetRequest"
                    },
                    "General": {
                        "Caption": "Asset Request",
                        "Description": "",
                        "Type": "List"
                    },
                    "Permissions": {
                        "Groups": ""
                    },
                    "UI": {
                        "Icon": "fa fa-chevron-right",
                        "Icon Background Color": "Gold",
                        "Templates": "",
                        "Tooltip": "Job Descriptions"
                    }
                }
            ],
            "Content": {
                // right nave Form UI State with Applicatio asset
            }
        }
    }
}
export default UIState;