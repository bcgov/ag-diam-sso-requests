resource "aws_cloudwatch_event_rule" "scheduler" {
  name                = "tf-apply-scheduler"
  schedule_expression = "rate(5 minutes)"
}

resource "aws_cloudwatch_event_target" "scheduler" {
  rule      = aws_cloudwatch_event_rule.scheduler.name
  target_id = "scheduler"
  arn       = aws_lambda_function.scheduler.arn
}

resource "aws_lambda_permission" "scheduler" {
  statement_id  = "AllowExecutionFromCloudWatch"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.scheduler.function_name
  principal     = "events.amazonaws.com"
  source_arn    = aws_cloudwatch_event_rule.scheduler.arn
}

resource "aws_cloudwatch_event_rule" "siteminder-tests-scheduler" {
  name                = "siteminder-tests-scheduler"
  schedule_expression = "cron(0 5 * * *)"
}

resource "aws_cloudwatch_event_target" "siteminder-tests-scheduler" {
  rule      = aws_cloudwatch_event_rule.siteminder-tests-scheduler.name
  target_id = "siteminder-tests-scheduler"
  arn       = aws_lambda_function.siteminder-tests-scheduler.arn
}

resource "aws_lambda_permission" "siteminder-tests-scheduler" {
  statement_id  = "AllowExecutionFromCloudWatch"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.siteminder-tests-scheduler.function_name
  principal     = "events.amazonaws.com"
  source_arn    = aws_cloudwatch_event_rule.siteminder-tests-scheduler.arn
}
