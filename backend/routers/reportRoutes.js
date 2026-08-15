    const express = require("express");
    const router = express.Router();

    const { getReportsSummary, exportReportsExcel } = require("../controllers/reportController");

    router.get("/", getReportsSummary);
    router.get("/export", exportReportsExcel);

    module.exports = router;